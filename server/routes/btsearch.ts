import type { HonoBinding } from "@/types";
import { Hono } from "hono";
import { fallback, object, picklist, safeParse, string } from "valibot";
import axios, { isAxiosError } from "feaxios";
import { XMLParser } from "fast-xml-parser";

type RssFeedResponse = {
  rss: {
    channel: {
      title: string;
      description: string;
      link: string;
      item?: Array<{
        title: string;
        link: string;
        guid: string;
        pubDate: string;
        description: string;
      }>;
    };
  };
};

const QuerySchema = object({
  q: string(),
  orderBy: fallback(
    picklist(["time", "size", "seeders", "relevance"]),
    "relevance"
  ),
  category: fallback(
    picklist(["all", "movie", "audio", "doc", "app", "other"]),
    "all"
  ),
  page: fallback(string(), "1"),
});

function formatToUTC(dateString: string): string {
  const parsedDate = new Date(dateString);
  const utcYear: number = parsedDate.getUTCFullYear();
  const utcMonth: string = (parsedDate.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0");
  const utcDay: string = parsedDate.getUTCDate().toString().padStart(2, "0");
  const utcHours: string = parsedDate.getUTCHours().toString().padStart(2, "0");
  const utcMinutes: string = parsedDate
    .getUTCMinutes()
    .toString()
    .padStart(2, "0");
  const utcSeconds: string = parsedDate
    .getUTCSeconds()
    .toString()
    .padStart(2, "0");
  const utcDateString: string = `${utcYear}-${utcMonth}-${utcDay}T${utcHours}:${utcMinutes}:${utcSeconds}Z`;

  return utcDateString;
}

function removeTrackersFromMagnet(magnetLink: string): string {
  const url = new URL(magnetLink);

  if (url.protocol !== "magnet:") {
    throw new Error("Not a valid magnet link");
  }

  const params = new URLSearchParams(url.search);
  params.forEach((_, key) => {
    if (key === "tr") params.delete(key);
  });
  const cleanedMagnetLink = `${url.protocol}${url.pathname}?${params.toString()}`;

  return decodeURIComponent(cleanedMagnetLink);
}

function extractTotalPages(input: string) {
  const regex = /Found\D+(\d+)\D+items/m;
  const match = input.match(regex);
  if (match) {
    return Number(match[1]);
  }
  return 0;
}

const router = new Hono<HonoBinding>({ strict: false });
const PAGE_SIZE = 15;
const MAX_QUERY_LENGTH = 200;
const SEARCH_CACHE_TTL_SECONDS = 120;
const SEARCH_TIMEOUT_MS = 10_000;
const SEARCH_RETRIES = 1;
const TRANSIENT_STATUS_CODES = new Set([403, 404, 429, 503]);
const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);

const fallbackResponse = (page: number) => ({
  torrents: [],
  meta: {
    total: 0,
    page,
    pages: 0,
  },
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createCacheKey = (
  url: string,
  input: { q: string; page: number; orderBy: string; category: string }
) => {
  const keyUrl = new URL(url);
  keyUrl.search = new URLSearchParams({
    q: input.q,
    page: String(input.page),
    orderBy: input.orderBy,
    category: input.category,
  }).toString();
  return new Request(keyUrl.toString(), { method: "GET" });
};

const isRetryableError = (error: unknown) => {
  if (!isAxiosError(error)) return true;
  const status = error.response?.status;
  if (!status) return true;
  return RETRYABLE_STATUS_CODES.has(status);
};

const getWithRetry = async (
  params: Record<string, string | number>,
  proxyUrl: string | undefined
) => {
  let attempt = 0;
  while (true) {
    try {
      return await axios.get("https://bt4gprx.com/search", {
        params,
        timeout: SEARCH_TIMEOUT_MS,
        ...(proxyUrl
          ? {
              // feaxios supports proxy via fetchOptions, but does not currently type this option.
              fetchOptions: { proxy: proxyUrl } as unknown as RequestInit,
            }
          : {}),
      });
    } catch (error) {
      if (attempt >= SEARCH_RETRIES || !isRetryableError(error)) {
        throw error;
      }
      attempt += 1;
      await sleep(200 * attempt);
    }
  }
};

router.get("/", async (c) => {
  const result = safeParse(QuerySchema, c.req.query());
  if (!result.success) {
    return c.json({ error: result.issues }, 400);
  }

  const q = result.output.q.trim();
  const page = Number(result.output.page);
  const { orderBy, category } = result.output;

  if (!q || q.length > MAX_QUERY_LENGTH) {
    return c.json(
      { error: `Query "q" must be between 1 and ${MAX_QUERY_LENGTH} characters` },
      400
    );
  }

  if (!Number.isInteger(page) || page < 1) {
    return c.json({ error: 'Query "page" must be an integer greater than or equal to 1' }, 400);
  }

  const cacheKey = createCacheKey(c.req.url, { q, page, orderBy, category });
  const cache = await caches.open("btsearch");
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const rssPromise = getWithRetry(
      {
        q,
        p: page,
        orderby: orderBy,
        category,
        page: "rss",
      },
      c.env.PROXY_URL
    );
    const countPromise = getWithRetry(
      {
        q,
        category,
        orderby: orderBy,
      },
      c.env.PROXY_URL
    ).catch((error) => {
      if (
        isAxiosError(error) &&
        TRANSIENT_STATUS_CODES.has(error.response?.status ?? 0)
      ) {
        return null;
      }
      throw error;
    });

    const [rssResponse, countResponse] = await Promise.all([rssPromise, countPromise]);

    const totalCount = countResponse ? extractTotalPages(countResponse.data) : 0;

    let items: Array<{
      title: string;
      link: string;
      guid: string;
      pubDate: string;
      description: string;
    }> = [];
    try {
      const parser = new XMLParser();
      const obj = parser.parse(rssResponse.data) as RssFeedResponse;
      items = obj.rss?.channel?.item
        ? Array.isArray(obj.rss.channel.item)
          ? obj.rss.channel.item
          : [obj.rss.channel.item]
        : [];
    } catch {
      items = [];
    }

    const data = items.flatMap((item) => {
      try {
        return [
          {
            title: item.title,
            magnet: removeTrackersFromMagnet(item.link),
            link: item.guid,
            createdAt: formatToUTC(item.pubDate),
            size: item.description.split("<br>")[1],
          },
        ];
      } catch {
        return [];
      }
    });

    const fallbackTotal = (page - 1) * PAGE_SIZE + data.length;
    const fallbackPages = data.length === PAGE_SIZE ? page + 1 : page;
    const payload = {
      torrents: data,
      meta: {
        total: totalCount || fallbackTotal,
        page,
        pages: totalCount ? Math.ceil(totalCount / PAGE_SIZE) : fallbackPages,
      },
    };

    const response = c.json(payload);
    response.headers.set(
      "Cache-Control",
      `public, max-age=0, s-maxage=${SEARCH_CACHE_TTL_SECONDS}`
    );
    await cache.put(cacheKey, response.clone());
    return response;
  } catch (error) {
    if (
      isAxiosError(error) &&
      TRANSIENT_STATUS_CODES.has(error.response?.status ?? 0)
    ) {
      return c.json(fallbackResponse(page));
    }
    return c.json(
      {
        error: "Failed to search torrents",
        ...fallbackResponse(page),
      },
      502
    );
  }
});

export default router;
