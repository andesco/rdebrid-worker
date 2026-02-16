import { Hono } from "hono";
import { logger } from "hono/logger";
import { optionalBasicAuth } from "./middleware/basic-auth";
import IndexRouter from "./routes";
import type { HonoBinding } from "@/types";

const app = new Hono<HonoBinding>({ strict: false }).basePath("/");

const CORS_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";

const parseAllowedOrigins = (raw?: string): Set<string> =>
  new Set(
    (raw ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  );

const resolveOrigin = (requestUrl: string) => new URL(requestUrl).origin;

app.use(logger());

app.use("/api/*", async (c, next) => {
  const requestOrigin = c.req.header("Origin");
  const sameOrigin = requestOrigin === resolveOrigin(c.req.url);
  const allowedOrigins = parseAllowedOrigins(c.env.ALLOWED_ORIGINS);
  const isAllowed = !requestOrigin || sameOrigin || allowedOrigins.has(requestOrigin);

  if (c.req.method === "OPTIONS") {
    if (!isAllowed) {
      return c.json({ error: "Origin not allowed" }, 403);
    }
    if (requestOrigin) {
      c.header("Access-Control-Allow-Origin", requestOrigin);
      c.header("Vary", "Origin");
      c.header("Access-Control-Allow-Methods", CORS_METHODS);
      c.header(
        "Access-Control-Allow-Headers",
        c.req.header("Access-Control-Request-Headers") ?? "Authorization,Content-Type"
      );
      c.header("Access-Control-Max-Age", "86400");
    }
    return c.body(null, 204);
  }

  if (!isAllowed) {
    return c.json({ error: "Origin not allowed" }, 403);
  }

  await next();

  if (requestOrigin) {
    c.header("Access-Control-Allow-Origin", requestOrigin);
    c.header("Vary", "Origin");
  }
});

app.route("/api", IndexRouter);

// Debug endpoint
app.get("/debug", async (c) => {
  if (c.env.ENVIRONMENT !== "development") {
    return c.notFound();
  }

  const authResult = await optionalBasicAuth(c.req.raw, c.env);
  if (authResult) return authResult;

  return c.json({
    path: c.req.path,
    environment: c.env.ENVIRONMENT ?? "unknown",
  });
});

export default app;
