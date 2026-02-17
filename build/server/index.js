var Se = (e, t, r) => (s, c) => {
  let l = -1;
  return a(0);
  async function a(i) {
    if (i <= l)
      throw new Error("next() called multiple times");
    l = i;
    let n, o = !1, u;
    if (e[i] ? (u = e[i][0][0], s.req.routeIndex = i) : u = i === e.length && c || void 0, u)
      try {
        n = await u(s, () => a(i + 1));
      } catch (d) {
        if (d instanceof Error && t)
          s.error = d, n = await t(d, s), o = !0;
        else
          throw d;
      }
    else
      s.finalized === !1 && r && (n = await r(s));
    return n && (s.finalized === !1 || o) && (s.res = n), s;
  }
}, St = /* @__PURE__ */ Symbol(), Ct = async (e, t = /* @__PURE__ */ Object.create(null)) => {
  const { all: r = !1, dot: s = !1 } = t, l = (e instanceof it ? e.raw.headers : e.headers).get("Content-Type");
  return l?.startsWith("multipart/form-data") || l?.startsWith("application/x-www-form-urlencoded") ? xt(e, { all: r, dot: s }) : {};
};
async function xt(e, t) {
  const r = await e.formData();
  return r ? It(r, t) : {};
}
function It(e, t) {
  const r = /* @__PURE__ */ Object.create(null);
  return e.forEach((s, c) => {
    t.all || c.endsWith("[]") ? _t(r, c, s) : r[c] = s;
  }), t.dot && Object.entries(r).forEach(([s, c]) => {
    s.includes(".") && ($t(r, s, c), delete r[s]);
  }), r;
}
var _t = (e, t, r) => {
  e[t] !== void 0 ? Array.isArray(e[t]) ? e[t].push(r) : e[t] = [e[t], r] : t.endsWith("[]") ? e[t] = [r] : e[t] = r;
}, $t = (e, t, r) => {
  let s = e;
  const c = t.split(".");
  c.forEach((l, a) => {
    a === c.length - 1 ? s[l] = r : ((!s[l] || typeof s[l] != "object" || Array.isArray(s[l]) || s[l] instanceof File) && (s[l] = /* @__PURE__ */ Object.create(null)), s = s[l]);
  });
}, et = (e) => {
  const t = e.split("/");
  return t[0] === "" && t.shift(), t;
}, Lt = (e) => {
  const { groups: t, path: r } = qt(e), s = et(r);
  return jt(s, t);
}, qt = (e) => {
  const t = [];
  return e = e.replace(/\{[^}]+\}/g, (r, s) => {
    const c = `@${s}`;
    return t.push([c, r]), c;
  }), { groups: t, path: e };
}, jt = (e, t) => {
  for (let r = t.length - 1; r >= 0; r--) {
    const [s] = t[r];
    for (let c = e.length - 1; c >= 0; c--)
      if (e[c].includes(s)) {
        e[c] = e[c].replace(s, t[r][1]);
        break;
      }
  }
  return e;
}, K = {}, kt = (e, t) => {
  if (e === "*")
    return "*";
  const r = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (r) {
    const s = `${e}#${t}`;
    return K[s] || (r[2] ? K[s] = t && t[0] !== ":" && t[0] !== "*" ? [s, r[1], new RegExp(`^${r[2]}(?=/${t})`)] : [e, r[1], new RegExp(`^${r[2]}$`)] : K[s] = [e, r[1], !0]), K[s];
  }
  return null;
}, we = (e, t) => {
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
}, Ft = (e) => we(e, decodeURI), tt = (e) => {
  const t = e.url, r = t.indexOf(
    "/",
    t.charCodeAt(9) === 58 ? 13 : 8
  );
  let s = r;
  for (; s < t.length; s++) {
    const c = t.charCodeAt(s);
    if (c === 37) {
      const l = t.indexOf("?", s), a = t.slice(r, l === -1 ? void 0 : l);
      return Ft(a.includes("%25") ? a.replace(/%25/g, "%2525") : a);
    } else if (c === 63)
      break;
  }
  return t.slice(r, s);
}, Mt = (e) => {
  const t = tt(e);
  return t.length > 1 && t.at(-1) === "/" ? t.slice(0, -1) : t;
}, F = (e, t, ...r) => (r.length && (t = F(t, ...r)), `${e?.[0] === "/" ? "" : "/"}${e}${t === "/" ? "" : `${e?.at(-1) === "/" ? "" : "/"}${t?.[0] === "/" ? t.slice(1) : t}`}`), rt = (e) => {
  if (e.charCodeAt(e.length - 1) !== 63 || !e.includes(":"))
    return null;
  const t = e.split("/"), r = [];
  let s = "";
  return t.forEach((c) => {
    if (c !== "" && !/\:/.test(c))
      s += "/" + c;
    else if (/\:/.test(c))
      if (/\?/.test(c)) {
        r.length === 0 && s === "" ? r.push("/") : r.push(s);
        const l = c.replace("?", "");
        s += "/" + l, r.push(s);
      } else
        s += "/" + c;
  }), r.filter((c, l, a) => a.indexOf(c) === l);
}, ee = (e) => /[%+]/.test(e) ? (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), e.indexOf("%") !== -1 ? we(e, nt) : e) : e, st = (e, t, r) => {
  let s;
  if (!r && t && !/[%+]/.test(t)) {
    let a = e.indexOf(`?${t}`, 8);
    for (a === -1 && (a = e.indexOf(`&${t}`, 8)); a !== -1; ) {
      const i = e.charCodeAt(a + t.length + 1);
      if (i === 61) {
        const n = a + t.length + 2, o = e.indexOf("&", n);
        return ee(e.slice(n, o === -1 ? void 0 : o));
      } else if (i == 38 || isNaN(i))
        return "";
      a = e.indexOf(`&${t}`, a + 1);
    }
    if (s = /[%+]/.test(e), !s)
      return;
  }
  const c = {};
  s ??= /[%+]/.test(e);
  let l = e.indexOf("?", 8);
  for (; l !== -1; ) {
    const a = e.indexOf("&", l + 1);
    let i = e.indexOf("=", l);
    i > a && a !== -1 && (i = -1);
    let n = e.slice(
      l + 1,
      i === -1 ? a === -1 ? void 0 : a : i
    );
    if (s && (n = ee(n)), l = a, n === "")
      continue;
    let o;
    i === -1 ? o = "" : (o = e.slice(i + 1, a === -1 ? void 0 : a), s && (o = ee(o))), r ? (c[n] && Array.isArray(c[n]) || (c[n] = []), c[n].push(o)) : c[n] ??= o;
  }
  return t ? c[t] : c;
}, Ut = st, Bt = (e, t) => st(e, t, !0), nt = decodeURIComponent, Ht = (e) => {
  try {
    return decodeURI(e) === e ? encodeURI(e) : e;
  } catch (t) {
    if (t instanceof URIError)
      return encodeURI(e);
    throw t;
  }
}, Ce = (e) => we(e, nt), it = class {
  raw;
  #t;
  #e;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(e, t = "/", r = [[]]) {
    this.raw = e, this.path = t, this.#e = r, this.#t = {};
  }
  param(e) {
    return e ? this.#r(e) : this.#i();
  }
  #r(e) {
    const t = this.#e[0][this.routeIndex][1][e], r = this.#n(t);
    return r ? /\%/.test(r) ? Ce(r) : r : void 0;
  }
  #i() {
    const e = {}, t = Object.keys(this.#e[0][this.routeIndex][1]);
    for (const r of t) {
      const s = this.#n(this.#e[0][this.routeIndex][1][r]);
      s && typeof s == "string" && (e[r] = /\%/.test(s) ? Ce(s) : s);
    }
    return e;
  }
  #n(e) {
    return this.#e[1] ? this.#e[1][e] : e;
  }
  query(e) {
    return Ut(this.url, e);
  }
  queries(e) {
    return Bt(this.url, e);
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
    return this.bodyCache.parsedBody ??= await Ct(this, e);
  }
  #s = (e) => {
    const { bodyCache: t, raw: r } = this, s = t[e];
    if (s)
      return s;
    const c = Object.keys(t)[0];
    return c ? t[c].then((l) => (c === "json" && (l = JSON.stringify(l)), new Response(l)[e]())) : t[e] = r[e]();
  };
  json() {
    return this.#s("text").then((e) => JSON.parse(e));
  }
  text() {
    return this.#s("text");
  }
  arrayBuffer() {
    return this.#s("arrayBuffer");
  }
  blob() {
    return this.#s("blob");
  }
  formData() {
    return this.#s("formData");
  }
  addValidatedData(e, t) {
    this.#t[e] = t;
  }
  valid(e) {
    return this.#t[e];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [St]() {
    return this.#e;
  }
  get matchedRoutes() {
    return this.#e[0].map(([[, e]]) => e);
  }
  get routePath() {
    return this.#e[0].map(([[, e]]) => e)[this.routeIndex].path;
  }
}, Vt = {
  Stringify: 1
}, ot = async (e, t, r, s, c) => {
  typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
  const l = e.callbacks;
  return l?.length ? (c ? c[0] += e : c = [e], Promise.all(l.map((i) => i({ phase: t, buffer: c, context: s }))).then(
    (i) => Promise.all(
      i.filter(Boolean).map((n) => ot(n, t, !1, s, c))
    ).then(() => c[0])
  )) : Promise.resolve(e);
}, Wt = "text/plain; charset=UTF-8", te = (e, t) => ({
  "Content-Type": e,
  ...t
}), Xt = class {
  #t;
  #e;
  env = {};
  #r;
  finalized = !1;
  error;
  #i;
  #n;
  #s;
  #l;
  #u;
  #c;
  #a;
  #f;
  #h;
  constructor(e, t) {
    this.#t = e, t && (this.#n = t.executionCtx, this.env = t.env, this.#c = t.notFoundHandler, this.#h = t.path, this.#f = t.matchResult);
  }
  get req() {
    return this.#e ??= new it(this.#t, this.#h, this.#f), this.#e;
  }
  get event() {
    if (this.#n && "respondWith" in this.#n)
      return this.#n;
    throw Error("This context has no FetchEvent");
  }
  get executionCtx() {
    if (this.#n)
      return this.#n;
    throw Error("This context has no ExecutionContext");
  }
  get res() {
    return this.#s ||= new Response(null, {
      headers: this.#a ??= new Headers()
    });
  }
  set res(e) {
    if (this.#s && e) {
      e = new Response(e.body, e);
      for (const [t, r] of this.#s.headers.entries())
        if (t !== "content-type")
          if (t === "set-cookie") {
            const s = this.#s.headers.getSetCookie();
            e.headers.delete("set-cookie");
            for (const c of s)
              e.headers.append("set-cookie", c);
          } else
            e.headers.set(t, r);
    }
    this.#s = e, this.finalized = !0;
  }
  render = (...e) => (this.#u ??= (t) => this.html(t), this.#u(...e));
  setLayout = (e) => this.#l = e;
  getLayout = () => this.#l;
  setRenderer = (e) => {
    this.#u = e;
  };
  header = (e, t, r) => {
    this.finalized && (this.#s = new Response(this.#s.body, this.#s));
    const s = this.#s ? this.#s.headers : this.#a ??= new Headers();
    t === void 0 ? s.delete(e) : r?.append ? s.append(e, t) : s.set(e, t);
  };
  status = (e) => {
    this.#i = e;
  };
  set = (e, t) => {
    this.#r ??= /* @__PURE__ */ new Map(), this.#r.set(e, t);
  };
  get = (e) => this.#r ? this.#r.get(e) : void 0;
  get var() {
    return this.#r ? Object.fromEntries(this.#r) : {};
  }
  #o(e, t, r) {
    const s = this.#s ? new Headers(this.#s.headers) : this.#a ?? new Headers();
    if (typeof t == "object" && "headers" in t) {
      const l = t.headers instanceof Headers ? t.headers : new Headers(t.headers);
      for (const [a, i] of l)
        a.toLowerCase() === "set-cookie" ? s.append(a, i) : s.set(a, i);
    }
    if (r)
      for (const [l, a] of Object.entries(r))
        if (typeof a == "string")
          s.set(l, a);
        else {
          s.delete(l);
          for (const i of a)
            s.append(l, i);
        }
    const c = typeof t == "number" ? t : t?.status ?? this.#i;
    return new Response(e, { status: c, headers: s });
  }
  newResponse = (...e) => this.#o(...e);
  body = (e, t, r) => this.#o(e, t, r);
  text = (e, t, r) => !this.#a && !this.#i && !t && !r && !this.finalized ? new Response(e) : this.#o(
    e,
    t,
    te(Wt, r)
  );
  json = (e, t, r) => this.#o(
    JSON.stringify(e),
    t,
    te("application/json", r)
  );
  html = (e, t, r) => {
    const s = (c) => this.#o(c, t, te("text/html; charset=UTF-8", r));
    return typeof e == "object" ? ot(e, Vt.Stringify, !1, {}).then(s) : s(e);
  };
  redirect = (e, t) => (this.header("Location", Ht(String(e))), this.newResponse(null, t ?? 302));
  notFound = () => (this.#c ??= () => new Response(), this.#c(this));
}, _ = "ALL", Gt = "all", zt = ["get", "post", "put", "delete", "options", "patch"], at = "Can not add a route since the matcher is already built.", ut = class extends Error {
}, Kt = "__COMPOSED_HANDLER", Jt = (e) => e.text("404 Not Found", 404), xe = (e, t) => {
  if ("getResponse" in e) {
    const r = e.getResponse();
    return t.newResponse(r.body, r);
  }
  return console.error(e), t.text("Internal Server Error", 500);
}, ct = class {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #t = "/";
  routes = [];
  constructor(t = {}) {
    [...zt, Gt].forEach((l) => {
      this[l] = (a, ...i) => (typeof a == "string" ? this.#t = a : this.#i(l, this.#t, a), i.forEach((n) => {
        this.#i(l, this.#t, n);
      }), this);
    }), this.on = (l, a, ...i) => {
      for (const n of [a].flat()) {
        this.#t = n;
        for (const o of [l].flat())
          i.map((u) => {
            this.#i(o.toUpperCase(), this.#t, u);
          });
      }
      return this;
    }, this.use = (l, ...a) => (typeof l == "string" ? this.#t = l : (this.#t = "*", a.unshift(l)), a.forEach((i) => {
      this.#i(_, this.#t, i);
    }), this);
    const { strict: s, ...c } = t;
    Object.assign(this, c), this.getPath = s ?? !0 ? t.getPath ?? tt : Mt;
  }
  #e() {
    const t = new ct({
      router: this.router,
      getPath: this.getPath
    });
    return t.errorHandler = this.errorHandler, t.#r = this.#r, t.routes = this.routes, t;
  }
  #r = Jt;
  errorHandler = xe;
  route(t, r) {
    const s = this.basePath(t);
    return r.routes.map((c) => {
      let l;
      r.errorHandler === xe ? l = c.handler : (l = async (a, i) => (await Se([], r.errorHandler)(a, () => c.handler(a, i))).res, l[Kt] = c.handler), s.#i(c.method, c.path, l);
    }), this;
  }
  basePath(t) {
    const r = this.#e();
    return r._basePath = F(this._basePath, t), r;
  }
  onError = (t) => (this.errorHandler = t, this);
  notFound = (t) => (this.#r = t, this);
  mount(t, r, s) {
    let c, l;
    s && (typeof s == "function" ? l = s : (l = s.optionHandler, s.replaceRequest === !1 ? c = (n) => n : c = s.replaceRequest));
    const a = l ? (n) => {
      const o = l(n);
      return Array.isArray(o) ? o : [o];
    } : (n) => {
      let o;
      try {
        o = n.executionCtx;
      } catch {
      }
      return [n.env, o];
    };
    c ||= (() => {
      const n = F(this._basePath, t), o = n === "/" ? 0 : n.length;
      return (u) => {
        const d = new URL(u.url);
        return d.pathname = d.pathname.slice(o) || "/", new Request(d, u);
      };
    })();
    const i = async (n, o) => {
      const u = await r(c(n.req.raw), ...a(n));
      if (u)
        return u;
      await o();
    };
    return this.#i(_, F(t, "*"), i), this;
  }
  #i(t, r, s) {
    t = t.toUpperCase(), r = F(this._basePath, r);
    const c = { basePath: this._basePath, path: r, method: t, handler: s };
    this.router.add(t, r, [s, c]), this.routes.push(c);
  }
  #n(t, r) {
    if (t instanceof Error)
      return this.errorHandler(t, r);
    throw t;
  }
  #s(t, r, s, c) {
    if (c === "HEAD")
      return (async () => new Response(null, await this.#s(t, r, s, "GET")))();
    const l = this.getPath(t, { env: s }), a = this.router.match(c, l), i = new Xt(t, {
      path: l,
      matchResult: a,
      env: s,
      executionCtx: r,
      notFoundHandler: this.#r
    });
    if (a[0].length === 1) {
      let o;
      try {
        o = a[0][0][0][0](i, async () => {
          i.res = await this.#r(i);
        });
      } catch (u) {
        return this.#n(u, i);
      }
      return o instanceof Promise ? o.then(
        (u) => u || (i.finalized ? i.res : this.#r(i))
      ).catch((u) => this.#n(u, i)) : o ?? this.#r(i);
    }
    const n = Se(a[0], this.errorHandler, this.#r);
    return (async () => {
      try {
        const o = await n(i);
        if (!o.finalized)
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        return o.res;
      } catch (o) {
        return this.#n(o, i);
      }
    })();
  }
  fetch = (t, ...r) => this.#s(t, r[1], r[0], t.method);
  request = (t, r, s, c) => t instanceof Request ? this.fetch(r ? new Request(t, r) : t, s, c) : (t = t.toString(), this.fetch(
    new Request(
      /^https?:\/\//.test(t) ? t : `http://localhost${F("/", t)}`,
      r
    ),
    s,
    c
  ));
  fire = () => {
    addEventListener("fetch", (t) => {
      t.respondWith(this.#s(t.request, t, void 0, t.request.method));
    });
  };
}, Y = "[^/]+", V = ".*", W = "(?:|/.*)", H = /* @__PURE__ */ Symbol(), Yt = new Set(".\\+*[^]$()");
function Qt(e, t) {
  return e.length === 1 ? t.length === 1 ? e < t ? -1 : 1 : -1 : t.length === 1 || e === V || e === W ? 1 : t === V || t === W ? -1 : e === Y ? 1 : t === Y ? -1 : e.length === t.length ? e < t ? -1 : 1 : t.length - e.length;
}
var me = class {
  #t;
  #e;
  #r = /* @__PURE__ */ Object.create(null);
  insert(t, r, s, c, l) {
    if (t.length === 0) {
      if (this.#t !== void 0)
        throw H;
      if (l)
        return;
      this.#t = r;
      return;
    }
    const [a, ...i] = t, n = a === "*" ? i.length === 0 ? ["", "", V] : ["", "", Y] : a === "/*" ? ["", "", W] : a.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let o;
    if (n) {
      const u = n[1];
      let d = n[2] || Y;
      if (u && n[2] && (d = d.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(d)))
        throw H;
      if (o = this.#r[d], !o) {
        if (Object.keys(this.#r).some(
          (E) => E !== V && E !== W
        ))
          throw H;
        if (l)
          return;
        o = this.#r[d] = new me(), u !== "" && (o.#e = c.varIndex++);
      }
      !l && u !== "" && s.push([u, o.#e]);
    } else if (o = this.#r[a], !o) {
      if (Object.keys(this.#r).some(
        (u) => u.length > 1 && u !== V && u !== W
      ))
        throw H;
      if (l)
        return;
      o = this.#r[a] = new me();
    }
    o.insert(i, r, s, c, l);
  }
  buildRegExpStr() {
    const r = Object.keys(this.#r).sort(Qt).map((s) => {
      const c = this.#r[s];
      return (typeof c.#e == "number" ? `(${s})@${c.#e}` : Yt.has(s) ? `\\${s}` : s) + c.buildRegExpStr();
    });
    return typeof this.#t == "number" && r.unshift(`#${this.#t}`), r.length === 0 ? "" : r.length === 1 ? r[0] : "(?:" + r.join("|") + ")";
  }
}, Zt = class {
  #t = { varIndex: 0 };
  #e = new me();
  insert(e, t, r) {
    const s = [], c = [];
    for (let a = 0; ; ) {
      let i = !1;
      if (e = e.replace(/\{[^}]+\}/g, (n) => {
        const o = `@\\${a}`;
        return c[a] = [o, n], a++, i = !0, o;
      }), !i)
        break;
    }
    const l = e.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let a = c.length - 1; a >= 0; a--) {
      const [i] = c[a];
      for (let n = l.length - 1; n >= 0; n--)
        if (l[n].indexOf(i) !== -1) {
          l[n] = l[n].replace(i, c[a][1]);
          break;
        }
    }
    return this.#e.insert(l, t, s, this.#t, r), s;
  }
  buildRegExp() {
    let e = this.#e.buildRegExpStr();
    if (e === "")
      return [/^$/, [], []];
    let t = 0;
    const r = [], s = [];
    return e = e.replace(/#(\d+)|@(\d+)|\.\*\$/g, (c, l, a) => l !== void 0 ? (r[++t] = Number(l), "$()") : (a !== void 0 && (s[Number(a)] = ++t), "")), [new RegExp(`^${e}`), r, s];
  }
}, lt = [], Dt = [/^$/, [], /* @__PURE__ */ Object.create(null)], ft = /* @__PURE__ */ Object.create(null);
function ht(e) {
  return ft[e] ??= new RegExp(
    e === "*" ? "" : `^${e.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (t, r) => r ? `\\${r}` : "(?:|/.*)"
    )}$`
  );
}
function er() {
  ft = /* @__PURE__ */ Object.create(null);
}
function tr(e) {
  const t = new Zt(), r = [];
  if (e.length === 0)
    return Dt;
  const s = e.map(
    (o) => [!/\*|\/:/.test(o[0]), ...o]
  ).sort(
    ([o, u], [d, E]) => o ? 1 : d ? -1 : u.length - E.length
  ), c = /* @__PURE__ */ Object.create(null);
  for (let o = 0, u = -1, d = s.length; o < d; o++) {
    const [E, y, N] = s[o];
    E ? c[y] = [N.map(([S]) => [S, /* @__PURE__ */ Object.create(null)]), lt] : u++;
    let R;
    try {
      R = t.insert(y, u, E);
    } catch (S) {
      throw S === H ? new ut(y) : S;
    }
    E || (r[u] = N.map(([S, f]) => {
      const g = /* @__PURE__ */ Object.create(null);
      for (f -= 1; f >= 0; f--) {
        const [w, P] = R[f];
        g[w] = P;
      }
      return [S, g];
    }));
  }
  const [l, a, i] = t.buildRegExp();
  for (let o = 0, u = r.length; o < u; o++)
    for (let d = 0, E = r[o].length; d < E; d++) {
      const y = r[o][d]?.[1];
      if (!y)
        continue;
      const N = Object.keys(y);
      for (let R = 0, S = N.length; R < S; R++)
        y[N[R]] = i[y[N[R]]];
    }
  const n = [];
  for (const o in a)
    n[o] = r[a[o]];
  return [l, n, c];
}
function k(e, t) {
  if (e) {
    for (const r of Object.keys(e).sort((s, c) => c.length - s.length))
      if (ht(r).test(t))
        return [...e[r]];
  }
}
var rr = class {
  name = "RegExpRouter";
  #t;
  #e;
  constructor() {
    this.#t = { [_]: /* @__PURE__ */ Object.create(null) }, this.#e = { [_]: /* @__PURE__ */ Object.create(null) };
  }
  add(e, t, r) {
    const s = this.#t, c = this.#e;
    if (!s || !c)
      throw new Error(at);
    s[e] || [s, c].forEach((i) => {
      i[e] = /* @__PURE__ */ Object.create(null), Object.keys(i[_]).forEach((n) => {
        i[e][n] = [...i[_][n]];
      });
    }), t === "/*" && (t = "*");
    const l = (t.match(/\/:/g) || []).length;
    if (/\*$/.test(t)) {
      const i = ht(t);
      e === _ ? Object.keys(s).forEach((n) => {
        s[n][t] ||= k(s[n], t) || k(s[_], t) || [];
      }) : s[e][t] ||= k(s[e], t) || k(s[_], t) || [], Object.keys(s).forEach((n) => {
        (e === _ || e === n) && Object.keys(s[n]).forEach((o) => {
          i.test(o) && s[n][o].push([r, l]);
        });
      }), Object.keys(c).forEach((n) => {
        (e === _ || e === n) && Object.keys(c[n]).forEach(
          (o) => i.test(o) && c[n][o].push([r, l])
        );
      });
      return;
    }
    const a = rt(t) || [t];
    for (let i = 0, n = a.length; i < n; i++) {
      const o = a[i];
      Object.keys(c).forEach((u) => {
        (e === _ || e === u) && (c[u][o] ||= [
          ...k(s[u], o) || k(s[_], o) || []
        ], c[u][o].push([r, l - n + i + 1]));
      });
    }
  }
  match(e, t) {
    er();
    const r = this.#r();
    return this.match = (s, c) => {
      const l = r[s] || r[_], a = l[2][c];
      if (a)
        return a;
      const i = c.match(l[0]);
      if (!i)
        return [[], lt];
      const n = i.indexOf("", 1);
      return [l[1][n], i];
    }, this.match(e, t);
  }
  #r() {
    const e = /* @__PURE__ */ Object.create(null);
    return Object.keys(this.#e).concat(Object.keys(this.#t)).forEach((t) => {
      e[t] ||= this.#i(t);
    }), this.#t = this.#e = void 0, e;
  }
  #i(e) {
    const t = [];
    let r = e === _;
    return [this.#t, this.#e].forEach((s) => {
      const c = s[e] ? Object.keys(s[e]).map((l) => [l, s[e][l]]) : [];
      c.length !== 0 ? (r ||= !0, t.push(...c)) : e !== _ && t.push(
        ...Object.keys(s[_]).map((l) => [l, s[_][l]])
      );
    }), r ? tr(t) : null;
  }
}, sr = class {
  name = "SmartRouter";
  #t = [];
  #e = [];
  constructor(e) {
    this.#t = e.routers;
  }
  add(e, t, r) {
    if (!this.#e)
      throw new Error(at);
    this.#e.push([e, t, r]);
  }
  match(e, t) {
    if (!this.#e)
      throw new Error("Fatal error");
    const r = this.#t, s = this.#e, c = r.length;
    let l = 0, a;
    for (; l < c; l++) {
      const i = r[l];
      try {
        for (let n = 0, o = s.length; n < o; n++)
          i.add(...s[n]);
        a = i.match(e, t);
      } catch (n) {
        if (n instanceof ut)
          continue;
        throw n;
      }
      this.match = i.match.bind(i), this.#t = [i], this.#e = void 0;
      break;
    }
    if (l === c)
      throw new Error("Fatal error");
    return this.name = `SmartRouter + ${this.activeRouter.name}`, a;
  }
  get activeRouter() {
    if (this.#e || this.#t.length !== 1)
      throw new Error("No active router has been determined yet.");
    return this.#t[0];
  }
}, U = /* @__PURE__ */ Object.create(null), dt = class {
  #t;
  #e;
  #r;
  #i = 0;
  #n = U;
  constructor(e, t, r) {
    if (this.#e = r || /* @__PURE__ */ Object.create(null), this.#t = [], e && t) {
      const s = /* @__PURE__ */ Object.create(null);
      s[e] = { handler: t, possibleKeys: [], score: 0 }, this.#t = [s];
    }
    this.#r = [];
  }
  insert(e, t, r) {
    this.#i = ++this.#i;
    let s = this;
    const c = Lt(t), l = [];
    for (let a = 0, i = c.length; a < i; a++) {
      const n = c[a], o = c[a + 1], u = kt(n, o), d = Array.isArray(u) ? u[0] : n;
      if (d in s.#e) {
        s = s.#e[d], u && l.push(u[1]);
        continue;
      }
      s.#e[d] = new dt(), u && (s.#r.push(u), l.push(u[1])), s = s.#e[d];
    }
    return s.#t.push({
      [e]: {
        handler: r,
        possibleKeys: l.filter((a, i, n) => n.indexOf(a) === i),
        score: this.#i
      }
    }), s;
  }
  #s(e, t, r, s) {
    const c = [];
    for (let l = 0, a = e.#t.length; l < a; l++) {
      const i = e.#t[l], n = i[t] || i[_], o = {};
      if (n !== void 0 && (n.params = /* @__PURE__ */ Object.create(null), c.push(n), r !== U || s && s !== U))
        for (let u = 0, d = n.possibleKeys.length; u < d; u++) {
          const E = n.possibleKeys[u], y = o[n.score];
          n.params[E] = s?.[E] && !y ? s[E] : r[E] ?? s?.[E], o[n.score] = !0;
        }
    }
    return c;
  }
  search(e, t) {
    const r = [];
    this.#n = U;
    let c = [this];
    const l = et(t), a = [];
    for (let i = 0, n = l.length; i < n; i++) {
      const o = l[i], u = i === n - 1, d = [];
      for (let E = 0, y = c.length; E < y; E++) {
        const N = c[E], R = N.#e[o];
        R && (R.#n = N.#n, u ? (R.#e["*"] && r.push(
          ...this.#s(R.#e["*"], e, N.#n)
        ), r.push(...this.#s(R, e, N.#n))) : d.push(R));
        for (let S = 0, f = N.#r.length; S < f; S++) {
          const g = N.#r[S], w = N.#n === U ? {} : { ...N.#n };
          if (g === "*") {
            const b = N.#e["*"];
            b && (r.push(...this.#s(b, e, N.#n)), b.#n = w, d.push(b));
            continue;
          }
          if (!o)
            continue;
          const [P, h, p] = g, m = N.#e[P], A = l.slice(i).join("/");
          if (p instanceof RegExp) {
            const b = p.exec(A);
            if (b) {
              if (w[h] = b[0], r.push(...this.#s(m, e, N.#n, w)), Object.keys(m.#e).length) {
                m.#n = w;
                const O = b[0].match(/\//)?.length ?? 0;
                (a[O] ||= []).push(m);
              }
              continue;
            }
          }
          (p === !0 || p.test(o)) && (w[h] = o, u ? (r.push(...this.#s(m, e, w, N.#n)), m.#e["*"] && r.push(
            ...this.#s(m.#e["*"], e, w, N.#n)
          )) : (m.#n = w, d.push(m)));
        }
      }
      c = d.concat(a.shift() ?? []);
    }
    return r.length > 1 && r.sort((i, n) => i.score - n.score), [r.map(({ handler: i, params: n }) => [i, n])];
  }
}, nr = class {
  name = "TrieRouter";
  #t;
  constructor() {
    this.#t = new dt();
  }
  add(e, t, r) {
    const s = rt(t);
    if (s) {
      for (let c = 0, l = s.length; c < l; c++)
        this.#t.insert(e, s[c], r);
      return;
    }
    this.#t.insert(e, t, r);
  }
  match(e, t) {
    return this.#t.search(e, t);
  }
}, Q = class extends ct {
  constructor(e = {}) {
    super(e), this.router = e.router ?? new sr({
      routers: [new rr(), new nr()]
    });
  }
};
function ir() {
  const { process: e, Deno: t } = globalThis;
  return !(typeof t?.noColor == "boolean" ? t.noColor : e !== void 0 ? "NO_COLOR" in e?.env : !1);
}
async function or() {
  const { navigator: e } = globalThis, t = "cloudflare:workers";
  return !(e !== void 0 && e.userAgent === "Cloudflare-Workers" ? await (async () => {
    try {
      return "NO_COLOR" in ((await import(t)).env ?? {});
    } catch {
      return !1;
    }
  })() : !ir());
}
var ar = (e) => {
  const [t, r] = [",", "."];
  return e.map((c) => c.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + t)).join(r);
}, ur = (e) => {
  const t = Date.now() - e;
  return ar([t < 1e3 ? t + "ms" : Math.round(t / 1e3) + "s"]);
}, cr = async (e) => {
  if (await or())
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
async function Ie(e, t, r, s, c = 0, l) {
  const a = t === "<--" ? `${t} ${r} ${s}` : `${t} ${r} ${s} ${await cr(c)} ${l}`;
  e(a);
}
var lr = (e = console.log) => async function(r, s) {
  const { method: c, url: l } = r.req, a = l.slice(l.indexOf("/", 8));
  await Ie(e, "<--", c, a);
  const i = Date.now();
  await s(), await Ie(e, "-->", c, a, r.res.status, ur(i));
};
function _e(e, t) {
  const r = new TextEncoder().encode(e), s = new TextEncoder().encode(t), c = Math.max(r.length, s.length);
  let l = r.length ^ s.length;
  for (let a = 0; a < c; a++) {
    const i = a < r.length ? r[a] : 0, n = a < s.length ? s[a] : 0;
    l |= i ^ n;
  }
  return l === 0;
}
const B = (e, t, r = !1) => {
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
async function Te(e, t) {
  if (!t.USERNAME || !t.PASSWORD)
    return null;
  const r = e.headers.get("Authorization");
  if (!r)
    return B(401, "Authentication required", !0);
  const [s, c] = r.split(" ", 2);
  if (!c || s.toLowerCase() !== "basic")
    return B(400, "Invalid authorization format");
  let l = "";
  try {
    l = atob(c);
  } catch {
    return B(400, "Invalid authorization encoding");
  }
  const a = l.indexOf(":");
  if (a < 0)
    return B(400, "Invalid authorization payload");
  const i = l.slice(0, a), n = l.slice(a + 1);
  return !_e(i, t.USERNAME) || !_e(n, t.PASSWORD) ? B(401, "Invalid credentials", !0) : null;
}
const Re = new Q({ strict: !1 }), fr = /* @__PURE__ */ new Set(["PUT", "POST", "PATCH"]), pt = "api.real-debrid.com", gt = "https:", Et = 15e3, $e = "application/x-www-form-urlencoded", Le = "application/json", hr = "multipart/form-data", dr = "application/octet-stream", pr = /* @__PURE__ */ new Set([
  "/rest/1.0/torrents/addMagnet",
  "/rest/1.0/torrents/addTorrent",
  "/rest/1.0/unrestrict/link"
]), gr = /* @__PURE__ */ new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade"
]), X = (e, t) => new Response(
  JSON.stringify({
    error: t
  }),
  {
    status: e,
    headers: {
      "Content-Type": "application/json"
    }
  }
), Er = (e) => e?.split(";")[0].trim().toLowerCase() ?? "", mr = (e) => pr.has(e), mt = (e) => {
  if (typeof AbortSignal.timeout == "function")
    return AbortSignal.timeout(e);
  const t = new AbortController();
  return setTimeout(() => t.abort(), e), t.signal;
}, yr = (e) => {
  const t = new Headers(e);
  for (const r of e.keys()) {
    const s = r.toLowerCase();
    (s.startsWith("access-control-") || gr.has(s)) && t.delete(r);
  }
  return t;
}, yt = async (e, t) => {
  const r = await fetch(e, t);
  return new Response(r.body, {
    status: r.status,
    headers: yr(r.headers)
  });
};
Re.get("/oauth/*", async (e) => {
  const t = new URL(e.req.url);
  t.host = pt, t.protocol = gt, t.port = "", t.pathname = t.pathname.replace("/api/debrid", "");
  try {
    return await yt(t.toString(), {
      method: e.req.method,
      signal: mt(Et)
    });
  } catch (r) {
    return r instanceof Error && (r.name === "AbortError" || r.name === "TimeoutError") ? X(504, "Upstream request timed out") : X(502, "Upstream request failed");
  }
});
const br = async (e, t) => {
  const r = e.req.header("content-type"), s = Er(r);
  if (!fr.has(e.req.method))
    return { body: void 0, contentType: void 0 };
  if (s === $e) {
    const c = new URLSearchParams(await e.req.text()), l = e.env.FORWARD_IP || e.req.header("CF-Connecting-IP");
    return l && mr(t) && c.set("ip", l), {
      body: c.toString(),
      contentType: $e
    };
  }
  return s === Le ? {
    body: await e.req.text(),
    contentType: Le
  } : s === hr || s === dr ? {
    body: e.req.raw.body ?? void 0,
    contentType: r
  } : {
    body: e.req.raw.body ?? void 0,
    contentType: r
  };
};
Re.use("*", async (e) => {
  if (!e.env.DEBRID_TOKEN)
    return X(500, "Server configuration error: DEBRID_TOKEN is not set");
  const t = new URL(e.req.url);
  t.host = pt, t.protocol = gt, t.port = "", t.pathname = `/rest/1.0${t.pathname.replace("/api/debrid", "")}`;
  const r = new Headers();
  r.set("Authorization", `Bearer ${e.env.DEBRID_TOKEN}`);
  const s = e.req.header("accept");
  s && r.set("Accept", s);
  try {
    const { body: c, contentType: l } = await br(e, t.pathname);
    l && r.set("Content-Type", l);
    const a = {
      method: e.req.method,
      headers: r,
      signal: mt(Et)
    };
    return c !== void 0 && (a.body = c), await yt(t.toString(), a);
  } catch (c) {
    return c instanceof Error && (c.name === "AbortError" || c.name === "TimeoutError") ? X(504, "Upstream request timed out") : X(502, "Upstream request failed");
  }
});
var re;
function G(e) {
  return {
    lang: e?.lang ?? re?.lang,
    message: e?.message,
    abortEarly: e?.abortEarly ?? re?.abortEarly,
    abortPipeEarly: e?.abortPipeEarly ?? re?.abortPipeEarly
  };
}
var Nr;
function wr(e) {
  return Nr?.get(e);
}
var Tr;
function Rr(e) {
  return Tr?.get(e);
}
var Or;
function vr(e, t) {
  return Or?.get(e)?.get(t);
}
function bt(e) {
  const t = typeof e;
  return t === "string" ? `"${e}"` : t === "number" || t === "bigint" || t === "boolean" ? `${e}` : t === "object" || t === "function" ? (e && Object.getPrototypeOf(e)?.constructor?.name) ?? "null" : t;
}
function Oe(e, t, r, s, c) {
  const l = r.value, a = e.expects ?? null, i = bt(l), n = {
    kind: e.kind,
    type: e.type,
    input: l,
    expected: a,
    received: i,
    message: `Invalid ${t}: ${a ? `Expected ${a} but r` : "R"}eceived ${i}`,
    requirement: e.requirement,
    path: c?.path,
    issues: c?.issues,
    lang: s.lang,
    abortEarly: s.abortEarly,
    abortPipeEarly: s.abortPipeEarly
  }, o = e.kind === "schema", u = e.message ?? vr(e.reference, n.lang) ?? (o ? Rr(n.lang) : null) ?? s.message ?? wr(n.lang);
  u && (n.message = typeof u == "function" ? (
    // @ts-expect-error
    u(n)
  ) : u), o && (r.typed = !1), r.issues ? r.issues.push(n) : r.issues = [n];
}
function Ar(e, t) {
  const r = [...new Set(e)];
  return r.length > 1 ? `(${r.join(` ${t} `)})` : r[0] ?? "never";
}
function Pr(e, t, r) {
  return typeof e.fallback == "function" ? (
    // @ts-expect-error
    e.fallback(t, r)
  ) : (
    // @ts-expect-error
    e.fallback
  );
}
function se(e, t) {
  return {
    ...e,
    fallback: t,
    "~validate"(r, s = G()) {
      const c = e["~validate"](r, s);
      return c.issues ? { typed: !0, value: Pr(this, c, s) } : c;
    }
  };
}
function Nt(e, t) {
  return {
    kind: "schema",
    type: "object",
    reference: Nt,
    expects: "Object",
    async: !1,
    entries: e,
    message: t,
    "~standard": 1,
    "~vendor": "valibot",
    "~validate"(r, s = G()) {
      const c = r.value;
      if (c && typeof c == "object") {
        r.typed = !0, r.value = {};
        for (const l in this.entries) {
          const a = c[l], i = this.entries[l]["~validate"](
            { value: a },
            s
          );
          if (i.issues) {
            const n = {
              type: "object",
              origin: "value",
              input: c,
              key: l,
              value: a
            };
            for (const o of i.issues)
              o.path ? o.path.unshift(n) : o.path = [n], r.issues?.push(o);
            if (r.issues || (r.issues = i.issues), s.abortEarly) {
              r.typed = !1;
              break;
            }
          }
          i.typed || (r.typed = !1), (i.value !== void 0 || l in c) && (r.value[l] = i.value);
        }
      } else
        Oe(this, "type", r, s);
      return r;
    }
  };
}
function ye(e, t) {
  return {
    kind: "schema",
    type: "picklist",
    reference: ye,
    expects: Ar(e.map(bt), "|"),
    async: !1,
    options: e,
    message: t,
    "~standard": 1,
    "~vendor": "valibot",
    "~validate"(r, s = G()) {
      return this.options.includes(r.value) ? r.typed = !0 : Oe(this, "type", r, s), r;
    }
  };
}
function be(e) {
  return {
    kind: "schema",
    type: "string",
    reference: be,
    expects: "string",
    async: !1,
    message: e,
    "~standard": 1,
    "~vendor": "valibot",
    "~validate"(t, r = G()) {
      return typeof t.value == "string" ? t.typed = !0 : Oe(this, "type", t, r), t;
    }
  };
}
function Sr(e, t, r) {
  const s = e["~validate"](
    { value: t },
    G(r)
  );
  return {
    typed: s.typed,
    success: !s.issues,
    output: s.value,
    issues: s.issues
  };
}
async function qe(e, t) {
  const r = { config: e };
  return r.status = t.status, r.statusText = t.statusText, r.headers = t.headers, e.responseType === "stream" ? (r.data = t.body, r) : t[e.responseType || "text"]().then((s) => {
    e.transformResponse ? (Array.isArray(e.transformResponse) ? e.transformResponse.map(
      (c) => s = c.call(e, s, t?.headers, t?.status)
    ) : s = e.transformResponse(s, t?.headers, t?.status), r.data = s) : (r.data = s, r.data = JSON.parse(s));
  }).catch(Object).then(() => r);
}
async function Cr(e, t) {
  let r = null;
  if ("any" in AbortSignal) {
    const s = [];
    e.timeout && s.push(AbortSignal.timeout(e.timeout)), e.signal && s.push(e.signal), s.length > 0 && (t.signal = AbortSignal.any(s));
  } else
    e.timeout && (t.signal = AbortSignal.timeout(e.timeout));
  try {
    return r = await fetch(e.url, t), (e.validateStatus ? e.validateStatus(r.status) : r.ok) ? await qe(e, r) : Promise.reject(
      new q(
        `Request failed with status code ${r?.status}`,
        [q.ERR_BAD_REQUEST, q.ERR_BAD_RESPONSE][Math.floor(r?.status / 100) - 4],
        e,
        new Request(e.url, t),
        await qe(e, r)
      )
    );
  } catch (s) {
    if (s.name === "AbortError" || s.name === "TimeoutError") {
      const c = s.name === "TimeoutError";
      return Promise.reject(
        c ? new q(
          e.timeoutErrorMessage || `timeout of ${e.timeout} ms exceeded`,
          q.ECONNABORTED,
          e,
          j
        ) : new _r(null, e)
      );
    }
    return Promise.reject(
      new q(
        s.message,
        void 0,
        e,
        j,
        void 0
      )
    );
  }
}
function wt(e) {
  let t = e.url || "";
  return e.baseURL && e.url && (t = e.url.replace(/^(?!.*\/\/)\/?/, `${e.baseURL}/`)), e.params && Object.keys(e.params).length > 0 && e.url && (t += (~e.url.indexOf("?") ? "&" : "?") + (e.paramsSerializer ? e.paramsSerializer(e.params) : new URLSearchParams(e.params))), t;
}
function Tt(e, t) {
  const r = {
    ...t,
    ...e
  };
  return t?.params && e?.params && (r.params = {
    ...t?.params,
    ...e?.params
  }), t?.headers && e?.headers && (r.headers = new Headers(t.headers || {}), new Headers(e.headers || {}).forEach((c, l) => {
    r.headers.set(l, c);
  })), r;
}
function xr(e, t) {
  const r = {
    ...t,
    ...e
  };
  return t?.headers && e?.headers && (r.headers = new Headers(t.headers || {}), new Headers(e.headers || {}).forEach((c, l) => {
    r.headers.set(l, c);
  })), r;
}
function Ir(e, t) {
  const r = t.get("content-type");
  return r ? r === "application/x-www-form-urlencoded" && !(e instanceof URLSearchParams) ? e = new URLSearchParams(e) : r === "application/json" && typeof e == "object" && (e = JSON.stringify(e)) : typeof e == "string" ? t.set("content-type", "text/plain") : e instanceof URLSearchParams ? t.set("content-type", "application/x-www-form-urlencoded") : e instanceof Blob || e instanceof ArrayBuffer || ArrayBuffer.isView(e) ? t.set("content-type", "application/octet-stream") : typeof e == "object" && typeof e.append != "function" && typeof e.text != "function" && (e = JSON.stringify(e), t.set("content-type", "application/json")), e;
}
async function j(e, t, r, s, c, l) {
  typeof e == "string" ? (t = t || {}, t.url = e) : t = e || {};
  const a = Tt(t, r || {});
  if (a.fetchOptions = a.fetchOptions || {}, a.timeout = a.timeout || 0, a.headers = new Headers(a.headers || {}), a.transformRequest = a.transformRequest ?? Ir, l = l || a.data, a.transformRequest && l && (Array.isArray(a.transformRequest) ? a.transformRequest.map(
    (o) => l = o.call(a, l, a.headers)
  ) : l = a.transformRequest(l, a.headers)), a.url = wt(a), a.method = s || a.method || "get", c && c.request.handlers.length > 0) {
    const o = c.request.handlers.filter(
      (d) => !d?.runWhen || typeof d.runWhen == "function" && d.runWhen(a)
    ).flatMap((d) => [d.fulfilled, d.rejected]);
    let u = a;
    for (let d = 0, E = o.length; d < E; d += 2) {
      const y = o[d], N = o[d + 1];
      try {
        y && (u = y(u));
      } catch (R) {
        N && N?.(R);
        break;
      }
    }
  }
  const i = xr(
    {
      method: a.method?.toUpperCase(),
      body: l,
      headers: a.headers,
      credentials: a.withCredentials ? "include" : void 0,
      signal: a.signal
    },
    a.fetchOptions
  );
  let n = Cr(a, i);
  if (c && c.response.handlers.length > 0) {
    const o = c.response.handlers.flatMap((u) => [
      u.fulfilled,
      u.rejected
    ]);
    for (let u = 0, d = o.length; u < d; u += 2)
      n = n.then(o[u], o[u + 1]);
  }
  return n;
}
var je = class {
  handlers = [];
  constructor() {
    this.handlers = [];
  }
  use = (e, t, r) => (this.handlers.push({
    fulfilled: e,
    rejected: t,
    runWhen: r?.runWhen
  }), this.handlers.length - 1);
  eject = (e) => {
    this.handlers[e] && (this.handlers[e] = null);
  };
  clear = () => {
    this.handlers = [];
  };
};
function Rt(e) {
  e = e || {};
  const t = {
    request: new je(),
    response: new je()
  }, r = (s, c) => j(s, c, e, void 0, t);
  return r.defaults = e, r.interceptors = t, r.getUri = (s) => {
    const c = Tt(s || {}, e);
    return wt(c);
  }, r.request = (s) => j(s, void 0, e, void 0, t), ["get", "delete", "head", "options"].forEach((s) => {
    r[s] = (c, l) => j(c, l, e, s, t);
  }), ["post", "put", "patch"].forEach((s) => {
    r[s] = (c, l, a) => j(c, a, e, s, t, l);
  }), ["postForm", "putForm", "patchForm"].forEach((s) => {
    r[s] = (c, l, a) => (a = a || {}, a.headers = new Headers(a.headers || {}), a.headers.set("content-type", "application/x-www-form-urlencoded"), j(
      c,
      a,
      e,
      s.replace("Form", ""),
      t,
      l
    ));
  }), r;
}
var q = class extends Error {
  config;
  code;
  request;
  response;
  status;
  isAxiosError;
  constructor(e, t, r, s, c) {
    super(e), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.name = "AxiosError", this.code = t, this.config = r, this.request = s, this.response = c, this.isAxiosError = !0;
  }
  static ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
  static ERR_BAD_OPTION = "ERR_BAD_OPTION";
  static ERR_NETWORK = "ERR_NETWORK";
  static ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
  static ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
  static ERR_INVALID_URL = "ERR_INVALID_URL";
  static ERR_CANCELED = "ERR_CANCELED";
  static ECONNABORTED = "ECONNABORTED";
  static ETIMEDOUT = "ETIMEDOUT";
}, _r = class extends q {
  constructor(e, t, r) {
    super(
      e || "canceled",
      q.ERR_CANCELED,
      t,
      r
    ), this.name = "CanceledError";
  }
};
function Ne(e) {
  return e !== null && typeof e == "object" && e.isAxiosError;
}
var Ot = Rt();
Ot.create = (e) => Rt(e);
var $r = Ot, ne = {}, ie = {}, ke;
function ve() {
  return ke || (ke = 1, (function(e) {
    const t = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", r = t + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040", s = "[" + t + "][" + r + "]*", c = new RegExp("^" + s + "$"), l = function(i, n) {
      const o = [];
      let u = n.exec(i);
      for (; u; ) {
        const d = [];
        d.startIndex = n.lastIndex - u[0].length;
        const E = u.length;
        for (let y = 0; y < E; y++)
          d.push(u[y]);
        o.push(d), u = n.exec(i);
      }
      return o;
    }, a = function(i) {
      const n = c.exec(i);
      return !(n === null || typeof n > "u");
    };
    e.isExist = function(i) {
      return typeof i < "u";
    }, e.isEmptyObject = function(i) {
      return Object.keys(i).length === 0;
    }, e.merge = function(i, n, o) {
      if (n) {
        const u = Object.keys(n), d = u.length;
        for (let E = 0; E < d; E++)
          o === "strict" ? i[u[E]] = [n[u[E]]] : i[u[E]] = n[u[E]];
      }
    }, e.getValue = function(i) {
      return e.isExist(i) ? i : "";
    }, e.isName = a, e.getAllMatches = l, e.nameRegexp = s;
  })(ie)), ie;
}
var Fe;
function vt() {
  if (Fe) return ne;
  Fe = 1;
  const e = ve(), t = {
    allowBooleanAttributes: !1,
    //A tag can have attributes without any value
    unpairedTags: []
  };
  ne.validate = function(f, g) {
    g = Object.assign({}, t, g);
    const w = [];
    let P = !1, h = !1;
    f[0] === "\uFEFF" && (f = f.substr(1));
    for (let p = 0; p < f.length; p++)
      if (f[p] === "<" && f[p + 1] === "?") {
        if (p += 2, p = s(f, p), p.err) return p;
      } else if (f[p] === "<") {
        let m = p;
        if (p++, f[p] === "!") {
          p = c(f, p);
          continue;
        } else {
          let A = !1;
          f[p] === "/" && (A = !0, p++);
          let b = "";
          for (; p < f.length && f[p] !== ">" && f[p] !== " " && f[p] !== "	" && f[p] !== `
` && f[p] !== "\r"; p++)
            b += f[p];
          if (b = b.trim(), b[b.length - 1] === "/" && (b = b.substring(0, b.length - 1), p--), !N(b)) {
            let v;
            return b.trim().length === 0 ? v = "Invalid space after '<'." : v = "Tag '" + b + "' is an invalid name.", E("InvalidTag", v, R(f, p));
          }
          const O = i(f, p);
          if (O === !1)
            return E("InvalidAttr", "Attributes for '" + b + "' have open quote.", R(f, p));
          let C = O.value;
          if (p = O.index, C[C.length - 1] === "/") {
            const v = p - C.length;
            C = C.substring(0, C.length - 1);
            const T = o(C, g);
            if (T === !0)
              P = !0;
            else
              return E(T.err.code, T.err.msg, R(f, v + T.err.line));
          } else if (A)
            if (O.tagClosed) {
              if (C.trim().length > 0)
                return E("InvalidTag", "Closing tag '" + b + "' can't have attributes or invalid starting.", R(f, m));
              if (w.length === 0)
                return E("InvalidTag", "Closing tag '" + b + "' has not been opened.", R(f, m));
              {
                const v = w.pop();
                if (b !== v.tagName) {
                  let T = R(f, v.tagStartPos);
                  return E(
                    "InvalidTag",
                    "Expected closing tag '" + v.tagName + "' (opened in line " + T.line + ", col " + T.col + ") instead of closing tag '" + b + "'.",
                    R(f, m)
                  );
                }
                w.length == 0 && (h = !0);
              }
            } else return E("InvalidTag", "Closing tag '" + b + "' doesn't have proper closing.", R(f, p));
          else {
            const v = o(C, g);
            if (v !== !0)
              return E(v.err.code, v.err.msg, R(f, p - C.length + v.err.line));
            if (h === !0)
              return E("InvalidXml", "Multiple possible root nodes found.", R(f, p));
            g.unpairedTags.indexOf(b) !== -1 || w.push({ tagName: b, tagStartPos: m }), P = !0;
          }
          for (p++; p < f.length; p++)
            if (f[p] === "<")
              if (f[p + 1] === "!") {
                p++, p = c(f, p);
                continue;
              } else if (f[p + 1] === "?") {
                if (p = s(f, ++p), p.err) return p;
              } else
                break;
            else if (f[p] === "&") {
              const v = d(f, p);
              if (v == -1)
                return E("InvalidChar", "char '&' is not expected.", R(f, p));
              p = v;
            } else if (h === !0 && !r(f[p]))
              return E("InvalidXml", "Extra text at the end", R(f, p));
          f[p] === "<" && p--;
        }
      } else {
        if (r(f[p]))
          continue;
        return E("InvalidChar", "char '" + f[p] + "' is not expected.", R(f, p));
      }
    if (P) {
      if (w.length == 1)
        return E("InvalidTag", "Unclosed tag '" + w[0].tagName + "'.", R(f, w[0].tagStartPos));
      if (w.length > 0)
        return E("InvalidXml", "Invalid '" + JSON.stringify(w.map((p) => p.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
    } else return E("InvalidXml", "Start tag expected.", 1);
    return !0;
  };
  function r(f) {
    return f === " " || f === "	" || f === `
` || f === "\r";
  }
  function s(f, g) {
    const w = g;
    for (; g < f.length; g++)
      if (f[g] == "?" || f[g] == " ") {
        const P = f.substr(w, g - w);
        if (g > 5 && P === "xml")
          return E("InvalidXml", "XML declaration allowed only at the start of the document.", R(f, g));
        if (f[g] == "?" && f[g + 1] == ">") {
          g++;
          break;
        } else
          continue;
      }
    return g;
  }
  function c(f, g) {
    if (f.length > g + 5 && f[g + 1] === "-" && f[g + 2] === "-") {
      for (g += 3; g < f.length; g++)
        if (f[g] === "-" && f[g + 1] === "-" && f[g + 2] === ">") {
          g += 2;
          break;
        }
    } else if (f.length > g + 8 && f[g + 1] === "D" && f[g + 2] === "O" && f[g + 3] === "C" && f[g + 4] === "T" && f[g + 5] === "Y" && f[g + 6] === "P" && f[g + 7] === "E") {
      let w = 1;
      for (g += 8; g < f.length; g++)
        if (f[g] === "<")
          w++;
        else if (f[g] === ">" && (w--, w === 0))
          break;
    } else if (f.length > g + 9 && f[g + 1] === "[" && f[g + 2] === "C" && f[g + 3] === "D" && f[g + 4] === "A" && f[g + 5] === "T" && f[g + 6] === "A" && f[g + 7] === "[") {
      for (g += 8; g < f.length; g++)
        if (f[g] === "]" && f[g + 1] === "]" && f[g + 2] === ">") {
          g += 2;
          break;
        }
    }
    return g;
  }
  const l = '"', a = "'";
  function i(f, g) {
    let w = "", P = "", h = !1;
    for (; g < f.length; g++) {
      if (f[g] === l || f[g] === a)
        P === "" ? P = f[g] : P !== f[g] || (P = "");
      else if (f[g] === ">" && P === "") {
        h = !0;
        break;
      }
      w += f[g];
    }
    return P !== "" ? !1 : {
      value: w,
      index: g,
      tagClosed: h
    };
  }
  const n = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
  function o(f, g) {
    const w = e.getAllMatches(f, n), P = {};
    for (let h = 0; h < w.length; h++) {
      if (w[h][1].length === 0)
        return E("InvalidAttr", "Attribute '" + w[h][2] + "' has no space in starting.", S(w[h]));
      if (w[h][3] !== void 0 && w[h][4] === void 0)
        return E("InvalidAttr", "Attribute '" + w[h][2] + "' is without value.", S(w[h]));
      if (w[h][3] === void 0 && !g.allowBooleanAttributes)
        return E("InvalidAttr", "boolean attribute '" + w[h][2] + "' is not allowed.", S(w[h]));
      const p = w[h][2];
      if (!y(p))
        return E("InvalidAttr", "Attribute '" + p + "' is an invalid name.", S(w[h]));
      if (!P.hasOwnProperty(p))
        P[p] = 1;
      else
        return E("InvalidAttr", "Attribute '" + p + "' is repeated.", S(w[h]));
    }
    return !0;
  }
  function u(f, g) {
    let w = /\d/;
    for (f[g] === "x" && (g++, w = /[\da-fA-F]/); g < f.length; g++) {
      if (f[g] === ";")
        return g;
      if (!f[g].match(w))
        break;
    }
    return -1;
  }
  function d(f, g) {
    if (g++, f[g] === ";")
      return -1;
    if (f[g] === "#")
      return g++, u(f, g);
    let w = 0;
    for (; g < f.length; g++, w++)
      if (!(f[g].match(/\w/) && w < 20)) {
        if (f[g] === ";")
          break;
        return -1;
      }
    return g;
  }
  function E(f, g, w) {
    return {
      err: {
        code: f,
        msg: g,
        line: w.line || w,
        col: w.col
      }
    };
  }
  function y(f) {
    return e.isName(f);
  }
  function N(f) {
    return e.isName(f);
  }
  function R(f, g) {
    const w = f.substring(0, g).split(/\r?\n/);
    return {
      line: w.length,
      // column number is last line's length + 1, because column numbering starts at 1:
      col: w[w.length - 1].length + 1
    };
  }
  function S(f) {
    return f.startIndex + f[1].length;
  }
  return ne;
}
var J = {}, Me;
function Lr() {
  if (Me) return J;
  Me = 1;
  const e = {
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
    tagValueProcessor: function(r, s) {
      return s;
    },
    attributeValueProcessor: function(r, s) {
      return s;
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
    updateTag: function(r, s, c) {
      return r;
    }
    // skipEmptyListItem: false
  }, t = function(r) {
    return Object.assign({}, e, r);
  };
  return J.buildOptions = t, J.defaultOptions = e, J;
}
var oe, Ue;
function qr() {
  if (Ue) return oe;
  Ue = 1;
  class e {
    constructor(r) {
      this.tagname = r, this.child = [], this[":@"] = {};
    }
    add(r, s) {
      r === "__proto__" && (r = "#__proto__"), this.child.push({ [r]: s });
    }
    addChild(r) {
      r.tagname === "__proto__" && (r.tagname = "#__proto__"), r[":@"] && Object.keys(r[":@"]).length > 0 ? this.child.push({ [r.tagname]: r.child, ":@": r[":@"] }) : this.child.push({ [r.tagname]: r.child });
    }
  }
  return oe = e, oe;
}
var ae, Be;
function jr() {
  if (Be) return ae;
  Be = 1;
  const e = ve();
  function t(o, u) {
    const d = {};
    if (o[u + 3] === "O" && o[u + 4] === "C" && o[u + 5] === "T" && o[u + 6] === "Y" && o[u + 7] === "P" && o[u + 8] === "E") {
      u = u + 9;
      let E = 1, y = !1, N = !1, R = "";
      for (; u < o.length; u++)
        if (o[u] === "<" && !N) {
          if (y && c(o, u)) {
            u += 7;
            let S, f;
            [S, f, u] = r(o, u + 1), f.indexOf("&") === -1 && (d[n(S)] = {
              regx: RegExp(`&${S};`, "g"),
              val: f
            });
          } else if (y && l(o, u)) u += 8;
          else if (y && a(o, u)) u += 8;
          else if (y && i(o, u)) u += 9;
          else if (s) N = !0;
          else throw new Error("Invalid DOCTYPE");
          E++, R = "";
        } else if (o[u] === ">") {
          if (N ? o[u - 1] === "-" && o[u - 2] === "-" && (N = !1, E--) : E--, E === 0)
            break;
        } else o[u] === "[" ? y = !0 : R += o[u];
      if (E !== 0)
        throw new Error("Unclosed DOCTYPE");
    } else
      throw new Error("Invalid Tag instead of DOCTYPE");
    return { entities: d, i: u };
  }
  function r(o, u) {
    let d = "";
    for (; u < o.length && o[u] !== "'" && o[u] !== '"'; u++)
      d += o[u];
    if (d = d.trim(), d.indexOf(" ") !== -1) throw new Error("External entites are not supported");
    const E = o[u++];
    let y = "";
    for (; u < o.length && o[u] !== E; u++)
      y += o[u];
    return [d, y, u];
  }
  function s(o, u) {
    return o[u + 1] === "!" && o[u + 2] === "-" && o[u + 3] === "-";
  }
  function c(o, u) {
    return o[u + 1] === "!" && o[u + 2] === "E" && o[u + 3] === "N" && o[u + 4] === "T" && o[u + 5] === "I" && o[u + 6] === "T" && o[u + 7] === "Y";
  }
  function l(o, u) {
    return o[u + 1] === "!" && o[u + 2] === "E" && o[u + 3] === "L" && o[u + 4] === "E" && o[u + 5] === "M" && o[u + 6] === "E" && o[u + 7] === "N" && o[u + 8] === "T";
  }
  function a(o, u) {
    return o[u + 1] === "!" && o[u + 2] === "A" && o[u + 3] === "T" && o[u + 4] === "T" && o[u + 5] === "L" && o[u + 6] === "I" && o[u + 7] === "S" && o[u + 8] === "T";
  }
  function i(o, u) {
    return o[u + 1] === "!" && o[u + 2] === "N" && o[u + 3] === "O" && o[u + 4] === "T" && o[u + 5] === "A" && o[u + 6] === "T" && o[u + 7] === "I" && o[u + 8] === "O" && o[u + 9] === "N";
  }
  function n(o) {
    if (e.isName(o))
      return o;
    throw new Error(`Invalid entity name ${o}`);
  }
  return ae = t, ae;
}
var ue, He;
function kr() {
  if (He) return ue;
  He = 1;
  const e = /^[-+]?0x[a-fA-F0-9]+$/, t = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/, r = {
    hex: !0,
    // oct: false,
    leadingZeros: !0,
    decimalPoint: ".",
    eNotation: !0
    //skipLike: /regex/
  };
  function s(a, i = {}) {
    if (i = Object.assign({}, r, i), !a || typeof a != "string") return a;
    let n = a.trim();
    if (i.skipLike !== void 0 && i.skipLike.test(n)) return a;
    if (a === "0") return 0;
    if (i.hex && e.test(n))
      return l(n, 16);
    if (n.search(/[eE]/) !== -1) {
      const o = n.match(/^([-\+])?(0*)([0-9]*(\.[0-9]*)?[eE][-\+]?[0-9]+)$/);
      if (o) {
        if (i.leadingZeros)
          n = (o[1] || "") + o[3];
        else if (!(o[2] === "0" && o[3][0] === ".")) return a;
        return i.eNotation ? Number(n) : a;
      } else
        return a;
    } else {
      const o = t.exec(n);
      if (o) {
        const u = o[1], d = o[2];
        let E = c(o[3]);
        if (!i.leadingZeros && d.length > 0 && u && n[2] !== ".") return a;
        if (!i.leadingZeros && d.length > 0 && !u && n[1] !== ".") return a;
        if (i.leadingZeros && d === a) return 0;
        {
          const y = Number(n), N = "" + y;
          return N.search(/[eE]/) !== -1 ? i.eNotation ? y : a : n.indexOf(".") !== -1 ? N === "0" && E === "" || N === E || u && N === "-" + E ? y : a : d ? E === N || u + E === N ? y : a : n === N || n === u + N ? y : a;
        }
      } else
        return a;
    }
  }
  function c(a) {
    return a && a.indexOf(".") !== -1 && (a = a.replace(/0+$/, ""), a === "." ? a = "0" : a[0] === "." ? a = "0" + a : a[a.length - 1] === "." && (a = a.substr(0, a.length - 1))), a;
  }
  function l(a, i) {
    if (parseInt) return parseInt(a, i);
    if (Number.parseInt) return Number.parseInt(a, i);
    if (window && window.parseInt) return window.parseInt(a, i);
    throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
  }
  return ue = s, ue;
}
var ce, Ve;
function At() {
  if (Ve) return ce;
  Ve = 1;
  function e(t) {
    return typeof t == "function" ? t : Array.isArray(t) ? (r) => {
      for (const s of t)
        if (typeof s == "string" && r === s || s instanceof RegExp && s.test(r))
          return !0;
    } : () => !1;
  }
  return ce = e, ce;
}
var le, We;
function Fr() {
  if (We) return le;
  We = 1;
  const e = ve(), t = qr(), r = jr(), s = kr(), c = At();
  class l {
    constructor(p) {
      this.options = p, this.currentNode = null, this.tagsNodeStack = [], this.docTypeEntities = {}, this.lastEntities = {
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
        num_dec: { regex: /&#([0-9]{1,7});/g, val: (m, A) => String.fromCharCode(Number.parseInt(A, 10)) },
        num_hex: { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (m, A) => String.fromCharCode(Number.parseInt(A, 16)) }
      }, this.addExternalEntities = a, this.parseXml = d, this.parseTextData = i, this.resolveNameSpace = n, this.buildAttributesMap = u, this.isItStopNode = R, this.replaceEntitiesValue = y, this.readStopNodeData = w, this.saveTextToParentTag = N, this.addChild = E, this.ignoreAttributesFn = c(this.options.ignoreAttributes);
    }
  }
  function a(h) {
    const p = Object.keys(h);
    for (let m = 0; m < p.length; m++) {
      const A = p[m];
      this.lastEntities[A] = {
        regex: new RegExp("&" + A + ";", "g"),
        val: h[A]
      };
    }
  }
  function i(h, p, m, A, b, O, C) {
    if (h !== void 0 && (this.options.trimValues && !A && (h = h.trim()), h.length > 0)) {
      C || (h = this.replaceEntitiesValue(h));
      const v = this.options.tagValueProcessor(p, h, m, b, O);
      return v == null ? h : typeof v != typeof h || v !== h ? v : this.options.trimValues ? P(h, this.options.parseTagValue, this.options.numberParseOptions) : h.trim() === h ? P(h, this.options.parseTagValue, this.options.numberParseOptions) : h;
    }
  }
  function n(h) {
    if (this.options.removeNSPrefix) {
      const p = h.split(":"), m = h.charAt(0) === "/" ? "/" : "";
      if (p[0] === "xmlns")
        return "";
      p.length === 2 && (h = m + p[1]);
    }
    return h;
  }
  const o = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
  function u(h, p, m) {
    if (this.options.ignoreAttributes !== !0 && typeof h == "string") {
      const A = e.getAllMatches(h, o), b = A.length, O = {};
      for (let C = 0; C < b; C++) {
        const v = this.resolveNameSpace(A[C][1]);
        if (this.ignoreAttributesFn(v, p))
          continue;
        let T = A[C][4], I = this.options.attributeNamePrefix + v;
        if (v.length)
          if (this.options.transformAttributeName && (I = this.options.transformAttributeName(I)), I === "__proto__" && (I = "#__proto__"), T !== void 0) {
            this.options.trimValues && (T = T.trim()), T = this.replaceEntitiesValue(T);
            const x = this.options.attributeValueProcessor(v, T, p);
            x == null ? O[I] = T : typeof x != typeof T || x !== T ? O[I] = x : O[I] = P(
              T,
              this.options.parseAttributeValue,
              this.options.numberParseOptions
            );
          } else this.options.allowBooleanAttributes && (O[I] = !0);
      }
      if (!Object.keys(O).length)
        return;
      if (this.options.attributesGroupName) {
        const C = {};
        return C[this.options.attributesGroupName] = O, C;
      }
      return O;
    }
  }
  const d = function(h) {
    h = h.replace(/\r\n?/g, `
`);
    const p = new t("!xml");
    let m = p, A = "", b = "";
    for (let O = 0; O < h.length; O++)
      if (h[O] === "<")
        if (h[O + 1] === "/") {
          const v = f(h, ">", O, "Closing Tag is not closed.");
          let T = h.substring(O + 2, v).trim();
          if (this.options.removeNSPrefix) {
            const L = T.indexOf(":");
            L !== -1 && (T = T.substr(L + 1));
          }
          this.options.transformTagName && (T = this.options.transformTagName(T)), m && (A = this.saveTextToParentTag(A, m, b));
          const I = b.substring(b.lastIndexOf(".") + 1);
          if (T && this.options.unpairedTags.indexOf(T) !== -1)
            throw new Error(`Unpaired tag can not be used as closing tag: </${T}>`);
          let x = 0;
          I && this.options.unpairedTags.indexOf(I) !== -1 ? (x = b.lastIndexOf(".", b.lastIndexOf(".") - 1), this.tagsNodeStack.pop()) : x = b.lastIndexOf("."), b = b.substring(0, x), m = this.tagsNodeStack.pop(), A = "", O = v;
        } else if (h[O + 1] === "?") {
          let v = g(h, O, !1, "?>");
          if (!v) throw new Error("Pi Tag is not closed.");
          if (A = this.saveTextToParentTag(A, m, b), !(this.options.ignoreDeclaration && v.tagName === "?xml" || this.options.ignorePiTags)) {
            const T = new t(v.tagName);
            T.add(this.options.textNodeName, ""), v.tagName !== v.tagExp && v.attrExpPresent && (T[":@"] = this.buildAttributesMap(v.tagExp, b, v.tagName)), this.addChild(m, T, b);
          }
          O = v.closeIndex + 1;
        } else if (h.substr(O + 1, 3) === "!--") {
          const v = f(h, "-->", O + 4, "Comment is not closed.");
          if (this.options.commentPropName) {
            const T = h.substring(O + 4, v - 2);
            A = this.saveTextToParentTag(A, m, b), m.add(this.options.commentPropName, [{ [this.options.textNodeName]: T }]);
          }
          O = v;
        } else if (h.substr(O + 1, 2) === "!D") {
          const v = r(h, O);
          this.docTypeEntities = v.entities, O = v.i;
        } else if (h.substr(O + 1, 2) === "![") {
          const v = f(h, "]]>", O, "CDATA is not closed.") - 2, T = h.substring(O + 9, v);
          A = this.saveTextToParentTag(A, m, b);
          let I = this.parseTextData(T, m.tagname, b, !0, !1, !0, !0);
          I == null && (I = ""), this.options.cdataPropName ? m.add(this.options.cdataPropName, [{ [this.options.textNodeName]: T }]) : m.add(this.options.textNodeName, I), O = v + 2;
        } else {
          let v = g(h, O, this.options.removeNSPrefix), T = v.tagName;
          const I = v.rawTagName;
          let x = v.tagExp, L = v.attrExpPresent, Ae = v.closeIndex;
          this.options.transformTagName && (T = this.options.transformTagName(T)), m && A && m.tagname !== "!xml" && (A = this.saveTextToParentTag(A, m, b, !1));
          const Pe = m;
          if (Pe && this.options.unpairedTags.indexOf(Pe.tagname) !== -1 && (m = this.tagsNodeStack.pop(), b = b.substring(0, b.lastIndexOf("."))), T !== p.tagname && (b += b ? "." + T : T), this.isItStopNode(this.options.stopNodes, b, T)) {
            let $ = "";
            if (x.length > 0 && x.lastIndexOf("/") === x.length - 1)
              T[T.length - 1] === "/" ? (T = T.substr(0, T.length - 1), b = b.substr(0, b.length - 1), x = T) : x = x.substr(0, x.length - 1), O = v.closeIndex;
            else if (this.options.unpairedTags.indexOf(T) !== -1)
              O = v.closeIndex;
            else {
              const D = this.readStopNodeData(h, I, Ae + 1);
              if (!D) throw new Error(`Unexpected end of ${I}`);
              O = D.i, $ = D.tagContent;
            }
            const Z = new t(T);
            T !== x && L && (Z[":@"] = this.buildAttributesMap(x, b, T)), $ && ($ = this.parseTextData($, T, b, !0, L, !0, !0)), b = b.substr(0, b.lastIndexOf(".")), Z.add(this.options.textNodeName, $), this.addChild(m, Z, b);
          } else {
            if (x.length > 0 && x.lastIndexOf("/") === x.length - 1) {
              T[T.length - 1] === "/" ? (T = T.substr(0, T.length - 1), b = b.substr(0, b.length - 1), x = T) : x = x.substr(0, x.length - 1), this.options.transformTagName && (T = this.options.transformTagName(T));
              const $ = new t(T);
              T !== x && L && ($[":@"] = this.buildAttributesMap(x, b, T)), this.addChild(m, $, b), b = b.substr(0, b.lastIndexOf("."));
            } else {
              const $ = new t(T);
              this.tagsNodeStack.push(m), T !== x && L && ($[":@"] = this.buildAttributesMap(x, b, T)), this.addChild(m, $, b), m = $;
            }
            A = "", O = Ae;
          }
        }
      else
        A += h[O];
    return p.child;
  };
  function E(h, p, m) {
    const A = this.options.updateTag(p.tagname, m, p[":@"]);
    A === !1 || (typeof A == "string" && (p.tagname = A), h.addChild(p));
  }
  const y = function(h) {
    if (this.options.processEntities) {
      for (let p in this.docTypeEntities) {
        const m = this.docTypeEntities[p];
        h = h.replace(m.regx, m.val);
      }
      for (let p in this.lastEntities) {
        const m = this.lastEntities[p];
        h = h.replace(m.regex, m.val);
      }
      if (this.options.htmlEntities)
        for (let p in this.htmlEntities) {
          const m = this.htmlEntities[p];
          h = h.replace(m.regex, m.val);
        }
      h = h.replace(this.ampEntity.regex, this.ampEntity.val);
    }
    return h;
  };
  function N(h, p, m, A) {
    return h && (A === void 0 && (A = p.child.length === 0), h = this.parseTextData(
      h,
      p.tagname,
      m,
      !1,
      p[":@"] ? Object.keys(p[":@"]).length !== 0 : !1,
      A
    ), h !== void 0 && h !== "" && p.add(this.options.textNodeName, h), h = ""), h;
  }
  function R(h, p, m) {
    const A = "*." + m;
    for (const b in h) {
      const O = h[b];
      if (A === O || p === O) return !0;
    }
    return !1;
  }
  function S(h, p, m = ">") {
    let A, b = "";
    for (let O = p; O < h.length; O++) {
      let C = h[O];
      if (A)
        C === A && (A = "");
      else if (C === '"' || C === "'")
        A = C;
      else if (C === m[0])
        if (m[1]) {
          if (h[O + 1] === m[1])
            return {
              data: b,
              index: O
            };
        } else
          return {
            data: b,
            index: O
          };
      else C === "	" && (C = " ");
      b += C;
    }
  }
  function f(h, p, m, A) {
    const b = h.indexOf(p, m);
    if (b === -1)
      throw new Error(A);
    return b + p.length - 1;
  }
  function g(h, p, m, A = ">") {
    const b = S(h, p + 1, A);
    if (!b) return;
    let O = b.data;
    const C = b.index, v = O.search(/\s/);
    let T = O, I = !0;
    v !== -1 && (T = O.substring(0, v), O = O.substring(v + 1).trimStart());
    const x = T;
    if (m) {
      const L = T.indexOf(":");
      L !== -1 && (T = T.substr(L + 1), I = T !== b.data.substr(L + 1));
    }
    return {
      tagName: T,
      tagExp: O,
      closeIndex: C,
      attrExpPresent: I,
      rawTagName: x
    };
  }
  function w(h, p, m) {
    const A = m;
    let b = 1;
    for (; m < h.length; m++)
      if (h[m] === "<")
        if (h[m + 1] === "/") {
          const O = f(h, ">", m, `${p} is not closed`);
          if (h.substring(m + 2, O).trim() === p && (b--, b === 0))
            return {
              tagContent: h.substring(A, m),
              i: O
            };
          m = O;
        } else if (h[m + 1] === "?")
          m = f(h, "?>", m + 1, "StopNode is not closed.");
        else if (h.substr(m + 1, 3) === "!--")
          m = f(h, "-->", m + 3, "StopNode is not closed.");
        else if (h.substr(m + 1, 2) === "![")
          m = f(h, "]]>", m, "StopNode is not closed.") - 2;
        else {
          const O = g(h, m, ">");
          O && ((O && O.tagName) === p && O.tagExp[O.tagExp.length - 1] !== "/" && b++, m = O.closeIndex);
        }
  }
  function P(h, p, m) {
    if (p && typeof h == "string") {
      const A = h.trim();
      return A === "true" ? !0 : A === "false" ? !1 : s(h, m);
    } else
      return e.isExist(h) ? h : "";
  }
  return le = l, le;
}
var fe = {}, Xe;
function Mr() {
  if (Xe) return fe;
  Xe = 1;
  function e(l, a) {
    return t(l, a);
  }
  function t(l, a, i) {
    let n;
    const o = {};
    for (let u = 0; u < l.length; u++) {
      const d = l[u], E = r(d);
      let y = "";
      if (i === void 0 ? y = E : y = i + "." + E, E === a.textNodeName)
        n === void 0 ? n = d[E] : n += "" + d[E];
      else {
        if (E === void 0)
          continue;
        if (d[E]) {
          let N = t(d[E], a, y);
          const R = c(N, a);
          d[":@"] ? s(N, d[":@"], y, a) : Object.keys(N).length === 1 && N[a.textNodeName] !== void 0 && !a.alwaysCreateTextNode ? N = N[a.textNodeName] : Object.keys(N).length === 0 && (a.alwaysCreateTextNode ? N[a.textNodeName] = "" : N = ""), o[E] !== void 0 && o.hasOwnProperty(E) ? (Array.isArray(o[E]) || (o[E] = [o[E]]), o[E].push(N)) : a.isArray(E, y, R) ? o[E] = [N] : o[E] = N;
        }
      }
    }
    return typeof n == "string" ? n.length > 0 && (o[a.textNodeName] = n) : n !== void 0 && (o[a.textNodeName] = n), o;
  }
  function r(l) {
    const a = Object.keys(l);
    for (let i = 0; i < a.length; i++) {
      const n = a[i];
      if (n !== ":@") return n;
    }
  }
  function s(l, a, i, n) {
    if (a) {
      const o = Object.keys(a), u = o.length;
      for (let d = 0; d < u; d++) {
        const E = o[d];
        n.isArray(E, i + "." + E, !0, !0) ? l[E] = [a[E]] : l[E] = a[E];
      }
    }
  }
  function c(l, a) {
    const { textNodeName: i } = a, n = Object.keys(l).length;
    return !!(n === 0 || n === 1 && (l[i] || typeof l[i] == "boolean" || l[i] === 0));
  }
  return fe.prettify = e, fe;
}
var he, Ge;
function Ur() {
  if (Ge) return he;
  Ge = 1;
  const { buildOptions: e } = Lr(), t = Fr(), { prettify: r } = Mr(), s = vt();
  class c {
    constructor(a) {
      this.externalEntities = {}, this.options = e(a);
    }
    /**
     * Parse XML dats to JS object 
     * @param {string|Buffer} xmlData 
     * @param {boolean|Object} validationOption 
     */
    parse(a, i) {
      if (typeof a != "string") if (a.toString)
        a = a.toString();
      else
        throw new Error("XML data is accepted in String or Bytes[] form.");
      if (i) {
        i === !0 && (i = {});
        const u = s.validate(a, i);
        if (u !== !0)
          throw Error(`${u.err.msg}:${u.err.line}:${u.err.col}`);
      }
      const n = new t(this.options);
      n.addExternalEntities(this.externalEntities);
      const o = n.parseXml(a);
      return this.options.preserveOrder || o === void 0 ? o : r(o, this.options);
    }
    /**
     * Add Entity which is not by default supported by this library
     * @param {string} key 
     * @param {string} value 
     */
    addEntity(a, i) {
      if (i.indexOf("&") !== -1)
        throw new Error("Entity value can't have '&'");
      if (a.indexOf("&") !== -1 || a.indexOf(";") !== -1)
        throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
      if (i === "&")
        throw new Error("An entity with value '&' is not permitted");
      this.externalEntities[a] = i;
    }
  }
  return he = c, he;
}
var de, ze;
function Br() {
  if (ze) return de;
  ze = 1;
  const e = `
`;
  function t(i, n) {
    let o = "";
    return n.format && n.indentBy.length > 0 && (o = e), r(i, n, "", o);
  }
  function r(i, n, o, u) {
    let d = "", E = !1;
    for (let y = 0; y < i.length; y++) {
      const N = i[y], R = s(N);
      if (R === void 0) continue;
      let S = "";
      if (o.length === 0 ? S = R : S = `${o}.${R}`, R === n.textNodeName) {
        let h = N[R];
        l(S, n) || (h = n.tagValueProcessor(R, h), h = a(h, n)), E && (d += u), d += h, E = !1;
        continue;
      } else if (R === n.cdataPropName) {
        E && (d += u), d += `<![CDATA[${N[R][0][n.textNodeName]}]]>`, E = !1;
        continue;
      } else if (R === n.commentPropName) {
        d += u + `<!--${N[R][0][n.textNodeName]}-->`, E = !0;
        continue;
      } else if (R[0] === "?") {
        const h = c(N[":@"], n), p = R === "?xml" ? "" : u;
        let m = N[R][0][n.textNodeName];
        m = m.length !== 0 ? " " + m : "", d += p + `<${R}${m}${h}?>`, E = !0;
        continue;
      }
      let f = u;
      f !== "" && (f += n.indentBy);
      const g = c(N[":@"], n), w = u + `<${R}${g}`, P = r(N[R], n, S, f);
      n.unpairedTags.indexOf(R) !== -1 ? n.suppressUnpairedNode ? d += w + ">" : d += w + "/>" : (!P || P.length === 0) && n.suppressEmptyNode ? d += w + "/>" : P && P.endsWith(">") ? d += w + `>${P}${u}</${R}>` : (d += w + ">", P && u !== "" && (P.includes("/>") || P.includes("</")) ? d += u + n.indentBy + P + u : d += P, d += `</${R}>`), E = !0;
    }
    return d;
  }
  function s(i) {
    const n = Object.keys(i);
    for (let o = 0; o < n.length; o++) {
      const u = n[o];
      if (i.hasOwnProperty(u) && u !== ":@")
        return u;
    }
  }
  function c(i, n) {
    let o = "";
    if (i && !n.ignoreAttributes)
      for (let u in i) {
        if (!i.hasOwnProperty(u)) continue;
        let d = n.attributeValueProcessor(u, i[u]);
        d = a(d, n), d === !0 && n.suppressBooleanAttributes ? o += ` ${u.substr(n.attributeNamePrefix.length)}` : o += ` ${u.substr(n.attributeNamePrefix.length)}="${d}"`;
      }
    return o;
  }
  function l(i, n) {
    i = i.substr(0, i.length - n.textNodeName.length - 1);
    let o = i.substr(i.lastIndexOf(".") + 1);
    for (let u in n.stopNodes)
      if (n.stopNodes[u] === i || n.stopNodes[u] === "*." + o) return !0;
    return !1;
  }
  function a(i, n) {
    if (i && i.length > 0 && n.processEntities)
      for (let o = 0; o < n.entities.length; o++) {
        const u = n.entities[o];
        i = i.replace(u.regex, u.val);
      }
    return i;
  }
  return de = t, de;
}
var pe, Ke;
function Hr() {
  if (Ke) return pe;
  Ke = 1;
  const e = Br(), t = At(), r = {
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
    tagValueProcessor: function(i, n) {
      return n;
    },
    attributeValueProcessor: function(i, n) {
      return n;
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
  function s(i) {
    this.options = Object.assign({}, r, i), this.options.ignoreAttributes === !0 || this.options.attributesGroupName ? this.isAttribute = function() {
      return !1;
    } : (this.ignoreAttributesFn = t(this.options.ignoreAttributes), this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = a), this.processTextOrObjNode = c, this.options.format ? (this.indentate = l, this.tagEndChar = `>
`, this.newLine = `
`) : (this.indentate = function() {
      return "";
    }, this.tagEndChar = ">", this.newLine = "");
  }
  s.prototype.build = function(i) {
    return this.options.preserveOrder ? e(i, this.options) : (Array.isArray(i) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (i = {
      [this.options.arrayNodeName]: i
    }), this.j2x(i, 0, []).val);
  }, s.prototype.j2x = function(i, n, o) {
    let u = "", d = "";
    const E = o.join(".");
    for (let y in i)
      if (Object.prototype.hasOwnProperty.call(i, y))
        if (typeof i[y] > "u")
          this.isAttribute(y) && (d += "");
        else if (i[y] === null)
          this.isAttribute(y) || y === this.options.cdataPropName ? d += "" : y[0] === "?" ? d += this.indentate(n) + "<" + y + "?" + this.tagEndChar : d += this.indentate(n) + "<" + y + "/" + this.tagEndChar;
        else if (i[y] instanceof Date)
          d += this.buildTextValNode(i[y], y, "", n);
        else if (typeof i[y] != "object") {
          const N = this.isAttribute(y);
          if (N && !this.ignoreAttributesFn(N, E))
            u += this.buildAttrPairStr(N, "" + i[y]);
          else if (!N)
            if (y === this.options.textNodeName) {
              let R = this.options.tagValueProcessor(y, "" + i[y]);
              d += this.replaceEntitiesValue(R);
            } else
              d += this.buildTextValNode(i[y], y, "", n);
        } else if (Array.isArray(i[y])) {
          const N = i[y].length;
          let R = "", S = "";
          for (let f = 0; f < N; f++) {
            const g = i[y][f];
            if (!(typeof g > "u")) if (g === null)
              y[0] === "?" ? d += this.indentate(n) + "<" + y + "?" + this.tagEndChar : d += this.indentate(n) + "<" + y + "/" + this.tagEndChar;
            else if (typeof g == "object")
              if (this.options.oneListGroup) {
                const w = this.j2x(g, n + 1, o.concat(y));
                R += w.val, this.options.attributesGroupName && g.hasOwnProperty(this.options.attributesGroupName) && (S += w.attrStr);
              } else
                R += this.processTextOrObjNode(g, y, n, o);
            else if (this.options.oneListGroup) {
              let w = this.options.tagValueProcessor(y, g);
              w = this.replaceEntitiesValue(w), R += w;
            } else
              R += this.buildTextValNode(g, y, "", n);
          }
          this.options.oneListGroup && (R = this.buildObjectNode(R, y, S, n)), d += R;
        } else if (this.options.attributesGroupName && y === this.options.attributesGroupName) {
          const N = Object.keys(i[y]), R = N.length;
          for (let S = 0; S < R; S++)
            u += this.buildAttrPairStr(N[S], "" + i[y][N[S]]);
        } else
          d += this.processTextOrObjNode(i[y], y, n, o);
    return { attrStr: u, val: d };
  }, s.prototype.buildAttrPairStr = function(i, n) {
    return n = this.options.attributeValueProcessor(i, "" + n), n = this.replaceEntitiesValue(n), this.options.suppressBooleanAttributes && n === "true" ? " " + i : " " + i + '="' + n + '"';
  };
  function c(i, n, o, u) {
    const d = this.j2x(i, o + 1, u.concat(n));
    return i[this.options.textNodeName] !== void 0 && Object.keys(i).length === 1 ? this.buildTextValNode(i[this.options.textNodeName], n, d.attrStr, o) : this.buildObjectNode(d.val, n, d.attrStr, o);
  }
  s.prototype.buildObjectNode = function(i, n, o, u) {
    if (i === "")
      return n[0] === "?" ? this.indentate(u) + "<" + n + o + "?" + this.tagEndChar : this.indentate(u) + "<" + n + o + this.closeTag(n) + this.tagEndChar;
    {
      let d = "</" + n + this.tagEndChar, E = "";
      return n[0] === "?" && (E = "?", d = ""), (o || o === "") && i.indexOf("<") === -1 ? this.indentate(u) + "<" + n + o + E + ">" + i + d : this.options.commentPropName !== !1 && n === this.options.commentPropName && E.length === 0 ? this.indentate(u) + `<!--${i}-->` + this.newLine : this.indentate(u) + "<" + n + o + E + this.tagEndChar + i + this.indentate(u) + d;
    }
  }, s.prototype.closeTag = function(i) {
    let n = "";
    return this.options.unpairedTags.indexOf(i) !== -1 ? this.options.suppressUnpairedNode || (n = "/") : this.options.suppressEmptyNode ? n = "/" : n = `></${i}`, n;
  }, s.prototype.buildTextValNode = function(i, n, o, u) {
    if (this.options.cdataPropName !== !1 && n === this.options.cdataPropName)
      return this.indentate(u) + `<![CDATA[${i}]]>` + this.newLine;
    if (this.options.commentPropName !== !1 && n === this.options.commentPropName)
      return this.indentate(u) + `<!--${i}-->` + this.newLine;
    if (n[0] === "?")
      return this.indentate(u) + "<" + n + o + "?" + this.tagEndChar;
    {
      let d = this.options.tagValueProcessor(n, i);
      return d = this.replaceEntitiesValue(d), d === "" ? this.indentate(u) + "<" + n + o + this.closeTag(n) + this.tagEndChar : this.indentate(u) + "<" + n + o + ">" + d + "</" + n + this.tagEndChar;
    }
  }, s.prototype.replaceEntitiesValue = function(i) {
    if (i && i.length > 0 && this.options.processEntities)
      for (let n = 0; n < this.options.entities.length; n++) {
        const o = this.options.entities[n];
        i = i.replace(o.regex, o.val);
      }
    return i;
  };
  function l(i) {
    return this.options.indentBy.repeat(i);
  }
  function a(i) {
    return i.startsWith(this.options.attributeNamePrefix) && i !== this.options.textNodeName ? i.substr(this.attrPrefixLen) : !1;
  }
  return pe = s, pe;
}
var ge, Je;
function Vr() {
  if (Je) return ge;
  Je = 1;
  const e = vt(), t = Ur(), r = Hr();
  return ge = {
    XMLParser: t,
    XMLValidator: e,
    XMLBuilder: r
  }, ge;
}
var Wr = Vr();
const Xr = Nt({
  q: be(),
  orderBy: se(
    ye(["time", "size", "seeders", "relevance"]),
    "relevance"
  ),
  category: se(
    ye(["all", "movie", "audio", "doc", "app", "other"]),
    "all"
  ),
  page: se(be(), "1")
});
function Gr(e) {
  const t = new Date(e), r = t.getUTCFullYear(), s = (t.getUTCMonth() + 1).toString().padStart(2, "0"), c = t.getUTCDate().toString().padStart(2, "0"), l = t.getUTCHours().toString().padStart(2, "0"), a = t.getUTCMinutes().toString().padStart(2, "0"), i = t.getUTCSeconds().toString().padStart(2, "0");
  return `${r}-${s}-${c}T${l}:${a}:${i}Z`;
}
function zr(e) {
  const t = new URL(e);
  if (t.protocol !== "magnet:")
    throw new Error("Not a valid magnet link");
  const r = new URLSearchParams(t.search);
  r.forEach((c, l) => {
    l === "tr" && r.delete(l);
  });
  const s = `${t.protocol}${t.pathname}?${r.toString()}`;
  return decodeURIComponent(s);
}
function Kr(e) {
  const t = /Found\D+(\d+)\D+items/m, r = e.match(t);
  return r ? Number(r[1]) : 0;
}
const Pt = new Q({ strict: !1 }), Ee = 15, Ye = 200, Jr = 120, Yr = 1e4, Qr = 1, Qe = /* @__PURE__ */ new Set([403, 404, 429, 503]), Zr = /* @__PURE__ */ new Set([408, 425, 429, 500, 502, 503, 504]), Ze = (e) => ({
  torrents: [],
  meta: {
    total: 0,
    page: e,
    pages: 0
  }
}), Dr = (e) => new Promise((t) => setTimeout(t, e)), es = (e, t) => {
  const r = new URL(e);
  return r.search = new URLSearchParams({
    q: t.q,
    page: String(t.page),
    orderBy: t.orderBy,
    category: t.category
  }).toString(), new Request(r.toString(), { method: "GET" });
}, ts = (e) => {
  if (!Ne(e)) return !0;
  const t = e.response?.status;
  return t ? Zr.has(t) : !0;
}, De = async (e, t) => {
  let r = 0;
  for (; ; )
    try {
      return await $r.get("https://bt4gprx.com/search", {
        params: e,
        timeout: Yr,
        ...t ? {
          // feaxios supports proxy via fetchOptions, but does not currently type this option.
          fetchOptions: { proxy: t }
        } : {}
      });
    } catch (s) {
      if (r >= Qr || !ts(s))
        throw s;
      r += 1, await Dr(200 * r);
    }
};
Pt.get("/", async (e) => {
  const t = Sr(Xr, e.req.query());
  if (!t.success)
    return e.json({ error: t.issues }, 400);
  const r = t.output.q.trim(), s = Number(t.output.page), { orderBy: c, category: l } = t.output;
  if (!r || r.length > Ye)
    return e.json(
      { error: `Query "q" must be between 1 and ${Ye} characters` },
      400
    );
  if (!Number.isInteger(s) || s < 1)
    return e.json({ error: 'Query "page" must be an integer greater than or equal to 1' }, 400);
  const a = es(e.req.url, { q: r, page: s, orderBy: c, category: l }), i = await caches.open("btsearch"), n = await i.match(a);
  if (n)
    return n;
  try {
    const o = De(
      {
        q: r,
        p: s,
        orderby: c,
        category: l,
        page: "rss"
      },
      e.env.PROXY_URL
    ), u = De(
      {
        q: r,
        category: l,
        orderby: c
      },
      e.env.PROXY_URL
    ).catch((P) => {
      if (Ne(P) && Qe.has(P.response?.status ?? 0))
        return null;
      throw P;
    }), [d, E] = await Promise.all([o, u]), y = E ? Kr(E.data) : 0;
    let N = [];
    try {
      const h = new Wr.XMLParser().parse(d.data);
      N = h.rss?.channel?.item ? Array.isArray(h.rss.channel.item) ? h.rss.channel.item : [h.rss.channel.item] : [];
    } catch {
      N = [];
    }
    const R = N.flatMap((P) => {
      try {
        return [
          {
            title: P.title,
            magnet: zr(P.link),
            link: P.guid,
            createdAt: Gr(P.pubDate),
            size: P.description.split("<br>")[1]
          }
        ];
      } catch {
        return [];
      }
    }), S = (s - 1) * Ee + R.length, f = R.length === Ee ? s + 1 : s, g = {
      torrents: R,
      meta: {
        total: y || S,
        page: s,
        pages: y ? Math.ceil(y / Ee) : f
      }
    }, w = e.json(g);
    return w.headers.set(
      "Cache-Control",
      `public, max-age=0, s-maxage=${Jr}`
    ), await i.put(a, w.clone()), w;
  } catch (o) {
    return Ne(o) && Qe.has(o.response?.status ?? 0) ? e.json(Ze(s)) : e.json(
      {
        error: "Failed to search torrents",
        ...Ze(s)
      },
      502
    );
  }
});
const M = new Q({ strict: !1 });
M.use("/debrid/*", async (e, t) => {
  const r = await Te(e.req.raw, e.env);
  if (r) return r;
  await t();
});
M.use("/btsearch", async (e, t) => {
  const r = await Te(e.req.raw, e.env);
  if (r) return r;
  await t();
});
M.route("/debrid", Re);
M.route("/btsearch", Pt);
M.get("/health", async (e) => e.json({ status: "ok" }));
const z = new Q({ strict: !1 }).basePath("/"), rs = "GET,POST,PUT,PATCH,DELETE,OPTIONS", ss = (e) => new Set(
  (e ?? "").split(",").map((t) => t.trim()).filter(Boolean)
), ns = (e) => new URL(e).origin;
z.use(lr());
z.use("/api/*", async (e, t) => {
  const r = e.req.header("Origin"), s = r === ns(e.req.url), c = ss(e.env.ALLOWED_ORIGINS), l = !r || s || c.has(r);
  if (e.req.method === "OPTIONS")
    return l ? (r && (e.header("Access-Control-Allow-Origin", r), e.header("Vary", "Origin"), e.header("Access-Control-Allow-Methods", rs), e.header(
      "Access-Control-Allow-Headers",
      e.req.header("Access-Control-Request-Headers") ?? "Authorization,Content-Type"
    ), e.header("Access-Control-Max-Age", "86400")), e.body(null, 204)) : e.json({ error: "Origin not allowed" }, 403);
  if (!l)
    return e.json({ error: "Origin not allowed" }, 403);
  await t(), r && (e.header("Access-Control-Allow-Origin", r), e.header("Vary", "Origin"));
});
z.route("/api", M);
z.get("/debug", async (e) => {
  if (e.env.ENVIRONMENT !== "development")
    return e.notFound();
  const t = await Te(e.req.raw, e.env);
  return t || e.json({
    path: e.req.path,
    environment: e.env.ENVIRONMENT ?? "unknown"
  });
});
z.notFound(async (e) => {
  if (e.req.path.startsWith("/api/"))
    return e.text("404 Not Found", 404);
  const t = e.env.ASSETS;
  return t ? t.fetch(e.req.raw) : e.text("404 Not Found", 404);
});
export {
  z as default
};
