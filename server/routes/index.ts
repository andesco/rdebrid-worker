import { Hono } from "hono";
import type { HonoBinding } from "@/types";
import { optionalBasicAuth } from "../middleware/basic-auth";

import DebridRouter from "./debrid";
import BTDigRouter from "./btsearch";

const router = new Hono<HonoBinding>({ strict: false });

// Apply optional basic auth to protected routes
router.use("/debrid/*", async (c, next) => {
  const authResult = await optionalBasicAuth(c.req.raw, c.env);
  if (authResult) return authResult;
  await next();
});

router.use("/btsearch", async (c, next) => {
  const authResult = await optionalBasicAuth(c.req.raw, c.env);
  if (authResult) return authResult;
  await next();
});

router.route("/debrid", DebridRouter);

router.route("/btsearch", BTDigRouter);

router.get("/health", async (c) => {
  return c.json({ status: "ok" });
});

export default router;
