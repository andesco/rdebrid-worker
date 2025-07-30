import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
import { logger } from "hono/logger";

import IndexRouter from "./routes";

interface Env {
  USERNAME?: string;
  PASSWORD?: string;
  DEBRID_TOKEN: string;
}

const app = new Hono<{ Bindings: Env }>({ strict: false }).basePath("/");

app.use(logger());
app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["*"],
    maxAge: 86400,
  }),
);

app.use("/api/*", (c, next) => {
  c.env = env(c);
  return next();
});

app.route("/api", IndexRouter);

// Debug endpoint
app.get("/debug", async (c) => {
  return c.json({
    path: c.req.path,
    authMode: c.env.USERNAME && c.env.PASSWORD ? "basic-auth-enabled" : "no-auth-required",
    hasUsername: !!c.env.USERNAME,
    hasPassword: !!c.env.PASSWORD,
    hasDebridToken: !!c.env.DEBRID_TOKEN,
    staticAssets: "served-by-cloudflare-workers-natively"
  });
});


export default app;
