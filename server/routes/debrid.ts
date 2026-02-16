import type { HonoBinding } from "@/types";
import type { Context } from "hono";
import { Hono } from "hono";

const router = new Hono<HonoBinding>({ strict: false });

const METHODS_WITH_BODY = new Set(["PUT", "POST", "PATCH"]);
const API_HOST = "api.real-debrid.com";
const API_PROTOCOL = "https:";
const UPSTREAM_TIMEOUT_MS = 15_000;
const FORM_URL_ENCODED = "application/x-www-form-urlencoded";
const JSON_CONTENT_TYPE = "application/json";
const MULTIPART_CONTENT_TYPE = "multipart/form-data";
const OCTET_STREAM_CONTENT_TYPE = "application/octet-stream";
const IP_INJECTION_PATHS = new Set([
  "/rest/1.0/torrents/addMagnet",
  "/rest/1.0/torrents/addTorrent",
  "/rest/1.0/unrestrict/link",
]);

const headersToDelete = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

const jsonError = (status: number, message: string) =>
  new Response(
    JSON.stringify({
      error: message,
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

const normalizeContentType = (value?: string): string =>
  value?.split(";")[0].trim().toLowerCase() ?? "";

const shouldInjectIp = (pathname: string) => IP_INJECTION_PATHS.has(pathname);

const createTimeoutSignal = (timeoutMs: number): AbortSignal => {
  if (typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(timeoutMs);
  }

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
};

const setResponseHeaders = (headers: Headers) => {
  const resHeaders = new Headers(headers);
  for (const k of headers.keys()) {
    const key = k.toLowerCase();
    if (key.startsWith("access-control-") || headersToDelete.has(key)) {
      resHeaders.delete(k);
    }
  }
  return resHeaders;
};

const fetchApiResponse = async (url: string, options: RequestInit) => {
  const res = await fetch(url, options);
  return new Response(res.body, {
    status: res.status,
    headers: setResponseHeaders(res.headers),
  });
};

router.get("/oauth/*", async (c) => {
  const url = new URL(c.req.url);
  url.host = API_HOST;
  url.protocol = API_PROTOCOL;
  url.port = "";
  url.pathname = url.pathname.replace("/api/debrid", "");

  try {
    return await fetchApiResponse(url.toString(), {
      method: c.req.method,
      signal: createTimeoutSignal(UPSTREAM_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) {
      return jsonError(504, "Upstream request timed out");
    }
    return jsonError(502, "Upstream request failed");
  }
});

const getForwardBody = async (c: Context<HonoBinding>, upstreamPathname: string) => {
  const contentTypeHeader = c.req.header("content-type");
  const contentType = normalizeContentType(contentTypeHeader);

  if (!METHODS_WITH_BODY.has(c.req.method)) {
    return { body: undefined, contentType: undefined };
  }

  if (contentType === FORM_URL_ENCODED) {
    const params = new URLSearchParams(await c.req.text());
    const ip = c.env.FORWARD_IP || c.req.header("CF-Connecting-IP");
    if (ip && shouldInjectIp(upstreamPathname)) {
      params.set("ip", ip);
    }

    return {
      body: params.toString(),
      contentType: FORM_URL_ENCODED,
    };
  }

  if (contentType === JSON_CONTENT_TYPE) {
    return {
      body: await c.req.text(),
      contentType: JSON_CONTENT_TYPE,
    };
  }

  if (contentType === MULTIPART_CONTENT_TYPE || contentType === OCTET_STREAM_CONTENT_TYPE) {
    return {
      body: c.req.raw.body ?? undefined,
      contentType: contentTypeHeader,
    };
  }

  return {
    body: c.req.raw.body ?? undefined,
    contentType: contentTypeHeader,
  };
};

router.use("*", async (c) => {
  if (!c.env.DEBRID_TOKEN) {
    return jsonError(500, "Server configuration error: DEBRID_TOKEN is not set");
  }

  const url = new URL(c.req.url);
  url.host = API_HOST;
  url.protocol = API_PROTOCOL;
  url.port = "";
  url.pathname = `/rest/1.0${url.pathname.replace("/api/debrid", "")}`;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${c.env.DEBRID_TOKEN}`);

  const accept = c.req.header("accept");
  if (accept) {
    headers.set("Accept", accept);
  }

  try {
    const { body, contentType } = await getForwardBody(c, url.pathname);
    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    const requestOptions: RequestInit = {
      method: c.req.method,
      headers,
      signal: createTimeoutSignal(UPSTREAM_TIMEOUT_MS),
    };

    if (body !== undefined) {
      requestOptions.body = body;
    }

    return await fetchApiResponse(url.toString(), requestOptions);
  } catch (error) {
    if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) {
      return jsonError(504, "Upstream request timed out");
    }
    return jsonError(502, "Upstream request failed");
  }
});

export default router;
