var Sr = Object.defineProperty;
var gt = (e) => {
  throw TypeError(e);
};
var Cr = (e, t, r) => t in e ? Sr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var p = (e, t, r) => Cr(e, typeof t != "symbol" ? t + "" : t, r), ze = (e, t, r) => t.has(e) || gt("Cannot " + r);
var h = (e, t, r) => (ze(e, t, "read from private field"), r ? r.call(e) : t.get(e)), E = (e, t, r) => t.has(e) ? gt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), g = (e, t, r, s) => (ze(e, t, "write to private field"), s ? s.call(e, r) : t.set(e, r), r), N = (e, t, r) => (ze(e, t, "access private method"), r);
var Et = (e, t, r, s) => ({
  set _(n) {
    g(e, t, n, r);
  },
  get _() {
    return h(e, t, s);
  }
});
var yt = (e, t, r) => (s, n) => {
  let i = -1;
  return a(0);
  async function a(c) {
    if (c <= i)
      throw new Error("next() called multiple times");
    i = c;
    let o, l = !1, u;
    if (e[c] ? (u = e[c][0][0], s.req.routeIndex = c) : u = c === e.length && n || void 0, u)
      try {
        o = await u(s, () => a(c + 1));
      } catch (f) {
        if (f instanceof Error && t)
          s.error = f, o = await t(f, s), l = !0;
        else
          throw f;
      }
    else
      s.finalized === !1 && r && (o = await r(s));
    return o && (s.finalized === !1 || l) && (s.res = o), s;
  }
}, Ir = Symbol(), xr = async (e, t = /* @__PURE__ */ Object.create(null)) => {
  const { all: r = !1, dot: s = !1 } = t, i = (e instanceof Yt ? e.raw.headers : e.headers).get("Content-Type");
  return i != null && i.startsWith("multipart/form-data") || i != null && i.startsWith("application/x-www-form-urlencoded") ? _r(e, { all: r, dot: s }) : {};
};
async function _r(e, t) {
  const r = await e.formData();
  return r ? $r(r, t) : {};
}
function $r(e, t) {
  const r = /* @__PURE__ */ Object.create(null);
  return e.forEach((s, n) => {
    t.all || n.endsWith("[]") ? Lr(r, n, s) : r[n] = s;
  }), t.dot && Object.entries(r).forEach(([s, n]) => {
    s.includes(".") && (jr(r, s, n), delete r[s]);
  }), r;
}
var Lr = (e, t, r) => {
  e[t] !== void 0 ? Array.isArray(e[t]) ? e[t].push(r) : e[t] = [e[t], r] : t.endsWith("[]") ? e[t] = [r] : e[t] = r;
}, jr = (e, t, r) => {
  let s = e;
  const n = t.split(".");
  n.forEach((i, a) => {
    a === n.length - 1 ? s[i] = r : ((!s[i] || typeof s[i] != "object" || Array.isArray(s[i]) || s[i] instanceof File) && (s[i] = /* @__PURE__ */ Object.create(null)), s = s[i]);
  });
}, Wt = (e) => {
  const t = e.split("/");
  return t[0] === "" && t.shift(), t;
}, kr = (e) => {
  const { groups: t, path: r } = Mr(e), s = Wt(r);
  return Ur(s, t);
}, Mr = (e) => {
  const t = [];
  return e = e.replace(/\{[^}]+\}/g, (r, s) => {
    const n = `@${s}`;
    return t.push([n, r]), n;
  }), { groups: t, path: e };
}, Ur = (e, t) => {
  for (let r = t.length - 1; r >= 0; r--) {
    const [s] = t[r];
    for (let n = e.length - 1; n >= 0; n--)
      if (e[n].includes(s)) {
        e[n] = e[n].replace(s, t[r][1]);
        break;
      }
  }
  return e;
}, Me = {}, Br = (e, t) => {
  if (e === "*")
    return "*";
  const r = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (r) {
    const s = `${e}#${t}`;
    return Me[s] || (r[2] ? Me[s] = t && t[0] !== ":" && t[0] !== "*" ? [s, r[1], new RegExp(`^${r[2]}(?=/${t})`)] : [e, r[1], new RegExp(`^${r[2]}$`)] : Me[s] = [e, r[1], !0]), Me[s];
  }
  return null;
}, ct = (e, t) => {
  try {
    return t(e);
  } catch {
    return e.replace(/(?:%[0-9A-Fa-f]{2})+/g, (r) => {
      try {
        return t(r);
      } catch {
        return r;
      }
    });
  }
}, Fr = (e) => ct(e, decodeURI), Xt = (e) => {
  const t = e.url, r = t.indexOf(
    "/",
    t.charCodeAt(9) === 58 ? 13 : 8
  );
  let s = r;
  for (; s < t.length; s++) {
    const n = t.charCodeAt(s);
    if (n === 37) {
      const i = t.indexOf("?", s), a = t.slice(r, i === -1 ? void 0 : i);
      return Fr(a.includes("%25") ? a.replace(/%25/g, "%2525") : a);
    } else if (n === 63)
      break;
  }
  return t.slice(r, s);
}, qr = (e) => {
  const t = Xt(e);
  return t.length > 1 && t.at(-1) === "/" ? t.slice(0, -1) : t;
}, fe = (e, t, ...r) => (r.length && (t = fe(t, ...r)), `${(e == null ? void 0 : e[0]) === "/" ? "" : "/"}${e}${t === "/" ? "" : `${(e == null ? void 0 : e.at(-1)) === "/" ? "" : "/"}${(t == null ? void 0 : t[0]) === "/" ? t.slice(1) : t}`}`), Gt = (e) => {
  if (e.charCodeAt(e.length - 1) !== 63 || !e.includes(":"))
    return null;
  const t = e.split("/"), r = [];
  let s = "";
  return t.forEach((n) => {
    if (n !== "" && !/\:/.test(n))
      s += "/" + n;
    else if (/\:/.test(n))
      if (/\?/.test(n)) {
        r.length === 0 && s === "" ? r.push("/") : r.push(s);
        const i = n.replace("?", "");
        s += "/" + i, r.push(s);
      } else
        s += "/" + n;
  }), r.filter((n, i, a) => a.indexOf(n) === i);
}, Ke = (e) => /[%+]/.test(e) ? (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), e.indexOf("%") !== -1 ? ct(e, Kt) : e) : e, zt = (e, t, r) => {
  let s;
  if (!r && t && !/[%+]/.test(t)) {
    let a = e.indexOf(`?${t}`, 8);
    for (a === -1 && (a = e.indexOf(`&${t}`, 8)); a !== -1; ) {
      const c = e.charCodeAt(a + t.length + 1);
      if (c === 61) {
        const o = a + t.length + 2, l = e.indexOf("&", o);
        return Ke(e.slice(o, l === -1 ? void 0 : l));
      } else if (c == 38 || isNaN(c))
        return "";
      a = e.indexOf(`&${t}`, a + 1);
    }
    if (s = /[%+]/.test(e), !s)
      return;
  }
  const n = {};
  s ?? (s = /[%+]/.test(e));
  let i = e.indexOf("?", 8);
  for (; i !== -1; ) {
    const a = e.indexOf("&", i + 1);
    let c = e.indexOf("=", i);
    c > a && a !== -1 && (c = -1);
    let o = e.slice(
      i + 1,
      c === -1 ? a === -1 ? void 0 : a : c
    );
    if (s && (o = Ke(o)), i = a, o === "")
      continue;
    let l;
    c === -1 ? l = "" : (l = e.slice(c + 1, a === -1 ? void 0 : a), s && (l = Ke(l))), r ? (n[o] && Array.isArray(n[o]) || (n[o] = []), n[o].push(l)) : n[o] ?? (n[o] = l);
  }
  return t ? n[t] : n;
}, Hr = zt, Vr = (e, t) => zt(e, t, !0), Kt = decodeURIComponent, Wr = (e) => {
  try {
    return decodeURI(e) === e ? encodeURI(e) : e;
  } catch (t) {
    if (t instanceof URIError)
      return encodeURI(e);
    throw t;
  }
}, bt = (e) => ct(e, Kt), pe, $, W, Jt, Zt, tt, z, jt, Yt = (jt = class {
  constructor(e, t = "/", r = [[]]) {
    E(this, W);
    p(this, "raw");
    E(this, pe);
    E(this, $);
    p(this, "routeIndex", 0);
    p(this, "path");
    p(this, "bodyCache", {});
    E(this, z, (e) => {
      const { bodyCache: t, raw: r } = this, s = t[e];
      if (s)
        return s;
      const n = Object.keys(t)[0];
      return n ? t[n].then((i) => (n === "json" && (i = JSON.stringify(i)), new Response(i)[e]())) : t[e] = r[e]();
    });
    this.raw = e, this.path = t, g(this, $, r), g(this, pe, {});
  }
  param(e) {
    return e ? N(this, W, Jt).call(this, e) : N(this, W, Zt).call(this);
  }
  query(e) {
    return Hr(this.url, e);
  }
  queries(e) {
    return Vr(this.url, e);
  }
  header(e) {
    if (e)
      return this.raw.headers.get(e) ?? void 0;
    const t = {};
    return this.raw.headers.forEach((r, s) => {
      t[s] = r;
    }), t;
  }
  async parseBody(e) {
    var t;
    return (t = this.bodyCache).parsedBody ?? (t.parsedBody = await xr(this, e));
  }
  json() {
    return h(this, z).call(this, "text").then((e) => JSON.parse(e));
  }
  text() {
    return h(this, z).call(this, "text");
  }
  arrayBuffer() {
    return h(this, z).call(this, "arrayBuffer");
  }
  blob() {
    return h(this, z).call(this, "blob");
  }
  formData() {
    return h(this, z).call(this, "formData");
  }
  addValidatedData(e, t) {
    h(this, pe)[e] = t;
  }
  valid(e) {
    return h(this, pe)[e];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [Ir]() {
    return h(this, $);
  }
  get matchedRoutes() {
    return h(this, $)[0].map(([[, e]]) => e);
  }
  get routePath() {
    return h(this, $)[0].map(([[, e]]) => e)[this.routeIndex].path;
  }
}, pe = new WeakMap(), $ = new WeakMap(), W = new WeakSet(), Jt = function(e) {
  const t = h(this, $)[0][this.routeIndex][1][e], r = N(this, W, tt).call(this, t);
  return r ? /\%/.test(r) ? bt(r) : r : void 0;
}, Zt = function() {
  const e = {}, t = Object.keys(h(this, $)[0][this.routeIndex][1]);
  for (const r of t) {
    const s = N(this, W, tt).call(this, h(this, $)[0][this.routeIndex][1][r]);
    s && typeof s == "string" && (e[r] = /\%/.test(s) ? bt(s) : s);
  }
  return e;
}, tt = function(e) {
  return h(this, $)[1] ? h(this, $)[1][e] : e;
}, z = new WeakMap(), jt), Xr = {
  Stringify: 1
}, Qt = async (e, t, r, s, n) => {
  typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
  const i = e.callbacks;
  return i != null && i.length ? (n ? n[0] += e : n = [e], Promise.all(i.map((c) => c({ phase: t, buffer: n, context: s }))).then(
    (c) => Promise.all(
      c.filter(Boolean).map((o) => Qt(o, t, !1, s, n))
    ).then(() => n[0])
  )) : Promise.resolve(e);
}, Gr = "text/plain; charset=UTF-8", Ye = (e, t) => ({
  "Content-Type": e,
  ...t
}), Ie, xe, F, ge, q, x, _e, Ee, ye, ie, $e, Le, K, de, kt, zr = (kt = class {
  constructor(e, t) {
    E(this, K);
    E(this, Ie);
    E(this, xe);
    p(this, "env", {});
    E(this, F);
    p(this, "finalized", !1);
    p(this, "error");
    E(this, ge);
    E(this, q);
    E(this, x);
    E(this, _e);
    E(this, Ee);
    E(this, ye);
    E(this, ie);
    E(this, $e);
    E(this, Le);
    p(this, "render", (...e) => (h(this, Ee) ?? g(this, Ee, (t) => this.html(t)), h(this, Ee).call(this, ...e)));
    p(this, "setLayout", (e) => g(this, _e, e));
    p(this, "getLayout", () => h(this, _e));
    p(this, "setRenderer", (e) => {
      g(this, Ee, e);
    });
    p(this, "header", (e, t, r) => {
      this.finalized && g(this, x, new Response(h(this, x).body, h(this, x)));
      const s = h(this, x) ? h(this, x).headers : h(this, ie) ?? g(this, ie, new Headers());
      t === void 0 ? s.delete(e) : r != null && r.append ? s.append(e, t) : s.set(e, t);
    });
    p(this, "status", (e) => {
      g(this, ge, e);
    });
    p(this, "set", (e, t) => {
      h(this, F) ?? g(this, F, /* @__PURE__ */ new Map()), h(this, F).set(e, t);
    });
    p(this, "get", (e) => h(this, F) ? h(this, F).get(e) : void 0);
    p(this, "newResponse", (...e) => N(this, K, de).call(this, ...e));
    p(this, "body", (e, t, r) => N(this, K, de).call(this, e, t, r));
    p(this, "text", (e, t, r) => !h(this, ie) && !h(this, ge) && !t && !r && !this.finalized ? new Response(e) : N(this, K, de).call(this, e, t, Ye(Gr, r)));
    p(this, "json", (e, t, r) => N(this, K, de).call(this, JSON.stringify(e), t, Ye("application/json", r)));
    p(this, "html", (e, t, r) => {
      const s = (n) => N(this, K, de).call(this, n, t, Ye("text/html; charset=UTF-8", r));
      return typeof e == "object" ? Qt(e, Xr.Stringify, !1, {}).then(s) : s(e);
    });
    p(this, "redirect", (e, t) => (this.header("Location", Wr(String(e))), this.newResponse(null, t ?? 302)));
    p(this, "notFound", () => (h(this, ye) ?? g(this, ye, () => new Response()), h(this, ye).call(this, this)));
    g(this, Ie, e), t && (g(this, q, t.executionCtx), this.env = t.env, g(this, ye, t.notFoundHandler), g(this, Le, t.path), g(this, $e, t.matchResult));
  }
  get req() {
    return h(this, xe) ?? g(this, xe, new Yt(h(this, Ie), h(this, Le), h(this, $e))), h(this, xe);
  }
  get event() {
    if (h(this, q) && "respondWith" in h(this, q))
      return h(this, q);
    throw Error("This context has no FetchEvent");
  }
  get executionCtx() {
    if (h(this, q))
      return h(this, q);
    throw Error("This context has no ExecutionContext");
  }
  get res() {
    return h(this, x) || g(this, x, new Response(null, {
      headers: h(this, ie) ?? g(this, ie, new Headers())
    }));
  }
  set res(e) {
    if (h(this, x) && e) {
      e = new Response(e.body, e);
      for (const [t, r] of h(this, x).headers.entries())
        if (t !== "content-type")
          if (t === "set-cookie") {
            const s = h(this, x).headers.getSetCookie();
            e.headers.delete("set-cookie");
            for (const n of s)
              e.headers.append("set-cookie", n);
          } else
            e.headers.set(t, r);
    }
    g(this, x, e), this.finalized = !0;
  }
  get var() {
    return h(this, F) ? Object.fromEntries(h(this, F)) : {};
  }
}, Ie = new WeakMap(), xe = new WeakMap(), F = new WeakMap(), ge = new WeakMap(), q = new WeakMap(), x = new WeakMap(), _e = new WeakMap(), Ee = new WeakMap(), ye = new WeakMap(), ie = new WeakMap(), $e = new WeakMap(), Le = new WeakMap(), K = new WeakSet(), de = function(e, t, r) {
  const s = h(this, x) ? new Headers(h(this, x).headers) : h(this, ie) ?? new Headers();
  if (typeof t == "object" && "headers" in t) {
    const i = t.headers instanceof Headers ? t.headers : new Headers(t.headers);
    for (const [a, c] of i)
      a.toLowerCase() === "set-cookie" ? s.append(a, c) : s.set(a, c);
  }
  if (r)
    for (const [i, a] of Object.entries(r))
      if (typeof a == "string")
        s.set(i, a);
      else {
        s.delete(i);
        for (const c of a)
          s.append(i, c);
      }
  const n = typeof t == "number" ? t : (t == null ? void 0 : t.status) ?? h(this, ge);
  return new Response(e, { status: n, headers: s });
}, kt), O = "ALL", Kr = "all", Yr = ["get", "post", "put", "delete", "options", "patch"], Dt = "Can not add a route since the matcher is already built.", er = class extends Error {
}, Jr = "__COMPOSED_HANDLER", Zr = (e) => e.text("404 Not Found", 404), mt = (e, t) => {
  if ("getResponse" in e) {
    const r = e.getResponse();
    return t.newResponse(r.body, r);
  }
  return console.error(e), t.text("Internal Server Error", 500);
}, j, R, rr, k, te, Ue, Be, Mt, tr = (Mt = class {
  constructor(t = {}) {
    E(this, R);
    p(this, "get");
    p(this, "post");
    p(this, "put");
    p(this, "delete");
    p(this, "options");
    p(this, "patch");
    p(this, "all");
    p(this, "on");
    p(this, "use");
    p(this, "router");
    p(this, "getPath");
    p(this, "_basePath", "/");
    E(this, j, "/");
    p(this, "routes", []);
    E(this, k, Zr);
    p(this, "errorHandler", mt);
    p(this, "onError", (t) => (this.errorHandler = t, this));
    p(this, "notFound", (t) => (g(this, k, t), this));
    p(this, "fetch", (t, ...r) => N(this, R, Be).call(this, t, r[1], r[0], t.method));
    p(this, "request", (t, r, s, n) => t instanceof Request ? this.fetch(r ? new Request(t, r) : t, s, n) : (t = t.toString(), this.fetch(
      new Request(
        /^https?:\/\//.test(t) ? t : `http://localhost${fe("/", t)}`,
        r
      ),
      s,
      n
    )));
    p(this, "fire", () => {
      addEventListener("fetch", (t) => {
        t.respondWith(N(this, R, Be).call(this, t.request, t, void 0, t.request.method));
      });
    });
    [...Yr, Kr].forEach((i) => {
      this[i] = (a, ...c) => (typeof a == "string" ? g(this, j, a) : N(this, R, te).call(this, i, h(this, j), a), c.forEach((o) => {
        N(this, R, te).call(this, i, h(this, j), o);
      }), this);
    }), this.on = (i, a, ...c) => {
      for (const o of [a].flat()) {
        g(this, j, o);
        for (const l of [i].flat())
          c.map((u) => {
            N(this, R, te).call(this, l.toUpperCase(), h(this, j), u);
          });
      }
      return this;
    }, this.use = (i, ...a) => (typeof i == "string" ? g(this, j, i) : (g(this, j, "*"), a.unshift(i)), a.forEach((c) => {
      N(this, R, te).call(this, O, h(this, j), c);
    }), this);
    const { strict: s, ...n } = t;
    Object.assign(this, n), this.getPath = s ?? !0 ? t.getPath ?? Xt : qr;
  }
  route(t, r) {
    const s = this.basePath(t);
    return r.routes.map((n) => {
      var a;
      let i;
      r.errorHandler === mt ? i = n.handler : (i = async (c, o) => (await yt([], r.errorHandler)(c, () => n.handler(c, o))).res, i[Jr] = n.handler), N(a = s, R, te).call(a, n.method, n.path, i);
    }), this;
  }
  basePath(t) {
    const r = N(this, R, rr).call(this);
    return r._basePath = fe(this._basePath, t), r;
  }
  mount(t, r, s) {
    let n, i;
    s && (typeof s == "function" ? i = s : (i = s.optionHandler, s.replaceRequest === !1 ? n = (o) => o : n = s.replaceRequest));
    const a = i ? (o) => {
      const l = i(o);
      return Array.isArray(l) ? l : [l];
    } : (o) => {
      let l;
      try {
        l = o.executionCtx;
      } catch {
      }
      return [o.env, l];
    };
    n || (n = (() => {
      const o = fe(this._basePath, t), l = o === "/" ? 0 : o.length;
      return (u) => {
        const f = new URL(u.url);
        return f.pathname = f.pathname.slice(l) || "/", new Request(f, u);
      };
    })());
    const c = async (o, l) => {
      const u = await r(n(o.req.raw), ...a(o));
      if (u)
        return u;
      await l();
    };
    return N(this, R, te).call(this, O, fe(t, "*"), c), this;
  }
}, j = new WeakMap(), R = new WeakSet(), rr = function() {
  const t = new tr({
    router: this.router,
    getPath: this.getPath
  });
  return t.errorHandler = this.errorHandler, g(t, k, h(this, k)), t.routes = this.routes, t;
}, k = new WeakMap(), te = function(t, r, s) {
  t = t.toUpperCase(), r = fe(this._basePath, r);
  const n = { basePath: this._basePath, path: r, method: t, handler: s };
  this.router.add(t, r, [s, n]), this.routes.push(n);
}, Ue = function(t, r) {
  if (t instanceof Error)
    return this.errorHandler(t, r);
  throw t;
}, Be = function(t, r, s, n) {
  if (n === "HEAD")
    return (async () => new Response(null, await N(this, R, Be).call(this, t, r, s, "GET")))();
  const i = this.getPath(t, { env: s }), a = this.router.match(n, i), c = new zr(t, {
    path: i,
    matchResult: a,
    env: s,
    executionCtx: r,
    notFoundHandler: h(this, k)
  });
  if (a[0].length === 1) {
    let l;
    try {
      l = a[0][0][0][0](c, async () => {
        c.res = await h(this, k).call(this, c);
      });
    } catch (u) {
      return N(this, R, Ue).call(this, u, c);
    }
    return l instanceof Promise ? l.then(
      (u) => u || (c.finalized ? c.res : h(this, k).call(this, c))
    ).catch((u) => N(this, R, Ue).call(this, u, c)) : l ?? h(this, k).call(this, c);
  }
  const o = yt(a[0], this.errorHandler, h(this, k));
  return (async () => {
    try {
      const l = await o(c);
      if (!l.finalized)
        throw new Error(
          "Context is not finalized. Did you forget to return a Response object or `await next()`?"
        );
      return l.res;
    } catch (l) {
      return N(this, R, Ue).call(this, l, c);
    }
  })();
}, Mt), qe = "[^/]+", Pe = ".*", Se = "(?:|/.*)", ve = Symbol(), Qr = new Set(".\\+*[^]$()");
function Dr(e, t) {
  return e.length === 1 ? t.length === 1 ? e < t ? -1 : 1 : -1 : t.length === 1 || e === Pe || e === Se ? 1 : t === Pe || t === Se ? -1 : e === qe ? 1 : t === qe ? -1 : e.length === t.length ? e < t ? -1 : 1 : t.length - e.length;
}
var oe, ae, M, Ut, rt = (Ut = class {
  constructor() {
    E(this, oe);
    E(this, ae);
    E(this, M, /* @__PURE__ */ Object.create(null));
  }
  insert(t, r, s, n, i) {
    if (t.length === 0) {
      if (h(this, oe) !== void 0)
        throw ve;
      if (i)
        return;
      g(this, oe, r);
      return;
    }
    const [a, ...c] = t, o = a === "*" ? c.length === 0 ? ["", "", Pe] : ["", "", qe] : a === "/*" ? ["", "", Se] : a.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let l;
    if (o) {
      const u = o[1];
      let f = o[2] || qe;
      if (u && o[2] && (f = f.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(f)))
        throw ve;
      if (l = h(this, M)[f], !l) {
        if (Object.keys(h(this, M)).some(
          (d) => d !== Pe && d !== Se
        ))
          throw ve;
        if (i)
          return;
        l = h(this, M)[f] = new rt(), u !== "" && g(l, ae, n.varIndex++);
      }
      !i && u !== "" && s.push([u, h(l, ae)]);
    } else if (l = h(this, M)[a], !l) {
      if (Object.keys(h(this, M)).some(
        (u) => u.length > 1 && u !== Pe && u !== Se
      ))
        throw ve;
      if (i)
        return;
      l = h(this, M)[a] = new rt();
    }
    l.insert(c, r, s, n, i);
  }
  buildRegExpStr() {
    const r = Object.keys(h(this, M)).sort(Dr).map((s) => {
      const n = h(this, M)[s];
      return (typeof h(n, ae) == "number" ? `(${s})@${h(n, ae)}` : Qr.has(s) ? `\\${s}` : s) + n.buildRegExpStr();
    });
    return typeof h(this, oe) == "number" && r.unshift(`#${h(this, oe)}`), r.length === 0 ? "" : r.length === 1 ? r[0] : "(?:" + r.join("|") + ")";
  }
}, oe = new WeakMap(), ae = new WeakMap(), M = new WeakMap(), Ut), He, je, Bt, es = (Bt = class {
  constructor() {
    E(this, He, { varIndex: 0 });
    E(this, je, new rt());
  }
  insert(e, t, r) {
    const s = [], n = [];
    for (let a = 0; ; ) {
      let c = !1;
      if (e = e.replace(/\{[^}]+\}/g, (o) => {
        const l = `@\\${a}`;
        return n[a] = [l, o], a++, c = !0, l;
      }), !c)
        break;
    }
    const i = e.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let a = n.length - 1; a >= 0; a--) {
      const [c] = n[a];
      for (let o = i.length - 1; o >= 0; o--)
        if (i[o].indexOf(c) !== -1) {
          i[o] = i[o].replace(c, n[a][1]);
          break;
        }
    }
    return h(this, je).insert(i, t, s, h(this, He), r), s;
  }
  buildRegExp() {
    let e = h(this, je).buildRegExpStr();
    if (e === "")
      return [/^$/, [], []];
    let t = 0;
    const r = [], s = [];
    return e = e.replace(/#(\d+)|@(\d+)|\.\*\$/g, (n, i, a) => i !== void 0 ? (r[++t] = Number(i), "$()") : (a !== void 0 && (s[Number(a)] = ++t), "")), [new RegExp(`^${e}`), r, s];
  }
}, He = new WeakMap(), je = new WeakMap(), Bt), sr = [], ts = [/^$/, [], /* @__PURE__ */ Object.create(null)], Fe = /* @__PURE__ */ Object.create(null);
function nr(e) {
  return Fe[e] ?? (Fe[e] = new RegExp(
    e === "*" ? "" : `^${e.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (t, r) => r ? `\\${r}` : "(?:|/.*)"
    )}$`
  ));
}
function rs() {
  Fe = /* @__PURE__ */ Object.create(null);
}
function ss(e) {
  var l;
  const t = new es(), r = [];
  if (e.length === 0)
    return ts;
  const s = e.map(
    (u) => [!/\*|\/:/.test(u[0]), ...u]
  ).sort(
    ([u, f], [d, b]) => u ? 1 : d ? -1 : f.length - b.length
  ), n = /* @__PURE__ */ Object.create(null);
  for (let u = 0, f = -1, d = s.length; u < d; u++) {
    const [b, y, m] = s[u];
    b ? n[y] = [m.map(([P]) => [P, /* @__PURE__ */ Object.create(null)]), sr] : f++;
    let w;
    try {
      w = t.insert(y, f, b);
    } catch (P) {
      throw P === ve ? new er(y) : P;
    }
    b || (r[f] = m.map(([P, U]) => {
      const ee = /* @__PURE__ */ Object.create(null);
      for (U -= 1; U >= 0; U--) {
        const [_, we] = w[U];
        ee[_] = we;
      }
      return [P, ee];
    }));
  }
  const [i, a, c] = t.buildRegExp();
  for (let u = 0, f = r.length; u < f; u++)
    for (let d = 0, b = r[u].length; d < b; d++) {
      const y = (l = r[u][d]) == null ? void 0 : l[1];
      if (!y)
        continue;
      const m = Object.keys(y);
      for (let w = 0, P = m.length; w < P; w++)
        y[m[w]] = c[y[m[w]]];
    }
  const o = [];
  for (const u in a)
    o[u] = r[a[u]];
  return [i, o, n];
}
function he(e, t) {
  if (e) {
    for (const r of Object.keys(e).sort((s, n) => n.length - s.length))
      if (nr(r).test(t))
        return [...e[r]];
  }
}
var Y, J, me, ir, or, Ft, ns = (Ft = class {
  constructor() {
    E(this, me);
    p(this, "name", "RegExpRouter");
    E(this, Y);
    E(this, J);
    g(this, Y, { [O]: /* @__PURE__ */ Object.create(null) }), g(this, J, { [O]: /* @__PURE__ */ Object.create(null) });
  }
  add(e, t, r) {
    var c;
    const s = h(this, Y), n = h(this, J);
    if (!s || !n)
      throw new Error(Dt);
    s[e] || [s, n].forEach((o) => {
      o[e] = /* @__PURE__ */ Object.create(null), Object.keys(o[O]).forEach((l) => {
        o[e][l] = [...o[O][l]];
      });
    }), t === "/*" && (t = "*");
    const i = (t.match(/\/:/g) || []).length;
    if (/\*$/.test(t)) {
      const o = nr(t);
      e === O ? Object.keys(s).forEach((l) => {
        var u;
        (u = s[l])[t] || (u[t] = he(s[l], t) || he(s[O], t) || []);
      }) : (c = s[e])[t] || (c[t] = he(s[e], t) || he(s[O], t) || []), Object.keys(s).forEach((l) => {
        (e === O || e === l) && Object.keys(s[l]).forEach((u) => {
          o.test(u) && s[l][u].push([r, i]);
        });
      }), Object.keys(n).forEach((l) => {
        (e === O || e === l) && Object.keys(n[l]).forEach(
          (u) => o.test(u) && n[l][u].push([r, i])
        );
      });
      return;
    }
    const a = Gt(t) || [t];
    for (let o = 0, l = a.length; o < l; o++) {
      const u = a[o];
      Object.keys(n).forEach((f) => {
        var d;
        (e === O || e === f) && ((d = n[f])[u] || (d[u] = [
          ...he(s[f], u) || he(s[O], u) || []
        ]), n[f][u].push([r, i - l + o + 1]));
      });
    }
  }
  match(e, t) {
    rs();
    const r = N(this, me, ir).call(this);
    return this.match = (s, n) => {
      const i = r[s] || r[O], a = i[2][n];
      if (a)
        return a;
      const c = n.match(i[0]);
      if (!c)
        return [[], sr];
      const o = c.indexOf("", 1);
      return [i[1][o], c];
    }, this.match(e, t);
  }
}, Y = new WeakMap(), J = new WeakMap(), me = new WeakSet(), ir = function() {
  const e = /* @__PURE__ */ Object.create(null);
  return Object.keys(h(this, J)).concat(Object.keys(h(this, Y))).forEach((t) => {
    e[t] || (e[t] = N(this, me, or).call(this, t));
  }), g(this, Y, g(this, J, void 0)), e;
}, or = function(e) {
  const t = [];
  let r = e === O;
  return [h(this, Y), h(this, J)].forEach((s) => {
    const n = s[e] ? Object.keys(s[e]).map((i) => [i, s[e][i]]) : [];
    n.length !== 0 ? (r || (r = !0), t.push(...n)) : e !== O && t.push(
      ...Object.keys(s[O]).map((i) => [i, s[O][i]])
    );
  }), r ? ss(t) : null;
}, Ft), Z, H, qt, is = (qt = class {
  constructor(e) {
    p(this, "name", "SmartRouter");
    E(this, Z, []);
    E(this, H, []);
    g(this, Z, e.routers);
  }
  add(e, t, r) {
    if (!h(this, H))
      throw new Error(Dt);
    h(this, H).push([e, t, r]);
  }
  match(e, t) {
    if (!h(this, H))
      throw new Error("Fatal error");
    const r = h(this, Z), s = h(this, H), n = r.length;
    let i = 0, a;
    for (; i < n; i++) {
      const c = r[i];
      try {
        for (let o = 0, l = s.length; o < l; o++)
          c.add(...s[o]);
        a = c.match(e, t);
      } catch (o) {
        if (o instanceof er)
          continue;
        throw o;
      }
      this.match = c.match.bind(c), g(this, Z, [c]), g(this, H, void 0);
      break;
    }
    if (i === n)
      throw new Error("Fatal error");
    return this.name = `SmartRouter + ${this.activeRouter.name}`, a;
  }
  get activeRouter() {
    if (h(this, H) || h(this, Z).length !== 1)
      throw new Error("No active router has been determined yet.");
    return h(this, Z)[0];
  }
}, Z = new WeakMap(), H = new WeakMap(), qt), Te = /* @__PURE__ */ Object.create(null), Q, S, ce, be, v, V, re, Ht, ar = (Ht = class {
  constructor(e, t, r) {
    E(this, V);
    E(this, Q);
    E(this, S);
    E(this, ce);
    E(this, be, 0);
    E(this, v, Te);
    if (g(this, S, r || /* @__PURE__ */ Object.create(null)), g(this, Q, []), e && t) {
      const s = /* @__PURE__ */ Object.create(null);
      s[e] = { handler: t, possibleKeys: [], score: 0 }, g(this, Q, [s]);
    }
    g(this, ce, []);
  }
  insert(e, t, r) {
    g(this, be, ++Et(this, be)._);
    let s = this;
    const n = kr(t), i = [];
    for (let a = 0, c = n.length; a < c; a++) {
      const o = n[a], l = n[a + 1], u = Br(o, l), f = Array.isArray(u) ? u[0] : o;
      if (f in h(s, S)) {
        s = h(s, S)[f], u && i.push(u[1]);
        continue;
      }
      h(s, S)[f] = new ar(), u && (h(s, ce).push(u), i.push(u[1])), s = h(s, S)[f];
    }
    return h(s, Q).push({
      [e]: {
        handler: r,
        possibleKeys: i.filter((a, c, o) => o.indexOf(a) === c),
        score: h(this, be)
      }
    }), s;
  }
  search(e, t) {
    var c;
    const r = [];
    g(this, v, Te);
    let n = [this];
    const i = Wt(t), a = [];
    for (let o = 0, l = i.length; o < l; o++) {
      const u = i[o], f = o === l - 1, d = [];
      for (let b = 0, y = n.length; b < y; b++) {
        const m = n[b], w = h(m, S)[u];
        w && (g(w, v, h(m, v)), f ? (h(w, S)["*"] && r.push(
          ...N(this, V, re).call(this, h(w, S)["*"], e, h(m, v))
        ), r.push(...N(this, V, re).call(this, w, e, h(m, v)))) : d.push(w));
        for (let P = 0, U = h(m, ce).length; P < U; P++) {
          const ee = h(m, ce)[P], _ = h(m, v) === Te ? {} : { ...h(m, v) };
          if (ee === "*") {
            const X = h(m, S)["*"];
            X && (r.push(...N(this, V, re).call(this, X, e, h(m, v))), g(X, v, _), d.push(X));
            continue;
          }
          if (!u)
            continue;
          const [we, le, C] = ee, A = h(m, S)[we], Pr = i.slice(o).join("/");
          if (C instanceof RegExp) {
            const X = C.exec(Pr);
            if (X) {
              if (_[le] = X[0], r.push(...N(this, V, re).call(this, A, e, h(m, v), _)), Object.keys(h(A, S)).length) {
                g(A, v, _);
                const Ge = ((c = X[0].match(/\//)) == null ? void 0 : c.length) ?? 0;
                (a[Ge] || (a[Ge] = [])).push(A);
              }
              continue;
            }
          }
          (C === !0 || C.test(u)) && (_[le] = u, f ? (r.push(...N(this, V, re).call(this, A, e, _, h(m, v))), h(A, S)["*"] && r.push(
            ...N(this, V, re).call(this, h(A, S)["*"], e, _, h(m, v))
          )) : (g(A, v, _), d.push(A)));
        }
      }
      n = d.concat(a.shift() ?? []);
    }
    return r.length > 1 && r.sort((o, l) => o.score - l.score), [r.map(({ handler: o, params: l }) => [o, l])];
  }
}, Q = new WeakMap(), S = new WeakMap(), ce = new WeakMap(), be = new WeakMap(), v = new WeakMap(), V = new WeakSet(), re = function(e, t, r, s) {
  const n = [];
  for (let i = 0, a = h(e, Q).length; i < a; i++) {
    const c = h(e, Q)[i], o = c[t] || c[O], l = {};
    if (o !== void 0 && (o.params = /* @__PURE__ */ Object.create(null), n.push(o), r !== Te || s && s !== Te))
      for (let u = 0, f = o.possibleKeys.length; u < f; u++) {
        const d = o.possibleKeys[u], b = l[o.score];
        o.params[d] = s != null && s[d] && !b ? s[d] : r[d] ?? (s == null ? void 0 : s[d]), l[o.score] = !0;
      }
  }
  return n;
}, Ht), ue, Vt, os = (Vt = class {
  constructor() {
    p(this, "name", "TrieRouter");
    E(this, ue);
    g(this, ue, new ar());
  }
  add(e, t, r) {
    const s = Gt(t);
    if (s) {
      for (let n = 0, i = s.length; n < i; n++)
        h(this, ue).insert(e, s[n], r);
      return;
    }
    h(this, ue).insert(e, t, r);
  }
  match(e, t) {
    return h(this, ue).search(e, t);
  }
}, ue = new WeakMap(), Vt), Ve = class extends tr {
  constructor(e = {}) {
    super(e), this.router = e.router ?? new is({
      routers: [new ns(), new os()]
    });
  }
};
function as() {
  const { process: e, Deno: t } = globalThis;
  return !(typeof (t == null ? void 0 : t.noColor) == "boolean" ? t.noColor : e !== void 0 ? "NO_COLOR" in (e == null ? void 0 : e.env) : !1);
}
async function cs() {
  const { navigator: e } = globalThis, t = "cloudflare:workers";
  return !(e !== void 0 && e.userAgent === "Cloudflare-Workers" ? await (async () => {
    try {
      return "NO_COLOR" in ((await import(t)).env ?? {});
    } catch {
      return !1;
    }
  })() : !as());
}
var us = (e) => {
  const [t, r] = [",", "."];
  return e.map((n) => n.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + t)).join(r);
}, ls = (e) => {
  const t = Date.now() - e;
  return us([t < 1e3 ? t + "ms" : Math.round(t / 1e3) + "s"]);
}, hs = async (e) => {
  if (await cs())
    switch (e / 100 | 0) {
      case 5:
        return `\x1B[31m${e}\x1B[0m`;
      case 4:
        return `\x1B[33m${e}\x1B[0m`;
      case 3:
        return `\x1B[36m${e}\x1B[0m`;
      case 2:
        return `\x1B[32m${e}\x1B[0m`;
    }
  return `${e}`;
};
async function Nt(e, t, r, s, n = 0, i) {
  const a = t === "<--" ? `${t} ${r} ${s}` : `${t} ${r} ${s} ${await hs(n)} ${i}`;
  e(a);
}
var fs = (e = console.log) => async function(r, s) {
  const { method: n, url: i } = r.req, a = i.slice(i.indexOf("/", 8));
  await Nt(e, "<--", n, a);
  const c = Date.now();
  await s(), await Nt(e, "-->", n, a, r.res.status, ls(c));
};
function wt(e, t) {
  const r = new TextEncoder().encode(e), s = new TextEncoder().encode(t), n = Math.max(r.length, s.length);
  let i = r.length ^ s.length;
  for (let a = 0; a < n; a++) {
    const c = a < r.length ? r[a] : 0, o = a < s.length ? s[a] : 0;
    i |= c ^ o;
  }
  return i === 0;
}
const Oe = (e, t, r = !1) => {
  const s = {
    "Content-Type": "application/json"
  };
  return r && (s["WWW-Authenticate"] = 'Basic realm="RDEBRID Access", charset="UTF-8"'), new Response(
    JSON.stringify({
      error: t
    }),
    {
      status: e,
      headers: s
    }
  );
};
async function ut(e, t) {
  if (!t.USERNAME || !t.PASSWORD)
    return null;
  const r = e.headers.get("Authorization");
  if (!r)
    return Oe(401, "Authentication required", !0);
  const [s, n] = r.split(" ", 2);
  if (!n || s.toLowerCase() !== "basic")
    return Oe(400, "Invalid authorization format");
  let i = "";
  try {
    i = atob(n);
  } catch {
    return Oe(400, "Invalid authorization encoding");
  }
  const a = i.indexOf(":");
  if (a < 0)
    return Oe(400, "Invalid authorization payload");
  const c = i.slice(0, a), o = i.slice(a + 1);
  return !wt(c, t.USERNAME) || !wt(o, t.PASSWORD) ? Oe(401, "Invalid credentials", !0) : null;
}
const lt = new Ve({ strict: !1 }), ds = /* @__PURE__ */ new Set(["PUT", "POST", "PATCH"]), cr = "api.real-debrid.com", ur = "https:", lr = 15e3, Tt = "application/x-www-form-urlencoded", Ot = "application/json", ps = "multipart/form-data", gs = "application/octet-stream", Es = /* @__PURE__ */ new Set([
  "/rest/1.0/torrents/addMagnet",
  "/rest/1.0/torrents/addTorrent",
  "/rest/1.0/unrestrict/link"
]), ys = /* @__PURE__ */ new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade"
]), Ce = (e, t) => new Response(
  JSON.stringify({
    error: t
  }),
  {
    status: e,
    headers: {
      "Content-Type": "application/json"
    }
  }
), bs = (e) => (e == null ? void 0 : e.split(";")[0].trim().toLowerCase()) ?? "", ms = (e) => Es.has(e), hr = (e) => {
  if (typeof AbortSignal.timeout == "function")
    return AbortSignal.timeout(e);
  const t = new AbortController();
  return setTimeout(() => t.abort(), e), t.signal;
}, Ns = (e) => {
  const t = new Headers(e);
  for (const r of e.keys()) {
    const s = r.toLowerCase();
    (s.startsWith("access-control-") || ys.has(s)) && t.delete(r);
  }
  return t;
}, fr = async (e, t) => {
  const r = await fetch(e, t);
  return new Response(r.body, {
    status: r.status,
    headers: Ns(r.headers)
  });
};
lt.get("/oauth/*", async (e) => {
  const t = new URL(e.req.url);
  t.host = cr, t.protocol = ur, t.port = "", t.pathname = t.pathname.replace("/api/debrid", "");
  try {
    return await fr(t.toString(), {
      method: e.req.method,
      signal: hr(lr)
    });
  } catch (r) {
    return r instanceof Error && (r.name === "AbortError" || r.name === "TimeoutError") ? Ce(504, "Upstream request timed out") : Ce(502, "Upstream request failed");
  }
});
const ws = async (e, t) => {
  const r = e.req.header("content-type"), s = bs(r);
  if (!ds.has(e.req.method))
    return { body: void 0, contentType: void 0 };
  if (s === Tt) {
    const n = new URLSearchParams(await e.req.text()), i = e.env.FORWARD_IP || e.req.header("CF-Connecting-IP");
    return i && ms(t) && n.set("ip", i), {
      body: n.toString(),
      contentType: Tt
    };
  }
  return s === Ot ? {
    body: await e.req.text(),
    contentType: Ot
  } : s === ps || s === gs ? {
    body: e.req.raw.body ?? void 0,
    contentType: r
  } : {
    body: e.req.raw.body ?? void 0,
    contentType: r
  };
};
lt.use("*", async (e) => {
  if (!e.env.DEBRID_TOKEN)
    return Ce(500, "Server configuration error: DEBRID_TOKEN is not set");
  const t = new URL(e.req.url);
  t.host = cr, t.protocol = ur, t.port = "", t.pathname = `/rest/1.0${t.pathname.replace("/api/debrid", "")}`;
  const r = new Headers();
  r.set("Authorization", `Bearer ${e.env.DEBRID_TOKEN}`);
  const s = e.req.header("accept");
  s && r.set("Accept", s);
  try {
    const { body: n, contentType: i } = await ws(e, t.pathname);
    i && r.set("Content-Type", i);
    const a = {
      method: e.req.method,
      headers: r,
      signal: hr(lr)
    };
    return n !== void 0 && (a.body = n), await fr(t.toString(), a);
  } catch (n) {
    return n instanceof Error && (n.name === "AbortError" || n.name === "TimeoutError") ? Ce(504, "Upstream request timed out") : Ce(502, "Upstream request failed");
  }
});
var B;
function ke(e) {
  return {
    lang: (e == null ? void 0 : e.lang) ?? (B == null ? void 0 : B.lang),
    message: e == null ? void 0 : e.message,
    abortEarly: (e == null ? void 0 : e.abortEarly) ?? (B == null ? void 0 : B.abortEarly),
    abortPipeEarly: (e == null ? void 0 : e.abortPipeEarly) ?? (B == null ? void 0 : B.abortPipeEarly)
  };
}
var Je;
function Ts(e) {
  return Je == null ? void 0 : Je.get(e);
}
var Ze;
function Os(e) {
  return Ze == null ? void 0 : Ze.get(e);
}
var Qe;
function Rs(e, t) {
  var r;
  return (r = Qe == null ? void 0 : Qe.get(e)) == null ? void 0 : r.get(t);
}
function dr(e) {
  var r, s;
  const t = typeof e;
  return t === "string" ? `"${e}"` : t === "number" || t === "bigint" || t === "boolean" ? `${e}` : t === "object" || t === "function" ? (e && ((s = (r = Object.getPrototypeOf(e)) == null ? void 0 : r.constructor) == null ? void 0 : s.name)) ?? "null" : t;
}
function ht(e, t, r, s, n) {
  const i = r.value, a = e.expects ?? null, c = dr(i), o = {
    kind: e.kind,
    type: e.type,
    input: i,
    expected: a,
    received: c,
    message: `Invalid ${t}: ${a ? `Expected ${a} but r` : "R"}eceived ${c}`,
    requirement: e.requirement,
    path: n == null ? void 0 : n.path,
    issues: n == null ? void 0 : n.issues,
    lang: s.lang,
    abortEarly: s.abortEarly,
    abortPipeEarly: s.abortPipeEarly
  }, l = e.kind === "schema", u = e.message ?? Rs(e.reference, o.lang) ?? (l ? Os(o.lang) : null) ?? s.message ?? Ts(o.lang);
  u && (o.message = typeof u == "function" ? (
    // @ts-expect-error
    u(o)
  ) : u), l && (r.typed = !1), r.issues ? r.issues.push(o) : r.issues = [o];
}
function As(e, t) {
  const r = [...new Set(e)];
  return r.length > 1 ? `(${r.join(` ${t} `)})` : r[0] ?? "never";
}
function vs(e, t, r) {
  return typeof e.fallback == "function" ? (
    // @ts-expect-error
    e.fallback(t, r)
  ) : (
    // @ts-expect-error
    e.fallback
  );
}
function De(e, t) {
  return {
    ...e,
    fallback: t,
    "~validate"(r, s = ke()) {
      const n = e["~validate"](r, s);
      return n.issues ? { typed: !0, value: vs(this, n, s) } : n;
    }
  };
}
function pr(e, t) {
  return {
    kind: "schema",
    type: "object",
    reference: pr,
    expects: "Object",
    async: !1,
    entries: e,
    message: t,
    "~standard": 1,
    "~vendor": "valibot",
    "~validate"(r, s = ke()) {
      var i;
      const n = r.value;
      if (n && typeof n == "object") {
        r.typed = !0, r.value = {};
        for (const a in this.entries) {
          const c = n[a], o = this.entries[a]["~validate"](
            { value: c },
            s
          );
          if (o.issues) {
            const l = {
              type: "object",
              origin: "value",
              input: n,
              key: a,
              value: c
            };
            for (const u of o.issues)
              u.path ? u.path.unshift(l) : u.path = [l], (i = r.issues) == null || i.push(u);
            if (r.issues || (r.issues = o.issues), s.abortEarly) {
              r.typed = !1;
              break;
            }
          }
          o.typed || (r.typed = !1), (o.value !== void 0 || a in n) && (r.value[a] = o.value);
        }
      } else
        ht(this, "type", r, s);
      return r;
    }
  };
}
function st(e, t) {
  return {
    kind: "schema",
    type: "picklist",
    reference: st,
    expects: As(e.map(dr), "|"),
    async: !1,
    options: e,
    message: t,
    "~standard": 1,
    "~vendor": "valibot",
    "~validate"(r, s = ke()) {
      return this.options.includes(r.value) ? r.typed = !0 : ht(this, "type", r, s), r;
    }
  };
}
function nt(e) {
  return {
    kind: "schema",
    type: "string",
    reference: nt,
    expects: "string",
    async: !1,
    message: e,
    "~standard": 1,
    "~vendor": "valibot",
    "~validate"(t, r = ke()) {
      return typeof t.value == "string" ? t.typed = !0 : ht(this, "type", t, r), t;
    }
  };
}
function Ps(e, t, r) {
  const s = e["~validate"](
    { value: t },
    ke(r)
  );
  return {
    typed: s.typed,
    success: !s.issues,
    output: s.value,
    issues: s.issues
  };
}
async function Rt(e, t) {
  const r = { config: e };
  return r.status = t.status, r.statusText = t.statusText, r.headers = t.headers, e.responseType === "stream" ? (r.data = t.body, r) : t[e.responseType || "text"]().then((s) => {
    e.transformResponse ? (Array.isArray(e.transformResponse) ? e.transformResponse.map(
      (n) => s = n.call(e, s, t == null ? void 0 : t.headers, t == null ? void 0 : t.status)
    ) : s = e.transformResponse(s, t == null ? void 0 : t.headers, t == null ? void 0 : t.status), r.data = s) : (r.data = s, r.data = JSON.parse(s));
  }).catch(Object).then(() => r);
}
async function Ss(e, t) {
  let r = null;
  if ("any" in AbortSignal) {
    const s = [];
    e.timeout && s.push(AbortSignal.timeout(e.timeout)), e.signal && s.push(e.signal), s.length > 0 && (t.signal = AbortSignal.any(s));
  } else
    e.timeout && (t.signal = AbortSignal.timeout(e.timeout));
  try {
    return r = await fetch(e.url, t), (e.validateStatus ? e.validateStatus(r.status) : r.ok) ? await Rt(e, r) : Promise.reject(
      new G(
        `Request failed with status code ${r == null ? void 0 : r.status}`,
        [G.ERR_BAD_REQUEST, G.ERR_BAD_RESPONSE][Math.floor((r == null ? void 0 : r.status) / 100) - 4],
        e,
        new Request(e.url, t),
        await Rt(e, r)
      )
    );
  } catch (s) {
    if (s.name === "AbortError" || s.name === "TimeoutError") {
      const n = s.name === "TimeoutError";
      return Promise.reject(
        n ? new G(
          e.timeoutErrorMessage || `timeout of ${e.timeout} ms exceeded`,
          G.ECONNABORTED,
          e,
          se
        ) : new xs(null, e)
      );
    }
    return Promise.reject(
      new G(
        s.message,
        void 0,
        e,
        se,
        void 0
      )
    );
  }
}
function gr(e) {
  let t = e.url || "";
  return e.baseURL && e.url && (t = e.url.replace(/^(?!.*\/\/)\/?/, `${e.baseURL}/`)), e.params && Object.keys(e.params).length > 0 && e.url && (t += (~e.url.indexOf("?") ? "&" : "?") + (e.paramsSerializer ? e.paramsSerializer(e.params) : new URLSearchParams(e.params))), t;
}
function Er(e, t) {
  const r = {
    ...t,
    ...e
  };
  return t != null && t.params && (e != null && e.params) && (r.params = {
    ...t == null ? void 0 : t.params,
    ...e == null ? void 0 : e.params
  }), t != null && t.headers && (e != null && e.headers) && (r.headers = new Headers(t.headers || {}), new Headers(e.headers || {}).forEach((n, i) => {
    r.headers.set(i, n);
  })), r;
}
function Cs(e, t) {
  const r = {
    ...t,
    ...e
  };
  return t != null && t.headers && (e != null && e.headers) && (r.headers = new Headers(t.headers || {}), new Headers(e.headers || {}).forEach((n, i) => {
    r.headers.set(i, n);
  })), r;
}
function Is(e, t) {
  const r = t.get("content-type");
  return r ? r === "application/x-www-form-urlencoded" && !(e instanceof URLSearchParams) ? e = new URLSearchParams(e) : r === "application/json" && typeof e == "object" && (e = JSON.stringify(e)) : typeof e == "string" ? t.set("content-type", "text/plain") : e instanceof URLSearchParams ? t.set("content-type", "application/x-www-form-urlencoded") : e instanceof Blob || e instanceof ArrayBuffer || ArrayBuffer.isView(e) ? t.set("content-type", "application/octet-stream") : typeof e == "object" && typeof e.append != "function" && typeof e.text != "function" && (e = JSON.stringify(e), t.set("content-type", "application/json")), e;
}
async function se(e, t, r, s, n, i) {
  var l;
  typeof e == "string" ? (t = t || {}, t.url = e) : t = e || {};
  const a = Er(t, r || {});
  if (a.fetchOptions = a.fetchOptions || {}, a.timeout = a.timeout || 0, a.headers = new Headers(a.headers || {}), a.transformRequest = a.transformRequest ?? Is, i = i || a.data, a.transformRequest && i && (Array.isArray(a.transformRequest) ? a.transformRequest.map(
    (u) => i = u.call(a, i, a.headers)
  ) : i = a.transformRequest(i, a.headers)), a.url = gr(a), a.method = s || a.method || "get", n && n.request.handlers.length > 0) {
    const u = n.request.handlers.filter(
      (d) => !(d != null && d.runWhen) || typeof d.runWhen == "function" && d.runWhen(a)
    ).flatMap((d) => [d.fulfilled, d.rejected]);
    let f = a;
    for (let d = 0, b = u.length; d < b; d += 2) {
      const y = u[d], m = u[d + 1];
      try {
        y && (f = y(f));
      } catch (w) {
        m && (m == null || m(w));
        break;
      }
    }
  }
  const c = Cs(
    {
      method: (l = a.method) == null ? void 0 : l.toUpperCase(),
      body: i,
      headers: a.headers,
      credentials: a.withCredentials ? "include" : void 0,
      signal: a.signal
    },
    a.fetchOptions
  );
  let o = Ss(a, c);
  if (n && n.response.handlers.length > 0) {
    const u = n.response.handlers.flatMap((f) => [
      f.fulfilled,
      f.rejected
    ]);
    for (let f = 0, d = u.length; f < d; f += 2)
      o = o.then(u[f], u[f + 1]);
  }
  return o;
}
var At = class {
  constructor() {
    p(this, "handlers", []);
    p(this, "use", (e, t, r) => (this.handlers.push({
      fulfilled: e,
      rejected: t,
      runWhen: r == null ? void 0 : r.runWhen
    }), this.handlers.length - 1));
    p(this, "eject", (e) => {
      this.handlers[e] && (this.handlers[e] = null);
    });
    p(this, "clear", () => {
      this.handlers = [];
    });
    this.handlers = [];
  }
};
function yr(e) {
  e = e || {};
  const t = {
    request: new At(),
    response: new At()
  }, r = (s, n) => se(s, n, e, void 0, t);
  return r.defaults = e, r.interceptors = t, r.getUri = (s) => {
    const n = Er(s || {}, e);
    return gr(n);
  }, r.request = (s) => se(s, void 0, e, void 0, t), ["get", "delete", "head", "options"].forEach((s) => {
    r[s] = (n, i) => se(n, i, e, s, t);
  }), ["post", "put", "patch"].forEach((s) => {
    r[s] = (n, i, a) => se(n, a, e, s, t, i);
  }), ["postForm", "putForm", "patchForm"].forEach((s) => {
    r[s] = (n, i, a) => (a = a || {}, a.headers = new Headers(a.headers || {}), a.headers.set("content-type", "application/x-www-form-urlencoded"), se(
      n,
      a,
      e,
      s.replace("Form", ""),
      t,
      i
    ));
  }), r;
}
var L, G = (L = class extends Error {
  constructor(t, r, s, n, i) {
    super(t);
    p(this, "config");
    p(this, "code");
    p(this, "request");
    p(this, "response");
    p(this, "status");
    p(this, "isAxiosError");
    Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.name = "AxiosError", this.code = r, this.config = s, this.request = n, this.response = i, this.isAxiosError = !0;
  }
}, p(L, "ERR_BAD_OPTION_VALUE", "ERR_BAD_OPTION_VALUE"), p(L, "ERR_BAD_OPTION", "ERR_BAD_OPTION"), p(L, "ERR_NETWORK", "ERR_NETWORK"), p(L, "ERR_BAD_RESPONSE", "ERR_BAD_RESPONSE"), p(L, "ERR_BAD_REQUEST", "ERR_BAD_REQUEST"), p(L, "ERR_INVALID_URL", "ERR_INVALID_URL"), p(L, "ERR_CANCELED", "ERR_CANCELED"), p(L, "ECONNABORTED", "ECONNABORTED"), p(L, "ETIMEDOUT", "ETIMEDOUT"), L), xs = class extends G {
  constructor(e, t, r) {
    super(
      e || "canceled",
      G.ERR_CANCELED,
      t,
      r
    ), this.name = "CanceledError";
  }
};
function it(e) {
  return e !== null && typeof e == "object" && e.isAxiosError;
}
var br = yr();
br.create = (e) => yr(e);
var _s = br, ft = {}, We = {};
(function(e) {
  const t = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", r = t + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040", s = "[" + t + "][" + r + "]*", n = new RegExp("^" + s + "$"), i = function(c, o) {
    const l = [];
    let u = o.exec(c);
    for (; u; ) {
      const f = [];
      f.startIndex = o.lastIndex - u[0].length;
      const d = u.length;
      for (let b = 0; b < d; b++)
        f.push(u[b]);
      l.push(f), u = o.exec(c);
    }
    return l;
  }, a = function(c) {
    const o = n.exec(c);
    return !(o === null || typeof o > "u");
  };
  e.isExist = function(c) {
    return typeof c < "u";
  }, e.isEmptyObject = function(c) {
    return Object.keys(c).length === 0;
  }, e.merge = function(c, o, l) {
    if (o) {
      const u = Object.keys(o), f = u.length;
      for (let d = 0; d < f; d++)
        l === "strict" ? c[u[d]] = [o[u[d]]] : c[u[d]] = o[u[d]];
    }
  }, e.getValue = function(c) {
    return e.isExist(c) ? c : "";
  }, e.isName = a, e.getAllMatches = i, e.nameRegexp = s;
})(We);
const dt = We, $s = {
  allowBooleanAttributes: !1,
  //A tag can have attributes without any value
  unpairedTags: []
};
ft.validate = function(e, t) {
  t = Object.assign({}, $s, t);
  const r = [];
  let s = !1, n = !1;
  e[0] === "\uFEFF" && (e = e.substr(1));
  for (let i = 0; i < e.length; i++)
    if (e[i] === "<" && e[i + 1] === "?") {
      if (i += 2, i = Pt(e, i), i.err) return i;
    } else if (e[i] === "<") {
      let a = i;
      if (i++, e[i] === "!") {
        i = St(e, i);
        continue;
      } else {
        let c = !1;
        e[i] === "/" && (c = !0, i++);
        let o = "";
        for (; i < e.length && e[i] !== ">" && e[i] !== " " && e[i] !== "	" && e[i] !== `
` && e[i] !== "\r"; i++)
          o += e[i];
        if (o = o.trim(), o[o.length - 1] === "/" && (o = o.substring(0, o.length - 1), i--), !qs(o)) {
          let f;
          return o.trim().length === 0 ? f = "Invalid space after '<'." : f = "Tag '" + o + "' is an invalid name.", T("InvalidTag", f, I(e, i));
        }
        const l = ks(e, i);
        if (l === !1)
          return T("InvalidAttr", "Attributes for '" + o + "' have open quote.", I(e, i));
        let u = l.value;
        if (i = l.index, u[u.length - 1] === "/") {
          const f = i - u.length;
          u = u.substring(0, u.length - 1);
          const d = Ct(u, t);
          if (d === !0)
            s = !0;
          else
            return T(d.err.code, d.err.msg, I(e, f + d.err.line));
        } else if (c)
          if (l.tagClosed) {
            if (u.trim().length > 0)
              return T("InvalidTag", "Closing tag '" + o + "' can't have attributes or invalid starting.", I(e, a));
            if (r.length === 0)
              return T("InvalidTag", "Closing tag '" + o + "' has not been opened.", I(e, a));
            {
              const f = r.pop();
              if (o !== f.tagName) {
                let d = I(e, f.tagStartPos);
                return T(
                  "InvalidTag",
                  "Expected closing tag '" + f.tagName + "' (opened in line " + d.line + ", col " + d.col + ") instead of closing tag '" + o + "'.",
                  I(e, a)
                );
              }
              r.length == 0 && (n = !0);
            }
          } else return T("InvalidTag", "Closing tag '" + o + "' doesn't have proper closing.", I(e, i));
        else {
          const f = Ct(u, t);
          if (f !== !0)
            return T(f.err.code, f.err.msg, I(e, i - u.length + f.err.line));
          if (n === !0)
            return T("InvalidXml", "Multiple possible root nodes found.", I(e, i));
          t.unpairedTags.indexOf(o) !== -1 || r.push({ tagName: o, tagStartPos: a }), s = !0;
        }
        for (i++; i < e.length; i++)
          if (e[i] === "<")
            if (e[i + 1] === "!") {
              i++, i = St(e, i);
              continue;
            } else if (e[i + 1] === "?") {
              if (i = Pt(e, ++i), i.err) return i;
            } else
              break;
          else if (e[i] === "&") {
            const f = Bs(e, i);
            if (f == -1)
              return T("InvalidChar", "char '&' is not expected.", I(e, i));
            i = f;
          } else if (n === !0 && !vt(e[i]))
            return T("InvalidXml", "Extra text at the end", I(e, i));
        e[i] === "<" && i--;
      }
    } else {
      if (vt(e[i]))
        continue;
      return T("InvalidChar", "char '" + e[i] + "' is not expected.", I(e, i));
    }
  if (s) {
    if (r.length == 1)
      return T("InvalidTag", "Unclosed tag '" + r[0].tagName + "'.", I(e, r[0].tagStartPos));
    if (r.length > 0)
      return T("InvalidXml", "Invalid '" + JSON.stringify(r.map((i) => i.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
  } else return T("InvalidXml", "Start tag expected.", 1);
  return !0;
};
function vt(e) {
  return e === " " || e === "	" || e === `
` || e === "\r";
}
function Pt(e, t) {
  const r = t;
  for (; t < e.length; t++)
    if (e[t] == "?" || e[t] == " ") {
      const s = e.substr(r, t - r);
      if (t > 5 && s === "xml")
        return T("InvalidXml", "XML declaration allowed only at the start of the document.", I(e, t));
      if (e[t] == "?" && e[t + 1] == ">") {
        t++;
        break;
      } else
        continue;
    }
  return t;
}
function St(e, t) {
  if (e.length > t + 5 && e[t + 1] === "-" && e[t + 2] === "-") {
    for (t += 3; t < e.length; t++)
      if (e[t] === "-" && e[t + 1] === "-" && e[t + 2] === ">") {
        t += 2;
        break;
      }
  } else if (e.length > t + 8 && e[t + 1] === "D" && e[t + 2] === "O" && e[t + 3] === "C" && e[t + 4] === "T" && e[t + 5] === "Y" && e[t + 6] === "P" && e[t + 7] === "E") {
    let r = 1;
    for (t += 8; t < e.length; t++)
      if (e[t] === "<")
        r++;
      else if (e[t] === ">" && (r--, r === 0))
        break;
  } else if (e.length > t + 9 && e[t + 1] === "[" && e[t + 2] === "C" && e[t + 3] === "D" && e[t + 4] === "A" && e[t + 5] === "T" && e[t + 6] === "A" && e[t + 7] === "[") {
    for (t += 8; t < e.length; t++)
      if (e[t] === "]" && e[t + 1] === "]" && e[t + 2] === ">") {
        t += 2;
        break;
      }
  }
  return t;
}
const Ls = '"', js = "'";
function ks(e, t) {
  let r = "", s = "", n = !1;
  for (; t < e.length; t++) {
    if (e[t] === Ls || e[t] === js)
      s === "" ? s = e[t] : s !== e[t] || (s = "");
    else if (e[t] === ">" && s === "") {
      n = !0;
      break;
    }
    r += e[t];
  }
  return s !== "" ? !1 : {
    value: r,
    index: t,
    tagClosed: n
  };
}
const Ms = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
function Ct(e, t) {
  const r = dt.getAllMatches(e, Ms), s = {};
  for (let n = 0; n < r.length; n++) {
    if (r[n][1].length === 0)
      return T("InvalidAttr", "Attribute '" + r[n][2] + "' has no space in starting.", Re(r[n]));
    if (r[n][3] !== void 0 && r[n][4] === void 0)
      return T("InvalidAttr", "Attribute '" + r[n][2] + "' is without value.", Re(r[n]));
    if (r[n][3] === void 0 && !t.allowBooleanAttributes)
      return T("InvalidAttr", "boolean attribute '" + r[n][2] + "' is not allowed.", Re(r[n]));
    const i = r[n][2];
    if (!Fs(i))
      return T("InvalidAttr", "Attribute '" + i + "' is an invalid name.", Re(r[n]));
    if (!s.hasOwnProperty(i))
      s[i] = 1;
    else
      return T("InvalidAttr", "Attribute '" + i + "' is repeated.", Re(r[n]));
  }
  return !0;
}
function Us(e, t) {
  let r = /\d/;
  for (e[t] === "x" && (t++, r = /[\da-fA-F]/); t < e.length; t++) {
    if (e[t] === ";")
      return t;
    if (!e[t].match(r))
      break;
  }
  return -1;
}
function Bs(e, t) {
  if (t++, e[t] === ";")
    return -1;
  if (e[t] === "#")
    return t++, Us(e, t);
  let r = 0;
  for (; t < e.length; t++, r++)
    if (!(e[t].match(/\w/) && r < 20)) {
      if (e[t] === ";")
        break;
      return -1;
    }
  return t;
}
function T(e, t, r) {
  return {
    err: {
      code: e,
      msg: t,
      line: r.line || r,
      col: r.col
    }
  };
}
function Fs(e) {
  return dt.isName(e);
}
function qs(e) {
  return dt.isName(e);
}
function I(e, t) {
  const r = e.substring(0, t).split(/\r?\n/);
  return {
    line: r.length,
    // column number is last line's length + 1, because column numbering starts at 1:
    col: r[r.length - 1].length + 1
  };
}
function Re(e) {
  return e.startIndex + e[1].length;
}
var pt = {};
const mr = {
  preserveOrder: !1,
  attributeNamePrefix: "@_",
  attributesGroupName: !1,
  textNodeName: "#text",
  ignoreAttributes: !0,
  removeNSPrefix: !1,
  // remove NS from tag name or attribute name if true
  allowBooleanAttributes: !1,
  //a tag can have attributes without any value
  //ignoreRootElement : false,
  parseTagValue: !0,
  parseAttributeValue: !1,
  trimValues: !0,
  //Trim string values of tag and attributes
  cdataPropName: !1,
  numberParseOptions: {
    hex: !0,
    leadingZeros: !0,
    eNotation: !0
  },
  tagValueProcessor: function(e, t) {
    return t;
  },
  attributeValueProcessor: function(e, t) {
    return t;
  },
  stopNodes: [],
  //nested tags will not be parsed even for errors
  alwaysCreateTextNode: !1,
  isArray: () => !1,
  commentPropName: !1,
  unpairedTags: [],
  processEntities: !0,
  htmlEntities: !1,
  ignoreDeclaration: !1,
  ignorePiTags: !1,
  transformTagName: !1,
  transformAttributeName: !1,
  updateTag: function(e, t, r) {
    return e;
  }
  // skipEmptyListItem: false
}, Hs = function(e) {
  return Object.assign({}, mr, e);
};
pt.buildOptions = Hs;
pt.defaultOptions = mr;
class Vs {
  constructor(t) {
    this.tagname = t, this.child = [], this[":@"] = {};
  }
  add(t, r) {
    t === "__proto__" && (t = "#__proto__"), this.child.push({ [t]: r });
  }
  addChild(t) {
    t.tagname === "__proto__" && (t.tagname = "#__proto__"), t[":@"] && Object.keys(t[":@"]).length > 0 ? this.child.push({ [t.tagname]: t.child, ":@": t[":@"] }) : this.child.push({ [t.tagname]: t.child });
  }
}
var Ws = Vs;
const Xs = We;
function Gs(e, t) {
  const r = {};
  if (e[t + 3] === "O" && e[t + 4] === "C" && e[t + 5] === "T" && e[t + 6] === "Y" && e[t + 7] === "P" && e[t + 8] === "E") {
    t = t + 9;
    let s = 1, n = !1, i = !1, a = "";
    for (; t < e.length; t++)
      if (e[t] === "<" && !i) {
        if (n && Ys(e, t)) {
          t += 7;
          let c, o;
          [c, o, t] = zs(e, t + 1), o.indexOf("&") === -1 && (r[Ds(c)] = {
            regx: RegExp(`&${c};`, "g"),
            val: o
          });
        } else if (n && Js(e, t)) t += 8;
        else if (n && Zs(e, t)) t += 8;
        else if (n && Qs(e, t)) t += 9;
        else if (Ks) i = !0;
        else throw new Error("Invalid DOCTYPE");
        s++, a = "";
      } else if (e[t] === ">") {
        if (i ? e[t - 1] === "-" && e[t - 2] === "-" && (i = !1, s--) : s--, s === 0)
          break;
      } else e[t] === "[" ? n = !0 : a += e[t];
    if (s !== 0)
      throw new Error("Unclosed DOCTYPE");
  } else
    throw new Error("Invalid Tag instead of DOCTYPE");
  return { entities: r, i: t };
}
function zs(e, t) {
  let r = "";
  for (; t < e.length && e[t] !== "'" && e[t] !== '"'; t++)
    r += e[t];
  if (r = r.trim(), r.indexOf(" ") !== -1) throw new Error("External entites are not supported");
  const s = e[t++];
  let n = "";
  for (; t < e.length && e[t] !== s; t++)
    n += e[t];
  return [r, n, t];
}
function Ks(e, t) {
  return e[t + 1] === "!" && e[t + 2] === "-" && e[t + 3] === "-";
}
function Ys(e, t) {
  return e[t + 1] === "!" && e[t + 2] === "E" && e[t + 3] === "N" && e[t + 4] === "T" && e[t + 5] === "I" && e[t + 6] === "T" && e[t + 7] === "Y";
}
function Js(e, t) {
  return e[t + 1] === "!" && e[t + 2] === "E" && e[t + 3] === "L" && e[t + 4] === "E" && e[t + 5] === "M" && e[t + 6] === "E" && e[t + 7] === "N" && e[t + 8] === "T";
}
function Zs(e, t) {
  return e[t + 1] === "!" && e[t + 2] === "A" && e[t + 3] === "T" && e[t + 4] === "T" && e[t + 5] === "L" && e[t + 6] === "I" && e[t + 7] === "S" && e[t + 8] === "T";
}
function Qs(e, t) {
  return e[t + 1] === "!" && e[t + 2] === "N" && e[t + 3] === "O" && e[t + 4] === "T" && e[t + 5] === "A" && e[t + 6] === "T" && e[t + 7] === "I" && e[t + 8] === "O" && e[t + 9] === "N";
}
function Ds(e) {
  if (Xs.isName(e))
    return e;
  throw new Error(`Invalid entity name ${e}`);
}
var en = Gs;
const tn = /^[-+]?0x[a-fA-F0-9]+$/, rn = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/, sn = {
  hex: !0,
  // oct: false,
  leadingZeros: !0,
  decimalPoint: ".",
  eNotation: !0
  //skipLike: /regex/
};
function nn(e, t = {}) {
  if (t = Object.assign({}, sn, t), !e || typeof e != "string") return e;
  let r = e.trim();
  if (t.skipLike !== void 0 && t.skipLike.test(r)) return e;
  if (e === "0") return 0;
  if (t.hex && tn.test(r))
    return an(r, 16);
  if (r.search(/[eE]/) !== -1) {
    const s = r.match(/^([-\+])?(0*)([0-9]*(\.[0-9]*)?[eE][-\+]?[0-9]+)$/);
    if (s) {
      if (t.leadingZeros)
        r = (s[1] || "") + s[3];
      else if (!(s[2] === "0" && s[3][0] === ".")) return e;
      return t.eNotation ? Number(r) : e;
    } else
      return e;
  } else {
    const s = rn.exec(r);
    if (s) {
      const n = s[1], i = s[2];
      let a = on(s[3]);
      if (!t.leadingZeros && i.length > 0 && n && r[2] !== ".") return e;
      if (!t.leadingZeros && i.length > 0 && !n && r[1] !== ".") return e;
      if (t.leadingZeros && i === e) return 0;
      {
        const c = Number(r), o = "" + c;
        return o.search(/[eE]/) !== -1 ? t.eNotation ? c : e : r.indexOf(".") !== -1 ? o === "0" && a === "" || o === a || n && o === "-" + a ? c : e : i ? a === o || n + a === o ? c : e : r === o || r === n + o ? c : e;
      }
    } else
      return e;
  }
}
function on(e) {
  return e && e.indexOf(".") !== -1 && (e = e.replace(/0+$/, ""), e === "." ? e = "0" : e[0] === "." ? e = "0" + e : e[e.length - 1] === "." && (e = e.substr(0, e.length - 1))), e;
}
function an(e, t) {
  if (parseInt) return parseInt(e, t);
  if (Number.parseInt) return Number.parseInt(e, t);
  if (window && window.parseInt) return window.parseInt(e, t);
  throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
}
var cn = nn;
function un(e) {
  return typeof e == "function" ? e : Array.isArray(e) ? (t) => {
    for (const r of e)
      if (typeof r == "string" && t === r || r instanceof RegExp && r.test(t))
        return !0;
  } : () => !1;
}
var Nr = un;
const wr = We, Ae = Ws, ln = en, hn = cn, fn = Nr;
let dn = class {
  constructor(t) {
    this.options = t, this.currentNode = null, this.tagsNodeStack = [], this.docTypeEntities = {}, this.lastEntities = {
      apos: { regex: /&(apos|#39|#x27);/g, val: "'" },
      gt: { regex: /&(gt|#62|#x3E);/g, val: ">" },
      lt: { regex: /&(lt|#60|#x3C);/g, val: "<" },
      quot: { regex: /&(quot|#34|#x22);/g, val: '"' }
    }, this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" }, this.htmlEntities = {
      space: { regex: /&(nbsp|#160);/g, val: " " },
      // "lt" : { regex: /&(lt|#60);/g, val: "<" },
      // "gt" : { regex: /&(gt|#62);/g, val: ">" },
      // "amp" : { regex: /&(amp|#38);/g, val: "&" },
      // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
      // "apos" : { regex: /&(apos|#39);/g, val: "'" },
      cent: { regex: /&(cent|#162);/g, val: "¢" },
      pound: { regex: /&(pound|#163);/g, val: "£" },
      yen: { regex: /&(yen|#165);/g, val: "¥" },
      euro: { regex: /&(euro|#8364);/g, val: "€" },
      copyright: { regex: /&(copy|#169);/g, val: "©" },
      reg: { regex: /&(reg|#174);/g, val: "®" },
      inr: { regex: /&(inr|#8377);/g, val: "₹" },
      num_dec: { regex: /&#([0-9]{1,7});/g, val: (r, s) => String.fromCharCode(Number.parseInt(s, 10)) },
      num_hex: { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (r, s) => String.fromCharCode(Number.parseInt(s, 16)) }
    }, this.addExternalEntities = pn, this.parseXml = mn, this.parseTextData = gn, this.resolveNameSpace = En, this.buildAttributesMap = bn, this.isItStopNode = On, this.replaceEntitiesValue = wn, this.readStopNodeData = An, this.saveTextToParentTag = Tn, this.addChild = Nn, this.ignoreAttributesFn = fn(this.options.ignoreAttributes);
  }
};
function pn(e) {
  const t = Object.keys(e);
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    this.lastEntities[s] = {
      regex: new RegExp("&" + s + ";", "g"),
      val: e[s]
    };
  }
}
function gn(e, t, r, s, n, i, a) {
  if (e !== void 0 && (this.options.trimValues && !s && (e = e.trim()), e.length > 0)) {
    a || (e = this.replaceEntitiesValue(e));
    const c = this.options.tagValueProcessor(t, e, r, n, i);
    return c == null ? e : typeof c != typeof e || c !== e ? c : this.options.trimValues ? at(e, this.options.parseTagValue, this.options.numberParseOptions) : e.trim() === e ? at(e, this.options.parseTagValue, this.options.numberParseOptions) : e;
  }
}
function En(e) {
  if (this.options.removeNSPrefix) {
    const t = e.split(":"), r = e.charAt(0) === "/" ? "/" : "";
    if (t[0] === "xmlns")
      return "";
    t.length === 2 && (e = r + t[1]);
  }
  return e;
}
const yn = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
function bn(e, t, r) {
  if (this.options.ignoreAttributes !== !0 && typeof e == "string") {
    const s = wr.getAllMatches(e, yn), n = s.length, i = {};
    for (let a = 0; a < n; a++) {
      const c = this.resolveNameSpace(s[a][1]);
      if (this.ignoreAttributesFn(c, t))
        continue;
      let o = s[a][4], l = this.options.attributeNamePrefix + c;
      if (c.length)
        if (this.options.transformAttributeName && (l = this.options.transformAttributeName(l)), l === "__proto__" && (l = "#__proto__"), o !== void 0) {
          this.options.trimValues && (o = o.trim()), o = this.replaceEntitiesValue(o);
          const u = this.options.attributeValueProcessor(c, o, t);
          u == null ? i[l] = o : typeof u != typeof o || u !== o ? i[l] = u : i[l] = at(
            o,
            this.options.parseAttributeValue,
            this.options.numberParseOptions
          );
        } else this.options.allowBooleanAttributes && (i[l] = !0);
    }
    if (!Object.keys(i).length)
      return;
    if (this.options.attributesGroupName) {
      const a = {};
      return a[this.options.attributesGroupName] = i, a;
    }
    return i;
  }
}
const mn = function(e) {
  e = e.replace(/\r\n?/g, `
`);
  const t = new Ae("!xml");
  let r = t, s = "", n = "";
  for (let i = 0; i < e.length; i++)
    if (e[i] === "<")
      if (e[i + 1] === "/") {
        const c = ne(e, ">", i, "Closing Tag is not closed.");
        let o = e.substring(i + 2, c).trim();
        if (this.options.removeNSPrefix) {
          const f = o.indexOf(":");
          f !== -1 && (o = o.substr(f + 1));
        }
        this.options.transformTagName && (o = this.options.transformTagName(o)), r && (s = this.saveTextToParentTag(s, r, n));
        const l = n.substring(n.lastIndexOf(".") + 1);
        if (o && this.options.unpairedTags.indexOf(o) !== -1)
          throw new Error(`Unpaired tag can not be used as closing tag: </${o}>`);
        let u = 0;
        l && this.options.unpairedTags.indexOf(l) !== -1 ? (u = n.lastIndexOf(".", n.lastIndexOf(".") - 1), this.tagsNodeStack.pop()) : u = n.lastIndexOf("."), n = n.substring(0, u), r = this.tagsNodeStack.pop(), s = "", i = c;
      } else if (e[i + 1] === "?") {
        let c = ot(e, i, !1, "?>");
        if (!c) throw new Error("Pi Tag is not closed.");
        if (s = this.saveTextToParentTag(s, r, n), !(this.options.ignoreDeclaration && c.tagName === "?xml" || this.options.ignorePiTags)) {
          const o = new Ae(c.tagName);
          o.add(this.options.textNodeName, ""), c.tagName !== c.tagExp && c.attrExpPresent && (o[":@"] = this.buildAttributesMap(c.tagExp, n, c.tagName)), this.addChild(r, o, n);
        }
        i = c.closeIndex + 1;
      } else if (e.substr(i + 1, 3) === "!--") {
        const c = ne(e, "-->", i + 4, "Comment is not closed.");
        if (this.options.commentPropName) {
          const o = e.substring(i + 4, c - 2);
          s = this.saveTextToParentTag(s, r, n), r.add(this.options.commentPropName, [{ [this.options.textNodeName]: o }]);
        }
        i = c;
      } else if (e.substr(i + 1, 2) === "!D") {
        const c = ln(e, i);
        this.docTypeEntities = c.entities, i = c.i;
      } else if (e.substr(i + 1, 2) === "![") {
        const c = ne(e, "]]>", i, "CDATA is not closed.") - 2, o = e.substring(i + 9, c);
        s = this.saveTextToParentTag(s, r, n);
        let l = this.parseTextData(o, r.tagname, n, !0, !1, !0, !0);
        l == null && (l = ""), this.options.cdataPropName ? r.add(this.options.cdataPropName, [{ [this.options.textNodeName]: o }]) : r.add(this.options.textNodeName, l), i = c + 2;
      } else {
        let c = ot(e, i, this.options.removeNSPrefix), o = c.tagName;
        const l = c.rawTagName;
        let u = c.tagExp, f = c.attrExpPresent, d = c.closeIndex;
        this.options.transformTagName && (o = this.options.transformTagName(o)), r && s && r.tagname !== "!xml" && (s = this.saveTextToParentTag(s, r, n, !1));
        const b = r;
        if (b && this.options.unpairedTags.indexOf(b.tagname) !== -1 && (r = this.tagsNodeStack.pop(), n = n.substring(0, n.lastIndexOf("."))), o !== t.tagname && (n += n ? "." + o : o), this.isItStopNode(this.options.stopNodes, n, o)) {
          let y = "";
          if (u.length > 0 && u.lastIndexOf("/") === u.length - 1)
            o[o.length - 1] === "/" ? (o = o.substr(0, o.length - 1), n = n.substr(0, n.length - 1), u = o) : u = u.substr(0, u.length - 1), i = c.closeIndex;
          else if (this.options.unpairedTags.indexOf(o) !== -1)
            i = c.closeIndex;
          else {
            const w = this.readStopNodeData(e, l, d + 1);
            if (!w) throw new Error(`Unexpected end of ${l}`);
            i = w.i, y = w.tagContent;
          }
          const m = new Ae(o);
          o !== u && f && (m[":@"] = this.buildAttributesMap(u, n, o)), y && (y = this.parseTextData(y, o, n, !0, f, !0, !0)), n = n.substr(0, n.lastIndexOf(".")), m.add(this.options.textNodeName, y), this.addChild(r, m, n);
        } else {
          if (u.length > 0 && u.lastIndexOf("/") === u.length - 1) {
            o[o.length - 1] === "/" ? (o = o.substr(0, o.length - 1), n = n.substr(0, n.length - 1), u = o) : u = u.substr(0, u.length - 1), this.options.transformTagName && (o = this.options.transformTagName(o));
            const y = new Ae(o);
            o !== u && f && (y[":@"] = this.buildAttributesMap(u, n, o)), this.addChild(r, y, n), n = n.substr(0, n.lastIndexOf("."));
          } else {
            const y = new Ae(o);
            this.tagsNodeStack.push(r), o !== u && f && (y[":@"] = this.buildAttributesMap(u, n, o)), this.addChild(r, y, n), r = y;
          }
          s = "", i = d;
        }
      }
    else
      s += e[i];
  return t.child;
};
function Nn(e, t, r) {
  const s = this.options.updateTag(t.tagname, r, t[":@"]);
  s === !1 || (typeof s == "string" && (t.tagname = s), e.addChild(t));
}
const wn = function(e) {
  if (this.options.processEntities) {
    for (let t in this.docTypeEntities) {
      const r = this.docTypeEntities[t];
      e = e.replace(r.regx, r.val);
    }
    for (let t in this.lastEntities) {
      const r = this.lastEntities[t];
      e = e.replace(r.regex, r.val);
    }
    if (this.options.htmlEntities)
      for (let t in this.htmlEntities) {
        const r = this.htmlEntities[t];
        e = e.replace(r.regex, r.val);
      }
    e = e.replace(this.ampEntity.regex, this.ampEntity.val);
  }
  return e;
};
function Tn(e, t, r, s) {
  return e && (s === void 0 && (s = t.child.length === 0), e = this.parseTextData(
    e,
    t.tagname,
    r,
    !1,
    t[":@"] ? Object.keys(t[":@"]).length !== 0 : !1,
    s
  ), e !== void 0 && e !== "" && t.add(this.options.textNodeName, e), e = ""), e;
}
function On(e, t, r) {
  const s = "*." + r;
  for (const n in e) {
    const i = e[n];
    if (s === i || t === i) return !0;
  }
  return !1;
}
function Rn(e, t, r = ">") {
  let s, n = "";
  for (let i = t; i < e.length; i++) {
    let a = e[i];
    if (s)
      a === s && (s = "");
    else if (a === '"' || a === "'")
      s = a;
    else if (a === r[0])
      if (r[1]) {
        if (e[i + 1] === r[1])
          return {
            data: n,
            index: i
          };
      } else
        return {
          data: n,
          index: i
        };
    else a === "	" && (a = " ");
    n += a;
  }
}
function ne(e, t, r, s) {
  const n = e.indexOf(t, r);
  if (n === -1)
    throw new Error(s);
  return n + t.length - 1;
}
function ot(e, t, r, s = ">") {
  const n = Rn(e, t + 1, s);
  if (!n) return;
  let i = n.data;
  const a = n.index, c = i.search(/\s/);
  let o = i, l = !0;
  c !== -1 && (o = i.substring(0, c), i = i.substring(c + 1).trimStart());
  const u = o;
  if (r) {
    const f = o.indexOf(":");
    f !== -1 && (o = o.substr(f + 1), l = o !== n.data.substr(f + 1));
  }
  return {
    tagName: o,
    tagExp: i,
    closeIndex: a,
    attrExpPresent: l,
    rawTagName: u
  };
}
function An(e, t, r) {
  const s = r;
  let n = 1;
  for (; r < e.length; r++)
    if (e[r] === "<")
      if (e[r + 1] === "/") {
        const i = ne(e, ">", r, `${t} is not closed`);
        if (e.substring(r + 2, i).trim() === t && (n--, n === 0))
          return {
            tagContent: e.substring(s, r),
            i
          };
        r = i;
      } else if (e[r + 1] === "?")
        r = ne(e, "?>", r + 1, "StopNode is not closed.");
      else if (e.substr(r + 1, 3) === "!--")
        r = ne(e, "-->", r + 3, "StopNode is not closed.");
      else if (e.substr(r + 1, 2) === "![")
        r = ne(e, "]]>", r, "StopNode is not closed.") - 2;
      else {
        const i = ot(e, r, ">");
        i && ((i && i.tagName) === t && i.tagExp[i.tagExp.length - 1] !== "/" && n++, r = i.closeIndex);
      }
}
function at(e, t, r) {
  if (t && typeof e == "string") {
    const s = e.trim();
    return s === "true" ? !0 : s === "false" ? !1 : hn(e, r);
  } else
    return wr.isExist(e) ? e : "";
}
var vn = dn, Tr = {};
function Pn(e, t) {
  return Or(e, t);
}
function Or(e, t, r) {
  let s;
  const n = {};
  for (let i = 0; i < e.length; i++) {
    const a = e[i], c = Sn(a);
    let o = "";
    if (r === void 0 ? o = c : o = r + "." + c, c === t.textNodeName)
      s === void 0 ? s = a[c] : s += "" + a[c];
    else {
      if (c === void 0)
        continue;
      if (a[c]) {
        let l = Or(a[c], t, o);
        const u = In(l, t);
        a[":@"] ? Cn(l, a[":@"], o, t) : Object.keys(l).length === 1 && l[t.textNodeName] !== void 0 && !t.alwaysCreateTextNode ? l = l[t.textNodeName] : Object.keys(l).length === 0 && (t.alwaysCreateTextNode ? l[t.textNodeName] = "" : l = ""), n[c] !== void 0 && n.hasOwnProperty(c) ? (Array.isArray(n[c]) || (n[c] = [n[c]]), n[c].push(l)) : t.isArray(c, o, u) ? n[c] = [l] : n[c] = l;
      }
    }
  }
  return typeof s == "string" ? s.length > 0 && (n[t.textNodeName] = s) : s !== void 0 && (n[t.textNodeName] = s), n;
}
function Sn(e) {
  const t = Object.keys(e);
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    if (s !== ":@") return s;
  }
}
function Cn(e, t, r, s) {
  if (t) {
    const n = Object.keys(t), i = n.length;
    for (let a = 0; a < i; a++) {
      const c = n[a];
      s.isArray(c, r + "." + c, !0, !0) ? e[c] = [t[c]] : e[c] = t[c];
    }
  }
}
function In(e, t) {
  const { textNodeName: r } = t, s = Object.keys(e).length;
  return !!(s === 0 || s === 1 && (e[r] || typeof e[r] == "boolean" || e[r] === 0));
}
Tr.prettify = Pn;
const { buildOptions: xn } = pt, _n = vn, { prettify: $n } = Tr, Ln = ft;
let jn = class {
  constructor(t) {
    this.externalEntities = {}, this.options = xn(t);
  }
  /**
   * Parse XML dats to JS object 
   * @param {string|Buffer} xmlData 
   * @param {boolean|Object} validationOption 
   */
  parse(t, r) {
    if (typeof t != "string") if (t.toString)
      t = t.toString();
    else
      throw new Error("XML data is accepted in String or Bytes[] form.");
    if (r) {
      r === !0 && (r = {});
      const i = Ln.validate(t, r);
      if (i !== !0)
        throw Error(`${i.err.msg}:${i.err.line}:${i.err.col}`);
    }
    const s = new _n(this.options);
    s.addExternalEntities(this.externalEntities);
    const n = s.parseXml(t);
    return this.options.preserveOrder || n === void 0 ? n : $n(n, this.options);
  }
  /**
   * Add Entity which is not by default supported by this library
   * @param {string} key 
   * @param {string} value 
   */
  addEntity(t, r) {
    if (r.indexOf("&") !== -1)
      throw new Error("Entity value can't have '&'");
    if (t.indexOf("&") !== -1 || t.indexOf(";") !== -1)
      throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
    if (r === "&")
      throw new Error("An entity with value '&' is not permitted");
    this.externalEntities[t] = r;
  }
};
var kn = jn;
const Mn = `
`;
function Un(e, t) {
  let r = "";
  return t.format && t.indentBy.length > 0 && (r = Mn), Rr(e, t, "", r);
}
function Rr(e, t, r, s) {
  let n = "", i = !1;
  for (let a = 0; a < e.length; a++) {
    const c = e[a], o = Bn(c);
    if (o === void 0) continue;
    let l = "";
    if (r.length === 0 ? l = o : l = `${r}.${o}`, o === t.textNodeName) {
      let y = c[o];
      Fn(l, t) || (y = t.tagValueProcessor(o, y), y = Ar(y, t)), i && (n += s), n += y, i = !1;
      continue;
    } else if (o === t.cdataPropName) {
      i && (n += s), n += `<![CDATA[${c[o][0][t.textNodeName]}]]>`, i = !1;
      continue;
    } else if (o === t.commentPropName) {
      n += s + `<!--${c[o][0][t.textNodeName]}-->`, i = !0;
      continue;
    } else if (o[0] === "?") {
      const y = It(c[":@"], t), m = o === "?xml" ? "" : s;
      let w = c[o][0][t.textNodeName];
      w = w.length !== 0 ? " " + w : "", n += m + `<${o}${w}${y}?>`, i = !0;
      continue;
    }
    let u = s;
    u !== "" && (u += t.indentBy);
    const f = It(c[":@"], t), d = s + `<${o}${f}`, b = Rr(c[o], t, l, u);
    t.unpairedTags.indexOf(o) !== -1 ? t.suppressUnpairedNode ? n += d + ">" : n += d + "/>" : (!b || b.length === 0) && t.suppressEmptyNode ? n += d + "/>" : b && b.endsWith(">") ? n += d + `>${b}${s}</${o}>` : (n += d + ">", b && s !== "" && (b.includes("/>") || b.includes("</")) ? n += s + t.indentBy + b + s : n += b, n += `</${o}>`), i = !0;
  }
  return n;
}
function Bn(e) {
  const t = Object.keys(e);
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    if (e.hasOwnProperty(s) && s !== ":@")
      return s;
  }
}
function It(e, t) {
  let r = "";
  if (e && !t.ignoreAttributes)
    for (let s in e) {
      if (!e.hasOwnProperty(s)) continue;
      let n = t.attributeValueProcessor(s, e[s]);
      n = Ar(n, t), n === !0 && t.suppressBooleanAttributes ? r += ` ${s.substr(t.attributeNamePrefix.length)}` : r += ` ${s.substr(t.attributeNamePrefix.length)}="${n}"`;
    }
  return r;
}
function Fn(e, t) {
  e = e.substr(0, e.length - t.textNodeName.length - 1);
  let r = e.substr(e.lastIndexOf(".") + 1);
  for (let s in t.stopNodes)
    if (t.stopNodes[s] === e || t.stopNodes[s] === "*." + r) return !0;
  return !1;
}
function Ar(e, t) {
  if (e && e.length > 0 && t.processEntities)
    for (let r = 0; r < t.entities.length; r++) {
      const s = t.entities[r];
      e = e.replace(s.regex, s.val);
    }
  return e;
}
var qn = Un;
const Hn = qn, Vn = Nr, Wn = {
  attributeNamePrefix: "@_",
  attributesGroupName: !1,
  textNodeName: "#text",
  ignoreAttributes: !0,
  cdataPropName: !1,
  format: !1,
  indentBy: "  ",
  suppressEmptyNode: !1,
  suppressUnpairedNode: !0,
  suppressBooleanAttributes: !0,
  tagValueProcessor: function(e, t) {
    return t;
  },
  attributeValueProcessor: function(e, t) {
    return t;
  },
  preserveOrder: !1,
  commentPropName: !1,
  unpairedTags: [],
  entities: [
    { regex: new RegExp("&", "g"), val: "&amp;" },
    //it must be on top
    { regex: new RegExp(">", "g"), val: "&gt;" },
    { regex: new RegExp("<", "g"), val: "&lt;" },
    { regex: new RegExp("'", "g"), val: "&apos;" },
    { regex: new RegExp('"', "g"), val: "&quot;" }
  ],
  processEntities: !0,
  stopNodes: [],
  // transformTagName: false,
  // transformAttributeName: false,
  oneListGroup: !1
};
function D(e) {
  this.options = Object.assign({}, Wn, e), this.options.ignoreAttributes === !0 || this.options.attributesGroupName ? this.isAttribute = function() {
    return !1;
  } : (this.ignoreAttributesFn = Vn(this.options.ignoreAttributes), this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = zn), this.processTextOrObjNode = Xn, this.options.format ? (this.indentate = Gn, this.tagEndChar = `>
`, this.newLine = `
`) : (this.indentate = function() {
    return "";
  }, this.tagEndChar = ">", this.newLine = "");
}
D.prototype.build = function(e) {
  return this.options.preserveOrder ? Hn(e, this.options) : (Array.isArray(e) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (e = {
    [this.options.arrayNodeName]: e
  }), this.j2x(e, 0, []).val);
};
D.prototype.j2x = function(e, t, r) {
  let s = "", n = "";
  const i = r.join(".");
  for (let a in e)
    if (Object.prototype.hasOwnProperty.call(e, a))
      if (typeof e[a] > "u")
        this.isAttribute(a) && (n += "");
      else if (e[a] === null)
        this.isAttribute(a) || a === this.options.cdataPropName ? n += "" : a[0] === "?" ? n += this.indentate(t) + "<" + a + "?" + this.tagEndChar : n += this.indentate(t) + "<" + a + "/" + this.tagEndChar;
      else if (e[a] instanceof Date)
        n += this.buildTextValNode(e[a], a, "", t);
      else if (typeof e[a] != "object") {
        const c = this.isAttribute(a);
        if (c && !this.ignoreAttributesFn(c, i))
          s += this.buildAttrPairStr(c, "" + e[a]);
        else if (!c)
          if (a === this.options.textNodeName) {
            let o = this.options.tagValueProcessor(a, "" + e[a]);
            n += this.replaceEntitiesValue(o);
          } else
            n += this.buildTextValNode(e[a], a, "", t);
      } else if (Array.isArray(e[a])) {
        const c = e[a].length;
        let o = "", l = "";
        for (let u = 0; u < c; u++) {
          const f = e[a][u];
          if (!(typeof f > "u")) if (f === null)
            a[0] === "?" ? n += this.indentate(t) + "<" + a + "?" + this.tagEndChar : n += this.indentate(t) + "<" + a + "/" + this.tagEndChar;
          else if (typeof f == "object")
            if (this.options.oneListGroup) {
              const d = this.j2x(f, t + 1, r.concat(a));
              o += d.val, this.options.attributesGroupName && f.hasOwnProperty(this.options.attributesGroupName) && (l += d.attrStr);
            } else
              o += this.processTextOrObjNode(f, a, t, r);
          else if (this.options.oneListGroup) {
            let d = this.options.tagValueProcessor(a, f);
            d = this.replaceEntitiesValue(d), o += d;
          } else
            o += this.buildTextValNode(f, a, "", t);
        }
        this.options.oneListGroup && (o = this.buildObjectNode(o, a, l, t)), n += o;
      } else if (this.options.attributesGroupName && a === this.options.attributesGroupName) {
        const c = Object.keys(e[a]), o = c.length;
        for (let l = 0; l < o; l++)
          s += this.buildAttrPairStr(c[l], "" + e[a][c[l]]);
      } else
        n += this.processTextOrObjNode(e[a], a, t, r);
  return { attrStr: s, val: n };
};
D.prototype.buildAttrPairStr = function(e, t) {
  return t = this.options.attributeValueProcessor(e, "" + t), t = this.replaceEntitiesValue(t), this.options.suppressBooleanAttributes && t === "true" ? " " + e : " " + e + '="' + t + '"';
};
function Xn(e, t, r, s) {
  const n = this.j2x(e, r + 1, s.concat(t));
  return e[this.options.textNodeName] !== void 0 && Object.keys(e).length === 1 ? this.buildTextValNode(e[this.options.textNodeName], t, n.attrStr, r) : this.buildObjectNode(n.val, t, n.attrStr, r);
}
D.prototype.buildObjectNode = function(e, t, r, s) {
  if (e === "")
    return t[0] === "?" ? this.indentate(s) + "<" + t + r + "?" + this.tagEndChar : this.indentate(s) + "<" + t + r + this.closeTag(t) + this.tagEndChar;
  {
    let n = "</" + t + this.tagEndChar, i = "";
    return t[0] === "?" && (i = "?", n = ""), (r || r === "") && e.indexOf("<") === -1 ? this.indentate(s) + "<" + t + r + i + ">" + e + n : this.options.commentPropName !== !1 && t === this.options.commentPropName && i.length === 0 ? this.indentate(s) + `<!--${e}-->` + this.newLine : this.indentate(s) + "<" + t + r + i + this.tagEndChar + e + this.indentate(s) + n;
  }
};
D.prototype.closeTag = function(e) {
  let t = "";
  return this.options.unpairedTags.indexOf(e) !== -1 ? this.options.suppressUnpairedNode || (t = "/") : this.options.suppressEmptyNode ? t = "/" : t = `></${e}`, t;
};
D.prototype.buildTextValNode = function(e, t, r, s) {
  if (this.options.cdataPropName !== !1 && t === this.options.cdataPropName)
    return this.indentate(s) + `<![CDATA[${e}]]>` + this.newLine;
  if (this.options.commentPropName !== !1 && t === this.options.commentPropName)
    return this.indentate(s) + `<!--${e}-->` + this.newLine;
  if (t[0] === "?")
    return this.indentate(s) + "<" + t + r + "?" + this.tagEndChar;
  {
    let n = this.options.tagValueProcessor(t, e);
    return n = this.replaceEntitiesValue(n), n === "" ? this.indentate(s) + "<" + t + r + this.closeTag(t) + this.tagEndChar : this.indentate(s) + "<" + t + r + ">" + n + "</" + t + this.tagEndChar;
  }
};
D.prototype.replaceEntitiesValue = function(e) {
  if (e && e.length > 0 && this.options.processEntities)
    for (let t = 0; t < this.options.entities.length; t++) {
      const r = this.options.entities[t];
      e = e.replace(r.regex, r.val);
    }
  return e;
};
function Gn(e) {
  return this.options.indentBy.repeat(e);
}
function zn(e) {
  return e.startsWith(this.options.attributeNamePrefix) && e !== this.options.textNodeName ? e.substr(this.attrPrefixLen) : !1;
}
var Kn = D;
const Yn = ft, Jn = kn, Zn = Kn;
var Qn = {
  XMLParser: Jn,
  XMLValidator: Yn,
  XMLBuilder: Zn
};
const Dn = pr({
  q: nt(),
  orderBy: De(
    st(["time", "size", "seeders", "relevance"]),
    "relevance"
  ),
  category: De(
    st(["all", "movie", "audio", "doc", "app", "other"]),
    "all"
  ),
  page: De(nt(), "1")
});
function ei(e) {
  const t = new Date(e), r = t.getUTCFullYear(), s = (t.getUTCMonth() + 1).toString().padStart(2, "0"), n = t.getUTCDate().toString().padStart(2, "0"), i = t.getUTCHours().toString().padStart(2, "0"), a = t.getUTCMinutes().toString().padStart(2, "0"), c = t.getUTCSeconds().toString().padStart(2, "0");
  return `${r}-${s}-${n}T${i}:${a}:${c}Z`;
}
function ti(e) {
  const t = new URL(e);
  if (t.protocol !== "magnet:")
    throw new Error("Not a valid magnet link");
  const r = new URLSearchParams(t.search);
  r.forEach((n, i) => {
    i === "tr" && r.delete(i);
  });
  const s = `${t.protocol}${t.pathname}?${r.toString()}`;
  return decodeURIComponent(s);
}
function ri(e) {
  const t = /Found\D+(\d+)\D+items/m, r = e.match(t);
  return r ? Number(r[1]) : 0;
}
const vr = new Ve({ strict: !1 }), et = 15, xt = 200, si = 120, ni = 1e4, ii = 1, _t = /* @__PURE__ */ new Set([403, 404, 429, 503]), oi = /* @__PURE__ */ new Set([408, 425, 429, 500, 502, 503, 504]), $t = (e) => ({
  torrents: [],
  meta: {
    total: 0,
    page: e,
    pages: 0
  }
}), ai = (e) => new Promise((t) => setTimeout(t, e)), ci = (e, t) => {
  const r = new URL(e);
  return r.search = new URLSearchParams({
    q: t.q,
    page: String(t.page),
    orderBy: t.orderBy,
    category: t.category
  }).toString(), new Request(r.toString(), { method: "GET" });
}, ui = (e) => {
  var r;
  if (!it(e)) return !0;
  const t = (r = e.response) == null ? void 0 : r.status;
  return t ? oi.has(t) : !0;
}, Lt = async (e, t) => {
  let r = 0;
  for (; ; )
    try {
      return await _s.get("https://bt4gprx.com/search", {
        params: e,
        timeout: ni,
        ...t ? {
          // feaxios supports proxy via fetchOptions, but does not currently type this option.
          fetchOptions: { proxy: t }
        } : {}
      });
    } catch (s) {
      if (r >= ii || !ui(s))
        throw s;
      r += 1, await ai(200 * r);
    }
};
vr.get("/", async (e) => {
  var l, u, f;
  const t = Ps(Dn, e.req.query());
  if (!t.success)
    return e.json({ error: t.issues }, 400);
  const r = t.output.q.trim(), s = Number(t.output.page), { orderBy: n, category: i } = t.output;
  if (!r || r.length > xt)
    return e.json(
      { error: `Query "q" must be between 1 and ${xt} characters` },
      400
    );
  if (!Number.isInteger(s) || s < 1)
    return e.json({ error: 'Query "page" must be an integer greater than or equal to 1' }, 400);
  const a = ci(e.req.url, { q: r, page: s, orderBy: n, category: i }), c = await caches.open("btsearch"), o = await c.match(a);
  if (o)
    return o;
  try {
    const d = Lt(
      {
        q: r,
        p: s,
        orderby: n,
        category: i,
        page: "rss"
      },
      e.env.PROXY_URL
    ), b = Lt(
      {
        q: r,
        category: i,
        orderby: n
      },
      e.env.PROXY_URL
    ).catch((C) => {
      var A;
      if (it(C) && _t.has(((A = C.response) == null ? void 0 : A.status) ?? 0))
        return null;
      throw C;
    }), [y, m] = await Promise.all([d, b]), w = m ? ri(m.data) : 0;
    let P = [];
    try {
      const A = new Qn.XMLParser().parse(y.data);
      P = (u = (l = A.rss) == null ? void 0 : l.channel) != null && u.item ? Array.isArray(A.rss.channel.item) ? A.rss.channel.item : [A.rss.channel.item] : [];
    } catch {
      P = [];
    }
    const U = P.flatMap((C) => {
      try {
        return [
          {
            title: C.title,
            magnet: ti(C.link),
            link: C.guid,
            createdAt: ei(C.pubDate),
            size: C.description.split("<br>")[1]
          }
        ];
      } catch {
        return [];
      }
    }), ee = (s - 1) * et + U.length, _ = U.length === et ? s + 1 : s, we = {
      torrents: U,
      meta: {
        total: w || ee,
        page: s,
        pages: w ? Math.ceil(w / et) : _
      }
    }, le = e.json(we);
    return le.headers.set(
      "Cache-Control",
      `public, max-age=0, s-maxage=${si}`
    ), await c.put(a, le.clone()), le;
  } catch (d) {
    return it(d) && _t.has(((f = d.response) == null ? void 0 : f.status) ?? 0) ? e.json($t(s)) : e.json(
      {
        error: "Failed to search torrents",
        ...$t(s)
      },
      502
    );
  }
});
const Ne = new Ve({ strict: !1 });
Ne.use("/debrid/*", async (e, t) => {
  const r = await ut(e.req.raw, e.env);
  if (r) return r;
  await t();
});
Ne.use("/btsearch", async (e, t) => {
  const r = await ut(e.req.raw, e.env);
  if (r) return r;
  await t();
});
Ne.route("/debrid", lt);
Ne.route("/btsearch", vr);
Ne.get("/health", async (e) => e.json({ status: "ok" }));
const Xe = new Ve({ strict: !1 }).basePath("/"), li = "GET,POST,PUT,PATCH,DELETE,OPTIONS", hi = (e) => new Set(
  (e ?? "").split(",").map((t) => t.trim()).filter(Boolean)
), fi = (e) => new URL(e).origin;
Xe.use(fs());
Xe.use("/api/*", async (e, t) => {
  const r = e.req.header("Origin"), s = r === fi(e.req.url), n = hi(e.env.ALLOWED_ORIGINS), i = !r || s || n.has(r);
  if (e.req.method === "OPTIONS")
    return i ? (r && (e.header("Access-Control-Allow-Origin", r), e.header("Vary", "Origin"), e.header("Access-Control-Allow-Methods", li), e.header(
      "Access-Control-Allow-Headers",
      e.req.header("Access-Control-Request-Headers") ?? "Authorization,Content-Type"
    ), e.header("Access-Control-Max-Age", "86400")), e.body(null, 204)) : e.json({ error: "Origin not allowed" }, 403);
  if (!i)
    return e.json({ error: "Origin not allowed" }, 403);
  await t(), r && (e.header("Access-Control-Allow-Origin", r), e.header("Vary", "Origin"));
});
Xe.route("/api", Ne);
Xe.get("/debug", async (e) => {
  if (e.env.ENVIRONMENT !== "development")
    return e.notFound();
  const t = await ut(e.req.raw, e.env);
  return t || e.json({
    path: e.req.path,
    environment: e.env.ENVIRONMENT ?? "unknown"
  });
});
export {
  Xe as default
};
