// tests/admin-endpoints.test.ts
import assert from "node:assert/strict";
import test, { afterEach } from "node:test";

// src/lib/api/core.ts
var DEFAULT_API_BASE_URL = "http://localhost:8080";
var ApiError = class extends Error {
  status;
  statusText;
  payload;
  constructor(status, statusText, payload) {
    const message = isErrorPayload(payload) && (payload.error ?? payload.message) || `${status} ${statusText}`.trim();
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.payload = payload;
  }
};
function getApiBaseUrl() {
  const configured = import.meta.env?.VITE_API_BASE_URL?.trim();
  const baseUrl = configured && configured.length > 0 ? configured : DEFAULT_API_BASE_URL;
  return baseUrl.replace(/\/+$/, "");
}
async function apiRequest({
  method = "GET",
  path,
  body,
  formData,
  headers,
  token,
  query,
  signal
}) {
  const requestHeaders = new Headers(headers);
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }
  let requestBody;
  if (formData) {
    requestBody = formData;
  } else if (body !== void 0) {
    requestHeaders.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }
  const response = await fetch(buildRequestUrl(path, query), {
    method,
    headers: requestHeaders,
    body: requestBody,
    credentials: "include",
    signal
  });
  const payload = await parseResponseBody(response);
  if (!response.ok) {
    throw new ApiError(response.status, response.statusText, payload);
  }
  return payload;
}
function buildRequestUrl(path, query) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const search = buildQueryString(query);
  return `${getApiBaseUrl()}${normalizedPath}${search}`;
}
function buildQueryString(query) {
  if (!query) {
    return "";
  }
  const searchParams = new URLSearchParams();
  for (const [key, rawValue] of Object.entries(query)) {
    if (Array.isArray(rawValue)) {
      for (const item of rawValue) {
        appendQueryValue(searchParams, key, item);
      }
      continue;
    }
    appendQueryValue(searchParams, key, rawValue);
  }
  const serialized = searchParams.toString();
  return serialized ? `?${serialized}` : "";
}
function appendQueryValue(searchParams, key, value) {
  if (value === null || value === void 0) {
    return;
  }
  searchParams.append(key, String(value));
}
async function parseResponseBody(response) {
  if (response.status === 204) {
    return void 0;
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  return text.length > 0 ? text : void 0;
}
function isErrorPayload(payload) {
  return typeof payload === "object" && payload !== null;
}

// node_modules/.pnpm/seroval@1.5.0/node_modules/seroval/dist/esm/production/index.mjs
var L = ((i2) => (i2[i2.AggregateError = 1] = "AggregateError", i2[i2.ArrowFunction = 2] = "ArrowFunction", i2[i2.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", i2[i2.ObjectAssign = 8] = "ObjectAssign", i2[i2.BigIntTypedArray = 16] = "BigIntTypedArray", i2[i2.RegExp = 32] = "RegExp", i2))(L || {});
var v = Symbol.asyncIterator;
var mr = Symbol.hasInstance;
var R = Symbol.isConcatSpreadable;
var C = Symbol.iterator;
var pr = Symbol.match;
var dr = Symbol.matchAll;
var gr = Symbol.replace;
var yr = Symbol.search;
var Nr = Symbol.species;
var br = Symbol.split;
var vr = Symbol.toPrimitive;
var P = Symbol.toStringTag;
var Cr = Symbol.unscopables;
var ve = { [v]: 0, [mr]: 1, [R]: 2, [C]: 3, [pr]: 4, [dr]: 5, [gr]: 6, [yr]: 7, [Nr]: 8, [br]: 9, [vr]: 10, [P]: 11, [Cr]: 12 };
var o = void 0;
var ot = { 2: true, 3: false, 1: o, 0: null, 4: -0, 5: Number.POSITIVE_INFINITY, 6: Number.NEGATIVE_INFINITY, 7: Number.NaN };
function c(e, r, t, n2, a, s, i2, u2, l2, g2, S, d2) {
  return { t: e, i: r, s: t, c: n2, m: a, p: s, e: i2, a: u2, f: l2, b: g2, o: S, l: d2 };
}
function F(e) {
  return c(2, o, e, o, o, o, o, o, o, o, o, o);
}
var J = F(2);
var Z = F(3);
var Ae = F(1);
var Ee = F(0);
var st = F(4);
var it = F(5);
var ut = F(6);
var lt = F(7);
var U = "__SEROVAL_REFS__";
var ce = "$R";
var Ie = `self.${ce}`;
var j = /* @__PURE__ */ new Map();
typeof globalThis != "undefined" ? Object.defineProperty(globalThis, U, { value: j, configurable: true, writable: false, enumerable: false }) : typeof window != "undefined" ? Object.defineProperty(window, U, { value: j, configurable: true, writable: false, enumerable: false }) : typeof self != "undefined" ? Object.defineProperty(self, U, { value: j, configurable: true, writable: false, enumerable: false }) : typeof global != "undefined" && Object.defineProperty(global, U, { value: j, configurable: true, writable: false, enumerable: false });
var { toString: ys } = Object.prototype;
var re = () => {
  let e = { p: 0, s: 0, f: 0 };
  return e.p = new Promise((r, t) => {
    e.s = r, e.f = t;
  }), e;
};
var vn = (e, r) => {
  e.s(r), e.p.s = 1, e.p.v = r;
};
var Cn = (e, r) => {
  e.f(r), e.p.s = 2, e.p.v = r;
};
var yt = re.toString();
var Nt = vn.toString();
var bt = Cn.toString();
var Rr = () => {
  let e = [], r = [], t = true, n2 = false, a = 0, s = (l2, g2, S) => {
    for (S = 0; S < a; S++) r[S] && r[S][g2](l2);
  }, i2 = (l2, g2, S, d2) => {
    for (g2 = 0, S = e.length; g2 < S; g2++) d2 = e[g2], !t && g2 === S - 1 ? l2[n2 ? "return" : "throw"](d2) : l2.next(d2);
  }, u2 = (l2, g2) => (t && (g2 = a++, r[g2] = l2), i2(l2), () => {
    t && (r[g2] = r[a], r[a--] = void 0);
  });
  return { __SEROVAL_STREAM__: true, on: (l2) => u2(l2), next: (l2) => {
    t && (e.push(l2), s(l2, "next"));
  }, throw: (l2) => {
    t && (e.push(l2), s(l2, "throw"), t = false, n2 = false, r.length = 0);
  }, return: (l2) => {
    t && (e.push(l2), s(l2, "return"), t = false, n2 = true, r.length = 0);
  } };
};
var vt = Rr.toString();
var Pr = (e) => (r) => () => {
  let t = 0, n2 = { [e]: () => n2, next: () => {
    if (t > r.d) return { done: true, value: void 0 };
    let a = t++, s = r.v[a];
    if (a === r.t) throw s;
    return { done: a === r.d, value: s };
  } };
  return n2;
};
var Ct = Pr.toString();
var xr = (e, r) => (t) => () => {
  let n2 = 0, a = -1, s = false, i2 = [], u2 = [], l2 = (S = 0, d2 = u2.length) => {
    for (; S < d2; S++) u2[S].s({ done: true, value: void 0 });
  };
  t.on({ next: (S) => {
    let d2 = u2.shift();
    d2 && d2.s({ done: false, value: S }), i2.push(S);
  }, throw: (S) => {
    let d2 = u2.shift();
    d2 && d2.f(S), l2(), a = i2.length, s = true, i2.push(S);
  }, return: (S) => {
    let d2 = u2.shift();
    d2 && d2.s({ done: true, value: S }), l2(), a = i2.length, i2.push(S);
  } });
  let g2 = { [e]: () => g2, next: () => {
    if (a === -1) {
      let K2 = n2++;
      if (K2 >= i2.length) {
        let et = r();
        return u2.push(et), et.p;
      }
      return { done: false, value: i2[K2] };
    }
    if (n2 > a) return { done: true, value: void 0 };
    let S = n2++, d2 = i2[S];
    if (S !== a) return { done: false, value: d2 };
    if (s) throw d2;
    return { done: true, value: d2 };
  } };
  return g2;
};
var At = xr.toString();
var Or = (e) => {
  let r = atob(e), t = r.length, n2 = new Uint8Array(t);
  for (let a = 0; a < t; a++) n2[a] = r.charCodeAt(a);
  return n2.buffer;
};
var Et = Or.toString();
var An = Pr(C);
function te() {
  return Rr();
}
var En = xr(v, re);
var ae = ((t) => (t[t.Vanilla = 1] = "Vanilla", t[t.Cross = 2] = "Cross", t))(ae || {});
function ni(e) {
  return e;
}
var Eo = () => T;
var Io = Eo.toString();
var qt = /=>/.test(Io);
var Ht = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_";
var Gt = Ht.length;
var Jt = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_";
var Kt = Jt.length;

// node_modules/.pnpm/seroval-plugins@1.5.0_seroval@1.5.0/node_modules/seroval-plugins/dist/esm/production/web.mjs
var u = (e) => {
  let r = new AbortController(), a = r.abort.bind(r);
  return e.then(a, a), r;
};
function E(e) {
  e(this.reason);
}
function D(e) {
  this.addEventListener("abort", E.bind(this, e), { once: true });
}
function c2(e) {
  return new Promise(D.bind(e));
}
var i = {};
var F2 = ni({ tag: "seroval-plugins/web/AbortControllerFactoryPlugin", test(e) {
  return e === i;
}, parse: { sync() {
  return i;
}, async async() {
  return await Promise.resolve(i);
}, stream() {
  return i;
} }, serialize() {
  return u.toString();
}, deserialize() {
  return u;
} });
var A = ni({ tag: "seroval-plugins/web/AbortSignal", extends: [F2], test(e) {
  return typeof AbortSignal == "undefined" ? false : e instanceof AbortSignal;
}, parse: { sync(e, r) {
  return e.aborted ? { reason: r.parse(e.reason) } : {};
}, async async(e, r) {
  if (e.aborted) return { reason: await r.parse(e.reason) };
  let a = await c2(e);
  return { reason: await r.parse(a) };
}, stream(e, r) {
  if (e.aborted) return { reason: r.parse(e.reason) };
  let a = c2(e);
  return { factory: r.parse(i), controller: r.parse(a) };
} }, serialize(e, r) {
  return e.reason ? "AbortSignal.abort(" + r.serialize(e.reason) + ")" : e.controller && e.factory ? "(" + r.serialize(e.factory) + ")(" + r.serialize(e.controller) + ").signal" : "(new AbortController).signal";
}, deserialize(e, r) {
  return e.reason ? AbortSignal.abort(r.deserialize(e.reason)) : e.controller ? u(r.deserialize(e.controller)).signal : new AbortController().signal;
} });
var I = ni({ tag: "seroval-plugins/web/Blob", test(e) {
  return typeof Blob == "undefined" ? false : e instanceof Blob;
}, parse: { async async(e, r) {
  return { type: await r.parse(e.type), buffer: await r.parse(await e.arrayBuffer()) };
} }, serialize(e, r) {
  return "new Blob([" + r.serialize(e.buffer) + "],{type:" + r.serialize(e.type) + "})";
}, deserialize(e, r) {
  return new Blob([r.deserialize(e.buffer)], { type: r.deserialize(e.type) });
} });
function d(e) {
  return { detail: e.detail, bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var U2 = ni({ tag: "seroval-plugins/web/CustomEvent", test(e) {
  return typeof CustomEvent == "undefined" ? false : e instanceof CustomEvent;
}, parse: { sync(e, r) {
  return { type: r.parse(e.type), options: r.parse(d(e)) };
}, async async(e, r) {
  return { type: await r.parse(e.type), options: await r.parse(d(e)) };
}, stream(e, r) {
  return { type: r.parse(e.type), options: r.parse(d(e)) };
} }, serialize(e, r) {
  return "new CustomEvent(" + r.serialize(e.type) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new CustomEvent(r.deserialize(e.type), r.deserialize(e.options));
} });
var _ = ni({ tag: "seroval-plugins/web/DOMException", test(e) {
  return typeof DOMException == "undefined" ? false : e instanceof DOMException;
}, parse: { sync(e, r) {
  return { name: r.parse(e.name), message: r.parse(e.message) };
}, async async(e, r) {
  return { name: await r.parse(e.name), message: await r.parse(e.message) };
}, stream(e, r) {
  return { name: r.parse(e.name), message: r.parse(e.message) };
} }, serialize(e, r) {
  return "new DOMException(" + r.serialize(e.message) + "," + r.serialize(e.name) + ")";
}, deserialize(e, r) {
  return new DOMException(r.deserialize(e.message), r.deserialize(e.name));
} });
function f(e) {
  return { bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var k = ni({ tag: "seroval-plugins/web/Event", test(e) {
  return typeof Event == "undefined" ? false : e instanceof Event;
}, parse: { sync(e, r) {
  return { type: r.parse(e.type), options: r.parse(f(e)) };
}, async async(e, r) {
  return { type: await r.parse(e.type), options: await r.parse(f(e)) };
}, stream(e, r) {
  return { type: r.parse(e.type), options: r.parse(f(e)) };
} }, serialize(e, r) {
  return "new Event(" + r.serialize(e.type) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new Event(r.deserialize(e.type), r.deserialize(e.options));
} });
var V = ni({ tag: "seroval-plugins/web/File", test(e) {
  return typeof File == "undefined" ? false : e instanceof File;
}, parse: { async async(e, r) {
  return { name: await r.parse(e.name), options: await r.parse({ type: e.type, lastModified: e.lastModified }), buffer: await r.parse(await e.arrayBuffer()) };
} }, serialize(e, r) {
  return "new File([" + r.serialize(e.buffer) + "]," + r.serialize(e.name) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new File([r.deserialize(e.buffer)], r.deserialize(e.name), r.deserialize(e.options));
} });
var m = V;
function y(e) {
  let r = [];
  return e.forEach((a, t) => {
    r.push([t, a]);
  }), r;
}
var o2 = {};
var v2 = (e, r = new FormData(), a = 0, t = e.length, s) => {
  for (; a < t; a++) s = e[a], r.append(s[0], s[1]);
  return r;
};
var G = ni({ tag: "seroval-plugins/web/FormDataFactory", test(e) {
  return e === o2;
}, parse: { sync() {
  return o2;
}, async async() {
  return await Promise.resolve(o2);
}, stream() {
  return o2;
} }, serialize() {
  return v2.toString();
}, deserialize() {
  return o2;
} });
var J2 = ni({ tag: "seroval-plugins/web/FormData", extends: [m, G], test(e) {
  return typeof FormData == "undefined" ? false : e instanceof FormData;
}, parse: { sync(e, r) {
  return { factory: r.parse(o2), entries: r.parse(y(e)) };
}, async async(e, r) {
  return { factory: await r.parse(o2), entries: await r.parse(y(e)) };
}, stream(e, r) {
  return { factory: r.parse(o2), entries: r.parse(y(e)) };
} }, serialize(e, r) {
  return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.entries) + ")";
}, deserialize(e, r) {
  return v2(r.deserialize(e.entries));
} });
function g(e) {
  let r = [];
  return e.forEach((a, t) => {
    r.push([t, a]);
  }), r;
}
var W = ni({ tag: "seroval-plugins/web/Headers", test(e) {
  return typeof Headers == "undefined" ? false : e instanceof Headers;
}, parse: { sync(e, r) {
  return { value: r.parse(g(e)) };
}, async async(e, r) {
  return { value: await r.parse(g(e)) };
}, stream(e, r) {
  return { value: r.parse(g(e)) };
} }, serialize(e, r) {
  return "new Headers(" + r.serialize(e.value) + ")";
}, deserialize(e, r) {
  return new Headers(r.deserialize(e.value));
} });
var l = W;
var Z2 = ni({ tag: "seroval-plugins/web/ImageData", test(e) {
  return typeof ImageData == "undefined" ? false : e instanceof ImageData;
}, parse: { sync(e, r) {
  return { data: r.parse(e.data), width: r.parse(e.width), height: r.parse(e.height), options: r.parse({ colorSpace: e.colorSpace }) };
}, async async(e, r) {
  return { data: await r.parse(e.data), width: await r.parse(e.width), height: await r.parse(e.height), options: await r.parse({ colorSpace: e.colorSpace }) };
}, stream(e, r) {
  return { data: r.parse(e.data), width: r.parse(e.width), height: r.parse(e.height), options: r.parse({ colorSpace: e.colorSpace }) };
} }, serialize(e, r) {
  return "new ImageData(" + r.serialize(e.data) + "," + r.serialize(e.width) + "," + r.serialize(e.height) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new ImageData(r.deserialize(e.data), r.deserialize(e.width), r.deserialize(e.height), r.deserialize(e.options));
} });
var n = {};
var P2 = (e) => new ReadableStream({ start: (r) => {
  e.on({ next: (a) => {
    try {
      r.enqueue(a);
    } catch (t) {
    }
  }, throw: (a) => {
    r.error(a);
  }, return: () => {
    try {
      r.close();
    } catch (a) {
    }
  } });
} });
var x = ni({ tag: "seroval-plugins/web/ReadableStreamFactory", test(e) {
  return e === n;
}, parse: { sync() {
  return n;
}, async async() {
  return await Promise.resolve(n);
}, stream() {
  return n;
} }, serialize() {
  return P2.toString();
}, deserialize() {
  return n;
} });
function w(e) {
  let r = te(), a = e.getReader();
  async function t() {
    try {
      let s = await a.read();
      s.done ? r.return(s.value) : (r.next(s.value), await t());
    } catch (s) {
      r.throw(s);
    }
  }
  return t().catch(() => {
  }), r;
}
var ee = ni({ tag: "seroval/plugins/web/ReadableStream", extends: [x], test(e) {
  return typeof ReadableStream == "undefined" ? false : e instanceof ReadableStream;
}, parse: { sync(e, r) {
  return { factory: r.parse(n), stream: r.parse(te()) };
}, async async(e, r) {
  return { factory: await r.parse(n), stream: await r.parse(w(e)) };
}, stream(e, r) {
  return { factory: r.parse(n), stream: r.parse(w(e)) };
} }, serialize(e, r) {
  return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.stream) + ")";
}, deserialize(e, r) {
  let a = r.deserialize(e.stream);
  return P2(a);
} });
var p = ee;
function N(e, r) {
  return { body: r, cache: e.cache, credentials: e.credentials, headers: e.headers, integrity: e.integrity, keepalive: e.keepalive, method: e.method, mode: e.mode, redirect: e.redirect, referrer: e.referrer, referrerPolicy: e.referrerPolicy };
}
var ae2 = ni({ tag: "seroval-plugins/web/Request", extends: [p, l], test(e) {
  return typeof Request == "undefined" ? false : e instanceof Request;
}, parse: { async async(e, r) {
  return { url: await r.parse(e.url), options: await r.parse(N(e, e.body && !e.bodyUsed ? await e.clone().arrayBuffer() : null)) };
}, stream(e, r) {
  return { url: r.parse(e.url), options: r.parse(N(e, e.body && !e.bodyUsed ? e.clone().body : null)) };
} }, serialize(e, r) {
  return "new Request(" + r.serialize(e.url) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new Request(r.deserialize(e.url), r.deserialize(e.options));
} });
function h(e) {
  return { headers: e.headers, status: e.status, statusText: e.statusText };
}
var oe = ni({ tag: "seroval-plugins/web/Response", extends: [p, l], test(e) {
  return typeof Response == "undefined" ? false : e instanceof Response;
}, parse: { async async(e, r) {
  return { body: await r.parse(e.body && !e.bodyUsed ? await e.clone().arrayBuffer() : null), options: await r.parse(h(e)) };
}, stream(e, r) {
  return { body: r.parse(e.body && !e.bodyUsed ? e.clone().body : null), options: r.parse(h(e)) };
} }, serialize(e, r) {
  return "new Response(" + r.serialize(e.body) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new Response(r.deserialize(e.body), r.deserialize(e.options));
} });
var le = ni({ tag: "seroval-plugins/web/URL", test(e) {
  return typeof URL == "undefined" ? false : e instanceof URL;
}, parse: { sync(e, r) {
  return { value: r.parse(e.href) };
}, async async(e, r) {
  return { value: await r.parse(e.href) };
}, stream(e, r) {
  return { value: r.parse(e.href) };
} }, serialize(e, r) {
  return "new URL(" + r.serialize(e.value) + ")";
}, deserialize(e, r) {
  return new URL(r.deserialize(e.value));
} });
var de = ni({ tag: "seroval-plugins/web/URLSearchParams", test(e) {
  return typeof URLSearchParams == "undefined" ? false : e instanceof URLSearchParams;
}, parse: { sync(e, r) {
  return { value: r.parse(e.toString()) };
}, async async(e, r) {
  return { value: await r.parse(e.toString()) };
}, stream(e, r) {
  return { value: r.parse(e.toString()) };
} }, serialize(e, r) {
  return "new URLSearchParams(" + r.serialize(e.value) + ")";
}, deserialize(e, r) {
  return new URLSearchParams(r.deserialize(e.value));
} });

// node_modules/.pnpm/solid-js@1.9.11/node_modules/solid-js/web/dist/server.js
var booleans = [
  "allowfullscreen",
  "async",
  "alpha",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "hidden",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "adauctionheaders",
  "browsingtopics",
  "credentialless",
  "defaultchecked",
  "defaultmuted",
  "defaultselected",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback",
  "preservespitch",
  "shadowrootclonable",
  "shadowrootcustomelementregistry",
  "shadowrootdelegatesfocus",
  "shadowrootserializable",
  "sharedstoragewritable"
];
var Properties = /* @__PURE__ */ new Set([
  "className",
  "value",
  "readOnly",
  "noValidate",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  "adAuctionHeaders",
  "allowFullscreen",
  "browsingTopics",
  "defaultChecked",
  "defaultMuted",
  "defaultSelected",
  "disablePictureInPicture",
  "disableRemotePlayback",
  "preservesPitch",
  "shadowRootClonable",
  "shadowRootCustomElementRegistry",
  "shadowRootDelegatesFocus",
  "shadowRootSerializable",
  "sharedStorageWritable",
  ...booleans
]);
var ES2017FLAG = L.AggregateError | L.BigIntTypedArray;
var RequestContext = Symbol();
var isServer = true;

// src/lib/auth/admin-session.ts
var ADMIN_TOKEN_STORAGE_KEY = "sabi_admin_token";
var MissingAdminTokenError = class extends Error {
  constructor() {
    super("Admin auth token is missing.");
    this.name = "MissingAdminTokenError";
  }
};
function readAdminToken() {
  if (!canUseStorage()) {
    return null;
  }
  const token = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)?.trim();
  return token ? token : null;
}
function resolveAdminToken(token) {
  const resolvedToken = token ?? readAdminToken();
  if (!resolvedToken) {
    throw new MissingAdminTokenError();
  }
  return resolvedToken;
}
function canUseStorage() {
  return !isServer && typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

// src/lib/api/admin/auth.ts
var ADMIN_BASE_PATH = "/admin";
function requestAdminWalletChallenge(payload, signal) {
  return apiRequest({
    method: "POST",
    path: `${ADMIN_BASE_PATH}/auth/wallet/challenge`,
    body: payload,
    signal
  });
}
function connectAdminWallet(payload, signal) {
  return apiRequest({
    method: "POST",
    path: `${ADMIN_BASE_PATH}/auth/wallet/connect`,
    body: payload,
    signal
  });
}
function getAdminMe(token, signal) {
  return apiRequest({
    method: "GET",
    path: `${ADMIN_BASE_PATH}/me`,
    token: resolveAdminToken(token),
    signal
  });
}

// src/lib/api/admin/markets.ts
function listAdminEvents(query, { token, signal } = {}) {
  return apiRequest({
    method: "GET",
    path: "/admin/events",
    query,
    token: resolveAdminToken(token),
    signal
  });
}
function createAdminEvent(payload, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: "/admin/events",
    body: payload,
    token: resolveAdminToken(token),
    signal
  });
}
function createAdminMatchEventBundle(payload, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: "/admin/events/matches",
    body: payload,
    token: resolveAdminToken(token),
    signal
  });
}
function getAdminMatchMarketCatalog(sportSlug, { token, signal } = {}) {
  return apiRequest({
    method: "GET",
    path: `/admin/events/matches/catalog/${sportSlug}`,
    token: resolveAdminToken(token),
    signal
  });
}
function getAdminEvent(eventId, { token, signal } = {}) {
  return apiRequest({
    method: "GET",
    path: `/admin/events/${eventId}`,
    token: resolveAdminToken(token),
    signal
  });
}
function updateAdminEventMatchup(eventId, payload, { token, signal } = {}) {
  return apiRequest({
    method: "PATCH",
    path: `/admin/events/${eventId}/matchup`,
    body: payload,
    token: resolveAdminToken(token),
    signal
  });
}
function publishAdminEventShell(eventId, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: `/admin/events/${eventId}/publish`,
    token: resolveAdminToken(token),
    signal
  });
}
function createAdminEventMarkets(eventId, payload, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: `/admin/events/${eventId}/markets`,
    body: payload,
    token: resolveAdminToken(token),
    signal
  });
}
function publishAdminEventMarkets(eventId, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: `/admin/events/${eventId}/markets/publish`,
    token: resolveAdminToken(token),
    signal
  });
}
function getAdminEventMarkets(eventId, query, { token, signal } = {}) {
  return apiRequest({
    method: "GET",
    path: `/admin/events/${eventId}/markets`,
    query,
    token: resolveAdminToken(token),
    signal
  });
}
function createAdminEventMarketLadder(eventId, payload, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: `/admin/events/${eventId}/markets/ladders`,
    body: payload,
    token: resolveAdminToken(token),
    signal
  });
}
function registerAdminNegRiskEvent(eventId, payload, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: `/admin/events/${eventId}/neg-risk/register`,
    body: payload,
    token: resolveAdminToken(token),
    signal
  });
}
function createAdminMarket(payload, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: "/admin/markets",
    body: payload,
    token: resolveAdminToken(token),
    signal
  });
}
function updateAdminMarket(marketId, payload, { token, signal } = {}) {
  return apiRequest({
    method: "PATCH",
    path: `/admin/markets/${marketId}`,
    body: payload,
    token: resolveAdminToken(token),
    signal
  });
}
function setAdminMarketPrices(marketId, payload, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: `/admin/markets/${marketId}/prices`,
    body: payload,
    token: resolveAdminToken(token),
    signal
  });
}
function bootstrapAdminMarketLiquidity(marketId, payload, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: `/admin/markets/${marketId}/liquidity/bootstrap`,
    body: payload,
    token: resolveAdminToken(token),
    signal
  });
}
function bootstrapAdminEventLiquidity(eventId, payload, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: `/admin/events/${eventId}/liquidity/bootstrap`,
    body: payload,
    token: resolveAdminToken(token),
    signal
  });
}
function pauseAdminMarket(marketId, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: `/admin/markets/${marketId}/pause`,
    token: resolveAdminToken(token),
    signal
  });
}
function unpauseAdminMarket(marketId, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: `/admin/markets/${marketId}/unpause`,
    token: resolveAdminToken(token),
    signal
  });
}
function proposeAdminMarketResolution(marketId, payload, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: `/admin/markets/${marketId}/resolution/propose`,
    body: payload,
    token: resolveAdminToken(token),
    signal
  });
}
function disputeAdminMarketResolution(marketId, payload, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: `/admin/markets/${marketId}/resolution/dispute`,
    body: payload,
    token: resolveAdminToken(token),
    signal
  });
}
function finalizeAdminMarketResolution(marketId, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: `/admin/markets/${marketId}/resolution/finalize`,
    token: resolveAdminToken(token),
    signal
  });
}
function emergencyResolveAdminMarket(marketId, payload, { token, signal } = {}) {
  return apiRequest({
    method: "POST",
    path: `/admin/markets/${marketId}/resolution/emergency`,
    body: payload,
    token: resolveAdminToken(token),
    signal
  });
}

// src/lib/api/admin/uploads.ts
function uploadAdminImage({
  file,
  token,
  scope,
  fileName,
  signal
}) {
  const formData = new FormData();
  const normalizedFileName = fileName ?? ("name" in file ? file.name : "upload");
  formData.append("file", file, normalizedFileName);
  if (scope) {
    formData.append("scope", scope);
  }
  return apiRequest({
    method: "POST",
    path: "/admin/uploads/images",
    formData,
    token: resolveAdminToken(token),
    signal
  });
}

// src/lib/market/matchup.ts
var MATCH_STATUSES_WITH_VISIBLE_ZERO_ZERO_SCORE = /* @__PURE__ */ new Set([
  "live",
  "final",
  "delayed",
  "suspended"
]);
function hasMatchScore(matchup) {
  if (!matchup) {
    return false;
  }
  const homeHasScore = typeof matchup.home.score === "number";
  const awayHasScore = typeof matchup.away.score === "number";
  if (!homeHasScore && !awayHasScore) {
    return false;
  }
  const homeScore = homeHasScore ? matchup.home.score ?? 0 : 0;
  const awayScore = awayHasScore ? matchup.away.score ?? 0 : 0;
  if (homeScore !== 0 || awayScore !== 0) {
    return true;
  }
  return MATCH_STATUSES_WITH_VISIBLE_ZERO_ZERO_SCORE.has(matchup.status.trim().toLowerCase());
}
function formatMatchScore(matchup) {
  if (!matchup || !hasMatchScore(matchup)) {
    return null;
  }
  return `${matchup.home.score ?? 0} - ${matchup.away.score ?? 0}`;
}

// src/lib/api/faucet.ts
function requestUsdcFaucet(payload, signal) {
  return apiRequest({
    method: "POST",
    path: "/faucet/usdc",
    body: payload,
    signal
  });
}
function getUsdcFaucetBalance(address, signal) {
  return apiRequest({
    method: "GET",
    path: "/faucet/usdc/balance",
    query: {
      address
    },
    signal
  });
}

// src/lib/usdc.ts
var USDC_BASE_UNITS_PER_DOLLAR = 1000000n;
function normalizeUsdcDollarInput(value) {
  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    return "";
  }
  const withoutCurrencySymbol = trimmedValue.startsWith("$") ? trimmedValue.slice(1).trim() : trimmedValue;
  const normalizedValue = withoutCurrencySymbol.replaceAll(",", "");
  return normalizedValue.startsWith(".") ? `0${normalizedValue}` : normalizedValue;
}
function parseUsdcDollarsToBaseUnits(value, label, options = {}) {
  const normalizedValue = normalizeUsdcDollarInput(value);
  if (!normalizedValue) {
    throw new Error(`${label} is required.`);
  }
  if (!/^\d+(\.\d{0,6})?$/.test(normalizedValue)) {
    throw new Error(`${label} must be a dollar amount with up to 6 decimal places.`);
  }
  const [wholeUnits, fractionalUnits = ""] = normalizedValue.split(".");
  const baseUnits = BigInt(wholeUnits) * USDC_BASE_UNITS_PER_DOLLAR + BigInt(fractionalUnits.padEnd(6, "0") || "0");
  if (baseUnits === 0n && !options.allowZero) {
    throw new Error(`${label} must be greater than zero.`);
  }
  return baseUnits.toString();
}

// tests/admin-endpoints.test.ts
var originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});
test("parseUsdcDollarsToBaseUnits converts whole-dollar USDC inputs to base units", () => {
  assert.equal(parseUsdcDollarsToBaseUnits("1500", "Inventory USDC amount"), "1500000000");
});
test("parseUsdcDollarsToBaseUnits supports decimals, commas, and a dollar sign", () => {
  assert.equal(
    parseUsdcDollarsToBaseUnits("$1,500.25", "Inventory USDC amount"),
    "1500250000"
  );
});
test("parseUsdcDollarsToBaseUnits rejects more than 6 decimals", () => {
  assert.throws(
    () => parseUsdcDollarsToBaseUnits("1.0000001", "Inventory USDC amount"),
    /up to 6 decimal places/
  );
});
test("parseUsdcDollarsToBaseUnits allows zero only when explicitly requested", () => {
  assert.throws(
    () => parseUsdcDollarsToBaseUnits("0", "Exit collateral USDC amount"),
    /must be greater than zero/
  );
  assert.equal(
    parseUsdcDollarsToBaseUnits("0", "Exit collateral USDC amount", { allowZero: true }),
    "0"
  );
});
test("formatMatchScore hides default scheduled 0-0 but keeps live 0-0", () => {
  assert.equal(
    formatMatchScore({
      sport_slug: "soccer",
      status: "scheduled",
      home: { name: "Australia", score: 0 },
      away: { name: "Turkiye", score: 0 }
    }),
    null
  );
  assert.equal(
    formatMatchScore({
      sport_slug: "soccer",
      status: "live",
      home: { name: "Australia", score: 0 },
      away: { name: "Turkiye", score: 0 }
    }),
    "0 - 0"
  );
});
test("requestAdminWalletChallenge posts the wallet challenge payload", async () => {
  const calls = installFetchMock({
    payload: {
      challenge_id: "challenge-id",
      message: "Sign this message",
      expires_at: "2026-04-02T12:00:00Z"
    }
  });
  const response = await requestAdminWalletChallenge({
    wallet_address: "0xabc123"
  });
  assert.equal(response.challenge_id, "challenge-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/auth/wallet/challenge",
    body: {
      wallet_address: "0xabc123"
    }
  });
});
test("connectAdminWallet posts the signed challenge payload", async () => {
  const calls = installFetchMock({
    payload: {
      token: "jwt-token",
      user: buildUser()
    }
  });
  const response = await connectAdminWallet({
    challenge_id: "challenge-id",
    signature: "0xsigned",
    username: "admin"
  });
  assert.equal(response.token, "jwt-token");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/auth/wallet/connect",
    body: {
      challenge_id: "challenge-id",
      signature: "0xsigned",
      username: "admin"
    }
  });
});
test("getAdminMe sends the auth header", async () => {
  const calls = installFetchMock({
    payload: {
      user: buildUser(),
      xlayer_chain_id: 1952
    }
  });
  const response = await getAdminMe("jwt-token");
  assert.equal(response.xlayer_chain_id, 1952);
  assertJsonRequest(calls[0], {
    method: "GET",
    path: "/admin/me",
    token: "jwt-token"
  });
});
test("requestUsdcFaucet posts the faucet payload", async () => {
  const calls = installFetchMock({
    payload: {
      token_address: "0xusdc",
      recipient: "0xabc123",
      amount: "150000000",
      tx_hash: "0xtxhash",
      requested_at: "2026-04-02T12:00:00Z"
    }
  });
  const response = await requestUsdcFaucet({
    address: "0xabc123",
    amount: "150000000"
  });
  assert.equal(response.tx_hash, "0xtxhash");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/faucet/usdc",
    body: {
      address: "0xabc123",
      amount: "150000000"
    }
  });
});
test("getUsdcFaucetBalance sends the faucet balance query", async () => {
  const calls = installFetchMock({
    payload: {
      token_address: "0xusdc",
      address: "0xabc123",
      balance: "250000000",
      queried_at: "2026-04-02T12:00:00Z"
    }
  });
  const response = await getUsdcFaucetBalance("0xabc123");
  assert.equal(response.balance, "250000000");
  assert.equal(readRequestPath(calls[0]), "/faucet/usdc/balance");
  assert.equal(readRequestUrl(calls[0]).searchParams.get("address"), "0xabc123");
  assert.equal(calls[0].init?.method, "GET");
});
test("getAdminMe throws ApiError when the backend rejects the request", async () => {
  installFetchMock({
    payload: {
      error: "admin access required"
    },
    status: 403
  });
  await assert.rejects(() => getAdminMe("jwt-token"), (error) => {
    assert.ok(error instanceof ApiError);
    assert.equal(error.status, 403);
    assert.equal(error.message, "admin access required");
    return true;
  });
});
test("uploadAdminImage sends multipart form data to the upload endpoint", async () => {
  const calls = installFetchMock({
    payload: {
      asset: {
        id: "asset-id",
        storage_provider: "filebase_ipfs",
        bucket_name: "bucket",
        scope: "markets",
        file_name: "asset.png",
        content_type: "image/png",
        size_bytes: 4,
        cid: "cid",
        ipfs_url: "ipfs://cid",
        gateway_url: "https://gateway/cid",
        created_at: "2026-04-02T12:00:00Z"
      }
    }
  });
  const file = new File(["test"], "market.png", { type: "image/png" });
  const response = await uploadAdminImage({
    file,
    token: "jwt-token",
    scope: "markets"
  });
  assert.equal(response.asset.id, "asset-id");
  assert.equal(calls[0].init?.method, "POST");
  assert.equal(readRequestPath(calls[0]), "/admin/uploads/images");
  assert.equal(readAuthorizationHeader(calls[0].init), "Bearer jwt-token");
  const body = calls[0].init?.body;
  assert.ok(body instanceof FormData);
  assert.equal(body.get("scope"), "markets");
  assert.equal(body.get("file").name, "market.png");
});
test("createAdminEvent posts the event draft payload", async () => {
  const calls = installFetchMock({
    payload: {
      id: "event-id",
      event: buildEvent(),
      on_chain: buildEventOnChain(),
      created_at: "2026-04-02T12:00:00Z"
    }
  });
  const payload = {
    event: {
      title: "Election 2028",
      slug: "election-2028",
      category_slug: "politics",
      rules: "Rules"
    },
    chain: {
      group_key: "group",
      series_key: "series"
    }
  };
  const response = await createAdminEvent(payload, { token: "jwt-token" });
  assert.equal(response.id, "event-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events",
    body: payload,
    token: "jwt-token"
  });
});
test("createAdminMatchEventBundle posts the sports bundle payload", async () => {
  const calls = installFetchMock({
    payload: {
      event: {
        ...buildEvent(),
        publication_status: "published",
        matchup: buildMatchup()
      },
      on_chain: buildEventOnChain(),
      markets: [buildMarket()]
    }
  });
  const payload = {
    event: {
      title: "Australia vs Turkiye",
      slug: "australia-vs-turkiye-2026-05-27",
      category_slug: "sports",
      subcategory_slug: "soccer",
      rules: "Resolve on regulation time only.",
      starts_at: "2026-05-28T04:00:00Z",
      matchup: buildMatchup()
    },
    chain: {
      neg_risk: true
    },
    markets: {
      oracle_address: "0xoracle",
      template_selections: [
        {
          template_key: "match_result_3_way"
        },
        {
          template_key: "both_teams_to_score"
        },
        {
          template_key: "total_goals_over",
          lines: ["1.5", "2.5", "3.5"]
        }
      ],
      register_neg_risk: true
    },
    publish: {
      mode: "publish"
    }
  };
  const response = await createAdminMatchEventBundle(payload, { token: "jwt-token" });
  assert.equal(response.event.slug, "event");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events/matches",
    body: payload,
    token: "jwt-token"
  });
});
test("getAdminMatchMarketCatalog reads the sports template catalog", async () => {
  const calls = installFetchMock({
    payload: {
      sport_slug: "soccer",
      templates: [
        {
          template_key: "match_result_3_way",
          market_key: "h2h_3_way",
          label: "Match Result (3-Way)",
          description: "Creates Home Win, Draw, and Away Win contracts for regulation time.",
          period_key: "regulation",
          supports_lines: false,
          default_selected: true,
          default_lines: [],
          generated_selections: [
            { selection_key: "home", label: "Home Win" },
            { selection_key: "draw", label: "Draw" },
            { selection_key: "away", label: "Away Win" }
          ]
        }
      ]
    }
  });
  const response = await getAdminMatchMarketCatalog("soccer", { token: "jwt-token" });
  assert.equal(response.sport_slug, "soccer");
  assertJsonRequest(calls[0], {
    method: "GET",
    path: "/admin/events/matches/catalog/soccer",
    token: "jwt-token"
  });
});
test("listAdminEvents sends the admin recovery query", async () => {
  const calls = installFetchMock({
    payload: {
      events: [buildAdminEventCard()],
      limit: 25,
      offset: 0
    }
  });
  const response = await listAdminEvents(
    {
      publication_status: "draft",
      limit: 25
    },
    { token: "jwt-token" }
  );
  assert.equal(response.events[0]?.id, "event-id");
  const url = readRequestUrl(calls[0]);
  assert.equal(url.pathname, "/admin/events");
  assert.equal(url.searchParams.get("publication_status"), "draft");
  assert.equal(url.searchParams.get("limit"), "25");
  assert.equal(readAuthorizationHeader(calls[0].init), "Bearer jwt-token");
});
test("getAdminEvent reads the admin event detail endpoint", async () => {
  const calls = installFetchMock({
    payload: {
      event: buildEvent(),
      on_chain: buildEventOnChain(),
      markets_count: 2
    }
  });
  const response = await getAdminEvent("event-id", { token: "jwt-token" });
  assert.equal(response.markets_count, 2);
  assertJsonRequest(calls[0], {
    method: "GET",
    path: "/admin/events/event-id",
    token: "jwt-token"
  });
});
test("updateAdminEventMatchup patches the matchup payload", async () => {
  const calls = installFetchMock({
    payload: {
      event: {
        ...buildEvent(),
        matchup: buildMatchup({
          status: "live",
          home: {
            ...buildMatchup().home,
            score: 1
          },
          away: {
            ...buildMatchup().away,
            score: 0
          }
        })
      },
      on_chain: buildEventOnChain(),
      markets_count: 5
    }
  });
  const payload = {
    matchup: buildMatchup({
      status: "live",
      home: {
        ...buildMatchup().home,
        score: 1
      },
      away: {
        ...buildMatchup().away,
        score: 0
      }
    })
  };
  const response = await updateAdminEventMatchup("event-id", payload, {
    token: "jwt-token"
  });
  assert.equal(response.event.matchup?.status, "live");
  assertJsonRequest(calls[0], {
    method: "PATCH",
    path: "/admin/events/event-id/matchup",
    body: payload,
    token: "jwt-token"
  });
});
test("publishAdminEventShell posts to the event publish endpoint", async () => {
  const calls = installFetchMock({
    payload: {
      event: {
        ...buildEvent(),
        publication_status: "published"
      },
      on_chain: {
        ...buildEventOnChain(),
        tx_hash: "0xtxhash"
      },
      markets_count: 2
    }
  });
  const response = await publishAdminEventShell("event-id", {
    token: "jwt-token"
  });
  assert.equal(response.event.publication_status, "published");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events/event-id/publish",
    token: "jwt-token"
  });
});
test("createAdminEventMarkets posts to the event markets endpoint", async () => {
  const calls = installFetchMock({
    payload: {
      event_id: "event-id",
      event_slug: "event-slug",
      markets: [buildMarket()]
    }
  });
  const payload = {
    markets: [
      {
        label: "Yes",
        slug: "yes",
        question: "Will it happen?",
        end_time: "2026-04-03T00:00:00Z",
        oracle_address: "0xoracle"
      }
    ]
  };
  const response = await createAdminEventMarkets("event-id", payload, {
    token: "jwt-token"
  });
  assert.equal(response.event_id, "event-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events/event-id/markets",
    body: payload,
    token: "jwt-token"
  });
});
test("getAdminEventMarkets reads admin event markets with filters", async () => {
  const calls = installFetchMock({
    payload: {
      event: buildEvent(),
      on_chain: buildEventOnChain(),
      markets: [buildMarket()]
    }
  });
  const response = await getAdminEventMarkets(
    "event-id",
    {
      publication_status: "draft"
    },
    { token: "jwt-token" }
  );
  assert.equal(response.markets.length, 1);
  const url = readRequestUrl(calls[0]);
  assert.equal(url.pathname, "/admin/events/event-id/markets");
  assert.equal(url.searchParams.get("publication_status"), "draft");
  assert.equal(readAuthorizationHeader(calls[0].init), "Bearer jwt-token");
});
test("publishAdminEventMarkets posts to the event markets publish endpoint", async () => {
  const calls = installFetchMock({
    payload: {
      event: {
        ...buildEvent(),
        publication_status: "published"
      },
      on_chain: {
        ...buildEventOnChain(),
        tx_hash: "0xtxhash"
      },
      markets: [
        {
          ...buildMarket(),
          publication_status: "published",
          condition_id: "condition-id"
        }
      ]
    }
  });
  const response = await publishAdminEventMarkets("event-id", {
    token: "jwt-token"
  });
  assert.equal(response.markets[0]?.condition_id, "condition-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events/event-id/markets/publish",
    token: "jwt-token"
  });
});
test("createAdminEventMarketLadder posts to the ladder endpoint", async () => {
  const calls = installFetchMock({
    payload: {
      event_id: "event-id",
      event_slug: "event-slug",
      markets: [buildMarket()]
    }
  });
  const payload = {
    template: {
      underlying: "BTC",
      deadline_label: "April 10 close",
      end_time: "2026-04-10T20:00:00Z",
      oracle_address: "0xoracle",
      unit_symbol: "$",
      up_thresholds: ["85000", "90000"],
      down_thresholds: ["75000", "70000"]
    },
    publish: {
      mode: "draft"
    }
  };
  const response = await createAdminEventMarketLadder("event-id", payload, {
    token: "jwt-token"
  });
  assert.equal(response.event_id, "event-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events/event-id/markets/ladders",
    body: payload,
    token: "jwt-token"
  });
});
test("registerAdminNegRiskEvent posts the neg risk payload", async () => {
  const calls = installFetchMock({
    payload: {
      event: buildEvent(),
      on_chain: buildEventOnChain(),
      neg_risk: {
        registered: true,
        has_other: false,
        other_market_id: null,
        other_condition_id: null,
        tx_hash: null,
        registered_by_user_id: "user-id",
        registered_at: "2026-04-02T12:00:00Z"
      },
      updated_at: "2026-04-02T12:00:00Z"
    }
  });
  const payload = {
    neg_risk: {
      other_market_id: null
    }
  };
  const response = await registerAdminNegRiskEvent("event-id", payload, {
    token: "jwt-token"
  });
  assert.equal(response.neg_risk.registered, true);
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events/event-id/neg-risk/register",
    body: payload,
    token: "jwt-token"
  });
});
test("createAdminMarket posts the standalone market payload", async () => {
  const calls = installFetchMock({
    payload: {
      event: buildEvent(),
      on_chain: buildEventOnChain(),
      market: buildMarket(),
      created_at: "2026-04-02T12:00:00Z"
    }
  });
  const payload = {
    market: {
      title: "Will BTC break 100k?",
      slug: "btc-100k",
      category_slug: "crypto",
      rules: "Rules",
      end_time: "2026-04-03T00:00:00Z"
    },
    chain: {
      oracle_address: "0xoracle"
    }
  };
  const response = await createAdminMarket(payload, { token: "jwt-token" });
  assert.equal(response.market.id, "market-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets",
    body: payload,
    token: "jwt-token"
  });
});
test("updateAdminMarket patches the requested market", async () => {
  const calls = installFetchMock({
    payload: {
      event: buildEvent(),
      on_chain: buildEventOnChain(),
      market: buildMarket(),
      updated_at: "2026-04-02T12:00:00Z"
    }
  });
  const payload = {
    market: {
      label: "Updated label"
    }
  };
  const response = await updateAdminMarket("market-id", payload, {
    token: "jwt-token"
  });
  assert.equal(response.market.id, "market-id");
  assertJsonRequest(calls[0], {
    method: "PATCH",
    path: "/admin/markets/market-id",
    body: payload,
    token: "jwt-token"
  });
});
test("setAdminMarketPrices posts the market price payload", async () => {
  const calls = installFetchMock({
    payload: buildMarketPricesResponse()
  });
  const payload = {
    prices: {
      yes_bps: 120,
      no_bps: 9880
    }
  };
  const response = await setAdminMarketPrices("market-id", payload, {
    token: "jwt-token"
  });
  assert.equal(response.prices.yes_bps, 120);
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/prices",
    body: payload,
    token: "jwt-token"
  });
});
test("bootstrapAdminMarketLiquidity posts the market bootstrap payload", async () => {
  const calls = installFetchMock({
    payload: buildMarketLiquidityBootstrapResponse()
  });
  const payload = {
    liquidity: {
      yes_bps: 120,
      no_bps: 9880,
      inventory_usdc_amount: "1000",
      exit_collateral_usdc_amount: "250"
    }
  };
  const response = await bootstrapAdminMarketLiquidity("market-id", payload, {
    token: "jwt-token"
  });
  assert.equal(response.bootstrap.inventory_usdc_amount, "1000");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/liquidity/bootstrap",
    body: payload,
    token: "jwt-token"
  });
});
test("bootstrapAdminEventLiquidity posts the event bootstrap payload", async () => {
  const calls = installFetchMock({
    payload: buildEventLiquidityBootstrapResponse()
  });
  const payload = {
    liquidity: {
      markets: [
        {
          market_id: "market-id",
          yes_bps: 120,
          no_bps: 9880,
          inventory_usdc_amount: "1000",
          exit_collateral_usdc_amount: "250"
        }
      ]
    }
  };
  const response = await bootstrapAdminEventLiquidity("event-id", payload, {
    token: "jwt-token"
  });
  assert.equal(response.results[0]?.market.id, "market-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events/event-id/liquidity/bootstrap",
    body: payload,
    token: "jwt-token"
  });
});
test("pauseAdminMarket posts to the pause endpoint", async () => {
  const calls = installFetchMock({
    payload: buildTradingStatusResponse()
  });
  const response = await pauseAdminMarket("market-id", { token: "jwt-token" });
  assert.equal(response.market.trading_status, "paused");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/pause",
    token: "jwt-token"
  });
});
test("unpauseAdminMarket posts to the unpause endpoint", async () => {
  const calls = installFetchMock({
    payload: buildTradingStatusResponse()
  });
  const response = await unpauseAdminMarket("market-id", { token: "jwt-token" });
  assert.equal(response.market.trading_status, "paused");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/unpause",
    token: "jwt-token"
  });
});
test("proposeAdminMarketResolution posts the resolution proposal", async () => {
  const calls = installFetchMock({
    payload: buildResolutionWorkflowResponse()
  });
  const payload = {
    resolution: {
      winning_outcome: 1,
      notes: "Resolved by oracle"
    }
  };
  const response = await proposeAdminMarketResolution("market-id", payload, {
    token: "jwt-token"
  });
  assert.equal(response.resolution.status, "proposed");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/resolution/propose",
    body: payload,
    token: "jwt-token"
  });
});
test("disputeAdminMarketResolution posts the dispute payload", async () => {
  const calls = installFetchMock({
    payload: buildResolutionWorkflowResponse()
  });
  const payload = {
    resolution: {
      reason: "Outcome feed disagrees"
    }
  };
  const response = await disputeAdminMarketResolution("market-id", payload, {
    token: "jwt-token"
  });
  assert.equal(response.resolution.status, "proposed");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/resolution/dispute",
    body: payload,
    token: "jwt-token"
  });
});
test("finalizeAdminMarketResolution posts to the finalize endpoint", async () => {
  const calls = installFetchMock({
    payload: buildResolutionWorkflowResponse()
  });
  const response = await finalizeAdminMarketResolution("market-id", {
    token: "jwt-token"
  });
  assert.equal(response.market.id, "market-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/resolution/finalize",
    token: "jwt-token"
  });
});
test("emergencyResolveAdminMarket posts the emergency resolution payload", async () => {
  const calls = installFetchMock({
    payload: buildResolutionWorkflowResponse()
  });
  const payload = {
    resolution: {
      winning_outcome: 0,
      reason: "Emergency admin action"
    }
  };
  const response = await emergencyResolveAdminMarket("market-id", payload, {
    token: "jwt-token"
  });
  assert.equal(response.market.id, "market-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/resolution/emergency",
    body: payload,
    token: "jwt-token"
  });
});
function installFetchMock({ payload, status = 200, headers }) {
  const calls = [];
  globalThis.fetch = (async (input, init) => {
    calls.push({ input, init });
    return new Response(payload === void 0 ? null : JSON.stringify(payload), {
      status,
      headers: headers ?? {
        "content-type": "application/json"
      }
    });
  });
  return calls;
}
function assertJsonRequest(call, expected) {
  assert.ok(call);
  assert.equal(readRequestPath(call), expected.path);
  assert.equal(call.init?.method, expected.method);
  if (expected.token) {
    assert.equal(readAuthorizationHeader(call.init), `Bearer ${expected.token}`);
  }
  if (expected.body !== void 0) {
    assert.deepEqual(JSON.parse(String(call.init?.body)), expected.body);
    assert.equal(readContentTypeHeader(call.init), "application/json");
  }
}
function readRequestPath(call) {
  return readRequestUrl(call).pathname;
}
function readRequestUrl(call) {
  const rawUrl = typeof call.input === "string" ? call.input : call.input.toString();
  return new URL(rawUrl);
}
function readAuthorizationHeader(init) {
  return new Headers(init?.headers).get("authorization");
}
function readContentTypeHeader(init) {
  return new Headers(init?.headers).get("content-type");
}
function buildUser() {
  return {
    id: "user-id",
    email: null,
    username: "admin",
    display_name: "Admin",
    avatar_url: null,
    wallet: {
      wallet_address: "0xabc123",
      chain_id: 1952,
      created_at: "2026-04-02T12:00:00Z"
    },
    created_at: "2026-04-02T12:00:00Z",
    updated_at: "2026-04-02T12:00:00Z"
  };
}
function buildEvent() {
  return {
    title: "Event",
    slug: "event",
    category_slug: "politics",
    subcategory_slug: null,
    tag_slugs: [],
    image_url: null,
    matchup: null,
    summary: null,
    rules: "Rules",
    context: null,
    additional_context: null,
    resolution_sources: [],
    resolution_timezone: "UTC",
    starts_at: null,
    sort_at: null,
    featured: false,
    breaking: false,
    searchable: true,
    visible: true,
    hide_resolved_by_default: false,
    publication_status: "draft"
  };
}
function buildAdminEventCard() {
  return {
    id: "event-id",
    title: "Event",
    slug: "event",
    category_slug: "politics",
    subcategory_slug: null,
    tag_slugs: [],
    image_url: null,
    matchup: null,
    summary: null,
    featured: false,
    breaking: false,
    neg_risk: false,
    publication_status: "draft",
    starts_at: null,
    sort_at: null,
    created_at: "2026-04-02T12:00:00Z",
    market_count: 2
  };
}
function buildEventOnChain() {
  return {
    event_id: "1",
    group_id: "2",
    series_id: "3",
    neg_risk: false,
    tx_hash: null
  };
}
function buildMatchup(overrides = {}) {
  return {
    sport_slug: "soccer",
    competition_name: "International Friendly",
    round_name: null,
    fixture_id: null,
    status: "scheduled",
    home: {
      name: "Australia",
      short_name: null,
      code: "aus",
      image_url: null,
      score: 0
    },
    away: {
      name: "Turkiye",
      short_name: null,
      code: "tur",
      image_url: null,
      score: 0
    },
    ...overrides
  };
}
function buildMarket() {
  return {
    id: "market-id",
    slug: "market",
    label: "Market",
    question: "Will it happen?",
    question_id: "question-id",
    condition_id: null,
    market_type: "binary",
    outcomes: ["Yes", "No"],
    end_time: "2026-04-03T00:00:00Z",
    sort_order: 0,
    publication_status: "draft",
    trading_status: "paused"
  };
}
function buildTradingStatusResponse() {
  return {
    event: buildEvent(),
    on_chain: buildEventOnChain(),
    market: buildMarket(),
    updated_at: "2026-04-02T12:00:00Z"
  };
}
function buildMarketLiquiditySnapshot() {
  return {
    market_id: "market-id",
    condition_id: "condition-id",
    source: "monad",
    exchange_outcomes: [
      {
        outcome_index: 0,
        outcome_label: "Yes",
        available: "500"
      },
      {
        outcome_index: 1,
        outcome_label: "No",
        available: "500"
      }
    ],
    pool: {
      idle_yes_total: "50",
      idle_no_total: "50",
      posted_yes_total: "450",
      posted_no_total: "450",
      claimable_collateral_total: "25"
    }
  };
}
function buildMarketPricesResponse() {
  return {
    event: buildEvent(),
    on_chain: buildEventOnChain(),
    market: buildMarket(),
    prices: {
      yes_bps: 120,
      no_bps: 9880,
      tx_hashes: {
        yes_price: "0xyes",
        no_price: "0xno"
      }
    },
    updated_at: "2026-04-02T12:00:00Z"
  };
}
function buildMarketLiquidityBootstrapResponse() {
  return {
    event: buildEvent(),
    on_chain: buildEventOnChain(),
    market: {
      ...buildMarket(),
      condition_id: "condition-id",
      publication_status: "published",
      trading_status: "active"
    },
    bootstrap: {
      yes_bps: 120,
      no_bps: 9880,
      inventory_usdc_amount: "1000",
      exit_collateral_usdc_amount: "250",
      tx_hashes: {
        yes_price: "0xyes",
        no_price: "0xno",
        split_and_add_liquidity: "0xsplit",
        deposit_collateral: "0xdeposit"
      }
    },
    liquidity: buildMarketLiquiditySnapshot(),
    updated_at: "2026-04-02T12:00:00Z"
  };
}
function buildEventLiquidityBootstrapResponse() {
  return {
    event: {
      ...buildEvent(),
      publication_status: "published"
    },
    on_chain: buildEventOnChain(),
    results: [
      {
        market: {
          ...buildMarket(),
          condition_id: "condition-id",
          publication_status: "published",
          trading_status: "active"
        },
        bootstrap: {
          yes_bps: 120,
          no_bps: 9880,
          inventory_usdc_amount: "1000",
          exit_collateral_usdc_amount: "250",
          tx_hashes: {
            yes_price: "0xyes",
            no_price: "0xno",
            split_and_add_liquidity: "0xsplit",
            deposit_collateral: null
          }
        },
        liquidity: buildMarketLiquiditySnapshot()
      }
    ],
    updated_at: "2026-04-02T12:00:00Z"
  };
}
function buildResolutionWorkflowResponse() {
  return {
    event: buildEvent(),
    on_chain: buildEventOnChain(),
    market: buildMarket(),
    resolution: {
      status: "proposed",
      proposed_winning_outcome: 1,
      final_winning_outcome: null,
      payout_vector_hash: "0xhash",
      proposed_by_user_id: "user-id",
      proposed_at: "2026-04-02T12:00:00Z",
      dispute_deadline: "2026-04-03T12:00:00Z",
      notes: null,
      disputed_by_user_id: null,
      disputed_at: null,
      dispute_reason: null,
      finalized_by_user_id: null,
      finalized_at: null,
      emergency_resolved_by_user_id: null,
      emergency_resolved_at: null
    },
    updated_at: "2026-04-02T12:00:00Z"
  };
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vdGVzdHMvYWRtaW4tZW5kcG9pbnRzLnRlc3QudHMiLCAiLi4vLi4vc3JjL2xpYi9hcGkvY29yZS50cyIsICIuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vc2Vyb3ZhbEAxLjUuMC9ub2RlX21vZHVsZXMvc2Vyb3ZhbC9kaXN0L2VzbS9wcm9kdWN0aW9uL2luZGV4Lm1qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vc2Vyb3ZhbC1wbHVnaW5zQDEuNS4wX3Nlcm92YWxAMS41LjAvbm9kZV9tb2R1bGVzL3Nlcm92YWwtcGx1Z2lucy9kaXN0L2VzbS9wcm9kdWN0aW9uL3dlYi5tanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3NvbGlkLWpzQDEuOS4xMS9ub2RlX21vZHVsZXMvc29saWQtanMvd2ViL2Rpc3Qvc2VydmVyLmpzIiwgIi4uLy4uL3NyYy9saWIvYXV0aC9hZG1pbi1zZXNzaW9uLnRzIiwgIi4uLy4uL3NyYy9saWIvYXBpL2FkbWluL2F1dGgudHMiLCAiLi4vLi4vc3JjL2xpYi9hcGkvYWRtaW4vbWFya2V0cy50cyIsICIuLi8uLi9zcmMvbGliL2FwaS9hZG1pbi91cGxvYWRzLnRzIiwgIi4uLy4uL3NyYy9saWIvbWFya2V0L21hdGNodXAudHMiLCAiLi4vLi4vc3JjL2xpYi9hcGkvZmF1Y2V0LnRzIiwgIi4uLy4uL3NyYy9saWIvdXNkYy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IGFzc2VydCBmcm9tIFwibm9kZTphc3NlcnQvc3RyaWN0XCI7XG5pbXBvcnQgdGVzdCwgeyBhZnRlckVhY2ggfSBmcm9tIFwibm9kZTp0ZXN0XCI7XG5cbmltcG9ydCB7IEFwaUVycm9yIH0gZnJvbSBcIn4vbGliL2FwaS9jb3JlXCI7XG5pbXBvcnQge1xuICBib290c3RyYXBBZG1pbkV2ZW50TGlxdWlkaXR5LFxuICBib290c3RyYXBBZG1pbk1hcmtldExpcXVpZGl0eSxcbiAgY29ubmVjdEFkbWluV2FsbGV0LFxuICBjcmVhdGVBZG1pbkV2ZW50LFxuICBjcmVhdGVBZG1pbkV2ZW50TWFya2V0TGFkZGVyLFxuICBjcmVhdGVBZG1pbkV2ZW50TWFya2V0cyxcbiAgY3JlYXRlQWRtaW5NYXRjaEV2ZW50QnVuZGxlLFxuICBjcmVhdGVBZG1pbk1hcmtldCxcbiAgZGlzcHV0ZUFkbWluTWFya2V0UmVzb2x1dGlvbixcbiAgZW1lcmdlbmN5UmVzb2x2ZUFkbWluTWFya2V0LFxuICBmaW5hbGl6ZUFkbWluTWFya2V0UmVzb2x1dGlvbixcbiAgZ2V0QWRtaW5FdmVudCxcbiAgZ2V0QWRtaW5FdmVudE1hcmtldHMsXG4gIGdldEFkbWluTWF0Y2hNYXJrZXRDYXRhbG9nLFxuICBsaXN0QWRtaW5FdmVudHMsXG4gIGdldEFkbWluTWUsXG4gIHBhdXNlQWRtaW5NYXJrZXQsXG4gIHB1Ymxpc2hBZG1pbkV2ZW50TWFya2V0cyxcbiAgcHVibGlzaEFkbWluRXZlbnRTaGVsbCxcbiAgcHJvcG9zZUFkbWluTWFya2V0UmVzb2x1dGlvbixcbiAgcmVnaXN0ZXJBZG1pbk5lZ1Jpc2tFdmVudCxcbiAgcmVxdWVzdEFkbWluV2FsbGV0Q2hhbGxlbmdlLFxuICBzZXRBZG1pbk1hcmtldFByaWNlcyxcbiAgdXBkYXRlQWRtaW5FdmVudE1hdGNodXAsXG4gIHVucGF1c2VBZG1pbk1hcmtldCxcbiAgdXBkYXRlQWRtaW5NYXJrZXQsXG4gIHVwbG9hZEFkbWluSW1hZ2UsXG59IGZyb20gXCJ+L2xpYi9hcGkvYWRtaW5cIjtcbmltcG9ydCB7IGZvcm1hdE1hdGNoU2NvcmUgfSBmcm9tIFwifi9saWIvbWFya2V0L21hdGNodXBcIjtcbmltcG9ydCB7IGdldFVzZGNGYXVjZXRCYWxhbmNlLCByZXF1ZXN0VXNkY0ZhdWNldCB9IGZyb20gXCJ+L2xpYi9hcGkvZmF1Y2V0XCI7XG5pbXBvcnQgeyBwYXJzZVVzZGNEb2xsYXJzVG9CYXNlVW5pdHMgfSBmcm9tIFwifi9saWIvdXNkY1wiO1xuXG50eXBlIE1vY2tSZXNwb25zZUluaXQgPSB7XG4gIHBheWxvYWQ/OiB1bmtub3duO1xuICBzdGF0dXM/OiBudW1iZXI7XG4gIGhlYWRlcnM/OiBIZWFkZXJzSW5pdDtcbn07XG5cbnR5cGUgUmVjb3JkZWRGZXRjaENhbGwgPSB7XG4gIGlucHV0OiBSZXF1ZXN0SW5mbyB8IFVSTDtcbiAgaW5pdDogUmVxdWVzdEluaXQgfCB1bmRlZmluZWQ7XG59O1xuXG5jb25zdCBvcmlnaW5hbEZldGNoID0gZ2xvYmFsVGhpcy5mZXRjaDtcblxuYWZ0ZXJFYWNoKCgpID0+IHtcbiAgZ2xvYmFsVGhpcy5mZXRjaCA9IG9yaWdpbmFsRmV0Y2g7XG59KTtcblxudGVzdChcInBhcnNlVXNkY0RvbGxhcnNUb0Jhc2VVbml0cyBjb252ZXJ0cyB3aG9sZS1kb2xsYXIgVVNEQyBpbnB1dHMgdG8gYmFzZSB1bml0c1wiLCAoKSA9PiB7XG4gIGFzc2VydC5lcXVhbChwYXJzZVVzZGNEb2xsYXJzVG9CYXNlVW5pdHMoXCIxNTAwXCIsIFwiSW52ZW50b3J5IFVTREMgYW1vdW50XCIpLCBcIjE1MDAwMDAwMDBcIik7XG59KTtcblxudGVzdChcInBhcnNlVXNkY0RvbGxhcnNUb0Jhc2VVbml0cyBzdXBwb3J0cyBkZWNpbWFscywgY29tbWFzLCBhbmQgYSBkb2xsYXIgc2lnblwiLCAoKSA9PiB7XG4gIGFzc2VydC5lcXVhbChcbiAgICBwYXJzZVVzZGNEb2xsYXJzVG9CYXNlVW5pdHMoXCIkMSw1MDAuMjVcIiwgXCJJbnZlbnRvcnkgVVNEQyBhbW91bnRcIiksXG4gICAgXCIxNTAwMjUwMDAwXCIsXG4gICk7XG59KTtcblxudGVzdChcInBhcnNlVXNkY0RvbGxhcnNUb0Jhc2VVbml0cyByZWplY3RzIG1vcmUgdGhhbiA2IGRlY2ltYWxzXCIsICgpID0+IHtcbiAgYXNzZXJ0LnRocm93cyhcbiAgICAoKSA9PiBwYXJzZVVzZGNEb2xsYXJzVG9CYXNlVW5pdHMoXCIxLjAwMDAwMDFcIiwgXCJJbnZlbnRvcnkgVVNEQyBhbW91bnRcIiksXG4gICAgL3VwIHRvIDYgZGVjaW1hbCBwbGFjZXMvLFxuICApO1xufSk7XG5cbnRlc3QoXCJwYXJzZVVzZGNEb2xsYXJzVG9CYXNlVW5pdHMgYWxsb3dzIHplcm8gb25seSB3aGVuIGV4cGxpY2l0bHkgcmVxdWVzdGVkXCIsICgpID0+IHtcbiAgYXNzZXJ0LnRocm93cyhcbiAgICAoKSA9PiBwYXJzZVVzZGNEb2xsYXJzVG9CYXNlVW5pdHMoXCIwXCIsIFwiRXhpdCBjb2xsYXRlcmFsIFVTREMgYW1vdW50XCIpLFxuICAgIC9tdXN0IGJlIGdyZWF0ZXIgdGhhbiB6ZXJvLyxcbiAgKTtcbiAgYXNzZXJ0LmVxdWFsKFxuICAgIHBhcnNlVXNkY0RvbGxhcnNUb0Jhc2VVbml0cyhcIjBcIiwgXCJFeGl0IGNvbGxhdGVyYWwgVVNEQyBhbW91bnRcIiwgeyBhbGxvd1plcm86IHRydWUgfSksXG4gICAgXCIwXCIsXG4gICk7XG59KTtcblxudGVzdChcImZvcm1hdE1hdGNoU2NvcmUgaGlkZXMgZGVmYXVsdCBzY2hlZHVsZWQgMC0wIGJ1dCBrZWVwcyBsaXZlIDAtMFwiLCAoKSA9PiB7XG4gIGFzc2VydC5lcXVhbChcbiAgICBmb3JtYXRNYXRjaFNjb3JlKHtcbiAgICAgIHNwb3J0X3NsdWc6IFwic29jY2VyXCIsXG4gICAgICBzdGF0dXM6IFwic2NoZWR1bGVkXCIsXG4gICAgICBob21lOiB7IG5hbWU6IFwiQXVzdHJhbGlhXCIsIHNjb3JlOiAwIH0sXG4gICAgICBhd2F5OiB7IG5hbWU6IFwiVHVya2l5ZVwiLCBzY29yZTogMCB9LFxuICAgIH0pLFxuICAgIG51bGwsXG4gICk7XG5cbiAgYXNzZXJ0LmVxdWFsKFxuICAgIGZvcm1hdE1hdGNoU2NvcmUoe1xuICAgICAgc3BvcnRfc2x1ZzogXCJzb2NjZXJcIixcbiAgICAgIHN0YXR1czogXCJsaXZlXCIsXG4gICAgICBob21lOiB7IG5hbWU6IFwiQXVzdHJhbGlhXCIsIHNjb3JlOiAwIH0sXG4gICAgICBhd2F5OiB7IG5hbWU6IFwiVHVya2l5ZVwiLCBzY29yZTogMCB9LFxuICAgIH0pLFxuICAgIFwiMCAtIDBcIixcbiAgKTtcbn0pO1xuXG50ZXN0KFwicmVxdWVzdEFkbWluV2FsbGV0Q2hhbGxlbmdlIHBvc3RzIHRoZSB3YWxsZXQgY2hhbGxlbmdlIHBheWxvYWRcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBjYWxscyA9IGluc3RhbGxGZXRjaE1vY2soe1xuICAgIHBheWxvYWQ6IHtcbiAgICAgIGNoYWxsZW5nZV9pZDogXCJjaGFsbGVuZ2UtaWRcIixcbiAgICAgIG1lc3NhZ2U6IFwiU2lnbiB0aGlzIG1lc3NhZ2VcIixcbiAgICAgIGV4cGlyZXNfYXQ6IFwiMjAyNi0wNC0wMlQxMjowMDowMFpcIixcbiAgICB9LFxuICB9KTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcXVlc3RBZG1pbldhbGxldENoYWxsZW5nZSh7XG4gICAgd2FsbGV0X2FkZHJlc3M6IFwiMHhhYmMxMjNcIixcbiAgfSk7XG5cbiAgYXNzZXJ0LmVxdWFsKHJlc3BvbnNlLmNoYWxsZW5nZV9pZCwgXCJjaGFsbGVuZ2UtaWRcIik7XG4gIGFzc2VydEpzb25SZXF1ZXN0KGNhbGxzWzBdLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBcIi9hZG1pbi9hdXRoL3dhbGxldC9jaGFsbGVuZ2VcIixcbiAgICBib2R5OiB7XG4gICAgICB3YWxsZXRfYWRkcmVzczogXCIweGFiYzEyM1wiLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoXCJjb25uZWN0QWRtaW5XYWxsZXQgcG9zdHMgdGhlIHNpZ25lZCBjaGFsbGVuZ2UgcGF5bG9hZFwiLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGNhbGxzID0gaW5zdGFsbEZldGNoTW9jayh7XG4gICAgcGF5bG9hZDoge1xuICAgICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gICAgICB1c2VyOiBidWlsZFVzZXIoKSxcbiAgICB9LFxuICB9KTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNvbm5lY3RBZG1pbldhbGxldCh7XG4gICAgY2hhbGxlbmdlX2lkOiBcImNoYWxsZW5nZS1pZFwiLFxuICAgIHNpZ25hdHVyZTogXCIweHNpZ25lZFwiLFxuICAgIHVzZXJuYW1lOiBcImFkbWluXCIsXG4gIH0pO1xuXG4gIGFzc2VydC5lcXVhbChyZXNwb25zZS50b2tlbiwgXCJqd3QtdG9rZW5cIik7XG4gIGFzc2VydEpzb25SZXF1ZXN0KGNhbGxzWzBdLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBcIi9hZG1pbi9hdXRoL3dhbGxldC9jb25uZWN0XCIsXG4gICAgYm9keToge1xuICAgICAgY2hhbGxlbmdlX2lkOiBcImNoYWxsZW5nZS1pZFwiLFxuICAgICAgc2lnbmF0dXJlOiBcIjB4c2lnbmVkXCIsXG4gICAgICB1c2VybmFtZTogXCJhZG1pblwiLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoXCJnZXRBZG1pbk1lIHNlbmRzIHRoZSBhdXRoIGhlYWRlclwiLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGNhbGxzID0gaW5zdGFsbEZldGNoTW9jayh7XG4gICAgcGF5bG9hZDoge1xuICAgICAgdXNlcjogYnVpbGRVc2VyKCksXG4gICAgICB4bGF5ZXJfY2hhaW5faWQ6IDE5NTIsXG4gICAgfSxcbiAgfSk7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBnZXRBZG1pbk1lKFwiand0LXRva2VuXCIpO1xuXG4gIGFzc2VydC5lcXVhbChyZXNwb25zZS54bGF5ZXJfY2hhaW5faWQsIDE5NTIpO1xuICBhc3NlcnRKc29uUmVxdWVzdChjYWxsc1swXSwge1xuICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICBwYXRoOiBcIi9hZG1pbi9tZVwiLFxuICAgIHRva2VuOiBcImp3dC10b2tlblwiLFxuICB9KTtcbn0pO1xuXG50ZXN0KFwicmVxdWVzdFVzZGNGYXVjZXQgcG9zdHMgdGhlIGZhdWNldCBwYXlsb2FkXCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgY2FsbHMgPSBpbnN0YWxsRmV0Y2hNb2NrKHtcbiAgICBwYXlsb2FkOiB7XG4gICAgICB0b2tlbl9hZGRyZXNzOiBcIjB4dXNkY1wiLFxuICAgICAgcmVjaXBpZW50OiBcIjB4YWJjMTIzXCIsXG4gICAgICBhbW91bnQ6IFwiMTUwMDAwMDAwXCIsXG4gICAgICB0eF9oYXNoOiBcIjB4dHhoYXNoXCIsXG4gICAgICByZXF1ZXN0ZWRfYXQ6IFwiMjAyNi0wNC0wMlQxMjowMDowMFpcIixcbiAgICB9LFxuICB9KTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlcXVlc3RVc2RjRmF1Y2V0KHtcbiAgICBhZGRyZXNzOiBcIjB4YWJjMTIzXCIsXG4gICAgYW1vdW50OiBcIjE1MDAwMDAwMFwiLFxuICB9KTtcblxuICBhc3NlcnQuZXF1YWwocmVzcG9uc2UudHhfaGFzaCwgXCIweHR4aGFzaFwiKTtcbiAgYXNzZXJ0SnNvblJlcXVlc3QoY2FsbHNbMF0sIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHBhdGg6IFwiL2ZhdWNldC91c2RjXCIsXG4gICAgYm9keToge1xuICAgICAgYWRkcmVzczogXCIweGFiYzEyM1wiLFxuICAgICAgYW1vdW50OiBcIjE1MDAwMDAwMFwiLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoXCJnZXRVc2RjRmF1Y2V0QmFsYW5jZSBzZW5kcyB0aGUgZmF1Y2V0IGJhbGFuY2UgcXVlcnlcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBjYWxscyA9IGluc3RhbGxGZXRjaE1vY2soe1xuICAgIHBheWxvYWQ6IHtcbiAgICAgIHRva2VuX2FkZHJlc3M6IFwiMHh1c2RjXCIsXG4gICAgICBhZGRyZXNzOiBcIjB4YWJjMTIzXCIsXG4gICAgICBiYWxhbmNlOiBcIjI1MDAwMDAwMFwiLFxuICAgICAgcXVlcmllZF9hdDogXCIyMDI2LTA0LTAyVDEyOjAwOjAwWlwiLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZ2V0VXNkY0ZhdWNldEJhbGFuY2UoXCIweGFiYzEyM1wiKTtcblxuICBhc3NlcnQuZXF1YWwocmVzcG9uc2UuYmFsYW5jZSwgXCIyNTAwMDAwMDBcIik7XG4gIGFzc2VydC5lcXVhbChyZWFkUmVxdWVzdFBhdGgoY2FsbHNbMF0pLCBcIi9mYXVjZXQvdXNkYy9iYWxhbmNlXCIpO1xuICBhc3NlcnQuZXF1YWwocmVhZFJlcXVlc3RVcmwoY2FsbHNbMF0pLnNlYXJjaFBhcmFtcy5nZXQoXCJhZGRyZXNzXCIpLCBcIjB4YWJjMTIzXCIpO1xuICBhc3NlcnQuZXF1YWwoY2FsbHNbMF0uaW5pdD8ubWV0aG9kLCBcIkdFVFwiKTtcbn0pO1xuXG50ZXN0KFwiZ2V0QWRtaW5NZSB0aHJvd3MgQXBpRXJyb3Igd2hlbiB0aGUgYmFja2VuZCByZWplY3RzIHRoZSByZXF1ZXN0XCIsIGFzeW5jICgpID0+IHtcbiAgaW5zdGFsbEZldGNoTW9jayh7XG4gICAgcGF5bG9hZDoge1xuICAgICAgZXJyb3I6IFwiYWRtaW4gYWNjZXNzIHJlcXVpcmVkXCIsXG4gICAgfSxcbiAgICBzdGF0dXM6IDQwMyxcbiAgfSk7XG5cbiAgYXdhaXQgYXNzZXJ0LnJlamVjdHMoKCkgPT4gZ2V0QWRtaW5NZShcImp3dC10b2tlblwiKSwgZXJyb3IgPT4ge1xuICAgIGFzc2VydC5vayhlcnJvciBpbnN0YW5jZW9mIEFwaUVycm9yKTtcbiAgICBhc3NlcnQuZXF1YWwoZXJyb3Iuc3RhdHVzLCA0MDMpO1xuICAgIGFzc2VydC5lcXVhbChlcnJvci5tZXNzYWdlLCBcImFkbWluIGFjY2VzcyByZXF1aXJlZFwiKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59KTtcblxudGVzdChcInVwbG9hZEFkbWluSW1hZ2Ugc2VuZHMgbXVsdGlwYXJ0IGZvcm0gZGF0YSB0byB0aGUgdXBsb2FkIGVuZHBvaW50XCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgY2FsbHMgPSBpbnN0YWxsRmV0Y2hNb2NrKHtcbiAgICBwYXlsb2FkOiB7XG4gICAgICBhc3NldDoge1xuICAgICAgICBpZDogXCJhc3NldC1pZFwiLFxuICAgICAgICBzdG9yYWdlX3Byb3ZpZGVyOiBcImZpbGViYXNlX2lwZnNcIixcbiAgICAgICAgYnVja2V0X25hbWU6IFwiYnVja2V0XCIsXG4gICAgICAgIHNjb3BlOiBcIm1hcmtldHNcIixcbiAgICAgICAgZmlsZV9uYW1lOiBcImFzc2V0LnBuZ1wiLFxuICAgICAgICBjb250ZW50X3R5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgIHNpemVfYnl0ZXM6IDQsXG4gICAgICAgIGNpZDogXCJjaWRcIixcbiAgICAgICAgaXBmc191cmw6IFwiaXBmczovL2NpZFwiLFxuICAgICAgICBnYXRld2F5X3VybDogXCJodHRwczovL2dhdGV3YXkvY2lkXCIsXG4gICAgICAgIGNyZWF0ZWRfYXQ6IFwiMjAyNi0wNC0wMlQxMjowMDowMFpcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG5cbiAgY29uc3QgZmlsZSA9IG5ldyBGaWxlKFtcInRlc3RcIl0sIFwibWFya2V0LnBuZ1wiLCB7IHR5cGU6IFwiaW1hZ2UvcG5nXCIgfSk7XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdXBsb2FkQWRtaW5JbWFnZSh7XG4gICAgZmlsZSxcbiAgICB0b2tlbjogXCJqd3QtdG9rZW5cIixcbiAgICBzY29wZTogXCJtYXJrZXRzXCIsXG4gIH0pO1xuXG4gIGFzc2VydC5lcXVhbChyZXNwb25zZS5hc3NldC5pZCwgXCJhc3NldC1pZFwiKTtcbiAgYXNzZXJ0LmVxdWFsKGNhbGxzWzBdLmluaXQ/Lm1ldGhvZCwgXCJQT1NUXCIpO1xuICBhc3NlcnQuZXF1YWwocmVhZFJlcXVlc3RQYXRoKGNhbGxzWzBdKSwgXCIvYWRtaW4vdXBsb2Fkcy9pbWFnZXNcIik7XG4gIGFzc2VydC5lcXVhbChyZWFkQXV0aG9yaXphdGlvbkhlYWRlcihjYWxsc1swXS5pbml0KSwgXCJCZWFyZXIgand0LXRva2VuXCIpO1xuXG4gIGNvbnN0IGJvZHkgPSBjYWxsc1swXS5pbml0Py5ib2R5O1xuICBhc3NlcnQub2soYm9keSBpbnN0YW5jZW9mIEZvcm1EYXRhKTtcbiAgYXNzZXJ0LmVxdWFsKGJvZHkuZ2V0KFwic2NvcGVcIiksIFwibWFya2V0c1wiKTtcbiAgYXNzZXJ0LmVxdWFsKChib2R5LmdldChcImZpbGVcIikgYXMgRmlsZSkubmFtZSwgXCJtYXJrZXQucG5nXCIpO1xufSk7XG5cbnRlc3QoXCJjcmVhdGVBZG1pbkV2ZW50IHBvc3RzIHRoZSBldmVudCBkcmFmdCBwYXlsb2FkXCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgY2FsbHMgPSBpbnN0YWxsRmV0Y2hNb2NrKHtcbiAgICBwYXlsb2FkOiB7XG4gICAgICBpZDogXCJldmVudC1pZFwiLFxuICAgICAgZXZlbnQ6IGJ1aWxkRXZlbnQoKSxcbiAgICAgIG9uX2NoYWluOiBidWlsZEV2ZW50T25DaGFpbigpLFxuICAgICAgY3JlYXRlZF9hdDogXCIyMDI2LTA0LTAyVDEyOjAwOjAwWlwiLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgZXZlbnQ6IHtcbiAgICAgIHRpdGxlOiBcIkVsZWN0aW9uIDIwMjhcIixcbiAgICAgIHNsdWc6IFwiZWxlY3Rpb24tMjAyOFwiLFxuICAgICAgY2F0ZWdvcnlfc2x1ZzogXCJwb2xpdGljc1wiLFxuICAgICAgcnVsZXM6IFwiUnVsZXNcIixcbiAgICB9LFxuICAgIGNoYWluOiB7XG4gICAgICBncm91cF9rZXk6IFwiZ3JvdXBcIixcbiAgICAgIHNlcmllc19rZXk6IFwic2VyaWVzXCIsXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNyZWF0ZUFkbWluRXZlbnQocGF5bG9hZCwgeyB0b2tlbjogXCJqd3QtdG9rZW5cIiB9KTtcblxuICBhc3NlcnQuZXF1YWwocmVzcG9uc2UuaWQsIFwiZXZlbnQtaWRcIik7XG4gIGFzc2VydEpzb25SZXF1ZXN0KGNhbGxzWzBdLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBcIi9hZG1pbi9ldmVudHNcIixcbiAgICBib2R5OiBwYXlsb2FkLFxuICAgIHRva2VuOiBcImp3dC10b2tlblwiLFxuICB9KTtcbn0pO1xuXG50ZXN0KFwiY3JlYXRlQWRtaW5NYXRjaEV2ZW50QnVuZGxlIHBvc3RzIHRoZSBzcG9ydHMgYnVuZGxlIHBheWxvYWRcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBjYWxscyA9IGluc3RhbGxGZXRjaE1vY2soe1xuICAgIHBheWxvYWQ6IHtcbiAgICAgIGV2ZW50OiB7XG4gICAgICAgIC4uLmJ1aWxkRXZlbnQoKSxcbiAgICAgICAgcHVibGljYXRpb25fc3RhdHVzOiBcInB1Ymxpc2hlZFwiLFxuICAgICAgICBtYXRjaHVwOiBidWlsZE1hdGNodXAoKSxcbiAgICAgIH0sXG4gICAgICBvbl9jaGFpbjogYnVpbGRFdmVudE9uQ2hhaW4oKSxcbiAgICAgIG1hcmtldHM6IFtidWlsZE1hcmtldCgpXSxcbiAgICB9LFxuICB9KTtcblxuICBjb25zdCBwYXlsb2FkID0ge1xuICAgIGV2ZW50OiB7XG4gICAgICB0aXRsZTogXCJBdXN0cmFsaWEgdnMgVHVya2l5ZVwiLFxuICAgICAgc2x1ZzogXCJhdXN0cmFsaWEtdnMtdHVya2l5ZS0yMDI2LTA1LTI3XCIsXG4gICAgICBjYXRlZ29yeV9zbHVnOiBcInNwb3J0c1wiLFxuICAgICAgc3ViY2F0ZWdvcnlfc2x1ZzogXCJzb2NjZXJcIixcbiAgICAgIHJ1bGVzOiBcIlJlc29sdmUgb24gcmVndWxhdGlvbiB0aW1lIG9ubHkuXCIsXG4gICAgICBzdGFydHNfYXQ6IFwiMjAyNi0wNS0yOFQwNDowMDowMFpcIixcbiAgICAgIG1hdGNodXA6IGJ1aWxkTWF0Y2h1cCgpLFxuICAgIH0sXG4gICAgY2hhaW46IHtcbiAgICAgIG5lZ19yaXNrOiB0cnVlLFxuICAgIH0sXG4gICAgbWFya2V0czoge1xuICAgICAgb3JhY2xlX2FkZHJlc3M6IFwiMHhvcmFjbGVcIixcbiAgICAgIHRlbXBsYXRlX3NlbGVjdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRlbXBsYXRlX2tleTogXCJtYXRjaF9yZXN1bHRfM193YXlcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRlbXBsYXRlX2tleTogXCJib3RoX3RlYW1zX3RvX3Njb3JlXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZW1wbGF0ZV9rZXk6IFwidG90YWxfZ29hbHNfb3ZlclwiLFxuICAgICAgICAgIGxpbmVzOiBbXCIxLjVcIiwgXCIyLjVcIiwgXCIzLjVcIl0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgcmVnaXN0ZXJfbmVnX3Jpc2s6IHRydWUsXG4gICAgfSxcbiAgICBwdWJsaXNoOiB7XG4gICAgICBtb2RlOiBcInB1Ymxpc2hcIiBhcyBjb25zdCxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY3JlYXRlQWRtaW5NYXRjaEV2ZW50QnVuZGxlKHBheWxvYWQsIHsgdG9rZW46IFwiand0LXRva2VuXCIgfSk7XG5cbiAgYXNzZXJ0LmVxdWFsKHJlc3BvbnNlLmV2ZW50LnNsdWcsIFwiZXZlbnRcIik7XG4gIGFzc2VydEpzb25SZXF1ZXN0KGNhbGxzWzBdLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBcIi9hZG1pbi9ldmVudHMvbWF0Y2hlc1wiLFxuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gIH0pO1xufSk7XG5cbnRlc3QoXCJnZXRBZG1pbk1hdGNoTWFya2V0Q2F0YWxvZyByZWFkcyB0aGUgc3BvcnRzIHRlbXBsYXRlIGNhdGFsb2dcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBjYWxscyA9IGluc3RhbGxGZXRjaE1vY2soe1xuICAgIHBheWxvYWQ6IHtcbiAgICAgIHNwb3J0X3NsdWc6IFwic29jY2VyXCIsXG4gICAgICB0ZW1wbGF0ZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRlbXBsYXRlX2tleTogXCJtYXRjaF9yZXN1bHRfM193YXlcIixcbiAgICAgICAgICBtYXJrZXRfa2V5OiBcImgyaF8zX3dheVwiLFxuICAgICAgICAgIGxhYmVsOiBcIk1hdGNoIFJlc3VsdCAoMy1XYXkpXCIsXG4gICAgICAgICAgZGVzY3JpcHRpb246IFwiQ3JlYXRlcyBIb21lIFdpbiwgRHJhdywgYW5kIEF3YXkgV2luIGNvbnRyYWN0cyBmb3IgcmVndWxhdGlvbiB0aW1lLlwiLFxuICAgICAgICAgIHBlcmlvZF9rZXk6IFwicmVndWxhdGlvblwiLFxuICAgICAgICAgIHN1cHBvcnRzX2xpbmVzOiBmYWxzZSxcbiAgICAgICAgICBkZWZhdWx0X3NlbGVjdGVkOiB0cnVlLFxuICAgICAgICAgIGRlZmF1bHRfbGluZXM6IFtdLFxuICAgICAgICAgIGdlbmVyYXRlZF9zZWxlY3Rpb25zOiBbXG4gICAgICAgICAgICB7IHNlbGVjdGlvbl9rZXk6IFwiaG9tZVwiLCBsYWJlbDogXCJIb21lIFdpblwiIH0sXG4gICAgICAgICAgICB7IHNlbGVjdGlvbl9rZXk6IFwiZHJhd1wiLCBsYWJlbDogXCJEcmF3XCIgfSxcbiAgICAgICAgICAgIHsgc2VsZWN0aW9uX2tleTogXCJhd2F5XCIsIGxhYmVsOiBcIkF3YXkgV2luXCIgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9KTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGdldEFkbWluTWF0Y2hNYXJrZXRDYXRhbG9nKFwic29jY2VyXCIsIHsgdG9rZW46IFwiand0LXRva2VuXCIgfSk7XG5cbiAgYXNzZXJ0LmVxdWFsKHJlc3BvbnNlLnNwb3J0X3NsdWcsIFwic29jY2VyXCIpO1xuICBhc3NlcnRKc29uUmVxdWVzdChjYWxsc1swXSwge1xuICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICBwYXRoOiBcIi9hZG1pbi9ldmVudHMvbWF0Y2hlcy9jYXRhbG9nL3NvY2NlclwiLFxuICAgIHRva2VuOiBcImp3dC10b2tlblwiLFxuICB9KTtcbn0pO1xuXG50ZXN0KFwibGlzdEFkbWluRXZlbnRzIHNlbmRzIHRoZSBhZG1pbiByZWNvdmVyeSBxdWVyeVwiLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGNhbGxzID0gaW5zdGFsbEZldGNoTW9jayh7XG4gICAgcGF5bG9hZDoge1xuICAgICAgZXZlbnRzOiBbYnVpbGRBZG1pbkV2ZW50Q2FyZCgpXSxcbiAgICAgIGxpbWl0OiAyNSxcbiAgICAgIG9mZnNldDogMCxcbiAgICB9LFxuICB9KTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGxpc3RBZG1pbkV2ZW50cyhcbiAgICB7XG4gICAgICBwdWJsaWNhdGlvbl9zdGF0dXM6IFwiZHJhZnRcIixcbiAgICAgIGxpbWl0OiAyNSxcbiAgICB9LFxuICAgIHsgdG9rZW46IFwiand0LXRva2VuXCIgfSxcbiAgKTtcblxuICBhc3NlcnQuZXF1YWwocmVzcG9uc2UuZXZlbnRzWzBdPy5pZCwgXCJldmVudC1pZFwiKTtcbiAgY29uc3QgdXJsID0gcmVhZFJlcXVlc3RVcmwoY2FsbHNbMF0pO1xuICBhc3NlcnQuZXF1YWwodXJsLnBhdGhuYW1lLCBcIi9hZG1pbi9ldmVudHNcIik7XG4gIGFzc2VydC5lcXVhbCh1cmwuc2VhcmNoUGFyYW1zLmdldChcInB1YmxpY2F0aW9uX3N0YXR1c1wiKSwgXCJkcmFmdFwiKTtcbiAgYXNzZXJ0LmVxdWFsKHVybC5zZWFyY2hQYXJhbXMuZ2V0KFwibGltaXRcIiksIFwiMjVcIik7XG4gIGFzc2VydC5lcXVhbChyZWFkQXV0aG9yaXphdGlvbkhlYWRlcihjYWxsc1swXS5pbml0KSwgXCJCZWFyZXIgand0LXRva2VuXCIpO1xufSk7XG5cbnRlc3QoXCJnZXRBZG1pbkV2ZW50IHJlYWRzIHRoZSBhZG1pbiBldmVudCBkZXRhaWwgZW5kcG9pbnRcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBjYWxscyA9IGluc3RhbGxGZXRjaE1vY2soe1xuICAgIHBheWxvYWQ6IHtcbiAgICAgIGV2ZW50OiBidWlsZEV2ZW50KCksXG4gICAgICBvbl9jaGFpbjogYnVpbGRFdmVudE9uQ2hhaW4oKSxcbiAgICAgIG1hcmtldHNfY291bnQ6IDIsXG4gICAgfSxcbiAgfSk7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBnZXRBZG1pbkV2ZW50KFwiZXZlbnQtaWRcIiwgeyB0b2tlbjogXCJqd3QtdG9rZW5cIiB9KTtcblxuICBhc3NlcnQuZXF1YWwocmVzcG9uc2UubWFya2V0c19jb3VudCwgMik7XG4gIGFzc2VydEpzb25SZXF1ZXN0KGNhbGxzWzBdLCB7XG4gICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgIHBhdGg6IFwiL2FkbWluL2V2ZW50cy9ldmVudC1pZFwiLFxuICAgIHRva2VuOiBcImp3dC10b2tlblwiLFxuICB9KTtcbn0pO1xuXG50ZXN0KFwidXBkYXRlQWRtaW5FdmVudE1hdGNodXAgcGF0Y2hlcyB0aGUgbWF0Y2h1cCBwYXlsb2FkXCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgY2FsbHMgPSBpbnN0YWxsRmV0Y2hNb2NrKHtcbiAgICBwYXlsb2FkOiB7XG4gICAgICBldmVudDoge1xuICAgICAgICAuLi5idWlsZEV2ZW50KCksXG4gICAgICAgIG1hdGNodXA6IGJ1aWxkTWF0Y2h1cCh7XG4gICAgICAgICAgc3RhdHVzOiBcImxpdmVcIixcbiAgICAgICAgICBob21lOiB7XG4gICAgICAgICAgICAuLi5idWlsZE1hdGNodXAoKS5ob21lLFxuICAgICAgICAgICAgc2NvcmU6IDEsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhd2F5OiB7XG4gICAgICAgICAgICAuLi5idWlsZE1hdGNodXAoKS5hd2F5LFxuICAgICAgICAgICAgc2NvcmU6IDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgICAgb25fY2hhaW46IGJ1aWxkRXZlbnRPbkNoYWluKCksXG4gICAgICBtYXJrZXRzX2NvdW50OiA1LFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgbWF0Y2h1cDogYnVpbGRNYXRjaHVwKHtcbiAgICAgIHN0YXR1czogXCJsaXZlXCIsXG4gICAgICBob21lOiB7XG4gICAgICAgIC4uLmJ1aWxkTWF0Y2h1cCgpLmhvbWUsXG4gICAgICAgIHNjb3JlOiAxLFxuICAgICAgfSxcbiAgICAgIGF3YXk6IHtcbiAgICAgICAgLi4uYnVpbGRNYXRjaHVwKCkuYXdheSxcbiAgICAgICAgc2NvcmU6IDAsXG4gICAgICB9LFxuICAgIH0pLFxuICB9O1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdXBkYXRlQWRtaW5FdmVudE1hdGNodXAoXCJldmVudC1pZFwiLCBwYXlsb2FkLCB7XG4gICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gIH0pO1xuXG4gIGFzc2VydC5lcXVhbChyZXNwb25zZS5ldmVudC5tYXRjaHVwPy5zdGF0dXMsIFwibGl2ZVwiKTtcbiAgYXNzZXJ0SnNvblJlcXVlc3QoY2FsbHNbMF0sIHtcbiAgICBtZXRob2Q6IFwiUEFUQ0hcIixcbiAgICBwYXRoOiBcIi9hZG1pbi9ldmVudHMvZXZlbnQtaWQvbWF0Y2h1cFwiLFxuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gIH0pO1xufSk7XG5cbnRlc3QoXCJwdWJsaXNoQWRtaW5FdmVudFNoZWxsIHBvc3RzIHRvIHRoZSBldmVudCBwdWJsaXNoIGVuZHBvaW50XCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgY2FsbHMgPSBpbnN0YWxsRmV0Y2hNb2NrKHtcbiAgICBwYXlsb2FkOiB7XG4gICAgICBldmVudDoge1xuICAgICAgICAuLi5idWlsZEV2ZW50KCksXG4gICAgICAgIHB1YmxpY2F0aW9uX3N0YXR1czogXCJwdWJsaXNoZWRcIixcbiAgICAgIH0sXG4gICAgICBvbl9jaGFpbjoge1xuICAgICAgICAuLi5idWlsZEV2ZW50T25DaGFpbigpLFxuICAgICAgICB0eF9oYXNoOiBcIjB4dHhoYXNoXCIsXG4gICAgICB9LFxuICAgICAgbWFya2V0c19jb3VudDogMixcbiAgICB9LFxuICB9KTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHB1Ymxpc2hBZG1pbkV2ZW50U2hlbGwoXCJldmVudC1pZFwiLCB7XG4gICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gIH0pO1xuXG4gIGFzc2VydC5lcXVhbChyZXNwb25zZS5ldmVudC5wdWJsaWNhdGlvbl9zdGF0dXMsIFwicHVibGlzaGVkXCIpO1xuICBhc3NlcnRKc29uUmVxdWVzdChjYWxsc1swXSwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgcGF0aDogXCIvYWRtaW4vZXZlbnRzL2V2ZW50LWlkL3B1Ymxpc2hcIixcbiAgICB0b2tlbjogXCJqd3QtdG9rZW5cIixcbiAgfSk7XG59KTtcblxudGVzdChcImNyZWF0ZUFkbWluRXZlbnRNYXJrZXRzIHBvc3RzIHRvIHRoZSBldmVudCBtYXJrZXRzIGVuZHBvaW50XCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgY2FsbHMgPSBpbnN0YWxsRmV0Y2hNb2NrKHtcbiAgICBwYXlsb2FkOiB7XG4gICAgICBldmVudF9pZDogXCJldmVudC1pZFwiLFxuICAgICAgZXZlbnRfc2x1ZzogXCJldmVudC1zbHVnXCIsXG4gICAgICBtYXJrZXRzOiBbYnVpbGRNYXJrZXQoKV0sXG4gICAgfSxcbiAgfSk7XG5cbiAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICBtYXJrZXRzOiBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiBcIlllc1wiLFxuICAgICAgICBzbHVnOiBcInllc1wiLFxuICAgICAgICBxdWVzdGlvbjogXCJXaWxsIGl0IGhhcHBlbj9cIixcbiAgICAgICAgZW5kX3RpbWU6IFwiMjAyNi0wNC0wM1QwMDowMDowMFpcIixcbiAgICAgICAgb3JhY2xlX2FkZHJlc3M6IFwiMHhvcmFjbGVcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgfTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNyZWF0ZUFkbWluRXZlbnRNYXJrZXRzKFwiZXZlbnQtaWRcIiwgcGF5bG9hZCwge1xuICAgIHRva2VuOiBcImp3dC10b2tlblwiLFxuICB9KTtcblxuICBhc3NlcnQuZXF1YWwocmVzcG9uc2UuZXZlbnRfaWQsIFwiZXZlbnQtaWRcIik7XG4gIGFzc2VydEpzb25SZXF1ZXN0KGNhbGxzWzBdLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBcIi9hZG1pbi9ldmVudHMvZXZlbnQtaWQvbWFya2V0c1wiLFxuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gIH0pO1xufSk7XG5cbnRlc3QoXCJnZXRBZG1pbkV2ZW50TWFya2V0cyByZWFkcyBhZG1pbiBldmVudCBtYXJrZXRzIHdpdGggZmlsdGVyc1wiLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGNhbGxzID0gaW5zdGFsbEZldGNoTW9jayh7XG4gICAgcGF5bG9hZDoge1xuICAgICAgZXZlbnQ6IGJ1aWxkRXZlbnQoKSxcbiAgICAgIG9uX2NoYWluOiBidWlsZEV2ZW50T25DaGFpbigpLFxuICAgICAgbWFya2V0czogW2J1aWxkTWFya2V0KCldLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZ2V0QWRtaW5FdmVudE1hcmtldHMoXG4gICAgXCJldmVudC1pZFwiLFxuICAgIHtcbiAgICAgIHB1YmxpY2F0aW9uX3N0YXR1czogXCJkcmFmdFwiLFxuICAgIH0sXG4gICAgeyB0b2tlbjogXCJqd3QtdG9rZW5cIiB9LFxuICApO1xuXG4gIGFzc2VydC5lcXVhbChyZXNwb25zZS5tYXJrZXRzLmxlbmd0aCwgMSk7XG4gIGNvbnN0IHVybCA9IHJlYWRSZXF1ZXN0VXJsKGNhbGxzWzBdKTtcbiAgYXNzZXJ0LmVxdWFsKHVybC5wYXRobmFtZSwgXCIvYWRtaW4vZXZlbnRzL2V2ZW50LWlkL21hcmtldHNcIik7XG4gIGFzc2VydC5lcXVhbCh1cmwuc2VhcmNoUGFyYW1zLmdldChcInB1YmxpY2F0aW9uX3N0YXR1c1wiKSwgXCJkcmFmdFwiKTtcbiAgYXNzZXJ0LmVxdWFsKHJlYWRBdXRob3JpemF0aW9uSGVhZGVyKGNhbGxzWzBdLmluaXQpLCBcIkJlYXJlciBqd3QtdG9rZW5cIik7XG59KTtcblxudGVzdChcInB1Ymxpc2hBZG1pbkV2ZW50TWFya2V0cyBwb3N0cyB0byB0aGUgZXZlbnQgbWFya2V0cyBwdWJsaXNoIGVuZHBvaW50XCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgY2FsbHMgPSBpbnN0YWxsRmV0Y2hNb2NrKHtcbiAgICBwYXlsb2FkOiB7XG4gICAgICBldmVudDoge1xuICAgICAgICAuLi5idWlsZEV2ZW50KCksXG4gICAgICAgIHB1YmxpY2F0aW9uX3N0YXR1czogXCJwdWJsaXNoZWRcIixcbiAgICAgIH0sXG4gICAgICBvbl9jaGFpbjoge1xuICAgICAgICAuLi5idWlsZEV2ZW50T25DaGFpbigpLFxuICAgICAgICB0eF9oYXNoOiBcIjB4dHhoYXNoXCIsXG4gICAgICB9LFxuICAgICAgbWFya2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgLi4uYnVpbGRNYXJrZXQoKSxcbiAgICAgICAgICBwdWJsaWNhdGlvbl9zdGF0dXM6IFwicHVibGlzaGVkXCIsXG4gICAgICAgICAgY29uZGl0aW9uX2lkOiBcImNvbmRpdGlvbi1pZFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9KTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHB1Ymxpc2hBZG1pbkV2ZW50TWFya2V0cyhcImV2ZW50LWlkXCIsIHtcbiAgICB0b2tlbjogXCJqd3QtdG9rZW5cIixcbiAgfSk7XG5cbiAgYXNzZXJ0LmVxdWFsKHJlc3BvbnNlLm1hcmtldHNbMF0/LmNvbmRpdGlvbl9pZCwgXCJjb25kaXRpb24taWRcIik7XG4gIGFzc2VydEpzb25SZXF1ZXN0KGNhbGxzWzBdLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBcIi9hZG1pbi9ldmVudHMvZXZlbnQtaWQvbWFya2V0cy9wdWJsaXNoXCIsXG4gICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gIH0pO1xufSk7XG5cbnRlc3QoXCJjcmVhdGVBZG1pbkV2ZW50TWFya2V0TGFkZGVyIHBvc3RzIHRvIHRoZSBsYWRkZXIgZW5kcG9pbnRcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBjYWxscyA9IGluc3RhbGxGZXRjaE1vY2soe1xuICAgIHBheWxvYWQ6IHtcbiAgICAgIGV2ZW50X2lkOiBcImV2ZW50LWlkXCIsXG4gICAgICBldmVudF9zbHVnOiBcImV2ZW50LXNsdWdcIixcbiAgICAgIG1hcmtldHM6IFtidWlsZE1hcmtldCgpXSxcbiAgICB9LFxuICB9KTtcblxuICBjb25zdCBwYXlsb2FkID0ge1xuICAgIHRlbXBsYXRlOiB7XG4gICAgICB1bmRlcmx5aW5nOiBcIkJUQ1wiLFxuICAgICAgZGVhZGxpbmVfbGFiZWw6IFwiQXByaWwgMTAgY2xvc2VcIixcbiAgICAgIGVuZF90aW1lOiBcIjIwMjYtMDQtMTBUMjA6MDA6MDBaXCIsXG4gICAgICBvcmFjbGVfYWRkcmVzczogXCIweG9yYWNsZVwiLFxuICAgICAgdW5pdF9zeW1ib2w6IFwiJFwiLFxuICAgICAgdXBfdGhyZXNob2xkczogW1wiODUwMDBcIiwgXCI5MDAwMFwiXSxcbiAgICAgIGRvd25fdGhyZXNob2xkczogW1wiNzUwMDBcIiwgXCI3MDAwMFwiXSxcbiAgICB9LFxuICAgIHB1Ymxpc2g6IHtcbiAgICAgIG1vZGU6IFwiZHJhZnRcIiBhcyBjb25zdCxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY3JlYXRlQWRtaW5FdmVudE1hcmtldExhZGRlcihcImV2ZW50LWlkXCIsIHBheWxvYWQsIHtcbiAgICB0b2tlbjogXCJqd3QtdG9rZW5cIixcbiAgfSk7XG5cbiAgYXNzZXJ0LmVxdWFsKHJlc3BvbnNlLmV2ZW50X2lkLCBcImV2ZW50LWlkXCIpO1xuICBhc3NlcnRKc29uUmVxdWVzdChjYWxsc1swXSwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgcGF0aDogXCIvYWRtaW4vZXZlbnRzL2V2ZW50LWlkL21hcmtldHMvbGFkZGVyc1wiLFxuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gIH0pO1xufSk7XG5cbnRlc3QoXCJyZWdpc3RlckFkbWluTmVnUmlza0V2ZW50IHBvc3RzIHRoZSBuZWcgcmlzayBwYXlsb2FkXCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgY2FsbHMgPSBpbnN0YWxsRmV0Y2hNb2NrKHtcbiAgICBwYXlsb2FkOiB7XG4gICAgICBldmVudDogYnVpbGRFdmVudCgpLFxuICAgICAgb25fY2hhaW46IGJ1aWxkRXZlbnRPbkNoYWluKCksXG4gICAgICBuZWdfcmlzazoge1xuICAgICAgICByZWdpc3RlcmVkOiB0cnVlLFxuICAgICAgICBoYXNfb3RoZXI6IGZhbHNlLFxuICAgICAgICBvdGhlcl9tYXJrZXRfaWQ6IG51bGwsXG4gICAgICAgIG90aGVyX2NvbmRpdGlvbl9pZDogbnVsbCxcbiAgICAgICAgdHhfaGFzaDogbnVsbCxcbiAgICAgICAgcmVnaXN0ZXJlZF9ieV91c2VyX2lkOiBcInVzZXItaWRcIixcbiAgICAgICAgcmVnaXN0ZXJlZF9hdDogXCIyMDI2LTA0LTAyVDEyOjAwOjAwWlwiLFxuICAgICAgfSxcbiAgICAgIHVwZGF0ZWRfYXQ6IFwiMjAyNi0wNC0wMlQxMjowMDowMFpcIixcbiAgICB9LFxuICB9KTtcblxuICBjb25zdCBwYXlsb2FkID0ge1xuICAgIG5lZ19yaXNrOiB7XG4gICAgICBvdGhlcl9tYXJrZXRfaWQ6IG51bGwsXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlZ2lzdGVyQWRtaW5OZWdSaXNrRXZlbnQoXCJldmVudC1pZFwiLCBwYXlsb2FkLCB7XG4gICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gIH0pO1xuXG4gIGFzc2VydC5lcXVhbChyZXNwb25zZS5uZWdfcmlzay5yZWdpc3RlcmVkLCB0cnVlKTtcbiAgYXNzZXJ0SnNvblJlcXVlc3QoY2FsbHNbMF0sIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHBhdGg6IFwiL2FkbWluL2V2ZW50cy9ldmVudC1pZC9uZWctcmlzay9yZWdpc3RlclwiLFxuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gIH0pO1xufSk7XG5cbnRlc3QoXCJjcmVhdGVBZG1pbk1hcmtldCBwb3N0cyB0aGUgc3RhbmRhbG9uZSBtYXJrZXQgcGF5bG9hZFwiLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGNhbGxzID0gaW5zdGFsbEZldGNoTW9jayh7XG4gICAgcGF5bG9hZDoge1xuICAgICAgZXZlbnQ6IGJ1aWxkRXZlbnQoKSxcbiAgICAgIG9uX2NoYWluOiBidWlsZEV2ZW50T25DaGFpbigpLFxuICAgICAgbWFya2V0OiBidWlsZE1hcmtldCgpLFxuICAgICAgY3JlYXRlZF9hdDogXCIyMDI2LTA0LTAyVDEyOjAwOjAwWlwiLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgbWFya2V0OiB7XG4gICAgICB0aXRsZTogXCJXaWxsIEJUQyBicmVhayAxMDBrP1wiLFxuICAgICAgc2x1ZzogXCJidGMtMTAwa1wiLFxuICAgICAgY2F0ZWdvcnlfc2x1ZzogXCJjcnlwdG9cIixcbiAgICAgIHJ1bGVzOiBcIlJ1bGVzXCIsXG4gICAgICBlbmRfdGltZTogXCIyMDI2LTA0LTAzVDAwOjAwOjAwWlwiLFxuICAgIH0sXG4gICAgY2hhaW46IHtcbiAgICAgIG9yYWNsZV9hZGRyZXNzOiBcIjB4b3JhY2xlXCIsXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNyZWF0ZUFkbWluTWFya2V0KHBheWxvYWQsIHsgdG9rZW46IFwiand0LXRva2VuXCIgfSk7XG5cbiAgYXNzZXJ0LmVxdWFsKHJlc3BvbnNlLm1hcmtldC5pZCwgXCJtYXJrZXQtaWRcIik7XG4gIGFzc2VydEpzb25SZXF1ZXN0KGNhbGxzWzBdLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBcIi9hZG1pbi9tYXJrZXRzXCIsXG4gICAgYm9keTogcGF5bG9hZCxcbiAgICB0b2tlbjogXCJqd3QtdG9rZW5cIixcbiAgfSk7XG59KTtcblxudGVzdChcInVwZGF0ZUFkbWluTWFya2V0IHBhdGNoZXMgdGhlIHJlcXVlc3RlZCBtYXJrZXRcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBjYWxscyA9IGluc3RhbGxGZXRjaE1vY2soe1xuICAgIHBheWxvYWQ6IHtcbiAgICAgIGV2ZW50OiBidWlsZEV2ZW50KCksXG4gICAgICBvbl9jaGFpbjogYnVpbGRFdmVudE9uQ2hhaW4oKSxcbiAgICAgIG1hcmtldDogYnVpbGRNYXJrZXQoKSxcbiAgICAgIHVwZGF0ZWRfYXQ6IFwiMjAyNi0wNC0wMlQxMjowMDowMFpcIixcbiAgICB9LFxuICB9KTtcblxuICBjb25zdCBwYXlsb2FkID0ge1xuICAgIG1hcmtldDoge1xuICAgICAgbGFiZWw6IFwiVXBkYXRlZCBsYWJlbFwiLFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB1cGRhdGVBZG1pbk1hcmtldChcIm1hcmtldC1pZFwiLCBwYXlsb2FkLCB7XG4gICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gIH0pO1xuXG4gIGFzc2VydC5lcXVhbChyZXNwb25zZS5tYXJrZXQuaWQsIFwibWFya2V0LWlkXCIpO1xuICBhc3NlcnRKc29uUmVxdWVzdChjYWxsc1swXSwge1xuICAgIG1ldGhvZDogXCJQQVRDSFwiLFxuICAgIHBhdGg6IFwiL2FkbWluL21hcmtldHMvbWFya2V0LWlkXCIsXG4gICAgYm9keTogcGF5bG9hZCxcbiAgICB0b2tlbjogXCJqd3QtdG9rZW5cIixcbiAgfSk7XG59KTtcblxudGVzdChcInNldEFkbWluTWFya2V0UHJpY2VzIHBvc3RzIHRoZSBtYXJrZXQgcHJpY2UgcGF5bG9hZFwiLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGNhbGxzID0gaW5zdGFsbEZldGNoTW9jayh7XG4gICAgcGF5bG9hZDogYnVpbGRNYXJrZXRQcmljZXNSZXNwb25zZSgpLFxuICB9KTtcblxuICBjb25zdCBwYXlsb2FkID0ge1xuICAgIHByaWNlczoge1xuICAgICAgeWVzX2JwczogMTIwLFxuICAgICAgbm9fYnBzOiA5ODgwLFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXRBZG1pbk1hcmtldFByaWNlcyhcIm1hcmtldC1pZFwiLCBwYXlsb2FkLCB7XG4gICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gIH0pO1xuXG4gIGFzc2VydC5lcXVhbChyZXNwb25zZS5wcmljZXMueWVzX2JwcywgMTIwKTtcbiAgYXNzZXJ0SnNvblJlcXVlc3QoY2FsbHNbMF0sIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHBhdGg6IFwiL2FkbWluL21hcmtldHMvbWFya2V0LWlkL3ByaWNlc1wiLFxuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gIH0pO1xufSk7XG5cbnRlc3QoXCJib290c3RyYXBBZG1pbk1hcmtldExpcXVpZGl0eSBwb3N0cyB0aGUgbWFya2V0IGJvb3RzdHJhcCBwYXlsb2FkXCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgY2FsbHMgPSBpbnN0YWxsRmV0Y2hNb2NrKHtcbiAgICBwYXlsb2FkOiBidWlsZE1hcmtldExpcXVpZGl0eUJvb3RzdHJhcFJlc3BvbnNlKCksXG4gIH0pO1xuXG4gIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgbGlxdWlkaXR5OiB7XG4gICAgICB5ZXNfYnBzOiAxMjAsXG4gICAgICBub19icHM6IDk4ODAsXG4gICAgICBpbnZlbnRvcnlfdXNkY19hbW91bnQ6IFwiMTAwMFwiLFxuICAgICAgZXhpdF9jb2xsYXRlcmFsX3VzZGNfYW1vdW50OiBcIjI1MFwiLFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBib290c3RyYXBBZG1pbk1hcmtldExpcXVpZGl0eShcIm1hcmtldC1pZFwiLCBwYXlsb2FkLCB7XG4gICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gIH0pO1xuXG4gIGFzc2VydC5lcXVhbChyZXNwb25zZS5ib290c3RyYXAuaW52ZW50b3J5X3VzZGNfYW1vdW50LCBcIjEwMDBcIik7XG4gIGFzc2VydEpzb25SZXF1ZXN0KGNhbGxzWzBdLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBcIi9hZG1pbi9tYXJrZXRzL21hcmtldC1pZC9saXF1aWRpdHkvYm9vdHN0cmFwXCIsXG4gICAgYm9keTogcGF5bG9hZCxcbiAgICB0b2tlbjogXCJqd3QtdG9rZW5cIixcbiAgfSk7XG59KTtcblxudGVzdChcImJvb3RzdHJhcEFkbWluRXZlbnRMaXF1aWRpdHkgcG9zdHMgdGhlIGV2ZW50IGJvb3RzdHJhcCBwYXlsb2FkXCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgY2FsbHMgPSBpbnN0YWxsRmV0Y2hNb2NrKHtcbiAgICBwYXlsb2FkOiBidWlsZEV2ZW50TGlxdWlkaXR5Qm9vdHN0cmFwUmVzcG9uc2UoKSxcbiAgfSk7XG5cbiAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICBsaXF1aWRpdHk6IHtcbiAgICAgIG1hcmtldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1hcmtldF9pZDogXCJtYXJrZXQtaWRcIixcbiAgICAgICAgICB5ZXNfYnBzOiAxMjAsXG4gICAgICAgICAgbm9fYnBzOiA5ODgwLFxuICAgICAgICAgIGludmVudG9yeV91c2RjX2Ftb3VudDogXCIxMDAwXCIsXG4gICAgICAgICAgZXhpdF9jb2xsYXRlcmFsX3VzZGNfYW1vdW50OiBcIjI1MFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYm9vdHN0cmFwQWRtaW5FdmVudExpcXVpZGl0eShcImV2ZW50LWlkXCIsIHBheWxvYWQsIHtcbiAgICB0b2tlbjogXCJqd3QtdG9rZW5cIixcbiAgfSk7XG5cbiAgYXNzZXJ0LmVxdWFsKHJlc3BvbnNlLnJlc3VsdHNbMF0/Lm1hcmtldC5pZCwgXCJtYXJrZXQtaWRcIik7XG4gIGFzc2VydEpzb25SZXF1ZXN0KGNhbGxzWzBdLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBcIi9hZG1pbi9ldmVudHMvZXZlbnQtaWQvbGlxdWlkaXR5L2Jvb3RzdHJhcFwiLFxuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gIH0pO1xufSk7XG5cbnRlc3QoXCJwYXVzZUFkbWluTWFya2V0IHBvc3RzIHRvIHRoZSBwYXVzZSBlbmRwb2ludFwiLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGNhbGxzID0gaW5zdGFsbEZldGNoTW9jayh7XG4gICAgcGF5bG9hZDogYnVpbGRUcmFkaW5nU3RhdHVzUmVzcG9uc2UoKSxcbiAgfSk7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBwYXVzZUFkbWluTWFya2V0KFwibWFya2V0LWlkXCIsIHsgdG9rZW46IFwiand0LXRva2VuXCIgfSk7XG5cbiAgYXNzZXJ0LmVxdWFsKHJlc3BvbnNlLm1hcmtldC50cmFkaW5nX3N0YXR1cywgXCJwYXVzZWRcIik7XG4gIGFzc2VydEpzb25SZXF1ZXN0KGNhbGxzWzBdLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBcIi9hZG1pbi9tYXJrZXRzL21hcmtldC1pZC9wYXVzZVwiLFxuICAgIHRva2VuOiBcImp3dC10b2tlblwiLFxuICB9KTtcbn0pO1xuXG50ZXN0KFwidW5wYXVzZUFkbWluTWFya2V0IHBvc3RzIHRvIHRoZSB1bnBhdXNlIGVuZHBvaW50XCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgY2FsbHMgPSBpbnN0YWxsRmV0Y2hNb2NrKHtcbiAgICBwYXlsb2FkOiBidWlsZFRyYWRpbmdTdGF0dXNSZXNwb25zZSgpLFxuICB9KTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHVucGF1c2VBZG1pbk1hcmtldChcIm1hcmtldC1pZFwiLCB7IHRva2VuOiBcImp3dC10b2tlblwiIH0pO1xuXG4gIGFzc2VydC5lcXVhbChyZXNwb25zZS5tYXJrZXQudHJhZGluZ19zdGF0dXMsIFwicGF1c2VkXCIpO1xuICBhc3NlcnRKc29uUmVxdWVzdChjYWxsc1swXSwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgcGF0aDogXCIvYWRtaW4vbWFya2V0cy9tYXJrZXQtaWQvdW5wYXVzZVwiLFxuICAgIHRva2VuOiBcImp3dC10b2tlblwiLFxuICB9KTtcbn0pO1xuXG50ZXN0KFwicHJvcG9zZUFkbWluTWFya2V0UmVzb2x1dGlvbiBwb3N0cyB0aGUgcmVzb2x1dGlvbiBwcm9wb3NhbFwiLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGNhbGxzID0gaW5zdGFsbEZldGNoTW9jayh7XG4gICAgcGF5bG9hZDogYnVpbGRSZXNvbHV0aW9uV29ya2Zsb3dSZXNwb25zZSgpLFxuICB9KTtcblxuICBjb25zdCBwYXlsb2FkID0ge1xuICAgIHJlc29sdXRpb246IHtcbiAgICAgIHdpbm5pbmdfb3V0Y29tZTogMSxcbiAgICAgIG5vdGVzOiBcIlJlc29sdmVkIGJ5IG9yYWNsZVwiLFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBwcm9wb3NlQWRtaW5NYXJrZXRSZXNvbHV0aW9uKFwibWFya2V0LWlkXCIsIHBheWxvYWQsIHtcbiAgICB0b2tlbjogXCJqd3QtdG9rZW5cIixcbiAgfSk7XG5cbiAgYXNzZXJ0LmVxdWFsKHJlc3BvbnNlLnJlc29sdXRpb24uc3RhdHVzLCBcInByb3Bvc2VkXCIpO1xuICBhc3NlcnRKc29uUmVxdWVzdChjYWxsc1swXSwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgcGF0aDogXCIvYWRtaW4vbWFya2V0cy9tYXJrZXQtaWQvcmVzb2x1dGlvbi9wcm9wb3NlXCIsXG4gICAgYm9keTogcGF5bG9hZCxcbiAgICB0b2tlbjogXCJqd3QtdG9rZW5cIixcbiAgfSk7XG59KTtcblxudGVzdChcImRpc3B1dGVBZG1pbk1hcmtldFJlc29sdXRpb24gcG9zdHMgdGhlIGRpc3B1dGUgcGF5bG9hZFwiLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGNhbGxzID0gaW5zdGFsbEZldGNoTW9jayh7XG4gICAgcGF5bG9hZDogYnVpbGRSZXNvbHV0aW9uV29ya2Zsb3dSZXNwb25zZSgpLFxuICB9KTtcblxuICBjb25zdCBwYXlsb2FkID0ge1xuICAgIHJlc29sdXRpb246IHtcbiAgICAgIHJlYXNvbjogXCJPdXRjb21lIGZlZWQgZGlzYWdyZWVzXCIsXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGRpc3B1dGVBZG1pbk1hcmtldFJlc29sdXRpb24oXCJtYXJrZXQtaWRcIiwgcGF5bG9hZCwge1xuICAgIHRva2VuOiBcImp3dC10b2tlblwiLFxuICB9KTtcblxuICBhc3NlcnQuZXF1YWwocmVzcG9uc2UucmVzb2x1dGlvbi5zdGF0dXMsIFwicHJvcG9zZWRcIik7XG4gIGFzc2VydEpzb25SZXF1ZXN0KGNhbGxzWzBdLCB7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBcIi9hZG1pbi9tYXJrZXRzL21hcmtldC1pZC9yZXNvbHV0aW9uL2Rpc3B1dGVcIixcbiAgICBib2R5OiBwYXlsb2FkLFxuICAgIHRva2VuOiBcImp3dC10b2tlblwiLFxuICB9KTtcbn0pO1xuXG50ZXN0KFwiZmluYWxpemVBZG1pbk1hcmtldFJlc29sdXRpb24gcG9zdHMgdG8gdGhlIGZpbmFsaXplIGVuZHBvaW50XCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgY2FsbHMgPSBpbnN0YWxsRmV0Y2hNb2NrKHtcbiAgICBwYXlsb2FkOiBidWlsZFJlc29sdXRpb25Xb3JrZmxvd1Jlc3BvbnNlKCksXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmluYWxpemVBZG1pbk1hcmtldFJlc29sdXRpb24oXCJtYXJrZXQtaWRcIiwge1xuICAgIHRva2VuOiBcImp3dC10b2tlblwiLFxuICB9KTtcblxuICBhc3NlcnQuZXF1YWwocmVzcG9uc2UubWFya2V0LmlkLCBcIm1hcmtldC1pZFwiKTtcbiAgYXNzZXJ0SnNvblJlcXVlc3QoY2FsbHNbMF0sIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHBhdGg6IFwiL2FkbWluL21hcmtldHMvbWFya2V0LWlkL3Jlc29sdXRpb24vZmluYWxpemVcIixcbiAgICB0b2tlbjogXCJqd3QtdG9rZW5cIixcbiAgfSk7XG59KTtcblxudGVzdChcImVtZXJnZW5jeVJlc29sdmVBZG1pbk1hcmtldCBwb3N0cyB0aGUgZW1lcmdlbmN5IHJlc29sdXRpb24gcGF5bG9hZFwiLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGNhbGxzID0gaW5zdGFsbEZldGNoTW9jayh7XG4gICAgcGF5bG9hZDogYnVpbGRSZXNvbHV0aW9uV29ya2Zsb3dSZXNwb25zZSgpLFxuICB9KTtcblxuICBjb25zdCBwYXlsb2FkID0ge1xuICAgIHJlc29sdXRpb246IHtcbiAgICAgIHdpbm5pbmdfb3V0Y29tZTogMCxcbiAgICAgIHJlYXNvbjogXCJFbWVyZ2VuY3kgYWRtaW4gYWN0aW9uXCIsXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGVtZXJnZW5jeVJlc29sdmVBZG1pbk1hcmtldChcIm1hcmtldC1pZFwiLCBwYXlsb2FkLCB7XG4gICAgdG9rZW46IFwiand0LXRva2VuXCIsXG4gIH0pO1xuXG4gIGFzc2VydC5lcXVhbChyZXNwb25zZS5tYXJrZXQuaWQsIFwibWFya2V0LWlkXCIpO1xuICBhc3NlcnRKc29uUmVxdWVzdChjYWxsc1swXSwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgcGF0aDogXCIvYWRtaW4vbWFya2V0cy9tYXJrZXQtaWQvcmVzb2x1dGlvbi9lbWVyZ2VuY3lcIixcbiAgICBib2R5OiBwYXlsb2FkLFxuICAgIHRva2VuOiBcImp3dC10b2tlblwiLFxuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBpbnN0YWxsRmV0Y2hNb2NrKHsgcGF5bG9hZCwgc3RhdHVzID0gMjAwLCBoZWFkZXJzIH06IE1vY2tSZXNwb25zZUluaXQpIHtcbiAgY29uc3QgY2FsbHM6IFJlY29yZGVkRmV0Y2hDYWxsW10gPSBbXTtcblxuICBnbG9iYWxUaGlzLmZldGNoID0gKGFzeW5jIChpbnB1dDogUmVxdWVzdEluZm8gfCBVUkwsIGluaXQ/OiBSZXF1ZXN0SW5pdCkgPT4ge1xuICAgIGNhbGxzLnB1c2goeyBpbnB1dCwgaW5pdCB9KTtcblxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UocGF5bG9hZCA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpLCB7XG4gICAgICBzdGF0dXMsXG4gICAgICBoZWFkZXJzOiBoZWFkZXJzID8/IHtcbiAgICAgICAgXCJjb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KSBhcyB0eXBlb2YgZmV0Y2g7XG5cbiAgcmV0dXJuIGNhbGxzO1xufVxuXG5mdW5jdGlvbiBhc3NlcnRKc29uUmVxdWVzdChcbiAgY2FsbDogUmVjb3JkZWRGZXRjaENhbGwgfCB1bmRlZmluZWQsXG4gIGV4cGVjdGVkOiB7XG4gICAgbWV0aG9kOiBzdHJpbmc7XG4gICAgcGF0aDogc3RyaW5nO1xuICAgIGJvZHk/OiB1bmtub3duO1xuICAgIHRva2VuPzogc3RyaW5nO1xuICB9LFxuKSB7XG4gIGFzc2VydC5vayhjYWxsKTtcbiAgYXNzZXJ0LmVxdWFsKHJlYWRSZXF1ZXN0UGF0aChjYWxsKSwgZXhwZWN0ZWQucGF0aCk7XG4gIGFzc2VydC5lcXVhbChjYWxsLmluaXQ/Lm1ldGhvZCwgZXhwZWN0ZWQubWV0aG9kKTtcblxuICBpZiAoZXhwZWN0ZWQudG9rZW4pIHtcbiAgICBhc3NlcnQuZXF1YWwocmVhZEF1dGhvcml6YXRpb25IZWFkZXIoY2FsbC5pbml0KSwgYEJlYXJlciAke2V4cGVjdGVkLnRva2VufWApO1xuICB9XG5cbiAgaWYgKGV4cGVjdGVkLmJvZHkgIT09IHVuZGVmaW5lZCkge1xuICAgIGFzc2VydC5kZWVwRXF1YWwoSlNPTi5wYXJzZShTdHJpbmcoY2FsbC5pbml0Py5ib2R5KSksIGV4cGVjdGVkLmJvZHkpO1xuICAgIGFzc2VydC5lcXVhbChyZWFkQ29udGVudFR5cGVIZWFkZXIoY2FsbC5pbml0KSwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlYWRSZXF1ZXN0UGF0aChjYWxsOiBSZWNvcmRlZEZldGNoQ2FsbCkge1xuICByZXR1cm4gcmVhZFJlcXVlc3RVcmwoY2FsbCkucGF0aG5hbWU7XG59XG5cbmZ1bmN0aW9uIHJlYWRSZXF1ZXN0VXJsKGNhbGw6IFJlY29yZGVkRmV0Y2hDYWxsKSB7XG4gIGNvbnN0IHJhd1VybCA9IHR5cGVvZiBjYWxsLmlucHV0ID09PSBcInN0cmluZ1wiID8gY2FsbC5pbnB1dCA6IGNhbGwuaW5wdXQudG9TdHJpbmcoKTtcbiAgcmV0dXJuIG5ldyBVUkwocmF3VXJsKTtcbn1cblxuZnVuY3Rpb24gcmVhZEF1dGhvcml6YXRpb25IZWFkZXIoaW5pdD86IFJlcXVlc3RJbml0KSB7XG4gIHJldHVybiBuZXcgSGVhZGVycyhpbml0Py5oZWFkZXJzKS5nZXQoXCJhdXRob3JpemF0aW9uXCIpO1xufVxuXG5mdW5jdGlvbiByZWFkQ29udGVudFR5cGVIZWFkZXIoaW5pdD86IFJlcXVlc3RJbml0KSB7XG4gIHJldHVybiBuZXcgSGVhZGVycyhpbml0Py5oZWFkZXJzKS5nZXQoXCJjb250ZW50LXR5cGVcIik7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkVXNlcigpIHtcbiAgcmV0dXJuIHtcbiAgICBpZDogXCJ1c2VyLWlkXCIsXG4gICAgZW1haWw6IG51bGwsXG4gICAgdXNlcm5hbWU6IFwiYWRtaW5cIixcbiAgICBkaXNwbGF5X25hbWU6IFwiQWRtaW5cIixcbiAgICBhdmF0YXJfdXJsOiBudWxsLFxuICAgIHdhbGxldDoge1xuICAgICAgd2FsbGV0X2FkZHJlc3M6IFwiMHhhYmMxMjNcIixcbiAgICAgIGNoYWluX2lkOiAxOTUyLFxuICAgICAgY3JlYXRlZF9hdDogXCIyMDI2LTA0LTAyVDEyOjAwOjAwWlwiLFxuICAgIH0sXG4gICAgY3JlYXRlZF9hdDogXCIyMDI2LTA0LTAyVDEyOjAwOjAwWlwiLFxuICAgIHVwZGF0ZWRfYXQ6IFwiMjAyNi0wNC0wMlQxMjowMDowMFpcIixcbiAgfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRFdmVudCgpIHtcbiAgcmV0dXJuIHtcbiAgICB0aXRsZTogXCJFdmVudFwiLFxuICAgIHNsdWc6IFwiZXZlbnRcIixcbiAgICBjYXRlZ29yeV9zbHVnOiBcInBvbGl0aWNzXCIsXG4gICAgc3ViY2F0ZWdvcnlfc2x1ZzogbnVsbCxcbiAgICB0YWdfc2x1Z3M6IFtdLFxuICAgIGltYWdlX3VybDogbnVsbCxcbiAgICBtYXRjaHVwOiBudWxsLFxuICAgIHN1bW1hcnk6IG51bGwsXG4gICAgcnVsZXM6IFwiUnVsZXNcIixcbiAgICBjb250ZXh0OiBudWxsLFxuICAgIGFkZGl0aW9uYWxfY29udGV4dDogbnVsbCxcbiAgICByZXNvbHV0aW9uX3NvdXJjZXM6IFtdLFxuICAgIHJlc29sdXRpb25fdGltZXpvbmU6IFwiVVRDXCIsXG4gICAgc3RhcnRzX2F0OiBudWxsLFxuICAgIHNvcnRfYXQ6IG51bGwsXG4gICAgZmVhdHVyZWQ6IGZhbHNlLFxuICAgIGJyZWFraW5nOiBmYWxzZSxcbiAgICBzZWFyY2hhYmxlOiB0cnVlLFxuICAgIHZpc2libGU6IHRydWUsXG4gICAgaGlkZV9yZXNvbHZlZF9ieV9kZWZhdWx0OiBmYWxzZSxcbiAgICBwdWJsaWNhdGlvbl9zdGF0dXM6IFwiZHJhZnRcIixcbiAgfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRBZG1pbkV2ZW50Q2FyZCgpIHtcbiAgcmV0dXJuIHtcbiAgICBpZDogXCJldmVudC1pZFwiLFxuICAgIHRpdGxlOiBcIkV2ZW50XCIsXG4gICAgc2x1ZzogXCJldmVudFwiLFxuICAgIGNhdGVnb3J5X3NsdWc6IFwicG9saXRpY3NcIixcbiAgICBzdWJjYXRlZ29yeV9zbHVnOiBudWxsLFxuICAgIHRhZ19zbHVnczogW10sXG4gICAgaW1hZ2VfdXJsOiBudWxsLFxuICAgIG1hdGNodXA6IG51bGwsXG4gICAgc3VtbWFyeTogbnVsbCxcbiAgICBmZWF0dXJlZDogZmFsc2UsXG4gICAgYnJlYWtpbmc6IGZhbHNlLFxuICAgIG5lZ19yaXNrOiBmYWxzZSxcbiAgICBwdWJsaWNhdGlvbl9zdGF0dXM6IFwiZHJhZnRcIixcbiAgICBzdGFydHNfYXQ6IG51bGwsXG4gICAgc29ydF9hdDogbnVsbCxcbiAgICBjcmVhdGVkX2F0OiBcIjIwMjYtMDQtMDJUMTI6MDA6MDBaXCIsXG4gICAgbWFya2V0X2NvdW50OiAyLFxuICB9O1xufVxuXG5mdW5jdGlvbiBidWlsZEV2ZW50T25DaGFpbigpIHtcbiAgcmV0dXJuIHtcbiAgICBldmVudF9pZDogXCIxXCIsXG4gICAgZ3JvdXBfaWQ6IFwiMlwiLFxuICAgIHNlcmllc19pZDogXCIzXCIsXG4gICAgbmVnX3Jpc2s6IGZhbHNlLFxuICAgIHR4X2hhc2g6IG51bGwsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGJ1aWxkTWF0Y2h1cChcbiAgb3ZlcnJpZGVzOiBQYXJ0aWFsPHtcbiAgICBzcG9ydF9zbHVnOiBzdHJpbmc7XG4gICAgY29tcGV0aXRpb25fbmFtZTogc3RyaW5nIHwgbnVsbDtcbiAgICByb3VuZF9uYW1lOiBzdHJpbmcgfCBudWxsO1xuICAgIGZpeHR1cmVfaWQ6IHN0cmluZyB8IG51bGw7XG4gICAgc3RhdHVzOiBzdHJpbmc7XG4gICAgaG9tZToge1xuICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgc2hvcnRfbmFtZTogc3RyaW5nIHwgbnVsbDtcbiAgICAgIGNvZGU6IHN0cmluZyB8IG51bGw7XG4gICAgICBpbWFnZV91cmw6IHN0cmluZyB8IG51bGw7XG4gICAgICBzY29yZTogbnVtYmVyIHwgbnVsbDtcbiAgICB9O1xuICAgIGF3YXk6IHtcbiAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgIHNob3J0X25hbWU6IHN0cmluZyB8IG51bGw7XG4gICAgICBjb2RlOiBzdHJpbmcgfCBudWxsO1xuICAgICAgaW1hZ2VfdXJsOiBzdHJpbmcgfCBudWxsO1xuICAgICAgc2NvcmU6IG51bWJlciB8IG51bGw7XG4gICAgfTtcbiAgfT4gPSB7fSxcbikge1xuICByZXR1cm4ge1xuICAgIHNwb3J0X3NsdWc6IFwic29jY2VyXCIsXG4gICAgY29tcGV0aXRpb25fbmFtZTogXCJJbnRlcm5hdGlvbmFsIEZyaWVuZGx5XCIsXG4gICAgcm91bmRfbmFtZTogbnVsbCxcbiAgICBmaXh0dXJlX2lkOiBudWxsLFxuICAgIHN0YXR1czogXCJzY2hlZHVsZWRcIixcbiAgICBob21lOiB7XG4gICAgICBuYW1lOiBcIkF1c3RyYWxpYVwiLFxuICAgICAgc2hvcnRfbmFtZTogbnVsbCxcbiAgICAgIGNvZGU6IFwiYXVzXCIsXG4gICAgICBpbWFnZV91cmw6IG51bGwsXG4gICAgICBzY29yZTogMCxcbiAgICB9LFxuICAgIGF3YXk6IHtcbiAgICAgIG5hbWU6IFwiVHVya2l5ZVwiLFxuICAgICAgc2hvcnRfbmFtZTogbnVsbCxcbiAgICAgIGNvZGU6IFwidHVyXCIsXG4gICAgICBpbWFnZV91cmw6IG51bGwsXG4gICAgICBzY29yZTogMCxcbiAgICB9LFxuICAgIC4uLm92ZXJyaWRlcyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRNYXJrZXQoKSB7XG4gIHJldHVybiB7XG4gICAgaWQ6IFwibWFya2V0LWlkXCIsXG4gICAgc2x1ZzogXCJtYXJrZXRcIixcbiAgICBsYWJlbDogXCJNYXJrZXRcIixcbiAgICBxdWVzdGlvbjogXCJXaWxsIGl0IGhhcHBlbj9cIixcbiAgICBxdWVzdGlvbl9pZDogXCJxdWVzdGlvbi1pZFwiLFxuICAgIGNvbmRpdGlvbl9pZDogbnVsbCxcbiAgICBtYXJrZXRfdHlwZTogXCJiaW5hcnlcIixcbiAgICBvdXRjb21lczogW1wiWWVzXCIsIFwiTm9cIl0sXG4gICAgZW5kX3RpbWU6IFwiMjAyNi0wNC0wM1QwMDowMDowMFpcIixcbiAgICBzb3J0X29yZGVyOiAwLFxuICAgIHB1YmxpY2F0aW9uX3N0YXR1czogXCJkcmFmdFwiLFxuICAgIHRyYWRpbmdfc3RhdHVzOiBcInBhdXNlZFwiLFxuICB9O1xufVxuXG5mdW5jdGlvbiBidWlsZFRyYWRpbmdTdGF0dXNSZXNwb25zZSgpIHtcbiAgcmV0dXJuIHtcbiAgICBldmVudDogYnVpbGRFdmVudCgpLFxuICAgIG9uX2NoYWluOiBidWlsZEV2ZW50T25DaGFpbigpLFxuICAgIG1hcmtldDogYnVpbGRNYXJrZXQoKSxcbiAgICB1cGRhdGVkX2F0OiBcIjIwMjYtMDQtMDJUMTI6MDA6MDBaXCIsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGJ1aWxkTWFya2V0TGlxdWlkaXR5U25hcHNob3QoKSB7XG4gIHJldHVybiB7XG4gICAgbWFya2V0X2lkOiBcIm1hcmtldC1pZFwiLFxuICAgIGNvbmRpdGlvbl9pZDogXCJjb25kaXRpb24taWRcIixcbiAgICBzb3VyY2U6IFwibW9uYWRcIixcbiAgICBleGNoYW5nZV9vdXRjb21lczogW1xuICAgICAge1xuICAgICAgICBvdXRjb21lX2luZGV4OiAwLFxuICAgICAgICBvdXRjb21lX2xhYmVsOiBcIlllc1wiLFxuICAgICAgICBhdmFpbGFibGU6IFwiNTAwXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvdXRjb21lX2luZGV4OiAxLFxuICAgICAgICBvdXRjb21lX2xhYmVsOiBcIk5vXCIsXG4gICAgICAgIGF2YWlsYWJsZTogXCI1MDBcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBwb29sOiB7XG4gICAgICBpZGxlX3llc190b3RhbDogXCI1MFwiLFxuICAgICAgaWRsZV9ub190b3RhbDogXCI1MFwiLFxuICAgICAgcG9zdGVkX3llc190b3RhbDogXCI0NTBcIixcbiAgICAgIHBvc3RlZF9ub190b3RhbDogXCI0NTBcIixcbiAgICAgIGNsYWltYWJsZV9jb2xsYXRlcmFsX3RvdGFsOiBcIjI1XCIsXG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRNYXJrZXRQcmljZXNSZXNwb25zZSgpIHtcbiAgcmV0dXJuIHtcbiAgICBldmVudDogYnVpbGRFdmVudCgpLFxuICAgIG9uX2NoYWluOiBidWlsZEV2ZW50T25DaGFpbigpLFxuICAgIG1hcmtldDogYnVpbGRNYXJrZXQoKSxcbiAgICBwcmljZXM6IHtcbiAgICAgIHllc19icHM6IDEyMCxcbiAgICAgIG5vX2JwczogOTg4MCxcbiAgICAgIHR4X2hhc2hlczoge1xuICAgICAgICB5ZXNfcHJpY2U6IFwiMHh5ZXNcIixcbiAgICAgICAgbm9fcHJpY2U6IFwiMHhub1wiLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHVwZGF0ZWRfYXQ6IFwiMjAyNi0wNC0wMlQxMjowMDowMFpcIixcbiAgfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRNYXJrZXRMaXF1aWRpdHlCb290c3RyYXBSZXNwb25zZSgpIHtcbiAgcmV0dXJuIHtcbiAgICBldmVudDogYnVpbGRFdmVudCgpLFxuICAgIG9uX2NoYWluOiBidWlsZEV2ZW50T25DaGFpbigpLFxuICAgIG1hcmtldDoge1xuICAgICAgLi4uYnVpbGRNYXJrZXQoKSxcbiAgICAgIGNvbmRpdGlvbl9pZDogXCJjb25kaXRpb24taWRcIixcbiAgICAgIHB1YmxpY2F0aW9uX3N0YXR1czogXCJwdWJsaXNoZWRcIixcbiAgICAgIHRyYWRpbmdfc3RhdHVzOiBcImFjdGl2ZVwiLFxuICAgIH0sXG4gICAgYm9vdHN0cmFwOiB7XG4gICAgICB5ZXNfYnBzOiAxMjAsXG4gICAgICBub19icHM6IDk4ODAsXG4gICAgICBpbnZlbnRvcnlfdXNkY19hbW91bnQ6IFwiMTAwMFwiLFxuICAgICAgZXhpdF9jb2xsYXRlcmFsX3VzZGNfYW1vdW50OiBcIjI1MFwiLFxuICAgICAgdHhfaGFzaGVzOiB7XG4gICAgICAgIHllc19wcmljZTogXCIweHllc1wiLFxuICAgICAgICBub19wcmljZTogXCIweG5vXCIsXG4gICAgICAgIHNwbGl0X2FuZF9hZGRfbGlxdWlkaXR5OiBcIjB4c3BsaXRcIixcbiAgICAgICAgZGVwb3NpdF9jb2xsYXRlcmFsOiBcIjB4ZGVwb3NpdFwiLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGxpcXVpZGl0eTogYnVpbGRNYXJrZXRMaXF1aWRpdHlTbmFwc2hvdCgpLFxuICAgIHVwZGF0ZWRfYXQ6IFwiMjAyNi0wNC0wMlQxMjowMDowMFpcIixcbiAgfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRFdmVudExpcXVpZGl0eUJvb3RzdHJhcFJlc3BvbnNlKCkge1xuICByZXR1cm4ge1xuICAgIGV2ZW50OiB7XG4gICAgICAuLi5idWlsZEV2ZW50KCksXG4gICAgICBwdWJsaWNhdGlvbl9zdGF0dXM6IFwicHVibGlzaGVkXCIsXG4gICAgfSxcbiAgICBvbl9jaGFpbjogYnVpbGRFdmVudE9uQ2hhaW4oKSxcbiAgICByZXN1bHRzOiBbXG4gICAgICB7XG4gICAgICAgIG1hcmtldDoge1xuICAgICAgICAgIC4uLmJ1aWxkTWFya2V0KCksXG4gICAgICAgICAgY29uZGl0aW9uX2lkOiBcImNvbmRpdGlvbi1pZFwiLFxuICAgICAgICAgIHB1YmxpY2F0aW9uX3N0YXR1czogXCJwdWJsaXNoZWRcIixcbiAgICAgICAgICB0cmFkaW5nX3N0YXR1czogXCJhY3RpdmVcIixcbiAgICAgICAgfSxcbiAgICAgICAgYm9vdHN0cmFwOiB7XG4gICAgICAgICAgeWVzX2JwczogMTIwLFxuICAgICAgICAgIG5vX2JwczogOTg4MCxcbiAgICAgICAgICBpbnZlbnRvcnlfdXNkY19hbW91bnQ6IFwiMTAwMFwiLFxuICAgICAgICAgIGV4aXRfY29sbGF0ZXJhbF91c2RjX2Ftb3VudDogXCIyNTBcIixcbiAgICAgICAgICB0eF9oYXNoZXM6IHtcbiAgICAgICAgICAgIHllc19wcmljZTogXCIweHllc1wiLFxuICAgICAgICAgICAgbm9fcHJpY2U6IFwiMHhub1wiLFxuICAgICAgICAgICAgc3BsaXRfYW5kX2FkZF9saXF1aWRpdHk6IFwiMHhzcGxpdFwiLFxuICAgICAgICAgICAgZGVwb3NpdF9jb2xsYXRlcmFsOiBudWxsLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGxpcXVpZGl0eTogYnVpbGRNYXJrZXRMaXF1aWRpdHlTbmFwc2hvdCgpLFxuICAgICAgfSxcbiAgICBdLFxuICAgIHVwZGF0ZWRfYXQ6IFwiMjAyNi0wNC0wMlQxMjowMDowMFpcIixcbiAgfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRSZXNvbHV0aW9uV29ya2Zsb3dSZXNwb25zZSgpIHtcbiAgcmV0dXJuIHtcbiAgICBldmVudDogYnVpbGRFdmVudCgpLFxuICAgIG9uX2NoYWluOiBidWlsZEV2ZW50T25DaGFpbigpLFxuICAgIG1hcmtldDogYnVpbGRNYXJrZXQoKSxcbiAgICByZXNvbHV0aW9uOiB7XG4gICAgICBzdGF0dXM6IFwicHJvcG9zZWRcIixcbiAgICAgIHByb3Bvc2VkX3dpbm5pbmdfb3V0Y29tZTogMSxcbiAgICAgIGZpbmFsX3dpbm5pbmdfb3V0Y29tZTogbnVsbCxcbiAgICAgIHBheW91dF92ZWN0b3JfaGFzaDogXCIweGhhc2hcIixcbiAgICAgIHByb3Bvc2VkX2J5X3VzZXJfaWQ6IFwidXNlci1pZFwiLFxuICAgICAgcHJvcG9zZWRfYXQ6IFwiMjAyNi0wNC0wMlQxMjowMDowMFpcIixcbiAgICAgIGRpc3B1dGVfZGVhZGxpbmU6IFwiMjAyNi0wNC0wM1QxMjowMDowMFpcIixcbiAgICAgIG5vdGVzOiBudWxsLFxuICAgICAgZGlzcHV0ZWRfYnlfdXNlcl9pZDogbnVsbCxcbiAgICAgIGRpc3B1dGVkX2F0OiBudWxsLFxuICAgICAgZGlzcHV0ZV9yZWFzb246IG51bGwsXG4gICAgICBmaW5hbGl6ZWRfYnlfdXNlcl9pZDogbnVsbCxcbiAgICAgIGZpbmFsaXplZF9hdDogbnVsbCxcbiAgICAgIGVtZXJnZW5jeV9yZXNvbHZlZF9ieV91c2VyX2lkOiBudWxsLFxuICAgICAgZW1lcmdlbmN5X3Jlc29sdmVkX2F0OiBudWxsLFxuICAgIH0sXG4gICAgdXBkYXRlZF9hdDogXCIyMDI2LTA0LTAyVDEyOjAwOjAwWlwiLFxuICB9O1xufVxuIiwgImNvbnN0IERFRkFVTFRfQVBJX0JBU0VfVVJMID0gXCJodHRwOi8vbG9jYWxob3N0OjgwODBcIjtcblxudHlwZSBRdWVyeVZhbHVlID1cbiAgfCBzdHJpbmdcbiAgfCBudW1iZXJcbiAgfCBib29sZWFuXG4gIHwgbnVsbFxuICB8IHVuZGVmaW5lZFxuICB8IEFycmF5PHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkPjtcblxudHlwZSBBcGlIdHRwTWV0aG9kID0gXCJHRVRcIiB8IFwiUE9TVFwiIHwgXCJQQVRDSFwiIHwgXCJQVVRcIiB8IFwiREVMRVRFXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXBpUmVxdWVzdE9wdGlvbnM8VEJvZHkgPSB1bmtub3duPiB7XG4gIG1ldGhvZD86IEFwaUh0dHBNZXRob2Q7XG4gIHBhdGg6IHN0cmluZztcbiAgYm9keT86IFRCb2R5O1xuICBmb3JtRGF0YT86IEZvcm1EYXRhO1xuICBoZWFkZXJzPzogSGVhZGVyc0luaXQ7XG4gIHRva2VuPzogc3RyaW5nIHwgbnVsbDtcbiAgcXVlcnk/OiBSZWNvcmQ8c3RyaW5nLCBRdWVyeVZhbHVlPjtcbiAgc2lnbmFsPzogQWJvcnRTaWduYWw7XG59XG5cbnR5cGUgRXJyb3JQYXlsb2FkID0ge1xuICBlcnJvcj86IHN0cmluZztcbiAgbWVzc2FnZT86IHN0cmluZztcbn07XG5cbmV4cG9ydCBjbGFzcyBBcGlFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgcmVhZG9ubHkgc3RhdHVzOiBudW1iZXI7XG4gIHJlYWRvbmx5IHN0YXR1c1RleHQ6IHN0cmluZztcbiAgcmVhZG9ubHkgcGF5bG9hZDogdW5rbm93bjtcblxuICBjb25zdHJ1Y3RvcihzdGF0dXM6IG51bWJlciwgc3RhdHVzVGV4dDogc3RyaW5nLCBwYXlsb2FkOiB1bmtub3duKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICAoaXNFcnJvclBheWxvYWQocGF5bG9hZCkgJiYgKHBheWxvYWQuZXJyb3IgPz8gcGF5bG9hZC5tZXNzYWdlKSkgfHxcbiAgICAgIGAke3N0YXR1c30gJHtzdGF0dXNUZXh0fWAudHJpbSgpO1xuXG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5uYW1lID0gXCJBcGlFcnJvclwiO1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgIHRoaXMuc3RhdHVzVGV4dCA9IHN0YXR1c1RleHQ7XG4gICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBpQmFzZVVybCgpIHtcbiAgY29uc3QgY29uZmlndXJlZCA9IGltcG9ydC5tZXRhLmVudj8uVklURV9BUElfQkFTRV9VUkw/LnRyaW0oKTtcbiAgY29uc3QgYmFzZVVybCA9IGNvbmZpZ3VyZWQgJiYgY29uZmlndXJlZC5sZW5ndGggPiAwID8gY29uZmlndXJlZCA6IERFRkFVTFRfQVBJX0JBU0VfVVJMO1xuXG4gIHJldHVybiBiYXNlVXJsLnJlcGxhY2UoL1xcLyskLywgXCJcIik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhcGlSZXF1ZXN0PFRSZXNwb25zZSwgVEJvZHkgPSB1bmtub3duPih7XG4gIG1ldGhvZCA9IFwiR0VUXCIsXG4gIHBhdGgsXG4gIGJvZHksXG4gIGZvcm1EYXRhLFxuICBoZWFkZXJzLFxuICB0b2tlbixcbiAgcXVlcnksXG4gIHNpZ25hbCxcbn06IEFwaVJlcXVlc3RPcHRpb25zPFRCb2R5Pik6IFByb21pc2U8VFJlc3BvbnNlPiB7XG4gIGNvbnN0IHJlcXVlc3RIZWFkZXJzID0gbmV3IEhlYWRlcnMoaGVhZGVycyk7XG5cbiAgaWYgKHRva2VuKSB7XG4gICAgcmVxdWVzdEhlYWRlcnMuc2V0KFwiQXV0aG9yaXphdGlvblwiLCBgQmVhcmVyICR7dG9rZW59YCk7XG4gIH1cblxuICBsZXQgcmVxdWVzdEJvZHk6IEJvZHlJbml0IHwgdW5kZWZpbmVkO1xuXG4gIGlmIChmb3JtRGF0YSkge1xuICAgIHJlcXVlc3RCb2R5ID0gZm9ybURhdGE7XG4gIH0gZWxzZSBpZiAoYm9keSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmVxdWVzdEhlYWRlcnMuc2V0KFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICByZXF1ZXN0Qm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xuICB9XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChidWlsZFJlcXVlc3RVcmwocGF0aCwgcXVlcnkpLCB7XG4gICAgbWV0aG9kLFxuICAgIGhlYWRlcnM6IHJlcXVlc3RIZWFkZXJzLFxuICAgIGJvZHk6IHJlcXVlc3RCb2R5LFxuICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcbiAgICBzaWduYWwsXG4gIH0pO1xuXG4gIGNvbnN0IHBheWxvYWQgPSBhd2FpdCBwYXJzZVJlc3BvbnNlQm9keShyZXNwb25zZSk7XG5cbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIHRocm93IG5ldyBBcGlFcnJvcihyZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLnN0YXR1c1RleHQsIHBheWxvYWQpO1xuICB9XG5cbiAgcmV0dXJuIHBheWxvYWQgYXMgVFJlc3BvbnNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBcGlFcnJvcihlcnJvcjogdW5rbm93bik6IGVycm9yIGlzIEFwaUVycm9yIHtcbiAgcmV0dXJuIGVycm9yIGluc3RhbmNlb2YgQXBpRXJyb3I7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFcnJvck1lc3NhZ2UoZXJyb3I6IHVua25vd24pIHtcbiAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgZXJyb3IubWVzc2FnZS50cmltKCkpIHtcbiAgICByZXR1cm4gZXJyb3IubWVzc2FnZTtcbiAgfVxuXG4gIHJldHVybiBcIlJlcXVlc3QgZmFpbGVkLlwiO1xufVxuXG5mdW5jdGlvbiBidWlsZFJlcXVlc3RVcmwocGF0aDogc3RyaW5nLCBxdWVyeT86IFJlY29yZDxzdHJpbmcsIFF1ZXJ5VmFsdWU+KSB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRQYXRoID0gcGF0aC5zdGFydHNXaXRoKFwiL1wiKSA/IHBhdGggOiBgLyR7cGF0aH1gO1xuICBjb25zdCBzZWFyY2ggPSBidWlsZFF1ZXJ5U3RyaW5nKHF1ZXJ5KTtcblxuICByZXR1cm4gYCR7Z2V0QXBpQmFzZVVybCgpfSR7bm9ybWFsaXplZFBhdGh9JHtzZWFyY2h9YDtcbn1cblxuZnVuY3Rpb24gYnVpbGRRdWVyeVN0cmluZyhxdWVyeT86IFJlY29yZDxzdHJpbmcsIFF1ZXJ5VmFsdWU+KSB7XG4gIGlmICghcXVlcnkpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuXG4gIGNvbnN0IHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcblxuICBmb3IgKGNvbnN0IFtrZXksIHJhd1ZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhxdWVyeSkpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShyYXdWYWx1ZSkpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiByYXdWYWx1ZSkge1xuICAgICAgICBhcHBlbmRRdWVyeVZhbHVlKHNlYXJjaFBhcmFtcywga2V5LCBpdGVtKTtcbiAgICAgIH1cblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgYXBwZW5kUXVlcnlWYWx1ZShzZWFyY2hQYXJhbXMsIGtleSwgcmF3VmFsdWUpO1xuICB9XG5cbiAgY29uc3Qgc2VyaWFsaXplZCA9IHNlYXJjaFBhcmFtcy50b1N0cmluZygpO1xuXG4gIHJldHVybiBzZXJpYWxpemVkID8gYD8ke3NlcmlhbGl6ZWR9YCA6IFwiXCI7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZFF1ZXJ5VmFsdWUoXG4gIHNlYXJjaFBhcmFtczogVVJMU2VhcmNoUGFyYW1zLFxuICBrZXk6IHN0cmluZyxcbiAgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkLFxuKSB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc2VhcmNoUGFyYW1zLmFwcGVuZChrZXksIFN0cmluZyh2YWx1ZSkpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBwYXJzZVJlc3BvbnNlQm9keShyZXNwb25zZTogUmVzcG9uc2UpIHtcbiAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjA0KSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IGNvbnRlbnRUeXBlID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIikgPz8gXCJcIjtcblxuICBpZiAoY29udGVudFR5cGUuaW5jbHVkZXMoXCJhcHBsaWNhdGlvbi9qc29uXCIpKSB7XG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgfVxuXG4gIGNvbnN0IHRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG5cbiAgcmV0dXJuIHRleHQubGVuZ3RoID4gMCA/IHRleHQgOiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGlzRXJyb3JQYXlsb2FkKHBheWxvYWQ6IHVua25vd24pOiBwYXlsb2FkIGlzIEVycm9yUGF5bG9hZCB7XG4gIHJldHVybiB0eXBlb2YgcGF5bG9hZCA9PT0gXCJvYmplY3RcIiAmJiBwYXlsb2FkICE9PSBudWxsO1xufVxuIiwgInZhciBMPShpPT4oaVtpLkFnZ3JlZ2F0ZUVycm9yPTFdPVwiQWdncmVnYXRlRXJyb3JcIixpW2kuQXJyb3dGdW5jdGlvbj0yXT1cIkFycm93RnVuY3Rpb25cIixpW2kuRXJyb3JQcm90b3R5cGVTdGFjaz00XT1cIkVycm9yUHJvdG90eXBlU3RhY2tcIixpW2kuT2JqZWN0QXNzaWduPThdPVwiT2JqZWN0QXNzaWduXCIsaVtpLkJpZ0ludFR5cGVkQXJyYXk9MTZdPVwiQmlnSW50VHlwZWRBcnJheVwiLGlbaS5SZWdFeHA9MzJdPVwiUmVnRXhwXCIsaSkpKEx8fHt9KTt2YXIgdj1TeW1ib2wuYXN5bmNJdGVyYXRvcixtcj1TeW1ib2wuaGFzSW5zdGFuY2UsUj1TeW1ib2wuaXNDb25jYXRTcHJlYWRhYmxlLEM9U3ltYm9sLml0ZXJhdG9yLHByPVN5bWJvbC5tYXRjaCxkcj1TeW1ib2wubWF0Y2hBbGwsZ3I9U3ltYm9sLnJlcGxhY2UseXI9U3ltYm9sLnNlYXJjaCxOcj1TeW1ib2wuc3BlY2llcyxicj1TeW1ib2wuc3BsaXQsdnI9U3ltYm9sLnRvUHJpbWl0aXZlLFA9U3ltYm9sLnRvU3RyaW5nVGFnLENyPVN5bWJvbC51bnNjb3BhYmxlczt2YXIgcnQ9ezA6XCJTeW1ib2wuYXN5bmNJdGVyYXRvclwiLDE6XCJTeW1ib2wuaGFzSW5zdGFuY2VcIiwyOlwiU3ltYm9sLmlzQ29uY2F0U3ByZWFkYWJsZVwiLDM6XCJTeW1ib2wuaXRlcmF0b3JcIiw0OlwiU3ltYm9sLm1hdGNoXCIsNTpcIlN5bWJvbC5tYXRjaEFsbFwiLDY6XCJTeW1ib2wucmVwbGFjZVwiLDc6XCJTeW1ib2wuc2VhcmNoXCIsODpcIlN5bWJvbC5zcGVjaWVzXCIsOTpcIlN5bWJvbC5zcGxpdFwiLDEwOlwiU3ltYm9sLnRvUHJpbWl0aXZlXCIsMTE6XCJTeW1ib2wudG9TdHJpbmdUYWdcIiwxMjpcIlN5bWJvbC51bnNjb3BhYmxlc1wifSx2ZT17W3ZdOjAsW21yXToxLFtSXToyLFtDXTozLFtwcl06NCxbZHJdOjUsW2dyXTo2LFt5cl06NyxbTnJdOjgsW2JyXTo5LFt2cl06MTAsW1BdOjExLFtDcl06MTJ9LHR0PXswOnYsMTptciwyOlIsMzpDLDQ6cHIsNTpkciw2OmdyLDc6eXIsODpOciw5OmJyLDEwOnZyLDExOlAsMTI6Q3J9LG50PXsyOlwiITBcIiwzOlwiITFcIiwxOlwidm9pZCAwXCIsMDpcIm51bGxcIiw0OlwiLTBcIiw1OlwiMS8wXCIsNjpcIi0xLzBcIiw3OlwiMC8wXCJ9LG89dm9pZCAwLG90PXsyOiEwLDM6ITEsMTpvLDA6bnVsbCw0Oi0wLDU6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLDY6TnVtYmVyLk5FR0FUSVZFX0lORklOSVRZLDc6TnVtYmVyLk5hTn07dmFyIENlPXswOlwiRXJyb3JcIiwxOlwiRXZhbEVycm9yXCIsMjpcIlJhbmdlRXJyb3JcIiwzOlwiUmVmZXJlbmNlRXJyb3JcIiw0OlwiU3ludGF4RXJyb3JcIiw1OlwiVHlwZUVycm9yXCIsNjpcIlVSSUVycm9yXCJ9LGF0PXswOkVycm9yLDE6RXZhbEVycm9yLDI6UmFuZ2VFcnJvciwzOlJlZmVyZW5jZUVycm9yLDQ6U3ludGF4RXJyb3IsNTpUeXBlRXJyb3IsNjpVUklFcnJvcn07ZnVuY3Rpb24gYyhlLHIsdCxuLGEscyxpLHUsbCxnLFMsZCl7cmV0dXJue3Q6ZSxpOnIsczp0LGM6bixtOmEscDpzLGU6aSxhOnUsZjpsLGI6ZyxvOlMsbDpkfX1mdW5jdGlvbiBGKGUpe3JldHVybiBjKDIsbyxlLG8sbyxvLG8sbyxvLG8sbyxvKX12YXIgSj1GKDIpLFo9RigzKSxBZT1GKDEpLEVlPUYoMCksc3Q9Rig0KSxpdD1GKDUpLHV0PUYoNiksbHQ9Rig3KTtmdW5jdGlvbiBmbihlKXtzd2l0Y2goZSl7Y2FzZSdcIic6cmV0dXJuJ1xcXFxcIic7Y2FzZVwiXFxcXFwiOnJldHVyblwiXFxcXFxcXFxcIjtjYXNlYFxuYDpyZXR1cm5cIlxcXFxuXCI7Y2FzZVwiXFxyXCI6cmV0dXJuXCJcXFxcclwiO2Nhc2VcIlxcYlwiOnJldHVyblwiXFxcXGJcIjtjYXNlXCJcdFwiOnJldHVyblwiXFxcXHRcIjtjYXNlXCJcXGZcIjpyZXR1cm5cIlxcXFxmXCI7Y2FzZVwiPFwiOnJldHVyblwiXFxcXHgzQ1wiO2Nhc2VcIlxcdTIwMjhcIjpyZXR1cm5cIlxcXFx1MjAyOFwiO2Nhc2VcIlxcdTIwMjlcIjpyZXR1cm5cIlxcXFx1MjAyOVwiO2RlZmF1bHQ6cmV0dXJuIG99fWZ1bmN0aW9uIHkoZSl7bGV0IHI9XCJcIix0PTAsbjtmb3IobGV0IGE9MCxzPWUubGVuZ3RoO2E8czthKyspbj1mbihlW2FdKSxuJiYocis9ZS5zbGljZSh0LGEpK24sdD1hKzEpO3JldHVybiB0PT09MD9yPWU6cis9ZS5zbGljZSh0KSxyfWZ1bmN0aW9uIFNuKGUpe3N3aXRjaChlKXtjYXNlXCJcXFxcXFxcXFwiOnJldHVyblwiXFxcXFwiO2Nhc2UnXFxcXFwiJzpyZXR1cm4nXCInO2Nhc2VcIlxcXFxuXCI6cmV0dXJuYFxuYDtjYXNlXCJcXFxcclwiOnJldHVyblwiXFxyXCI7Y2FzZVwiXFxcXGJcIjpyZXR1cm5cIlxcYlwiO2Nhc2VcIlxcXFx0XCI6cmV0dXJuXCJcdFwiO2Nhc2VcIlxcXFxmXCI6cmV0dXJuXCJcXGZcIjtjYXNlXCJcXFxceDNDXCI6cmV0dXJuXCI8XCI7Y2FzZVwiXFxcXHUyMDI4XCI6cmV0dXJuXCJcXHUyMDI4XCI7Y2FzZVwiXFxcXHUyMDI5XCI6cmV0dXJuXCJcXHUyMDI5XCI7ZGVmYXVsdDpyZXR1cm4gZX19ZnVuY3Rpb24gQihlKXtyZXR1cm4gZS5yZXBsYWNlKC8oXFxcXFxcXFx8XFxcXFwifFxcXFxufFxcXFxyfFxcXFxifFxcXFx0fFxcXFxmfFxcXFx1MjAyOHxcXFxcdTIwMjl8XFxcXHgzQykvZyxTbil9dmFyIFU9XCJfX1NFUk9WQUxfUkVGU19fXCIsY2U9XCIkUlwiLEllPWBzZWxmLiR7Y2V9YDtmdW5jdGlvbiBtbihlKXtyZXR1cm4gZT09bnVsbD9gJHtJZX09JHtJZX18fFtdYDpgKCR7SWV9PSR7SWV9fHx7fSlbXCIke3koZSl9XCJdPVtdYH12YXIgQXI9bmV3IE1hcCxqPW5ldyBNYXA7ZnVuY3Rpb24gcG4oZSxyKXtyZXR1cm4gQXIuc2V0KHIsZSksai5zZXQoZSxyKSxyfWZ1bmN0aW9uIEVyKGUpe3JldHVybiBBci5oYXMoZSl9ZnVuY3Rpb24gZG4oZSl7cmV0dXJuIGouaGFzKGUpfWZ1bmN0aW9uIGN0KGUpe2lmKEVyKGUpKXJldHVybiBBci5nZXQoZSk7dGhyb3cgbmV3IFJlKGUpfWZ1bmN0aW9uIGZ0KGUpe2lmKGRuKGUpKXJldHVybiBqLmdldChlKTt0aHJvdyBuZXcgUGUoZSl9dHlwZW9mIGdsb2JhbFRoaXMhPVwidW5kZWZpbmVkXCI/T2JqZWN0LmRlZmluZVByb3BlcnR5KGdsb2JhbFRoaXMsVSx7dmFsdWU6aixjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITEsZW51bWVyYWJsZTohMX0pOnR5cGVvZiB3aW5kb3chPVwidW5kZWZpbmVkXCI/T2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdyxVLHt2YWx1ZTpqLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMSxlbnVtZXJhYmxlOiExfSk6dHlwZW9mIHNlbGYhPVwidW5kZWZpbmVkXCI/T2JqZWN0LmRlZmluZVByb3BlcnR5KHNlbGYsVSx7dmFsdWU6aixjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITEsZW51bWVyYWJsZTohMX0pOnR5cGVvZiBnbG9iYWwhPVwidW5kZWZpbmVkXCImJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShnbG9iYWwsVSx7dmFsdWU6aixjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITEsZW51bWVyYWJsZTohMX0pO2Z1bmN0aW9uIHhlKGUpe3JldHVybiBlIGluc3RhbmNlb2YgRXZhbEVycm9yPzE6ZSBpbnN0YW5jZW9mIFJhbmdlRXJyb3I/MjplIGluc3RhbmNlb2YgUmVmZXJlbmNlRXJyb3I/MzplIGluc3RhbmNlb2YgU3ludGF4RXJyb3I/NDplIGluc3RhbmNlb2YgVHlwZUVycm9yPzU6ZSBpbnN0YW5jZW9mIFVSSUVycm9yPzY6MH1mdW5jdGlvbiBnbihlKXtsZXQgcj1DZVt4ZShlKV07cmV0dXJuIGUubmFtZSE9PXI/e25hbWU6ZS5uYW1lfTplLmNvbnN0cnVjdG9yLm5hbWUhPT1yP3tuYW1lOmUuY29uc3RydWN0b3IubmFtZX06e319ZnVuY3Rpb24gJChlLHIpe2xldCB0PWduKGUpLG49T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZSk7Zm9yKGxldCBhPTAscz1uLmxlbmd0aCxpO2E8czthKyspaT1uW2FdLGkhPT1cIm5hbWVcIiYmaSE9PVwibWVzc2FnZVwiJiYoaT09PVwic3RhY2tcIj9yJjQmJih0PXR8fHt9LHRbaV09ZVtpXSk6KHQ9dHx8e30sdFtpXT1lW2ldKSk7cmV0dXJuIHR9ZnVuY3Rpb24gT2UoZSl7cmV0dXJuIE9iamVjdC5pc0Zyb3plbihlKT8zOk9iamVjdC5pc1NlYWxlZChlKT8yOk9iamVjdC5pc0V4dGVuc2libGUoZSk/MDoxfWZ1bmN0aW9uIFRlKGUpe3N3aXRjaChlKXtjYXNlIE51bWJlci5QT1NJVElWRV9JTkZJTklUWTpyZXR1cm4gaXQ7Y2FzZSBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFk6cmV0dXJuIHV0fXJldHVybiBlIT09ZT9sdDpPYmplY3QuaXMoZSwtMCk/c3Q6YygwLG8sZSxvLG8sbyxvLG8sbyxvLG8sbyl9ZnVuY3Rpb24gWChlKXtyZXR1cm4gYygxLG8seShlKSxvLG8sbyxvLG8sbyxvLG8sbyl9ZnVuY3Rpb24gd2UoZSl7cmV0dXJuIGMoMyxvLFwiXCIrZSxvLG8sbyxvLG8sbyxvLG8sbyl9ZnVuY3Rpb24gbXQoZSl7cmV0dXJuIGMoNCxlLG8sbyxvLG8sbyxvLG8sbyxvLG8pfWZ1bmN0aW9uIGhlKGUscil7bGV0IHQ9ci52YWx1ZU9mKCk7cmV0dXJuIGMoNSxlLHQhPT10P1wiXCI6ci50b0lTT1N0cmluZygpLG8sbyxvLG8sbyxvLG8sbyxvKX1mdW5jdGlvbiB6ZShlLHIpe3JldHVybiBjKDYsZSxvLHkoci5zb3VyY2UpLHIuZmxhZ3MsbyxvLG8sbyxvLG8sbyl9ZnVuY3Rpb24gcHQoZSxyKXtyZXR1cm4gYygxNyxlLHZlW3JdLG8sbyxvLG8sbyxvLG8sbyxvKX1mdW5jdGlvbiBkdChlLHIpe3JldHVybiBjKDE4LGUseShjdChyKSksbyxvLG8sbyxvLG8sbyxvLG8pfWZ1bmN0aW9uIGZlKGUscix0KXtyZXR1cm4gYygyNSxlLHQseShyKSxvLG8sbyxvLG8sbyxvLG8pfWZ1bmN0aW9uIF9lKGUscix0KXtyZXR1cm4gYyg5LGUsbyxvLG8sbyxvLHQsbyxvLE9lKHIpLG8pfWZ1bmN0aW9uIGtlKGUscil7cmV0dXJuIGMoMjEsZSxvLG8sbyxvLG8sbyxyLG8sbyxvKX1mdW5jdGlvbiBEZShlLHIsdCl7cmV0dXJuIGMoMTUsZSxvLHIuY29uc3RydWN0b3IubmFtZSxvLG8sbyxvLHQsci5ieXRlT2Zmc2V0LG8sci5sZW5ndGgpfWZ1bmN0aW9uIEZlKGUscix0KXtyZXR1cm4gYygxNixlLG8sci5jb25zdHJ1Y3Rvci5uYW1lLG8sbyxvLG8sdCxyLmJ5dGVPZmZzZXQsbyxyLmJ5dGVMZW5ndGgpfWZ1bmN0aW9uIEJlKGUscix0KXtyZXR1cm4gYygyMCxlLG8sbyxvLG8sbyxvLHQsci5ieXRlT2Zmc2V0LG8sci5ieXRlTGVuZ3RoKX1mdW5jdGlvbiBWZShlLHIsdCl7cmV0dXJuIGMoMTMsZSx4ZShyKSxvLHkoci5tZXNzYWdlKSx0LG8sbyxvLG8sbyxvKX1mdW5jdGlvbiBNZShlLHIsdCl7cmV0dXJuIGMoMTQsZSx4ZShyKSxvLHkoci5tZXNzYWdlKSx0LG8sbyxvLG8sbyxvKX1mdW5jdGlvbiBMZShlLHIpe3JldHVybiBjKDcsZSxvLG8sbyxvLG8scixvLG8sbyxvKX1mdW5jdGlvbiBVZShlLHIpe3JldHVybiBjKDI4LG8sbyxvLG8sbyxvLFtlLHJdLG8sbyxvLG8pfWZ1bmN0aW9uIGplKGUscil7cmV0dXJuIGMoMzAsbyxvLG8sbyxvLG8sW2Uscl0sbyxvLG8sbyl9ZnVuY3Rpb24gWWUoZSxyLHQpe3JldHVybiBjKDMxLGUsbyxvLG8sbyxvLHQscixvLG8sbyl9ZnVuY3Rpb24gcWUoZSxyKXtyZXR1cm4gYygzMixlLG8sbyxvLG8sbyxvLHIsbyxvLG8pfWZ1bmN0aW9uIFdlKGUscil7cmV0dXJuIGMoMzMsZSxvLG8sbyxvLG8sbyxyLG8sbyxvKX1mdW5jdGlvbiBHZShlLHIpe3JldHVybiBjKDM0LGUsbyxvLG8sbyxvLG8scixvLG8sbyl9ZnVuY3Rpb24gS2UoZSxyLHQsbil7cmV0dXJuIGMoMzUsZSx0LG8sbyxvLG8scixvLG8sbyxuKX12YXJ7dG9TdHJpbmc6eXN9PU9iamVjdC5wcm90b3R5cGU7dmFyIHluPXtwYXJzaW5nOjEsc2VyaWFsaXphdGlvbjoyLGRlc2VyaWFsaXphdGlvbjozfTtmdW5jdGlvbiBObihlKXtyZXR1cm5gU2Vyb3ZhbCBFcnJvciAoc3RlcDogJHt5bltlXX0pYH12YXIgYm49KGUscik9Pk5uKGUpLFNlPWNsYXNzIGV4dGVuZHMgRXJyb3J7Y29uc3RydWN0b3IodCxuKXtzdXBlcihibih0LG4pKTt0aGlzLmNhdXNlPW59fSx6PWNsYXNzIGV4dGVuZHMgU2V7Y29uc3RydWN0b3Iocil7c3VwZXIoXCJwYXJzaW5nXCIscil9fSxJcj1jbGFzcyBleHRlbmRzIFNle2NvbnN0cnVjdG9yKHIpe3N1cGVyKFwic2VyaWFsaXphdGlvblwiLHIpfX0sSGU9Y2xhc3MgZXh0ZW5kcyBTZXtjb25zdHJ1Y3RvcihyKXtzdXBlcihcImRlc2VyaWFsaXphdGlvblwiLHIpfX07ZnVuY3Rpb24gXyhlKXtyZXR1cm5gU2Vyb3ZhbCBFcnJvciAoc3BlY2lmaWM6ICR7ZX0pYH12YXIgeD1jbGFzcyBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKHQpe3N1cGVyKF8oMSkpO3RoaXMudmFsdWU9dH19LHc9Y2xhc3MgZXh0ZW5kcyBFcnJvcntjb25zdHJ1Y3RvcihyKXtzdXBlcihfKDIpKX19LFE9Y2xhc3MgZXh0ZW5kcyBFcnJvcntjb25zdHJ1Y3RvcihyKXtzdXBlcihfKDMpKX19LFY9Y2xhc3MgZXh0ZW5kcyBFcnJvcntjb25zdHJ1Y3RvcihyKXtzdXBlcihfKDQpKX19LFJlPWNsYXNzIGV4dGVuZHMgRXJyb3J7Y29uc3RydWN0b3IodCl7c3VwZXIoXyg1KSk7dGhpcy52YWx1ZT10fX0sUGU9Y2xhc3MgZXh0ZW5kcyBFcnJvcntjb25zdHJ1Y3RvcihyKXtzdXBlcihfKDYpKX19LEplPWNsYXNzIGV4dGVuZHMgRXJyb3J7Y29uc3RydWN0b3Iocil7c3VwZXIoXyg3KSl9fSxoPWNsYXNzIGV4dGVuZHMgRXJyb3J7Y29uc3RydWN0b3Iocil7c3VwZXIoXyg4KSl9fSxndD1jbGFzcyBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKHIpe3N1cGVyKF8oOSkpfX0sZWU9Y2xhc3MgZXh0ZW5kcyBFcnJvcntjb25zdHJ1Y3RvcihyKXtzdXBlcihfKDkpKX19O3ZhciBZPWNsYXNze2NvbnN0cnVjdG9yKHIsdCl7dGhpcy52YWx1ZT1yO3RoaXMucmVwbGFjZW1lbnQ9dH19O3ZhciByZT0oKT0+e2xldCBlPXtwOjAsczowLGY6MH07cmV0dXJuIGUucD1uZXcgUHJvbWlzZSgocix0KT0+e2Uucz1yLGUuZj10fSksZX0sdm49KGUscik9PntlLnMociksZS5wLnM9MSxlLnAudj1yfSxDbj0oZSxyKT0+e2UuZihyKSxlLnAucz0yLGUucC52PXJ9LHl0PXJlLnRvU3RyaW5nKCksTnQ9dm4udG9TdHJpbmcoKSxidD1Dbi50b1N0cmluZygpLFJyPSgpPT57bGV0IGU9W10scj1bXSx0PSEwLG49ITEsYT0wLHM9KGwsZyxTKT0+e2ZvcihTPTA7UzxhO1MrKylyW1NdJiZyW1NdW2ddKGwpfSxpPShsLGcsUyxkKT0+e2ZvcihnPTAsUz1lLmxlbmd0aDtnPFM7ZysrKWQ9ZVtnXSwhdCYmZz09PVMtMT9sW24/XCJyZXR1cm5cIjpcInRocm93XCJdKGQpOmwubmV4dChkKX0sdT0obCxnKT0+KHQmJihnPWErKyxyW2ddPWwpLGkobCksKCk9Pnt0JiYocltnXT1yW2FdLHJbYS0tXT12b2lkIDApfSk7cmV0dXJue19fU0VST1ZBTF9TVFJFQU1fXzohMCxvbjpsPT51KGwpLG5leHQ6bD0+e3QmJihlLnB1c2gobCkscyhsLFwibmV4dFwiKSl9LHRocm93Omw9Pnt0JiYoZS5wdXNoKGwpLHMobCxcInRocm93XCIpLHQ9ITEsbj0hMSxyLmxlbmd0aD0wKX0scmV0dXJuOmw9Pnt0JiYoZS5wdXNoKGwpLHMobCxcInJldHVyblwiKSx0PSExLG49ITAsci5sZW5ndGg9MCl9fX0sdnQ9UnIudG9TdHJpbmcoKSxQcj1lPT5yPT4oKT0+e2xldCB0PTAsbj17W2VdOigpPT5uLG5leHQ6KCk9PntpZih0PnIuZClyZXR1cm57ZG9uZTohMCx2YWx1ZTp2b2lkIDB9O2xldCBhPXQrKyxzPXIudlthXTtpZihhPT09ci50KXRocm93IHM7cmV0dXJue2RvbmU6YT09PXIuZCx2YWx1ZTpzfX19O3JldHVybiBufSxDdD1Qci50b1N0cmluZygpLHhyPShlLHIpPT50PT4oKT0+e2xldCBuPTAsYT0tMSxzPSExLGk9W10sdT1bXSxsPShTPTAsZD11Lmxlbmd0aCk9Pntmb3IoO1M8ZDtTKyspdVtTXS5zKHtkb25lOiEwLHZhbHVlOnZvaWQgMH0pfTt0Lm9uKHtuZXh0OlM9PntsZXQgZD11LnNoaWZ0KCk7ZCYmZC5zKHtkb25lOiExLHZhbHVlOlN9KSxpLnB1c2goUyl9LHRocm93OlM9PntsZXQgZD11LnNoaWZ0KCk7ZCYmZC5mKFMpLGwoKSxhPWkubGVuZ3RoLHM9ITAsaS5wdXNoKFMpfSxyZXR1cm46Uz0+e2xldCBkPXUuc2hpZnQoKTtkJiZkLnMoe2RvbmU6ITAsdmFsdWU6U30pLGwoKSxhPWkubGVuZ3RoLGkucHVzaChTKX19KTtsZXQgZz17W2VdOigpPT5nLG5leHQ6KCk9PntpZihhPT09LTEpe2xldCBLPW4rKztpZihLPj1pLmxlbmd0aCl7bGV0IGV0PXIoKTtyZXR1cm4gdS5wdXNoKGV0KSxldC5wfXJldHVybntkb25lOiExLHZhbHVlOmlbS119fWlmKG4+YSlyZXR1cm57ZG9uZTohMCx2YWx1ZTp2b2lkIDB9O2xldCBTPW4rKyxkPWlbU107aWYoUyE9PWEpcmV0dXJue2RvbmU6ITEsdmFsdWU6ZH07aWYocyl0aHJvdyBkO3JldHVybntkb25lOiEwLHZhbHVlOmR9fX07cmV0dXJuIGd9LEF0PXhyLnRvU3RyaW5nKCksT3I9ZT0+e2xldCByPWF0b2IoZSksdD1yLmxlbmd0aCxuPW5ldyBVaW50OEFycmF5KHQpO2ZvcihsZXQgYT0wO2E8dDthKyspblthXT1yLmNoYXJDb2RlQXQoYSk7cmV0dXJuIG4uYnVmZmVyfSxFdD1Pci50b1N0cmluZygpO2Z1bmN0aW9uIFplKGUpe3JldHVyblwiX19TRVJPVkFMX1NFUVVFTkNFX19cImluIGV9ZnVuY3Rpb24gVHIoZSxyLHQpe3JldHVybntfX1NFUk9WQUxfU0VRVUVOQ0VfXzohMCx2OmUsdDpyLGQ6dH19ZnVuY3Rpb24gJGUoZSl7bGV0IHI9W10sdD0tMSxuPS0xLGE9ZVtDXSgpO2Zvcig7Oyl0cnl7bGV0IHM9YS5uZXh0KCk7aWYoci5wdXNoKHMudmFsdWUpLHMuZG9uZSl7bj1yLmxlbmd0aC0xO2JyZWFrfX1jYXRjaChzKXt0PXIubGVuZ3RoLHIucHVzaChzKX1yZXR1cm4gVHIocix0LG4pfXZhciBBbj1QcihDKTtmdW5jdGlvbiBJdChlKXtyZXR1cm4gQW4oZSl9dmFyIFJ0PXt9LFB0PXt9O3ZhciB4dD17MDp7fSwxOnt9LDI6e30sMzp7fSw0Ont9LDU6e319LE90PXswOlwiW11cIiwxOnl0LDI6TnQsMzpidCw0OnZ0LDU6RXR9O2Z1bmN0aW9uIE0oZSl7cmV0dXJuXCJfX1NFUk9WQUxfU1RSRUFNX19cImluIGV9ZnVuY3Rpb24gdGUoKXtyZXR1cm4gUnIoKX1mdW5jdGlvbiBYZShlKXtsZXQgcj10ZSgpLHQ9ZVt2XSgpO2FzeW5jIGZ1bmN0aW9uIG4oKXt0cnl7bGV0IGE9YXdhaXQgdC5uZXh0KCk7YS5kb25lP3IucmV0dXJuKGEudmFsdWUpOihyLm5leHQoYS52YWx1ZSksYXdhaXQgbigpKX1jYXRjaChhKXtyLnRocm93KGEpfX1yZXR1cm4gbigpLmNhdGNoKCgpPT57fSkscn12YXIgRW49eHIodixyZSk7ZnVuY3Rpb24gVHQoZSl7cmV0dXJuIEVuKGUpfWFzeW5jIGZ1bmN0aW9uIHdyKGUpe3RyeXtyZXR1cm5bMSxhd2FpdCBlXX1jYXRjaChyKXtyZXR1cm5bMCxyXX19ZnVuY3Rpb24gcGUoZSxyKXtyZXR1cm57cGx1Z2luczpyLnBsdWdpbnMsbW9kZTplLG1hcmtlZDpuZXcgU2V0LGZlYXR1cmVzOjYzXihyLmRpc2FibGVkRmVhdHVyZXN8fDApLHJlZnM6ci5yZWZzfHxuZXcgTWFwLGRlcHRoTGltaXQ6ci5kZXB0aExpbWl0fHwxZTN9fWZ1bmN0aW9uIGRlKGUscil7ZS5tYXJrZWQuYWRkKHIpfWZ1bmN0aW9uIGhyKGUscil7bGV0IHQ9ZS5yZWZzLnNpemU7cmV0dXJuIGUucmVmcy5zZXQocix0KSx0fWZ1bmN0aW9uIFFlKGUscil7bGV0IHQ9ZS5yZWZzLmdldChyKTtyZXR1cm4gdCE9bnVsbD8oZGUoZSx0KSx7dHlwZToxLHZhbHVlOm10KHQpfSk6e3R5cGU6MCx2YWx1ZTpocihlLHIpfX1mdW5jdGlvbiBxKGUscil7bGV0IHQ9UWUoZSxyKTtyZXR1cm4gdC50eXBlPT09MT90OkVyKHIpP3t0eXBlOjIsdmFsdWU6ZHQodC52YWx1ZSxyKX06dH1mdW5jdGlvbiBJKGUscil7bGV0IHQ9cShlLHIpO2lmKHQudHlwZSE9PTApcmV0dXJuIHQudmFsdWU7aWYociBpbiB2ZSlyZXR1cm4gcHQodC52YWx1ZSxyKTt0aHJvdyBuZXcgeChyKX1mdW5jdGlvbiBrKGUscil7bGV0IHQ9UWUoZSx4dFtyXSk7cmV0dXJuIHQudHlwZT09PTE/dC52YWx1ZTpjKDI2LHQudmFsdWUscixvLG8sbyxvLG8sbyxvLG8sbyl9ZnVuY3Rpb24gZXIoZSl7bGV0IHI9UWUoZSxSdCk7cmV0dXJuIHIudHlwZT09PTE/ci52YWx1ZTpjKDI3LHIudmFsdWUsbyxvLG8sbyxvLG8sSShlLEMpLG8sbyxvKX1mdW5jdGlvbiBycihlKXtsZXQgcj1RZShlLFB0KTtyZXR1cm4gci50eXBlPT09MT9yLnZhbHVlOmMoMjksci52YWx1ZSxvLG8sbyxvLG8sW2soZSwxKSxJKGUsdildLG8sbyxvLG8pfWZ1bmN0aW9uIHRyKGUscix0LG4pe3JldHVybiBjKHQ/MTE6MTAsZSxvLG8sbyxuLG8sbyxvLG8sT2Uociksbyl9ZnVuY3Rpb24gbnIoZSxyLHQsbil7cmV0dXJuIGMoOCxyLG8sbyxvLG8se2s6dCx2Om59LG8sayhlLDApLG8sbyxvKX1mdW5jdGlvbiBodChlLHIsdCl7cmV0dXJuIGMoMjIscix0LG8sbyxvLG8sbyxrKGUsMSksbyxvLG8pfWZ1bmN0aW9uIG9yKGUscix0KXtsZXQgbj1uZXcgVWludDhBcnJheSh0KSxhPVwiXCI7Zm9yKGxldCBzPTAsaT1uLmxlbmd0aDtzPGk7cysrKWErPVN0cmluZy5mcm9tQ2hhckNvZGUobltzXSk7cmV0dXJuIGMoMTkscix5KGJ0b2EoYSkpLG8sbyxvLG8sbyxrKGUsNSksbyxvLG8pfWZ1bmN0aW9uIG5lKGUscil7cmV0dXJue2Jhc2U6cGUoZSxyKSxjaGlsZDp2b2lkIDB9fXZhciBfcj1jbGFzc3tjb25zdHJ1Y3RvcihyLHQpe3RoaXMuX3A9cjt0aGlzLmRlcHRoPXR9cGFyc2Uocil7cmV0dXJuIE4odGhpcy5fcCx0aGlzLmRlcHRoLHIpfX07YXN5bmMgZnVuY3Rpb24gUm4oZSxyLHQpe2xldCBuPVtdO2ZvcihsZXQgYT0wLHM9dC5sZW5ndGg7YTxzO2ErKylhIGluIHQ/blthXT1hd2FpdCBOKGUscix0W2FdKTpuW2FdPTA7cmV0dXJuIG59YXN5bmMgZnVuY3Rpb24gUG4oZSxyLHQsbil7cmV0dXJuIF9lKHQsbixhd2FpdCBSbihlLHIsbikpfWFzeW5jIGZ1bmN0aW9uIGtyKGUscix0KXtsZXQgbj1PYmplY3QuZW50cmllcyh0KSxhPVtdLHM9W107Zm9yKGxldCBpPTAsdT1uLmxlbmd0aDtpPHU7aSsrKWEucHVzaCh5KG5baV1bMF0pKSxzLnB1c2goYXdhaXQgTihlLHIsbltpXVsxXSkpO3JldHVybiBDIGluIHQmJihhLnB1c2goSShlLmJhc2UsQykpLHMucHVzaChVZShlcihlLmJhc2UpLGF3YWl0IE4oZSxyLCRlKHQpKSkpKSx2IGluIHQmJihhLnB1c2goSShlLmJhc2UsdikpLHMucHVzaChqZShycihlLmJhc2UpLGF3YWl0IE4oZSxyLFhlKHQpKSkpKSxQIGluIHQmJihhLnB1c2goSShlLmJhc2UsUCkpLHMucHVzaChYKHRbUF0pKSksUiBpbiB0JiYoYS5wdXNoKEkoZS5iYXNlLFIpKSxzLnB1c2godFtSXT9KOlopKSx7azphLHY6c319YXN5bmMgZnVuY3Rpb24genIoZSxyLHQsbixhKXtyZXR1cm4gdHIodCxuLGEsYXdhaXQga3IoZSxyLG4pKX1hc3luYyBmdW5jdGlvbiB4bihlLHIsdCxuKXtyZXR1cm4ga2UodCxhd2FpdCBOKGUscixuLnZhbHVlT2YoKSkpfWFzeW5jIGZ1bmN0aW9uIE9uKGUscix0LG4pe3JldHVybiBEZSh0LG4sYXdhaXQgTihlLHIsbi5idWZmZXIpKX1hc3luYyBmdW5jdGlvbiBUbihlLHIsdCxuKXtyZXR1cm4gRmUodCxuLGF3YWl0IE4oZSxyLG4uYnVmZmVyKSl9YXN5bmMgZnVuY3Rpb24gd24oZSxyLHQsbil7cmV0dXJuIEJlKHQsbixhd2FpdCBOKGUscixuLmJ1ZmZlcikpfWFzeW5jIGZ1bmN0aW9uIHp0KGUscix0LG4pe2xldCBhPSQobixlLmJhc2UuZmVhdHVyZXMpO3JldHVybiBWZSh0LG4sYT9hd2FpdCBrcihlLHIsYSk6byl9YXN5bmMgZnVuY3Rpb24gaG4oZSxyLHQsbil7bGV0IGE9JChuLGUuYmFzZS5mZWF0dXJlcyk7cmV0dXJuIE1lKHQsbixhP2F3YWl0IGtyKGUscixhKTpvKX1hc3luYyBmdW5jdGlvbiB6bihlLHIsdCxuKXtsZXQgYT1bXSxzPVtdO2ZvcihsZXRbaSx1XW9mIG4uZW50cmllcygpKWEucHVzaChhd2FpdCBOKGUscixpKSkscy5wdXNoKGF3YWl0IE4oZSxyLHUpKTtyZXR1cm4gbnIoZS5iYXNlLHQsYSxzKX1hc3luYyBmdW5jdGlvbiBfbihlLHIsdCxuKXtsZXQgYT1bXTtmb3IobGV0IHMgb2Ygbi5rZXlzKCkpYS5wdXNoKGF3YWl0IE4oZSxyLHMpKTtyZXR1cm4gTGUodCxhKX1hc3luYyBmdW5jdGlvbiBfdChlLHIsdCxuKXtsZXQgYT1lLmJhc2UucGx1Z2lucztpZihhKWZvcihsZXQgcz0wLGk9YS5sZW5ndGg7czxpO3MrKyl7bGV0IHU9YVtzXTtpZih1LnBhcnNlLmFzeW5jJiZ1LnRlc3QobikpcmV0dXJuIGZlKHQsdS50YWcsYXdhaXQgdS5wYXJzZS5hc3luYyhuLG5ldyBfcihlLHIpLHtpZDp0fSkpfXJldHVybiBvfWFzeW5jIGZ1bmN0aW9uIGtuKGUscix0LG4pe2xldFthLHNdPWF3YWl0IHdyKG4pO3JldHVybiBjKDEyLHQsYSxvLG8sbyxvLG8sYXdhaXQgTihlLHIscyksbyxvLG8pfWZ1bmN0aW9uIERuKGUscix0LG4sYSl7bGV0IHM9W10saT10Lm9uKHtuZXh0OnU9PntkZSh0aGlzLmJhc2UsciksTih0aGlzLGUsdSkudGhlbihsPT57cy5wdXNoKHFlKHIsbCkpfSxsPT57YShsKSxpKCl9KX0sdGhyb3c6dT0+e2RlKHRoaXMuYmFzZSxyKSxOKHRoaXMsZSx1KS50aGVuKGw9PntzLnB1c2goV2UocixsKSksbihzKSxpKCl9LGw9PnthKGwpLGkoKX0pfSxyZXR1cm46dT0+e2RlKHRoaXMuYmFzZSxyKSxOKHRoaXMsZSx1KS50aGVuKGw9PntzLnB1c2goR2UocixsKSksbihzKSxpKCl9LGw9PnthKGwpLGkoKX0pfX0pfWFzeW5jIGZ1bmN0aW9uIEZuKGUscix0LG4pe3JldHVybiBZZSh0LGsoZS5iYXNlLDQpLGF3YWl0IG5ldyBQcm9taXNlKERuLmJpbmQoZSxyLHQsbikpKX1hc3luYyBmdW5jdGlvbiBCbihlLHIsdCxuKXtsZXQgYT1bXTtmb3IobGV0IHM9MCxpPW4udi5sZW5ndGg7czxpO3MrKylhW3NdPWF3YWl0IE4oZSxyLG4udltzXSk7cmV0dXJuIEtlKHQsYSxuLnQsbi5kKX1hc3luYyBmdW5jdGlvbiBWbihlLHIsdCxuKXtpZihBcnJheS5pc0FycmF5KG4pKXJldHVybiBQbihlLHIsdCxuKTtpZihNKG4pKXJldHVybiBGbihlLHIsdCxuKTtpZihaZShuKSlyZXR1cm4gQm4oZSxyLHQsbik7bGV0IGE9bi5jb25zdHJ1Y3RvcjtpZihhPT09WSlyZXR1cm4gTihlLHIsbi5yZXBsYWNlbWVudCk7bGV0IHM9YXdhaXQgX3QoZSxyLHQsbik7aWYocylyZXR1cm4gcztzd2l0Y2goYSl7Y2FzZSBPYmplY3Q6cmV0dXJuIHpyKGUscix0LG4sITEpO2Nhc2UgbzpyZXR1cm4genIoZSxyLHQsbiwhMCk7Y2FzZSBEYXRlOnJldHVybiBoZSh0LG4pO2Nhc2UgRXJyb3I6Y2FzZSBFdmFsRXJyb3I6Y2FzZSBSYW5nZUVycm9yOmNhc2UgUmVmZXJlbmNlRXJyb3I6Y2FzZSBTeW50YXhFcnJvcjpjYXNlIFR5cGVFcnJvcjpjYXNlIFVSSUVycm9yOnJldHVybiB6dChlLHIsdCxuKTtjYXNlIE51bWJlcjpjYXNlIEJvb2xlYW46Y2FzZSBTdHJpbmc6Y2FzZSBCaWdJbnQ6cmV0dXJuIHhuKGUscix0LG4pO2Nhc2UgQXJyYXlCdWZmZXI6cmV0dXJuIG9yKGUuYmFzZSx0LG4pO2Nhc2UgSW50OEFycmF5OmNhc2UgSW50MTZBcnJheTpjYXNlIEludDMyQXJyYXk6Y2FzZSBVaW50OEFycmF5OmNhc2UgVWludDE2QXJyYXk6Y2FzZSBVaW50MzJBcnJheTpjYXNlIFVpbnQ4Q2xhbXBlZEFycmF5OmNhc2UgRmxvYXQzMkFycmF5OmNhc2UgRmxvYXQ2NEFycmF5OnJldHVybiBPbihlLHIsdCxuKTtjYXNlIERhdGFWaWV3OnJldHVybiB3bihlLHIsdCxuKTtjYXNlIE1hcDpyZXR1cm4gem4oZSxyLHQsbik7Y2FzZSBTZXQ6cmV0dXJuIF9uKGUscix0LG4pO2RlZmF1bHQ6YnJlYWt9aWYoYT09PVByb21pc2V8fG4gaW5zdGFuY2VvZiBQcm9taXNlKXJldHVybiBrbihlLHIsdCxuKTtsZXQgaT1lLmJhc2UuZmVhdHVyZXM7aWYoaSYzMiYmYT09PVJlZ0V4cClyZXR1cm4gemUodCxuKTtpZihpJjE2KXN3aXRjaChhKXtjYXNlIEJpZ0ludDY0QXJyYXk6Y2FzZSBCaWdVaW50NjRBcnJheTpyZXR1cm4gVG4oZSxyLHQsbik7ZGVmYXVsdDpicmVha31pZihpJjEmJnR5cGVvZiBBZ2dyZWdhdGVFcnJvciE9XCJ1bmRlZmluZWRcIiYmKGE9PT1BZ2dyZWdhdGVFcnJvcnx8biBpbnN0YW5jZW9mIEFnZ3JlZ2F0ZUVycm9yKSlyZXR1cm4gaG4oZSxyLHQsbik7aWYobiBpbnN0YW5jZW9mIEVycm9yKXJldHVybiB6dChlLHIsdCxuKTtpZihDIGluIG58fHYgaW4gbilyZXR1cm4genIoZSxyLHQsbiwhIWEpO3Rocm93IG5ldyB4KG4pfWFzeW5jIGZ1bmN0aW9uIE1uKGUscix0KXtsZXQgbj1xKGUuYmFzZSx0KTtpZihuLnR5cGUhPT0wKXJldHVybiBuLnZhbHVlO2xldCBhPWF3YWl0IF90KGUscixuLnZhbHVlLHQpO2lmKGEpcmV0dXJuIGE7dGhyb3cgbmV3IHgodCl9YXN5bmMgZnVuY3Rpb24gTihlLHIsdCl7c3dpdGNoKHR5cGVvZiB0KXtjYXNlXCJib29sZWFuXCI6cmV0dXJuIHQ/SjpaO2Nhc2VcInVuZGVmaW5lZFwiOnJldHVybiBBZTtjYXNlXCJzdHJpbmdcIjpyZXR1cm4gWCh0KTtjYXNlXCJudW1iZXJcIjpyZXR1cm4gVGUodCk7Y2FzZVwiYmlnaW50XCI6cmV0dXJuIHdlKHQpO2Nhc2VcIm9iamVjdFwiOntpZih0KXtsZXQgbj1xKGUuYmFzZSx0KTtyZXR1cm4gbi50eXBlPT09MD9hd2FpdCBWbihlLHIrMSxuLnZhbHVlLHQpOm4udmFsdWV9cmV0dXJuIEVlfWNhc2VcInN5bWJvbFwiOnJldHVybiBJKGUuYmFzZSx0KTtjYXNlXCJmdW5jdGlvblwiOnJldHVybiBNbihlLHIsdCk7ZGVmYXVsdDp0aHJvdyBuZXcgeCh0KX19YXN5bmMgZnVuY3Rpb24gb2UoZSxyKXt0cnl7cmV0dXJuIGF3YWl0IE4oZSwwLHIpfWNhdGNoKHQpe3Rocm93IHQgaW5zdGFuY2VvZiB6P3Q6bmV3IHoodCl9fXZhciBhZT0odD0+KHRbdC5WYW5pbGxhPTFdPVwiVmFuaWxsYVwiLHRbdC5Dcm9zcz0yXT1cIkNyb3NzXCIsdCkpKGFlfHx7fSk7ZnVuY3Rpb24gbmkoZSl7cmV0dXJuIGV9ZnVuY3Rpb24ga3QoZSxyKXtmb3IobGV0IHQ9MCxuPXIubGVuZ3RoO3Q8bjt0Kyspe2xldCBhPXJbdF07ZS5oYXMoYSl8fChlLmFkZChhKSxhLmV4dGVuZHMmJmt0KGUsYS5leHRlbmRzKSl9fWZ1bmN0aW9uIEEoZSl7aWYoZSl7bGV0IHI9bmV3IFNldDtyZXR1cm4ga3QocixlKSxbLi4ucl19fWZ1bmN0aW9uIER0KGUpe3N3aXRjaChlKXtjYXNlXCJJbnQ4QXJyYXlcIjpyZXR1cm4gSW50OEFycmF5O2Nhc2VcIkludDE2QXJyYXlcIjpyZXR1cm4gSW50MTZBcnJheTtjYXNlXCJJbnQzMkFycmF5XCI6cmV0dXJuIEludDMyQXJyYXk7Y2FzZVwiVWludDhBcnJheVwiOnJldHVybiBVaW50OEFycmF5O2Nhc2VcIlVpbnQxNkFycmF5XCI6cmV0dXJuIFVpbnQxNkFycmF5O2Nhc2VcIlVpbnQzMkFycmF5XCI6cmV0dXJuIFVpbnQzMkFycmF5O2Nhc2VcIlVpbnQ4Q2xhbXBlZEFycmF5XCI6cmV0dXJuIFVpbnQ4Q2xhbXBlZEFycmF5O2Nhc2VcIkZsb2F0MzJBcnJheVwiOnJldHVybiBGbG9hdDMyQXJyYXk7Y2FzZVwiRmxvYXQ2NEFycmF5XCI6cmV0dXJuIEZsb2F0NjRBcnJheTtjYXNlXCJCaWdJbnQ2NEFycmF5XCI6cmV0dXJuIEJpZ0ludDY0QXJyYXk7Y2FzZVwiQmlnVWludDY0QXJyYXlcIjpyZXR1cm4gQmlnVWludDY0QXJyYXk7ZGVmYXVsdDp0aHJvdyBuZXcgSmUoZSl9fXZhciBMbj0xZTYsVW49MWU0LGpuPTJlNDtmdW5jdGlvbiBCdChlLHIpe3N3aXRjaChyKXtjYXNlIDM6cmV0dXJuIE9iamVjdC5mcmVlemUoZSk7Y2FzZSAxOnJldHVybiBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoZSk7Y2FzZSAyOnJldHVybiBPYmplY3Quc2VhbChlKTtkZWZhdWx0OnJldHVybiBlfX12YXIgWW49MWUzO2Z1bmN0aW9uIFZ0KGUscil7dmFyIHQ7cmV0dXJue21vZGU6ZSxwbHVnaW5zOnIucGx1Z2lucyxyZWZzOnIucmVmc3x8bmV3IE1hcCxmZWF0dXJlczoodD1yLmZlYXR1cmVzKSE9bnVsbD90OjYzXihyLmRpc2FibGVkRmVhdHVyZXN8fDApLGRlcHRoTGltaXQ6ci5kZXB0aExpbWl0fHxZbn19ZnVuY3Rpb24gTXQoZSl7cmV0dXJue21vZGU6MSxiYXNlOlZ0KDEsZSksY2hpbGQ6byxzdGF0ZTp7bWFya2VkOm5ldyBTZXQoZS5tYXJrZWRSZWZzKX19fWZ1bmN0aW9uIEx0KGUpe3JldHVybnttb2RlOjIsYmFzZTpWdCgyLGUpLGNoaWxkOm99fXZhciBEcj1jbGFzc3tjb25zdHJ1Y3RvcihyLHQpe3RoaXMuX3A9cjt0aGlzLmRlcHRoPXR9ZGVzZXJpYWxpemUocil7cmV0dXJuIHAodGhpcy5fcCx0aGlzLmRlcHRoLHIpfX07ZnVuY3Rpb24gVXQoZSxyKXtpZihyPDB8fCFOdW1iZXIuaXNGaW5pdGUocil8fCFOdW1iZXIuaXNJbnRlZ2VyKHIpKXRocm93IG5ldyBoKHt0OjQsaTpyfSk7aWYoZS5yZWZzLmhhcyhyKSl0aHJvdyBuZXcgRXJyb3IoXCJDb25mbGljdGVkIHJlZiBpZDogXCIrcil9ZnVuY3Rpb24gcW4oZSxyLHQpe3JldHVybiBVdChlLmJhc2UsciksZS5zdGF0ZS5tYXJrZWQuaGFzKHIpJiZlLmJhc2UucmVmcy5zZXQocix0KSx0fWZ1bmN0aW9uIFduKGUscix0KXtyZXR1cm4gVXQoZS5iYXNlLHIpLGUuYmFzZS5yZWZzLnNldChyLHQpLHR9ZnVuY3Rpb24gYihlLHIsdCl7cmV0dXJuIGUubW9kZT09PTE/cW4oZSxyLHQpOlduKGUscix0KX1mdW5jdGlvbiBGcihlLHIsdCl7aWYoT2JqZWN0Lmhhc093bihyLHQpKXJldHVybiByW3RdO3Rocm93IG5ldyBoKGUpfWZ1bmN0aW9uIEduKGUscil7cmV0dXJuIGIoZSxyLmksZnQoQihyLnMpKSl9ZnVuY3Rpb24gS24oZSxyLHQpe2xldCBuPXQuYSxhPW4ubGVuZ3RoLHM9YihlLHQuaSxuZXcgQXJyYXkoYSkpO2ZvcihsZXQgaT0wLHU7aTxhO2krKyl1PW5baV0sdSYmKHNbaV09cChlLHIsdSkpO3JldHVybiBCdChzLHQubyksc31mdW5jdGlvbiBIbihlKXtzd2l0Y2goZSl7Y2FzZVwiY29uc3RydWN0b3JcIjpjYXNlXCJfX3Byb3RvX19cIjpjYXNlXCJwcm90b3R5cGVcIjpjYXNlXCJfX2RlZmluZUdldHRlcl9fXCI6Y2FzZVwiX19kZWZpbmVTZXR0ZXJfX1wiOmNhc2VcIl9fbG9va3VwR2V0dGVyX19cIjpjYXNlXCJfX2xvb2t1cFNldHRlcl9fXCI6cmV0dXJuITE7ZGVmYXVsdDpyZXR1cm4hMH19ZnVuY3Rpb24gSm4oZSl7c3dpdGNoKGUpe2Nhc2UgdjpjYXNlIFI6Y2FzZSBQOmNhc2UgQzpyZXR1cm4hMDtkZWZhdWx0OnJldHVybiExfX1mdW5jdGlvbiBGdChlLHIsdCl7SG4ocik/ZVtyXT10Ok9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLHIse3ZhbHVlOnQsY29uZmlndXJhYmxlOiEwLGVudW1lcmFibGU6ITAsd3JpdGFibGU6ITB9KX1mdW5jdGlvbiBabihlLHIsdCxuLGEpe2lmKHR5cGVvZiBuPT1cInN0cmluZ1wiKUZ0KHQsbixwKGUscixhKSk7ZWxzZXtsZXQgcz1wKGUscixuKTtzd2l0Y2godHlwZW9mIHMpe2Nhc2VcInN0cmluZ1wiOkZ0KHQscyxwKGUscixhKSk7YnJlYWs7Y2FzZVwic3ltYm9sXCI6Sm4ocykmJih0W3NdPXAoZSxyLGEpKTticmVhaztkZWZhdWx0OnRocm93IG5ldyBoKG4pfX19ZnVuY3Rpb24ganQoZSxyLHQsbil7bGV0IGE9dC5rO2lmKGEubGVuZ3RoPjApZm9yKGxldCBpPTAsdT10LnYsbD1hLmxlbmd0aDtpPGw7aSsrKVpuKGUscixuLGFbaV0sdVtpXSk7cmV0dXJuIG59ZnVuY3Rpb24gJG4oZSxyLHQpe2xldCBuPWIoZSx0LmksdC50PT09MTA/e306T2JqZWN0LmNyZWF0ZShudWxsKSk7cmV0dXJuIGp0KGUscix0LnAsbiksQnQobix0Lm8pLG59ZnVuY3Rpb24gWG4oZSxyKXtyZXR1cm4gYihlLHIuaSxuZXcgRGF0ZShyLnMpKX1mdW5jdGlvbiBRbihlLHIpe2lmKGUuYmFzZS5mZWF0dXJlcyYzMil7bGV0IHQ9QihyLmMpO2lmKHQubGVuZ3RoPmpuKXRocm93IG5ldyBoKHIpO3JldHVybiBiKGUsci5pLG5ldyBSZWdFeHAodCxyLm0pKX10aHJvdyBuZXcgdyhyKX1mdW5jdGlvbiBlbyhlLHIsdCl7bGV0IG49YihlLHQuaSxuZXcgU2V0KTtmb3IobGV0IGE9MCxzPXQuYSxpPXMubGVuZ3RoO2E8aTthKyspbi5hZGQocChlLHIsc1thXSkpO3JldHVybiBufWZ1bmN0aW9uIHJvKGUscix0KXtsZXQgbj1iKGUsdC5pLG5ldyBNYXApO2ZvcihsZXQgYT0wLHM9dC5lLmssaT10LmUudix1PXMubGVuZ3RoO2E8dTthKyspbi5zZXQocChlLHIsc1thXSkscChlLHIsaVthXSkpO3JldHVybiBufWZ1bmN0aW9uIHRvKGUscil7aWYoci5zLmxlbmd0aD5Mbil0aHJvdyBuZXcgaChyKTtyZXR1cm4gYihlLHIuaSxPcihCKHIucykpKX1mdW5jdGlvbiBubyhlLHIsdCl7dmFyIHU7bGV0IG49RHQodC5jKSxhPXAoZSxyLHQuZikscz0odT10LmIpIT1udWxsP3U6MDtpZihzPDB8fHM+YS5ieXRlTGVuZ3RoKXRocm93IG5ldyBoKHQpO3JldHVybiBiKGUsdC5pLG5ldyBuKGEscyx0LmwpKX1mdW5jdGlvbiBvbyhlLHIsdCl7dmFyIGk7bGV0IG49cChlLHIsdC5mKSxhPShpPXQuYikhPW51bGw/aTowO2lmKGE8MHx8YT5uLmJ5dGVMZW5ndGgpdGhyb3cgbmV3IGgodCk7cmV0dXJuIGIoZSx0LmksbmV3IERhdGFWaWV3KG4sYSx0LmwpKX1mdW5jdGlvbiBZdChlLHIsdCxuKXtpZih0LnApe2xldCBhPWp0KGUscix0LnAse30pO09iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG4sT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoYSkpfXJldHVybiBufWZ1bmN0aW9uIGFvKGUscix0KXtsZXQgbj1iKGUsdC5pLG5ldyBBZ2dyZWdhdGVFcnJvcihbXSxCKHQubSkpKTtyZXR1cm4gWXQoZSxyLHQsbil9ZnVuY3Rpb24gc28oZSxyLHQpe2xldCBuPUZyKHQsYXQsdC5zKSxhPWIoZSx0LmksbmV3IG4oQih0Lm0pKSk7cmV0dXJuIFl0KGUscix0LGEpfWZ1bmN0aW9uIGlvKGUscix0KXtsZXQgbj1yZSgpLGE9YihlLHQuaSxuLnApLHM9cChlLHIsdC5mKTtyZXR1cm4gdC5zP24ucyhzKTpuLmYocyksYX1mdW5jdGlvbiB1byhlLHIsdCl7cmV0dXJuIGIoZSx0LmksT2JqZWN0KHAoZSxyLHQuZikpKX1mdW5jdGlvbiBsbyhlLHIsdCl7bGV0IG49ZS5iYXNlLnBsdWdpbnM7aWYobil7bGV0IGE9Qih0LmMpO2ZvcihsZXQgcz0wLGk9bi5sZW5ndGg7czxpO3MrKyl7bGV0IHU9bltzXTtpZih1LnRhZz09PWEpcmV0dXJuIGIoZSx0LmksdS5kZXNlcmlhbGl6ZSh0LnMsbmV3IERyKGUscikse2lkOnQuaX0pKX19dGhyb3cgbmV3IFEodC5jKX1mdW5jdGlvbiBjbyhlLHIpe3JldHVybiBiKGUsci5pLGIoZSxyLnMscmUoKSkucCl9ZnVuY3Rpb24gZm8oZSxyLHQpe2xldCBuPWUuYmFzZS5yZWZzLmdldCh0LmkpO2lmKG4pcmV0dXJuIG4ucyhwKGUscix0LmFbMV0pKSxvO3Rocm93IG5ldyBWKFwiUHJvbWlzZVwiKX1mdW5jdGlvbiBTbyhlLHIsdCl7bGV0IG49ZS5iYXNlLnJlZnMuZ2V0KHQuaSk7aWYobilyZXR1cm4gbi5mKHAoZSxyLHQuYVsxXSkpLG87dGhyb3cgbmV3IFYoXCJQcm9taXNlXCIpfWZ1bmN0aW9uIG1vKGUscix0KXtwKGUscix0LmFbMF0pO2xldCBuPXAoZSxyLHQuYVsxXSk7cmV0dXJuIEl0KG4pfWZ1bmN0aW9uIHBvKGUscix0KXtwKGUscix0LmFbMF0pO2xldCBuPXAoZSxyLHQuYVsxXSk7cmV0dXJuIFR0KG4pfWZ1bmN0aW9uIGdvKGUscix0KXtsZXQgbj1iKGUsdC5pLHRlKCkpLGE9dC5hLHM9YS5sZW5ndGg7aWYocylmb3IobGV0IGk9MDtpPHM7aSsrKXAoZSxyLGFbaV0pO3JldHVybiBufWZ1bmN0aW9uIHlvKGUscix0KXtsZXQgbj1lLmJhc2UucmVmcy5nZXQodC5pKTtpZihuJiZNKG4pKXJldHVybiBuLm5leHQocChlLHIsdC5mKSksbzt0aHJvdyBuZXcgVihcIlN0cmVhbVwiKX1mdW5jdGlvbiBObyhlLHIsdCl7bGV0IG49ZS5iYXNlLnJlZnMuZ2V0KHQuaSk7aWYobiYmTShuKSlyZXR1cm4gbi50aHJvdyhwKGUscix0LmYpKSxvO3Rocm93IG5ldyBWKFwiU3RyZWFtXCIpfWZ1bmN0aW9uIGJvKGUscix0KXtsZXQgbj1lLmJhc2UucmVmcy5nZXQodC5pKTtpZihuJiZNKG4pKXJldHVybiBuLnJldHVybihwKGUscix0LmYpKSxvO3Rocm93IG5ldyBWKFwiU3RyZWFtXCIpfWZ1bmN0aW9uIHZvKGUscix0KXtyZXR1cm4gcChlLHIsdC5mKSxvfWZ1bmN0aW9uIENvKGUscix0KXtyZXR1cm4gcChlLHIsdC5hWzFdKSxvfWZ1bmN0aW9uIEFvKGUscix0KXtsZXQgbj1iKGUsdC5pLFRyKFtdLHQucyx0LmwpKTtmb3IobGV0IGE9MCxzPXQuYS5sZW5ndGg7YTxzO2ErKyluLnZbYV09cChlLHIsdC5hW2FdKTtyZXR1cm4gbn1mdW5jdGlvbiBwKGUscix0KXtpZihyPmUuYmFzZS5kZXB0aExpbWl0KXRocm93IG5ldyBlZShlLmJhc2UuZGVwdGhMaW1pdCk7c3dpdGNoKHIrPTEsdC50KXtjYXNlIDI6cmV0dXJuIEZyKHQsb3QsdC5zKTtjYXNlIDA6cmV0dXJuIE51bWJlcih0LnMpO2Nhc2UgMTpyZXR1cm4gQihTdHJpbmcodC5zKSk7Y2FzZSAzOmlmKFN0cmluZyh0LnMpLmxlbmd0aD5Vbil0aHJvdyBuZXcgaCh0KTtyZXR1cm4gQmlnSW50KHQucyk7Y2FzZSA0OnJldHVybiBlLmJhc2UucmVmcy5nZXQodC5pKTtjYXNlIDE4OnJldHVybiBHbihlLHQpO2Nhc2UgOTpyZXR1cm4gS24oZSxyLHQpO2Nhc2UgMTA6Y2FzZSAxMTpyZXR1cm4gJG4oZSxyLHQpO2Nhc2UgNTpyZXR1cm4gWG4oZSx0KTtjYXNlIDY6cmV0dXJuIFFuKGUsdCk7Y2FzZSA3OnJldHVybiBlbyhlLHIsdCk7Y2FzZSA4OnJldHVybiBybyhlLHIsdCk7Y2FzZSAxOTpyZXR1cm4gdG8oZSx0KTtjYXNlIDE2OmNhc2UgMTU6cmV0dXJuIG5vKGUscix0KTtjYXNlIDIwOnJldHVybiBvbyhlLHIsdCk7Y2FzZSAxNDpyZXR1cm4gYW8oZSxyLHQpO2Nhc2UgMTM6cmV0dXJuIHNvKGUscix0KTtjYXNlIDEyOnJldHVybiBpbyhlLHIsdCk7Y2FzZSAxNzpyZXR1cm4gRnIodCx0dCx0LnMpO2Nhc2UgMjE6cmV0dXJuIHVvKGUscix0KTtjYXNlIDI1OnJldHVybiBsbyhlLHIsdCk7Y2FzZSAyMjpyZXR1cm4gY28oZSx0KTtjYXNlIDIzOnJldHVybiBmbyhlLHIsdCk7Y2FzZSAyNDpyZXR1cm4gU28oZSxyLHQpO2Nhc2UgMjg6cmV0dXJuIG1vKGUscix0KTtjYXNlIDMwOnJldHVybiBwbyhlLHIsdCk7Y2FzZSAzMTpyZXR1cm4gZ28oZSxyLHQpO2Nhc2UgMzI6cmV0dXJuIHlvKGUscix0KTtjYXNlIDMzOnJldHVybiBObyhlLHIsdCk7Y2FzZSAzNDpyZXR1cm4gYm8oZSxyLHQpO2Nhc2UgMjc6cmV0dXJuIHZvKGUscix0KTtjYXNlIDI5OnJldHVybiBDbyhlLHIsdCk7Y2FzZSAzNTpyZXR1cm4gQW8oZSxyLHQpO2RlZmF1bHQ6dGhyb3cgbmV3IHcodCl9fWZ1bmN0aW9uIGFyKGUscil7dHJ5e3JldHVybiBwKGUsMCxyKX1jYXRjaCh0KXt0aHJvdyBuZXcgSGUodCl9fXZhciBFbz0oKT0+VCxJbz1Fby50b1N0cmluZygpLHF0PS89Pi8udGVzdChJbyk7ZnVuY3Rpb24gc3IoZSxyKXtyZXR1cm4gcXQ/KGUubGVuZ3RoPT09MT9lWzBdOlwiKFwiK2Uuam9pbihcIixcIikrXCIpXCIpK1wiPT5cIisoci5zdGFydHNXaXRoKFwie1wiKT9cIihcIityK1wiKVwiOnIpOlwiZnVuY3Rpb24oXCIrZS5qb2luKFwiLFwiKStcIil7cmV0dXJuIFwiK3IrXCJ9XCJ9ZnVuY3Rpb24gV3QoZSxyKXtyZXR1cm4gcXQ/KGUubGVuZ3RoPT09MT9lWzBdOlwiKFwiK2Uuam9pbihcIixcIikrXCIpXCIpK1wiPT57XCIrcitcIn1cIjpcImZ1bmN0aW9uKFwiK2Uuam9pbihcIixcIikrXCIpe1wiK3IrXCJ9XCJ9dmFyIEh0PVwiaGprbW9xdXh6QUJDREVGR0hJSktMTlBRUlRVVldYWVokX1wiLEd0PUh0Lmxlbmd0aCxKdD1cImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVowMTIzNDU2Nzg5JF9cIixLdD1KdC5sZW5ndGg7ZnVuY3Rpb24gQnIoZSl7bGV0IHI9ZSVHdCx0PUh0W3JdO2ZvcihlPShlLXIpL0d0O2U+MDspcj1lJUt0LHQrPUp0W3JdLGU9KGUtcikvS3Q7cmV0dXJuIHR9dmFyIFJvPS9eWyRBLVpfXVswLTlBLVpfJF0qJC9pO2Z1bmN0aW9uIFZyKGUpe2xldCByPWVbMF07cmV0dXJuKHI9PT1cIiRcInx8cj09PVwiX1wifHxyPj1cIkFcIiYmcjw9XCJaXCJ8fHI+PVwiYVwiJiZyPD1cInpcIikmJlJvLnRlc3QoZSl9ZnVuY3Rpb24geWUoZSl7c3dpdGNoKGUudCl7Y2FzZSAwOnJldHVybiBlLnMrXCI9XCIrZS52O2Nhc2UgMjpyZXR1cm4gZS5zK1wiLnNldChcIitlLmsrXCIsXCIrZS52K1wiKVwiO2Nhc2UgMTpyZXR1cm4gZS5zK1wiLmFkZChcIitlLnYrXCIpXCI7Y2FzZSAzOnJldHVybiBlLnMrXCIuZGVsZXRlKFwiK2UuaytcIilcIn19ZnVuY3Rpb24gUG8oZSl7bGV0IHI9W10sdD1lWzBdO2ZvcihsZXQgbj0xLGE9ZS5sZW5ndGgscyxpPXQ7bjxhO24rKylzPWVbbl0scy50PT09MCYmcy52PT09aS52P3Q9e3Q6MCxzOnMucyxrOm8sdjp5ZSh0KX06cy50PT09MiYmcy5zPT09aS5zP3Q9e3Q6MixzOnllKHQpLGs6cy5rLHY6cy52fTpzLnQ9PT0xJiZzLnM9PT1pLnM/dD17dDoxLHM6eWUodCksazpvLHY6cy52fTpzLnQ9PT0zJiZzLnM9PT1pLnM/dD17dDozLHM6eWUodCksazpzLmssdjpvfTooci5wdXNoKHQpLHQ9cyksaT1zO3JldHVybiByLnB1c2godCkscn1mdW5jdGlvbiB0bihlKXtpZihlLmxlbmd0aCl7bGV0IHI9XCJcIix0PVBvKGUpO2ZvcihsZXQgbj0wLGE9dC5sZW5ndGg7bjxhO24rKylyKz15ZSh0W25dKStcIixcIjtyZXR1cm4gcn1yZXR1cm4gb312YXIgeG89XCJPYmplY3QuY3JlYXRlKG51bGwpXCIsT289XCJuZXcgU2V0XCIsVG89XCJuZXcgTWFwXCIsd289XCJQcm9taXNlLnJlc29sdmVcIixobz1cIlByb21pc2UucmVqZWN0XCIsem89ezM6XCJPYmplY3QuZnJlZXplXCIsMjpcIk9iamVjdC5zZWFsXCIsMTpcIk9iamVjdC5wcmV2ZW50RXh0ZW5zaW9uc1wiLDA6b307ZnVuY3Rpb24gbm4oZSxyKXtyZXR1cm57bW9kZTplLHBsdWdpbnM6ci5wbHVnaW5zLGZlYXR1cmVzOnIuZmVhdHVyZXMsbWFya2VkOm5ldyBTZXQoci5tYXJrZWRSZWZzKSxzdGFjazpbXSxmbGFnczpbXSxhc3NpZ25tZW50czpbXX19ZnVuY3Rpb24gX28oKXtyZXR1cm57dmFsaWQ6bmV3IE1hcCx2YXJzOltdfX1mdW5jdGlvbiBpcihlKXtyZXR1cm57bW9kZToxLGJhc2U6bm4oMSxlKSxzdGF0ZTpfbygpLGNoaWxkOm99fWZ1bmN0aW9uIHVyKGUpe3JldHVybnttb2RlOjIsYmFzZTpubigyLGUpLHN0YXRlOmUsY2hpbGQ6b319dmFyIE1yPWNsYXNze2NvbnN0cnVjdG9yKHIpe3RoaXMuX3A9cn1zZXJpYWxpemUocil7cmV0dXJuIGYodGhpcy5fcCxyKX19O2Z1bmN0aW9uIGtvKGUscil7bGV0IHQ9ZS52YWxpZC5nZXQocik7dD09bnVsbCYmKHQ9ZS52YWxpZC5zaXplLGUudmFsaWQuc2V0KHIsdCkpO2xldCBuPWUudmFyc1t0XTtyZXR1cm4gbj09bnVsbCYmKG49QnIodCksZS52YXJzW3RdPW4pLG59ZnVuY3Rpb24gRG8oZSl7cmV0dXJuIGNlK1wiW1wiK2UrXCJdXCJ9ZnVuY3Rpb24gbShlLHIpe3JldHVybiBlLm1vZGU9PT0xP2tvKGUuc3RhdGUscik6RG8ocil9ZnVuY3Rpb24gTyhlLHIpe2UubWFya2VkLmFkZChyKX1mdW5jdGlvbiBMcihlLHIpe3JldHVybiBlLm1hcmtlZC5oYXMocil9ZnVuY3Rpb24ganIoZSxyLHQpe3IhPT0wJiYoTyhlLmJhc2UsdCksZS5iYXNlLmZsYWdzLnB1c2goe3R5cGU6cix2YWx1ZTptKGUsdCl9KSl9ZnVuY3Rpb24gRm8oZSl7bGV0IHI9XCJcIjtmb3IobGV0IHQ9MCxuPWUuZmxhZ3MsYT1uLmxlbmd0aDt0PGE7dCsrKXtsZXQgcz1uW3RdO3IrPXpvW3MudHlwZV0rXCIoXCIrcy52YWx1ZStcIiksXCJ9cmV0dXJuIHJ9ZnVuY3Rpb24gb24oZSl7bGV0IHI9dG4oZS5hc3NpZ25tZW50cyksdD1GbyhlKTtyZXR1cm4gcj90P3IrdDpyOnR9ZnVuY3Rpb24gWXIoZSxyLHQpe2UuYXNzaWdubWVudHMucHVzaCh7dDowLHM6cixrOm8sdjp0fSl9ZnVuY3Rpb24gQm8oZSxyLHQpe2UuYmFzZS5hc3NpZ25tZW50cy5wdXNoKHt0OjEsczptKGUsciksazpvLHY6dH0pfWZ1bmN0aW9uIGdlKGUscix0LG4pe2UuYmFzZS5hc3NpZ25tZW50cy5wdXNoKHt0OjIsczptKGUsciksazp0LHY6bn0pfWZ1bmN0aW9uIFp0KGUscix0KXtlLmJhc2UuYXNzaWdubWVudHMucHVzaCh7dDozLHM6bShlLHIpLGs6dCx2Om99KX1mdW5jdGlvbiBOZShlLHIsdCxuKXtZcihlLmJhc2UsbShlLHIpK1wiW1wiK3QrXCJdXCIsbil9ZnVuY3Rpb24gVXIoZSxyLHQsbil7WXIoZS5iYXNlLG0oZSxyKStcIi5cIit0LG4pfWZ1bmN0aW9uIFZvKGUscix0LG4pe1lyKGUuYmFzZSxtKGUscikrXCIudltcIit0K1wiXVwiLG4pfWZ1bmN0aW9uIEQoZSxyKXtyZXR1cm4gci50PT09NCYmZS5zdGFjay5pbmNsdWRlcyhyLmkpfWZ1bmN0aW9uIHNlKGUscix0KXtyZXR1cm4gZS5tb2RlPT09MSYmIUxyKGUuYmFzZSxyKT90Om0oZSxyKStcIj1cIit0fWZ1bmN0aW9uIE1vKGUpe3JldHVybiBVKycuZ2V0KFwiJytlLnMrJ1wiKSd9ZnVuY3Rpb24gJHQoZSxyLHQsbil7cmV0dXJuIHQ/RChlLmJhc2UsdCk/KE8oZS5iYXNlLHIpLE5lKGUscixuLG0oZSx0LmkpKSxcIlwiKTpmKGUsdCk6XCJcIn1mdW5jdGlvbiBMbyhlLHIpe2xldCB0PXIuaSxuPXIuYSxhPW4ubGVuZ3RoO2lmKGE+MCl7ZS5iYXNlLnN0YWNrLnB1c2godCk7bGV0IHM9JHQoZSx0LG5bMF0sMCksaT1zPT09XCJcIjtmb3IobGV0IHU9MSxsO3U8YTt1KyspbD0kdChlLHQsblt1XSx1KSxzKz1cIixcIitsLGk9bD09PVwiXCI7cmV0dXJuIGUuYmFzZS5zdGFjay5wb3AoKSxqcihlLHIubyxyLmkpLFwiW1wiK3MrKGk/XCIsXVwiOlwiXVwiKX1yZXR1cm5cIltdXCJ9ZnVuY3Rpb24gWHQoZSxyLHQsbil7aWYodHlwZW9mIHQ9PVwic3RyaW5nXCIpe2xldCBhPU51bWJlcih0KSxzPWE+PTAmJmEudG9TdHJpbmcoKT09PXR8fFZyKHQpO2lmKEQoZS5iYXNlLG4pKXtsZXQgaT1tKGUsbi5pKTtyZXR1cm4gTyhlLmJhc2Usci5pKSxzJiZhIT09YT9VcihlLHIuaSx0LGkpOk5lKGUsci5pLHM/dDonXCInK3QrJ1wiJyxpKSxcIlwifXJldHVybihzP3Q6J1wiJyt0KydcIicpK1wiOlwiK2YoZSxuKX1yZXR1cm5cIltcIitmKGUsdCkrXCJdOlwiK2YoZSxuKX1mdW5jdGlvbiBhbihlLHIsdCl7bGV0IG49dC5rLGE9bi5sZW5ndGg7aWYoYT4wKXtsZXQgcz10LnY7ZS5iYXNlLnN0YWNrLnB1c2goci5pKTtsZXQgaT1YdChlLHIsblswXSxzWzBdKTtmb3IobGV0IHU9MSxsPWk7dTxhO3UrKylsPVh0KGUscixuW3VdLHNbdV0pLGkrPShsJiZpJiZcIixcIikrbDtyZXR1cm4gZS5iYXNlLnN0YWNrLnBvcCgpLFwie1wiK2krXCJ9XCJ9cmV0dXJuXCJ7fVwifWZ1bmN0aW9uIFVvKGUscil7cmV0dXJuIGpyKGUsci5vLHIuaSksYW4oZSxyLHIucCl9ZnVuY3Rpb24gam8oZSxyLHQsbil7bGV0IGE9YW4oZSxyLHQpO3JldHVybiBhIT09XCJ7fVwiP1wiT2JqZWN0LmFzc2lnbihcIituK1wiLFwiK2ErXCIpXCI6bn1mdW5jdGlvbiBZbyhlLHIsdCxuLGEpe2xldCBzPWUuYmFzZSxpPWYoZSxhKSx1PU51bWJlcihuKSxsPXU+PTAmJnUudG9TdHJpbmcoKT09PW58fFZyKG4pO2lmKEQocyxhKSlsJiZ1IT09dT9VcihlLHIuaSxuLGkpOk5lKGUsci5pLGw/bjonXCInK24rJ1wiJyxpKTtlbHNle2xldCBnPXMuYXNzaWdubWVudHM7cy5hc3NpZ25tZW50cz10LGwmJnUhPT11P1VyKGUsci5pLG4saSk6TmUoZSxyLmksbD9uOidcIicrbisnXCInLGkpLHMuYXNzaWdubWVudHM9Z319ZnVuY3Rpb24gcW8oZSxyLHQsbixhKXtpZih0eXBlb2Ygbj09XCJzdHJpbmdcIilZbyhlLHIsdCxuLGEpO2Vsc2V7bGV0IHM9ZS5iYXNlLGk9cy5zdGFjaztzLnN0YWNrPVtdO2xldCB1PWYoZSxhKTtzLnN0YWNrPWk7bGV0IGw9cy5hc3NpZ25tZW50cztzLmFzc2lnbm1lbnRzPXQsTmUoZSxyLmksZihlLG4pLHUpLHMuYXNzaWdubWVudHM9bH19ZnVuY3Rpb24gV28oZSxyLHQpe2xldCBuPXQuayxhPW4ubGVuZ3RoO2lmKGE+MCl7bGV0IHM9W10saT10LnY7ZS5iYXNlLnN0YWNrLnB1c2goci5pKTtmb3IobGV0IHU9MDt1PGE7dSsrKXFvKGUscixzLG5bdV0saVt1XSk7cmV0dXJuIGUuYmFzZS5zdGFjay5wb3AoKSx0bihzKX1yZXR1cm4gb31mdW5jdGlvbiBxcihlLHIsdCl7aWYoci5wKXtsZXQgbj1lLmJhc2U7aWYobi5mZWF0dXJlcyY4KXQ9am8oZSxyLHIucCx0KTtlbHNle08obixyLmkpO2xldCBhPVdvKGUscixyLnApO2lmKGEpcmV0dXJuXCIoXCIrc2UoZSxyLmksdCkrXCIsXCIrYSttKGUsci5pKStcIilcIn19cmV0dXJuIHR9ZnVuY3Rpb24gR28oZSxyKXtyZXR1cm4ganIoZSxyLm8sci5pKSxxcihlLHIseG8pfWZ1bmN0aW9uIEtvKGUpe3JldHVybiduZXcgRGF0ZShcIicrZS5zKydcIiknfWZ1bmN0aW9uIEhvKGUscil7aWYoZS5iYXNlLmZlYXR1cmVzJjMyKXJldHVyblwiL1wiK3IuYytcIi9cIityLm07dGhyb3cgbmV3IHcocil9ZnVuY3Rpb24gUXQoZSxyLHQpe2xldCBuPWUuYmFzZTtyZXR1cm4gRChuLHQpPyhPKG4sciksQm8oZSxyLG0oZSx0LmkpKSxcIlwiKTpmKGUsdCl9ZnVuY3Rpb24gSm8oZSxyKXtsZXQgdD1PbyxuPXIuYSxhPW4ubGVuZ3RoLHM9ci5pO2lmKGE+MCl7ZS5iYXNlLnN0YWNrLnB1c2gocyk7bGV0IGk9UXQoZSxzLG5bMF0pO2ZvcihsZXQgdT0xLGw9aTt1PGE7dSsrKWw9UXQoZSxzLG5bdV0pLGkrPShsJiZpJiZcIixcIikrbDtlLmJhc2Uuc3RhY2sucG9wKCksaSYmKHQrPVwiKFtcIitpK1wiXSlcIil9cmV0dXJuIHR9ZnVuY3Rpb24gZW4oZSxyLHQsbixhKXtsZXQgcz1lLmJhc2U7aWYoRChzLHQpKXtsZXQgaT1tKGUsdC5pKTtpZihPKHMsciksRChzLG4pKXtsZXQgbD1tKGUsbi5pKTtyZXR1cm4gZ2UoZSxyLGksbCksXCJcIn1pZihuLnQhPT00JiZuLmkhPW51bGwmJkxyKHMsbi5pKSl7bGV0IGw9XCIoXCIrZihlLG4pK1wiLFtcIithK1wiLFwiK2ErXCJdKVwiO3JldHVybiBnZShlLHIsaSxtKGUsbi5pKSksWnQoZSxyLGEpLGx9bGV0IHU9cy5zdGFjaztyZXR1cm4gcy5zdGFjaz1bXSxnZShlLHIsaSxmKGUsbikpLHMuc3RhY2s9dSxcIlwifWlmKEQocyxuKSl7bGV0IGk9bShlLG4uaSk7aWYoTyhzLHIpLHQudCE9PTQmJnQuaSE9bnVsbCYmTHIocyx0LmkpKXtsZXQgbD1cIihcIitmKGUsdCkrXCIsW1wiK2ErXCIsXCIrYStcIl0pXCI7cmV0dXJuIGdlKGUscixtKGUsdC5pKSxpKSxadChlLHIsYSksbH1sZXQgdT1zLnN0YWNrO3JldHVybiBzLnN0YWNrPVtdLGdlKGUscixmKGUsdCksaSkscy5zdGFjaz11LFwiXCJ9cmV0dXJuXCJbXCIrZihlLHQpK1wiLFwiK2YoZSxuKStcIl1cIn1mdW5jdGlvbiBabyhlLHIpe2xldCB0PVRvLG49ci5lLmssYT1uLmxlbmd0aCxzPXIuaSxpPXIuZix1PW0oZSxpLmkpLGw9ZS5iYXNlO2lmKGE+MCl7bGV0IGc9ci5lLnY7bC5zdGFjay5wdXNoKHMpO2xldCBTPWVuKGUscyxuWzBdLGdbMF0sdSk7Zm9yKGxldCBkPTEsSz1TO2Q8YTtkKyspSz1lbihlLHMsbltkXSxnW2RdLHUpLFMrPShLJiZTJiZcIixcIikrSztsLnN0YWNrLnBvcCgpLFMmJih0Kz1cIihbXCIrUytcIl0pXCIpfXJldHVybiBpLnQ9PT0yNiYmKE8obCxpLmkpLHQ9XCIoXCIrZihlLGkpK1wiLFwiK3QrXCIpXCIpLHR9ZnVuY3Rpb24gJG8oZSxyKXtyZXR1cm4gVyhlLHIuZikrJyhcIicrci5zKydcIiknfWZ1bmN0aW9uIFhvKGUscil7cmV0dXJuXCJuZXcgXCIrci5jK1wiKFwiK2YoZSxyLmYpK1wiLFwiK3IuYitcIixcIityLmwrXCIpXCJ9ZnVuY3Rpb24gUW8oZSxyKXtyZXR1cm5cIm5ldyBEYXRhVmlldyhcIitmKGUsci5mKStcIixcIityLmIrXCIsXCIrci5sK1wiKVwifWZ1bmN0aW9uIGVhKGUscil7bGV0IHQ9ci5pO2UuYmFzZS5zdGFjay5wdXNoKHQpO2xldCBuPXFyKGUsciwnbmV3IEFnZ3JlZ2F0ZUVycm9yKFtdLFwiJytyLm0rJ1wiKScpO3JldHVybiBlLmJhc2Uuc3RhY2sucG9wKCksbn1mdW5jdGlvbiByYShlLHIpe3JldHVybiBxcihlLHIsXCJuZXcgXCIrQ2Vbci5zXSsnKFwiJytyLm0rJ1wiKScpfWZ1bmN0aW9uIHRhKGUscil7bGV0IHQsbj1yLmYsYT1yLmkscz1yLnM/d286aG8saT1lLmJhc2U7aWYoRChpLG4pKXtsZXQgdT1tKGUsbi5pKTt0PXMrKHIucz9cIigpLnRoZW4oXCIrc3IoW10sdSkrXCIpXCI6XCIoKS5jYXRjaChcIitXdChbXSxcInRocm93IFwiK3UpK1wiKVwiKX1lbHNle2kuc3RhY2sucHVzaChhKTtsZXQgdT1mKGUsbik7aS5zdGFjay5wb3AoKSx0PXMrXCIoXCIrdStcIilcIn1yZXR1cm4gdH1mdW5jdGlvbiBuYShlLHIpe3JldHVyblwiT2JqZWN0KFwiK2YoZSxyLmYpK1wiKVwifWZ1bmN0aW9uIFcoZSxyKXtsZXQgdD1mKGUscik7cmV0dXJuIHIudD09PTQ/dDpcIihcIit0K1wiKVwifWZ1bmN0aW9uIG9hKGUscil7aWYoZS5tb2RlPT09MSl0aHJvdyBuZXcgdyhyKTtyZXR1cm5cIihcIitzZShlLHIucyxXKGUsci5mKStcIigpXCIpK1wiKS5wXCJ9ZnVuY3Rpb24gYWEoZSxyKXtpZihlLm1vZGU9PT0xKXRocm93IG5ldyB3KHIpO3JldHVybiBXKGUsci5hWzBdKStcIihcIittKGUsci5pKStcIixcIitmKGUsci5hWzFdKStcIilcIn1mdW5jdGlvbiBzYShlLHIpe2lmKGUubW9kZT09PTEpdGhyb3cgbmV3IHcocik7cmV0dXJuIFcoZSxyLmFbMF0pK1wiKFwiK20oZSxyLmkpK1wiLFwiK2YoZSxyLmFbMV0pK1wiKVwifWZ1bmN0aW9uIGlhKGUscil7bGV0IHQ9ZS5iYXNlLnBsdWdpbnM7aWYodClmb3IobGV0IG49MCxhPXQubGVuZ3RoO248YTtuKyspe2xldCBzPXRbbl07aWYocy50YWc9PT1yLmMpcmV0dXJuIGUuY2hpbGQ9PW51bGwmJihlLmNoaWxkPW5ldyBNcihlKSkscy5zZXJpYWxpemUoci5zLGUuY2hpbGQse2lkOnIuaX0pfXRocm93IG5ldyBRKHIuYyl9ZnVuY3Rpb24gdWEoZSxyKXtsZXQgdD1cIlwiLG49ITE7cmV0dXJuIHIuZi50IT09NCYmKE8oZS5iYXNlLHIuZi5pKSx0PVwiKFwiK2YoZSxyLmYpK1wiLFwiLG49ITApLHQrPXNlKGUsci5pLFwiKFwiK0N0K1wiKShcIittKGUsci5mLmkpK1wiKVwiKSxuJiYodCs9XCIpXCIpLHR9ZnVuY3Rpb24gbGEoZSxyKXtyZXR1cm4gVyhlLHIuYVswXSkrXCIoXCIrZihlLHIuYVsxXSkrXCIpXCJ9ZnVuY3Rpb24gY2EoZSxyKXtsZXQgdD1yLmFbMF0sbj1yLmFbMV0sYT1lLmJhc2Uscz1cIlwiO3QudCE9PTQmJihPKGEsdC5pKSxzKz1cIihcIitmKGUsdCkpLG4udCE9PTQmJihPKGEsbi5pKSxzKz0ocz9cIixcIjpcIihcIikrZihlLG4pKSxzJiYocys9XCIsXCIpO2xldCBpPXNlKGUsci5pLFwiKFwiK0F0K1wiKShcIittKGUsbi5pKStcIixcIittKGUsdC5pKStcIilcIik7cmV0dXJuIHM/cytpK1wiKVwiOml9ZnVuY3Rpb24gZmEoZSxyKXtyZXR1cm4gVyhlLHIuYVswXSkrXCIoXCIrZihlLHIuYVsxXSkrXCIpXCJ9ZnVuY3Rpb24gU2EoZSxyKXtsZXQgdD1zZShlLHIuaSxXKGUsci5mKStcIigpXCIpLG49ci5hLmxlbmd0aDtpZihuKXtsZXQgYT1mKGUsci5hWzBdKTtmb3IobGV0IHM9MTtzPG47cysrKWErPVwiLFwiK2YoZSxyLmFbc10pO3JldHVyblwiKFwiK3QrXCIsXCIrYStcIixcIittKGUsci5pKStcIilcIn1yZXR1cm4gdH1mdW5jdGlvbiBtYShlLHIpe3JldHVybiBtKGUsci5pKStcIi5uZXh0KFwiK2YoZSxyLmYpK1wiKVwifWZ1bmN0aW9uIHBhKGUscil7cmV0dXJuIG0oZSxyLmkpK1wiLnRocm93KFwiK2YoZSxyLmYpK1wiKVwifWZ1bmN0aW9uIGRhKGUscil7cmV0dXJuIG0oZSxyLmkpK1wiLnJldHVybihcIitmKGUsci5mKStcIilcIn1mdW5jdGlvbiBybihlLHIsdCxuKXtsZXQgYT1lLmJhc2U7cmV0dXJuIEQoYSxuKT8oTyhhLHIpLFZvKGUscix0LG0oZSxuLmkpKSxcIlwiKTpmKGUsbil9ZnVuY3Rpb24gZ2EoZSxyKXtsZXQgdD1yLmEsbj10Lmxlbmd0aCxhPXIuaTtpZihuPjApe2UuYmFzZS5zdGFjay5wdXNoKGEpO2xldCBzPXJuKGUsYSwwLHRbMF0pO2ZvcihsZXQgaT0xLHU9cztpPG47aSsrKXU9cm4oZSxhLGksdFtpXSkscys9KHUmJnMmJlwiLFwiKSt1O2lmKGUuYmFzZS5zdGFjay5wb3AoKSxzKXJldHVyblwie19fU0VST1ZBTF9TRVFVRU5DRV9fOiEwLHY6W1wiK3MrXCJdLHQ6XCIrci5zK1wiLGQ6XCIrci5sK1wifVwifXJldHVyblwie19fU0VST1ZBTF9TRVFVRU5DRV9fOiEwLHY6W10sdDotMSxkOjB9XCJ9ZnVuY3Rpb24geWEoZSxyKXtzd2l0Y2goci50KXtjYXNlIDE3OnJldHVybiBydFtyLnNdO2Nhc2UgMTg6cmV0dXJuIE1vKHIpO2Nhc2UgOTpyZXR1cm4gTG8oZSxyKTtjYXNlIDEwOnJldHVybiBVbyhlLHIpO2Nhc2UgMTE6cmV0dXJuIEdvKGUscik7Y2FzZSA1OnJldHVybiBLbyhyKTtjYXNlIDY6cmV0dXJuIEhvKGUscik7Y2FzZSA3OnJldHVybiBKbyhlLHIpO2Nhc2UgODpyZXR1cm4gWm8oZSxyKTtjYXNlIDE5OnJldHVybiAkbyhlLHIpO2Nhc2UgMTY6Y2FzZSAxNTpyZXR1cm4gWG8oZSxyKTtjYXNlIDIwOnJldHVybiBRbyhlLHIpO2Nhc2UgMTQ6cmV0dXJuIGVhKGUscik7Y2FzZSAxMzpyZXR1cm4gcmEoZSxyKTtjYXNlIDEyOnJldHVybiB0YShlLHIpO2Nhc2UgMjE6cmV0dXJuIG5hKGUscik7Y2FzZSAyMjpyZXR1cm4gb2EoZSxyKTtjYXNlIDI1OnJldHVybiBpYShlLHIpO2Nhc2UgMjY6cmV0dXJuIE90W3Iuc107Y2FzZSAzNTpyZXR1cm4gZ2EoZSxyKTtkZWZhdWx0OnRocm93IG5ldyB3KHIpfX1mdW5jdGlvbiBmKGUscil7c3dpdGNoKHIudCl7Y2FzZSAyOnJldHVybiBudFtyLnNdO2Nhc2UgMDpyZXR1cm5cIlwiK3IucztjYXNlIDE6cmV0dXJuJ1wiJytyLnMrJ1wiJztjYXNlIDM6cmV0dXJuIHIucytcIm5cIjtjYXNlIDQ6cmV0dXJuIG0oZSxyLmkpO2Nhc2UgMjM6cmV0dXJuIGFhKGUscik7Y2FzZSAyNDpyZXR1cm4gc2EoZSxyKTtjYXNlIDI3OnJldHVybiB1YShlLHIpO2Nhc2UgMjg6cmV0dXJuIGxhKGUscik7Y2FzZSAyOTpyZXR1cm4gY2EoZSxyKTtjYXNlIDMwOnJldHVybiBmYShlLHIpO2Nhc2UgMzE6cmV0dXJuIFNhKGUscik7Y2FzZSAzMjpyZXR1cm4gbWEoZSxyKTtjYXNlIDMzOnJldHVybiBwYShlLHIpO2Nhc2UgMzQ6cmV0dXJuIGRhKGUscik7ZGVmYXVsdDpyZXR1cm4gc2UoZSxyLmkseWEoZSxyKSl9fWZ1bmN0aW9uIGxyKGUscil7bGV0IHQ9ZihlLHIpO2lmKHIuaSE9bnVsbCYmZS5zdGF0ZS52YXJzLmxlbmd0aCl7bGV0IG49b24oZS5iYXNlKSxhPXQ7aWYobil7bGV0IHM9bShlLHIuaSk7YT10K1wiLFwiK24rcyx0LnN0YXJ0c1dpdGgocytcIj1cIil8fChhPXMrXCI9XCIrYSksYT1cIihcIithK1wiKVwifXJldHVyblwiKFwiK3NyKGUuc3RhdGUudmFycyxhKStcIikoKVwifXJldHVybiByLnQ9PT0xMD9cIihcIit0K1wiKVwiOnR9ZnVuY3Rpb24gY3IoZSxyKXtsZXQgdD1mKGUsciksbj1yLmk7aWYobj09bnVsbClyZXR1cm4gdDtsZXQgYT1vbihlLmJhc2UpLHM9bShlLG4pLGk9ZS5zdGF0ZS5zY29wZUlkLHU9aT09bnVsbD9cIlwiOmNlLGw9YT9cIihcIit0K1wiLFwiK2ErcytcIilcIjp0O2lmKHU9PT1cIlwiKXJldHVybiByLnQ9PT0xMCYmIWE/XCIoXCIrbCtcIilcIjpsO2xldCBnPWk9PW51bGw/XCIoKVwiOlwiKFwiK2NlKydbXCInK3koaSkrJ1wiXSknO3JldHVyblwiKFwiK3NyKFt1XSxsKStcIilcIitnfWZ1bmN0aW9uIHVlKGUscil7cmV0dXJue3R5cGU6MSxiYXNlOnBlKGUsciksY2hpbGQ6b319dmFyIEdyPWNsYXNze2NvbnN0cnVjdG9yKHIsdCl7dGhpcy5fcD1yO3RoaXMuZGVwdGg9dH1wYXJzZShyKXtyZXR1cm4gRSh0aGlzLl9wLHRoaXMuZGVwdGgscil9fSxLcj1jbGFzc3tjb25zdHJ1Y3RvcihyLHQpe3RoaXMuX3A9cjt0aGlzLmRlcHRoPXR9cGFyc2Uocil7cmV0dXJuIEUodGhpcy5fcCx0aGlzLmRlcHRoLHIpfXBhcnNlV2l0aEVycm9yKHIpe3JldHVybiBHKHRoaXMuX3AsdGhpcy5kZXB0aCxyKX1pc0FsaXZlKCl7cmV0dXJuIHRoaXMuX3Auc3RhdGUuYWxpdmV9cHVzaFBlbmRpbmdTdGF0ZSgpe1hyKHRoaXMuX3ApfXBvcFBlbmRpbmdTdGF0ZSgpe2JlKHRoaXMuX3ApfW9uUGFyc2Uocil7aWUodGhpcy5fcCxyKX1vbkVycm9yKHIpe1pyKHRoaXMuX3Ascil9fTtmdW5jdGlvbiBOYShlKXtyZXR1cm57YWxpdmU6ITAscGVuZGluZzowLGluaXRpYWw6ITAsYnVmZmVyOltdLG9uUGFyc2U6ZS5vblBhcnNlLG9uRXJyb3I6ZS5vbkVycm9yLG9uRG9uZTplLm9uRG9uZX19ZnVuY3Rpb24gSHIoZSl7cmV0dXJue3R5cGU6MixiYXNlOnBlKDIsZSksc3RhdGU6TmEoZSl9fWZ1bmN0aW9uIGJhKGUscix0KXtsZXQgbj1bXTtmb3IobGV0IGE9MCxzPXQubGVuZ3RoO2E8czthKyspYSBpbiB0P25bYV09RShlLHIsdFthXSk6blthXT0wO3JldHVybiBufWZ1bmN0aW9uIHZhKGUscix0LG4pe3JldHVybiBfZSh0LG4sYmEoZSxyLG4pKX1mdW5jdGlvbiBKcihlLHIsdCl7bGV0IG49T2JqZWN0LmVudHJpZXModCksYT1bXSxzPVtdO2ZvcihsZXQgaT0wLHU9bi5sZW5ndGg7aTx1O2krKylhLnB1c2goeShuW2ldWzBdKSkscy5wdXNoKEUoZSxyLG5baV1bMV0pKTtyZXR1cm4gQyBpbiB0JiYoYS5wdXNoKEkoZS5iYXNlLEMpKSxzLnB1c2goVWUoZXIoZS5iYXNlKSxFKGUsciwkZSh0KSkpKSksdiBpbiB0JiYoYS5wdXNoKEkoZS5iYXNlLHYpKSxzLnB1c2goamUocnIoZS5iYXNlKSxFKGUscixlLnR5cGU9PT0xP3RlKCk6WGUodCkpKSkpLFAgaW4gdCYmKGEucHVzaChJKGUuYmFzZSxQKSkscy5wdXNoKFgodFtQXSkpKSxSIGluIHQmJihhLnB1c2goSShlLmJhc2UsUikpLHMucHVzaCh0W1JdP0o6WikpLHtrOmEsdjpzfX1mdW5jdGlvbiBXcihlLHIsdCxuLGEpe3JldHVybiB0cih0LG4sYSxKcihlLHIsbikpfWZ1bmN0aW9uIENhKGUscix0LG4pe3JldHVybiBrZSh0LEUoZSxyLG4udmFsdWVPZigpKSl9ZnVuY3Rpb24gQWEoZSxyLHQsbil7cmV0dXJuIERlKHQsbixFKGUscixuLmJ1ZmZlcikpfWZ1bmN0aW9uIEVhKGUscix0LG4pe3JldHVybiBGZSh0LG4sRShlLHIsbi5idWZmZXIpKX1mdW5jdGlvbiBJYShlLHIsdCxuKXtyZXR1cm4gQmUodCxuLEUoZSxyLG4uYnVmZmVyKSl9ZnVuY3Rpb24gc24oZSxyLHQsbil7bGV0IGE9JChuLGUuYmFzZS5mZWF0dXJlcyk7cmV0dXJuIFZlKHQsbixhP0pyKGUscixhKTpvKX1mdW5jdGlvbiBSYShlLHIsdCxuKXtsZXQgYT0kKG4sZS5iYXNlLmZlYXR1cmVzKTtyZXR1cm4gTWUodCxuLGE/SnIoZSxyLGEpOm8pfWZ1bmN0aW9uIFBhKGUscix0LG4pe2xldCBhPVtdLHM9W107Zm9yKGxldFtpLHVdb2Ygbi5lbnRyaWVzKCkpYS5wdXNoKEUoZSxyLGkpKSxzLnB1c2goRShlLHIsdSkpO3JldHVybiBucihlLmJhc2UsdCxhLHMpfWZ1bmN0aW9uIHhhKGUscix0LG4pe2xldCBhPVtdO2ZvcihsZXQgcyBvZiBuLmtleXMoKSlhLnB1c2goRShlLHIscykpO3JldHVybiBMZSh0LGEpfWZ1bmN0aW9uIE9hKGUscix0LG4pe2xldCBhPVllKHQsayhlLmJhc2UsNCksW10pO3JldHVybiBlLnR5cGU9PT0xfHwoWHIoZSksbi5vbih7bmV4dDpzPT57aWYoZS5zdGF0ZS5hbGl2ZSl7bGV0IGk9RyhlLHIscyk7aSYmaWUoZSxxZSh0LGkpKX19LHRocm93OnM9PntpZihlLnN0YXRlLmFsaXZlKXtsZXQgaT1HKGUscixzKTtpJiZpZShlLFdlKHQsaSkpfWJlKGUpfSxyZXR1cm46cz0+e2lmKGUuc3RhdGUuYWxpdmUpe2xldCBpPUcoZSxyLHMpO2kmJmllKGUsR2UodCxpKSl9YmUoZSl9fSkpLGF9ZnVuY3Rpb24gVGEoZSxyLHQpe2lmKHRoaXMuc3RhdGUuYWxpdmUpe2xldCBuPUcodGhpcyxyLHQpO24mJmllKHRoaXMsYygyMyxlLG8sbyxvLG8sbyxbayh0aGlzLmJhc2UsMiksbl0sbyxvLG8sbykpLGJlKHRoaXMpfX1mdW5jdGlvbiB3YShlLHIsdCl7aWYodGhpcy5zdGF0ZS5hbGl2ZSl7bGV0IG49Ryh0aGlzLHIsdCk7biYmaWUodGhpcyxjKDI0LGUsbyxvLG8sbyxvLFtrKHRoaXMuYmFzZSwzKSxuXSxvLG8sbyxvKSl9YmUodGhpcyl9ZnVuY3Rpb24gaGEoZSxyLHQsbil7bGV0IGE9aHIoZS5iYXNlLHt9KTtyZXR1cm4gZS50eXBlPT09MiYmKFhyKGUpLG4udGhlbihUYS5iaW5kKGUsYSxyKSx3YS5iaW5kKGUsYSxyKSkpLGh0KGUuYmFzZSx0LGEpfWZ1bmN0aW9uIHphKGUscix0LG4sYSl7Zm9yKGxldCBzPTAsaT1hLmxlbmd0aDtzPGk7cysrKXtsZXQgdT1hW3NdO2lmKHUucGFyc2Uuc3luYyYmdS50ZXN0KG4pKXJldHVybiBmZSh0LHUudGFnLHUucGFyc2Uuc3luYyhuLG5ldyBHcihlLHIpLHtpZDp0fSkpfXJldHVybiBvfWZ1bmN0aW9uIF9hKGUscix0LG4sYSl7Zm9yKGxldCBzPTAsaT1hLmxlbmd0aDtzPGk7cysrKXtsZXQgdT1hW3NdO2lmKHUucGFyc2Uuc3RyZWFtJiZ1LnRlc3QobikpcmV0dXJuIGZlKHQsdS50YWcsdS5wYXJzZS5zdHJlYW0obixuZXcgS3IoZSxyKSx7aWQ6dH0pKX1yZXR1cm4gb31mdW5jdGlvbiB1bihlLHIsdCxuKXtsZXQgYT1lLmJhc2UucGx1Z2lucztyZXR1cm4gYT9lLnR5cGU9PT0xP3phKGUscix0LG4sYSk6X2EoZSxyLHQsbixhKTpvfWZ1bmN0aW9uIGthKGUscix0LG4pe2xldCBhPVtdO2ZvcihsZXQgcz0wLGk9bi52Lmxlbmd0aDtzPGk7cysrKWFbc109RShlLHIsbi52W3NdKTtyZXR1cm4gS2UodCxhLG4udCxuLmQpfWZ1bmN0aW9uIERhKGUscix0LG4sYSl7c3dpdGNoKGEpe2Nhc2UgT2JqZWN0OnJldHVybiBXcihlLHIsdCxuLCExKTtjYXNlIG86cmV0dXJuIFdyKGUscix0LG4sITApO2Nhc2UgRGF0ZTpyZXR1cm4gaGUodCxuKTtjYXNlIEVycm9yOmNhc2UgRXZhbEVycm9yOmNhc2UgUmFuZ2VFcnJvcjpjYXNlIFJlZmVyZW5jZUVycm9yOmNhc2UgU3ludGF4RXJyb3I6Y2FzZSBUeXBlRXJyb3I6Y2FzZSBVUklFcnJvcjpyZXR1cm4gc24oZSxyLHQsbik7Y2FzZSBOdW1iZXI6Y2FzZSBCb29sZWFuOmNhc2UgU3RyaW5nOmNhc2UgQmlnSW50OnJldHVybiBDYShlLHIsdCxuKTtjYXNlIEFycmF5QnVmZmVyOnJldHVybiBvcihlLmJhc2UsdCxuKTtjYXNlIEludDhBcnJheTpjYXNlIEludDE2QXJyYXk6Y2FzZSBJbnQzMkFycmF5OmNhc2UgVWludDhBcnJheTpjYXNlIFVpbnQxNkFycmF5OmNhc2UgVWludDMyQXJyYXk6Y2FzZSBVaW50OENsYW1wZWRBcnJheTpjYXNlIEZsb2F0MzJBcnJheTpjYXNlIEZsb2F0NjRBcnJheTpyZXR1cm4gQWEoZSxyLHQsbik7Y2FzZSBEYXRhVmlldzpyZXR1cm4gSWEoZSxyLHQsbik7Y2FzZSBNYXA6cmV0dXJuIFBhKGUscix0LG4pO2Nhc2UgU2V0OnJldHVybiB4YShlLHIsdCxuKTtkZWZhdWx0OmJyZWFrfWlmKGE9PT1Qcm9taXNlfHxuIGluc3RhbmNlb2YgUHJvbWlzZSlyZXR1cm4gaGEoZSxyLHQsbik7bGV0IHM9ZS5iYXNlLmZlYXR1cmVzO2lmKHMmMzImJmE9PT1SZWdFeHApcmV0dXJuIHplKHQsbik7aWYocyYxNilzd2l0Y2goYSl7Y2FzZSBCaWdJbnQ2NEFycmF5OmNhc2UgQmlnVWludDY0QXJyYXk6cmV0dXJuIEVhKGUscix0LG4pO2RlZmF1bHQ6YnJlYWt9aWYocyYxJiZ0eXBlb2YgQWdncmVnYXRlRXJyb3IhPVwidW5kZWZpbmVkXCImJihhPT09QWdncmVnYXRlRXJyb3J8fG4gaW5zdGFuY2VvZiBBZ2dyZWdhdGVFcnJvcikpcmV0dXJuIFJhKGUscix0LG4pO2lmKG4gaW5zdGFuY2VvZiBFcnJvcilyZXR1cm4gc24oZSxyLHQsbik7aWYoQyBpbiBufHx2IGluIG4pcmV0dXJuIFdyKGUscix0LG4sISFhKTt0aHJvdyBuZXcgeChuKX1mdW5jdGlvbiBGYShlLHIsdCxuKXtpZihBcnJheS5pc0FycmF5KG4pKXJldHVybiB2YShlLHIsdCxuKTtpZihNKG4pKXJldHVybiBPYShlLHIsdCxuKTtpZihaZShuKSlyZXR1cm4ga2EoZSxyLHQsbik7bGV0IGE9bi5jb25zdHJ1Y3RvcjtpZihhPT09WSlyZXR1cm4gRShlLHIsbi5yZXBsYWNlbWVudCk7bGV0IHM9dW4oZSxyLHQsbik7cmV0dXJuIHN8fERhKGUscix0LG4sYSl9ZnVuY3Rpb24gQmEoZSxyLHQpe2xldCBuPXEoZS5iYXNlLHQpO2lmKG4udHlwZSE9PTApcmV0dXJuIG4udmFsdWU7bGV0IGE9dW4oZSxyLG4udmFsdWUsdCk7aWYoYSlyZXR1cm4gYTt0aHJvdyBuZXcgeCh0KX1mdW5jdGlvbiBFKGUscix0KXtpZihyPj1lLmJhc2UuZGVwdGhMaW1pdCl0aHJvdyBuZXcgZWUoZS5iYXNlLmRlcHRoTGltaXQpO3N3aXRjaCh0eXBlb2YgdCl7Y2FzZVwiYm9vbGVhblwiOnJldHVybiB0P0o6WjtjYXNlXCJ1bmRlZmluZWRcIjpyZXR1cm4gQWU7Y2FzZVwic3RyaW5nXCI6cmV0dXJuIFgodCk7Y2FzZVwibnVtYmVyXCI6cmV0dXJuIFRlKHQpO2Nhc2VcImJpZ2ludFwiOnJldHVybiB3ZSh0KTtjYXNlXCJvYmplY3RcIjp7aWYodCl7bGV0IG49cShlLmJhc2UsdCk7cmV0dXJuIG4udHlwZT09PTA/RmEoZSxyKzEsbi52YWx1ZSx0KTpuLnZhbHVlfXJldHVybiBFZX1jYXNlXCJzeW1ib2xcIjpyZXR1cm4gSShlLmJhc2UsdCk7Y2FzZVwiZnVuY3Rpb25cIjpyZXR1cm4gQmEoZSxyLHQpO2RlZmF1bHQ6dGhyb3cgbmV3IHgodCl9fWZ1bmN0aW9uIGxlKGUscil7dHJ5e3JldHVybiBFKGUsMCxyKX1jYXRjaCh0KXt0aHJvdyB0IGluc3RhbmNlb2Ygej90Om5ldyB6KHQpfX1mdW5jdGlvbiBpZShlLHIpe2Uuc3RhdGUuaW5pdGlhbD9lLnN0YXRlLmJ1ZmZlci5wdXNoKHIpOiRyKGUsciwhMSl9ZnVuY3Rpb24gWnIoZSxyKXtpZihlLnN0YXRlLm9uRXJyb3IpZS5zdGF0ZS5vbkVycm9yKHIpO2Vsc2UgdGhyb3cgciBpbnN0YW5jZW9mIHo/cjpuZXcgeihyKX1mdW5jdGlvbiBsbihlKXtlLnN0YXRlLm9uRG9uZSYmZS5zdGF0ZS5vbkRvbmUoKX1mdW5jdGlvbiAkcihlLHIsdCl7dHJ5e2Uuc3RhdGUub25QYXJzZShyLHQpfWNhdGNoKG4pe1pyKGUsbil9fWZ1bmN0aW9uIFhyKGUpe2Uuc3RhdGUucGVuZGluZysrfWZ1bmN0aW9uIGJlKGUpey0tZS5zdGF0ZS5wZW5kaW5nPD0wJiZsbihlKX1mdW5jdGlvbiBHKGUscix0KXt0cnl7cmV0dXJuIEUoZSxyLHQpfWNhdGNoKG4pe3JldHVybiBacihlLG4pLG99fWZ1bmN0aW9uIFFyKGUscil7bGV0IHQ9RyhlLDAscik7dCYmKCRyKGUsdCwhMCksZS5zdGF0ZS5pbml0aWFsPSExLFZhKGUsZS5zdGF0ZSksZS5zdGF0ZS5wZW5kaW5nPD0wJiZmcihlKSl9ZnVuY3Rpb24gVmEoZSxyKXtmb3IobGV0IHQ9MCxuPXIuYnVmZmVyLmxlbmd0aDt0PG47dCsrKSRyKGUsci5idWZmZXJbdF0sITEpfWZ1bmN0aW9uIGZyKGUpe2Uuc3RhdGUuYWxpdmUmJihsbihlKSxlLnN0YXRlLmFsaXZlPSExKX1mdW5jdGlvbiBydShlLHI9e30pe2xldCB0PUEoci5wbHVnaW5zKSxuPXVlKDIse3BsdWdpbnM6dCxkaXNhYmxlZEZlYXR1cmVzOnIuZGlzYWJsZWRGZWF0dXJlcyxyZWZzOnIucmVmc30pLGE9bGUobixlKSxzPXVyKHtwbHVnaW5zOnQsZmVhdHVyZXM6bi5iYXNlLmZlYXR1cmVzLHNjb3BlSWQ6ci5zY29wZUlkLG1hcmtlZFJlZnM6bi5iYXNlLm1hcmtlZH0pO3JldHVybiBjcihzLGEpfWFzeW5jIGZ1bmN0aW9uIHR1KGUscj17fSl7bGV0IHQ9QShyLnBsdWdpbnMpLG49bmUoMix7cGx1Z2luczp0LGRpc2FibGVkRmVhdHVyZXM6ci5kaXNhYmxlZEZlYXR1cmVzLHJlZnM6ci5yZWZzfSksYT1hd2FpdCBvZShuLGUpLHM9dXIoe3BsdWdpbnM6dCxmZWF0dXJlczpuLmJhc2UuZmVhdHVyZXMsc2NvcGVJZDpyLnNjb3BlSWQsbWFya2VkUmVmczpuLmJhc2UubWFya2VkfSk7cmV0dXJuIGNyKHMsYSl9ZnVuY3Rpb24gbnUoZSxyPXt9KXtsZXQgdD1BKHIucGx1Z2lucyksbj11ZSgyLHtwbHVnaW5zOnQsZGlzYWJsZWRGZWF0dXJlczpyLmRpc2FibGVkRmVhdHVyZXMscmVmczpyLnJlZnN9KTtyZXR1cm4gbGUobixlKX1hc3luYyBmdW5jdGlvbiBvdShlLHI9e30pe2xldCB0PUEoci5wbHVnaW5zKSxuPW5lKDIse3BsdWdpbnM6dCxkaXNhYmxlZEZlYXR1cmVzOnIuZGlzYWJsZWRGZWF0dXJlcyxyZWZzOnIucmVmc30pO3JldHVybiBhd2FpdCBvZShuLGUpfWZ1bmN0aW9uIGNuKGUscil7bGV0IHQ9QShyLnBsdWdpbnMpLG49SHIoe3BsdWdpbnM6dCxyZWZzOnIucmVmcyxkaXNhYmxlZEZlYXR1cmVzOnIuZGlzYWJsZWRGZWF0dXJlcyxvblBhcnNlKGEscyl7bGV0IGk9dXIoe3BsdWdpbnM6dCxmZWF0dXJlczpuLmJhc2UuZmVhdHVyZXMsc2NvcGVJZDpyLnNjb3BlSWQsbWFya2VkUmVmczpuLmJhc2UubWFya2VkfSksdTt0cnl7dT1jcihpLGEpfWNhdGNoKGwpe3Iub25FcnJvciYmci5vbkVycm9yKGwpO3JldHVybn1yLm9uU2VyaWFsaXplKHUscyl9LG9uRXJyb3I6ci5vbkVycm9yLG9uRG9uZTpyLm9uRG9uZX0pO3JldHVybiBRcihuLGUpLGZyLmJpbmQobnVsbCxuKX1mdW5jdGlvbiBhdShlLHIpe2xldCB0PUEoci5wbHVnaW5zKSxuPUhyKHtwbHVnaW5zOnQscmVmczpyLnJlZnMsZGlzYWJsZWRGZWF0dXJlczpyLmRpc2FibGVkRmVhdHVyZXMsb25QYXJzZTpyLm9uUGFyc2Usb25FcnJvcjpyLm9uRXJyb3Isb25Eb25lOnIub25Eb25lfSk7cmV0dXJuIFFyKG4sZSksZnIuYmluZChudWxsLG4pfWZ1bmN0aW9uIHN1KGUscil7bGV0IHQ9QShyLnBsdWdpbnMpLG49THQoe3BsdWdpbnM6dCxyZWZzOnIucmVmcyxmZWF0dXJlczpyLmZlYXR1cmVzLGRpc2FibGVkRmVhdHVyZXM6ci5kaXNhYmxlZEZlYXR1cmVzfSk7cmV0dXJuIGFyKG4sZSl9dmFyIFNyPWNsYXNze2NvbnN0cnVjdG9yKHIpe3RoaXMub3B0aW9ucz1yO3RoaXMuYWxpdmU9ITA7dGhpcy5mbHVzaGVkPSExO3RoaXMuZG9uZT0hMTt0aGlzLnBlbmRpbmc9MDt0aGlzLmNsZWFudXBzPVtdO3RoaXMucmVmcz1uZXcgTWFwO3RoaXMua2V5cz1uZXcgU2V0O3RoaXMuaWRzPTA7dGhpcy5wbHVnaW5zPUEoci5wbHVnaW5zKX13cml0ZShyLHQpe3RoaXMuYWxpdmUmJiF0aGlzLmZsdXNoZWQmJih0aGlzLnBlbmRpbmcrKyx0aGlzLmtleXMuYWRkKHIpLHRoaXMuY2xlYW51cHMucHVzaChjbih0LHtwbHVnaW5zOnRoaXMucGx1Z2lucyxzY29wZUlkOnRoaXMub3B0aW9ucy5zY29wZUlkLHJlZnM6dGhpcy5yZWZzLGRpc2FibGVkRmVhdHVyZXM6dGhpcy5vcHRpb25zLmRpc2FibGVkRmVhdHVyZXMsb25FcnJvcjp0aGlzLm9wdGlvbnMub25FcnJvcixvblNlcmlhbGl6ZToobixhKT0+e3RoaXMuYWxpdmUmJnRoaXMub3B0aW9ucy5vbkRhdGEoYT90aGlzLm9wdGlvbnMuZ2xvYmFsSWRlbnRpZmllcisnW1wiJyt5KHIpKydcIl09JytuOm4pfSxvbkRvbmU6KCk9Pnt0aGlzLmFsaXZlJiYodGhpcy5wZW5kaW5nLS0sdGhpcy5wZW5kaW5nPD0wJiZ0aGlzLmZsdXNoZWQmJiF0aGlzLmRvbmUmJnRoaXMub3B0aW9ucy5vbkRvbmUmJih0aGlzLm9wdGlvbnMub25Eb25lKCksdGhpcy5kb25lPSEwKSl9fSkpKX1nZXROZXh0SUQoKXtmb3IoO3RoaXMua2V5cy5oYXMoXCJcIit0aGlzLmlkcyk7KXRoaXMuaWRzKys7cmV0dXJuXCJcIit0aGlzLmlkc31wdXNoKHIpe2xldCB0PXRoaXMuZ2V0TmV4dElEKCk7cmV0dXJuIHRoaXMud3JpdGUodCxyKSx0fWZsdXNoKCl7dGhpcy5hbGl2ZSYmKHRoaXMuZmx1c2hlZD0hMCx0aGlzLnBlbmRpbmc8PTAmJiF0aGlzLmRvbmUmJnRoaXMub3B0aW9ucy5vbkRvbmUmJih0aGlzLm9wdGlvbnMub25Eb25lKCksdGhpcy5kb25lPSEwKSl9Y2xvc2UoKXtpZih0aGlzLmFsaXZlKXtmb3IobGV0IHI9MCx0PXRoaXMuY2xlYW51cHMubGVuZ3RoO3I8dDtyKyspdGhpcy5jbGVhbnVwc1tyXSgpOyF0aGlzLmRvbmUmJnRoaXMub3B0aW9ucy5vbkRvbmUmJih0aGlzLm9wdGlvbnMub25Eb25lKCksdGhpcy5kb25lPSEwKSx0aGlzLmFsaXZlPSExfX19O2Z1bmN0aW9uIE51KGUscj17fSl7bGV0IHQ9QShyLnBsdWdpbnMpLG49dWUoMSx7cGx1Z2luczp0LGRpc2FibGVkRmVhdHVyZXM6ci5kaXNhYmxlZEZlYXR1cmVzfSksYT1sZShuLGUpLHM9aXIoe3BsdWdpbnM6dCxmZWF0dXJlczpuLmJhc2UuZmVhdHVyZXMsbWFya2VkUmVmczpuLmJhc2UubWFya2VkfSk7cmV0dXJuIGxyKHMsYSl9YXN5bmMgZnVuY3Rpb24gYnUoZSxyPXt9KXtsZXQgdD1BKHIucGx1Z2lucyksbj1uZSgxLHtwbHVnaW5zOnQsZGlzYWJsZWRGZWF0dXJlczpyLmRpc2FibGVkRmVhdHVyZXN9KSxhPWF3YWl0IG9lKG4sZSkscz1pcih7cGx1Z2luczp0LGZlYXR1cmVzOm4uYmFzZS5mZWF0dXJlcyxtYXJrZWRSZWZzOm4uYmFzZS5tYXJrZWR9KTtyZXR1cm4gbHIocyxhKX1mdW5jdGlvbiB2dShlKXtyZXR1cm4oMCxldmFsKShlKX1mdW5jdGlvbiBDdShlLHI9e30pe2xldCB0PUEoci5wbHVnaW5zKSxuPXVlKDEse3BsdWdpbnM6dCxkaXNhYmxlZEZlYXR1cmVzOnIuZGlzYWJsZWRGZWF0dXJlc30pO3JldHVybnt0OmxlKG4sZSksZjpuLmJhc2UuZmVhdHVyZXMsbTpBcnJheS5mcm9tKG4uYmFzZS5tYXJrZWQpfX1hc3luYyBmdW5jdGlvbiBBdShlLHI9e30pe2xldCB0PUEoci5wbHVnaW5zKSxuPW5lKDEse3BsdWdpbnM6dCxkaXNhYmxlZEZlYXR1cmVzOnIuZGlzYWJsZWRGZWF0dXJlc30pO3JldHVybnt0OmF3YWl0IG9lKG4sZSksZjpuLmJhc2UuZmVhdHVyZXMsbTpBcnJheS5mcm9tKG4uYmFzZS5tYXJrZWQpfX1mdW5jdGlvbiBFdShlLHI9e30pe2xldCB0PUEoci5wbHVnaW5zKSxuPWlyKHtwbHVnaW5zOnQsZmVhdHVyZXM6ZS5mLG1hcmtlZFJlZnM6ZS5tfSk7cmV0dXJuIGxyKG4sZS50KX1mdW5jdGlvbiBJdShlLHI9e30pe3ZhciBpO2xldCB0PUEoci5wbHVnaW5zKSxuPXIuZGlzYWJsZWRGZWF0dXJlc3x8MCxhPShpPWUuZikhPW51bGw/aTo2MyxzPU10KHtwbHVnaW5zOnQsbWFya2VkUmVmczplLm0sZmVhdHVyZXM6YSZ+bixkaXNhYmxlZEZlYXR1cmVzOm59KTtyZXR1cm4gYXIocyxlLnQpfWV4cG9ydHtMIGFzIEZlYXR1cmUsWSBhcyBPcGFxdWVSZWZlcmVuY2UsU3IgYXMgU2VyaWFsaXplcixndCBhcyBTZXJvdmFsQ29uZmxpY3RlZE5vZGVJZEVycm9yLGVlIGFzIFNlcm92YWxEZXB0aExpbWl0RXJyb3IsSGUgYXMgU2Vyb3ZhbERlc2VyaWFsaXphdGlvbkVycm9yLFNlIGFzIFNlcm92YWxFcnJvcixoIGFzIFNlcm92YWxNYWxmb3JtZWROb2RlRXJyb3IsViBhcyBTZXJvdmFsTWlzc2luZ0luc3RhbmNlRXJyb3IsUSBhcyBTZXJvdmFsTWlzc2luZ1BsdWdpbkVycm9yLFJlIGFzIFNlcm92YWxNaXNzaW5nUmVmZXJlbmNlRXJyb3IsUGUgYXMgU2Vyb3ZhbE1pc3NpbmdSZWZlcmVuY2VGb3JJZEVycm9yLGFlIGFzIFNlcm92YWxNb2RlLHogYXMgU2Vyb3ZhbFBhcnNlckVycm9yLElyIGFzIFNlcm92YWxTZXJpYWxpemF0aW9uRXJyb3IsSmUgYXMgU2Vyb3ZhbFVua25vd25UeXBlZEFycmF5RXJyb3IsdyBhcyBTZXJvdmFsVW5zdXBwb3J0ZWROb2RlRXJyb3IseCBhcyBTZXJvdmFsVW5zdXBwb3J0ZWRUeXBlRXJyb3IsRXUgYXMgY29tcGlsZUpTT04sbmkgYXMgY3JlYXRlUGx1Z2luLHBuIGFzIGNyZWF0ZVJlZmVyZW5jZSx0ZSBhcyBjcmVhdGVTdHJlYW0scnUgYXMgY3Jvc3NTZXJpYWxpemUsdHUgYXMgY3Jvc3NTZXJpYWxpemVBc3luYyxjbiBhcyBjcm9zc1NlcmlhbGl6ZVN0cmVhbSx2dSBhcyBkZXNlcmlhbGl6ZSxzdSBhcyBmcm9tQ3Jvc3NKU09OLEl1IGFzIGZyb21KU09OLG1uIGFzIGdldENyb3NzUmVmZXJlbmNlSGVhZGVyLEEgYXMgcmVzb2x2ZVBsdWdpbnMsTnUgYXMgc2VyaWFsaXplLGJ1IGFzIHNlcmlhbGl6ZUFzeW5jLG51IGFzIHRvQ3Jvc3NKU09OLG91IGFzIHRvQ3Jvc3NKU09OQXN5bmMsYXUgYXMgdG9Dcm9zc0pTT05TdHJlYW0sQ3UgYXMgdG9KU09OLEF1IGFzIHRvSlNPTkFzeW5jfTtcbiIsICJpbXBvcnR7Y3JlYXRlUGx1Z2luIGFzIGJ9ZnJvbVwic2Vyb3ZhbFwiO3ZhciB1PWU9PntsZXQgcj1uZXcgQWJvcnRDb250cm9sbGVyLGE9ci5hYm9ydC5iaW5kKHIpO3JldHVybiBlLnRoZW4oYSxhKSxyfTtmdW5jdGlvbiBFKGUpe2UodGhpcy5yZWFzb24pfWZ1bmN0aW9uIEQoZSl7dGhpcy5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIixFLmJpbmQodGhpcyxlKSx7b25jZTohMH0pfWZ1bmN0aW9uIGMoZSl7cmV0dXJuIG5ldyBQcm9taXNlKEQuYmluZChlKSl9dmFyIGk9e30sRj1iKHt0YWc6XCJzZXJvdmFsLXBsdWdpbnMvd2ViL0Fib3J0Q29udHJvbGxlckZhY3RvcnlQbHVnaW5cIix0ZXN0KGUpe3JldHVybiBlPT09aX0scGFyc2U6e3N5bmMoKXtyZXR1cm4gaX0sYXN5bmMgYXN5bmMoKXtyZXR1cm4gYXdhaXQgUHJvbWlzZS5yZXNvbHZlKGkpfSxzdHJlYW0oKXtyZXR1cm4gaX19LHNlcmlhbGl6ZSgpe3JldHVybiB1LnRvU3RyaW5nKCl9LGRlc2VyaWFsaXplKCl7cmV0dXJuIHV9fSksQT1iKHt0YWc6XCJzZXJvdmFsLXBsdWdpbnMvd2ViL0Fib3J0U2lnbmFsXCIsZXh0ZW5kczpbRl0sdGVzdChlKXtyZXR1cm4gdHlwZW9mIEFib3J0U2lnbmFsPT1cInVuZGVmaW5lZFwiPyExOmUgaW5zdGFuY2VvZiBBYm9ydFNpZ25hbH0scGFyc2U6e3N5bmMoZSxyKXtyZXR1cm4gZS5hYm9ydGVkP3tyZWFzb246ci5wYXJzZShlLnJlYXNvbil9Ont9fSxhc3luYyBhc3luYyhlLHIpe2lmKGUuYWJvcnRlZClyZXR1cm57cmVhc29uOmF3YWl0IHIucGFyc2UoZS5yZWFzb24pfTtsZXQgYT1hd2FpdCBjKGUpO3JldHVybntyZWFzb246YXdhaXQgci5wYXJzZShhKX19LHN0cmVhbShlLHIpe2lmKGUuYWJvcnRlZClyZXR1cm57cmVhc29uOnIucGFyc2UoZS5yZWFzb24pfTtsZXQgYT1jKGUpO3JldHVybntmYWN0b3J5OnIucGFyc2UoaSksY29udHJvbGxlcjpyLnBhcnNlKGEpfX19LHNlcmlhbGl6ZShlLHIpe3JldHVybiBlLnJlYXNvbj9cIkFib3J0U2lnbmFsLmFib3J0KFwiK3Iuc2VyaWFsaXplKGUucmVhc29uKStcIilcIjplLmNvbnRyb2xsZXImJmUuZmFjdG9yeT9cIihcIityLnNlcmlhbGl6ZShlLmZhY3RvcnkpK1wiKShcIityLnNlcmlhbGl6ZShlLmNvbnRyb2xsZXIpK1wiKS5zaWduYWxcIjpcIihuZXcgQWJvcnRDb250cm9sbGVyKS5zaWduYWxcIn0sZGVzZXJpYWxpemUoZSxyKXtyZXR1cm4gZS5yZWFzb24/QWJvcnRTaWduYWwuYWJvcnQoci5kZXNlcmlhbGl6ZShlLnJlYXNvbikpOmUuY29udHJvbGxlcj91KHIuZGVzZXJpYWxpemUoZS5jb250cm9sbGVyKSkuc2lnbmFsOm5ldyBBYm9ydENvbnRyb2xsZXIoKS5zaWduYWx9fSksTz1BO2ltcG9ydHtjcmVhdGVQbHVnaW4gYXMgQ31mcm9tXCJzZXJvdmFsXCI7dmFyIEk9Qyh7dGFnOlwic2Vyb3ZhbC1wbHVnaW5zL3dlYi9CbG9iXCIsdGVzdChlKXtyZXR1cm4gdHlwZW9mIEJsb2I9PVwidW5kZWZpbmVkXCI/ITE6ZSBpbnN0YW5jZW9mIEJsb2J9LHBhcnNlOnthc3luYyBhc3luYyhlLHIpe3JldHVybnt0eXBlOmF3YWl0IHIucGFyc2UoZS50eXBlKSxidWZmZXI6YXdhaXQgci5wYXJzZShhd2FpdCBlLmFycmF5QnVmZmVyKCkpfX19LHNlcmlhbGl6ZShlLHIpe3JldHVyblwibmV3IEJsb2IoW1wiK3Iuc2VyaWFsaXplKGUuYnVmZmVyKStcIl0se3R5cGU6XCIrci5zZXJpYWxpemUoZS50eXBlKStcIn0pXCJ9LGRlc2VyaWFsaXplKGUscil7cmV0dXJuIG5ldyBCbG9iKFtyLmRlc2VyaWFsaXplKGUuYnVmZmVyKV0se3R5cGU6ci5kZXNlcmlhbGl6ZShlLnR5cGUpfSl9fSksQj1JO2ltcG9ydHtjcmVhdGVQbHVnaW4gYXMgVH1mcm9tXCJzZXJvdmFsXCI7ZnVuY3Rpb24gZChlKXtyZXR1cm57ZGV0YWlsOmUuZGV0YWlsLGJ1YmJsZXM6ZS5idWJibGVzLGNhbmNlbGFibGU6ZS5jYW5jZWxhYmxlLGNvbXBvc2VkOmUuY29tcG9zZWR9fXZhciBVPVQoe3RhZzpcInNlcm92YWwtcGx1Z2lucy93ZWIvQ3VzdG9tRXZlbnRcIix0ZXN0KGUpe3JldHVybiB0eXBlb2YgQ3VzdG9tRXZlbnQ9PVwidW5kZWZpbmVkXCI/ITE6ZSBpbnN0YW5jZW9mIEN1c3RvbUV2ZW50fSxwYXJzZTp7c3luYyhlLHIpe3JldHVybnt0eXBlOnIucGFyc2UoZS50eXBlKSxvcHRpb25zOnIucGFyc2UoZChlKSl9fSxhc3luYyBhc3luYyhlLHIpe3JldHVybnt0eXBlOmF3YWl0IHIucGFyc2UoZS50eXBlKSxvcHRpb25zOmF3YWl0IHIucGFyc2UoZChlKSl9fSxzdHJlYW0oZSxyKXtyZXR1cm57dHlwZTpyLnBhcnNlKGUudHlwZSksb3B0aW9uczpyLnBhcnNlKGQoZSkpfX19LHNlcmlhbGl6ZShlLHIpe3JldHVyblwibmV3IEN1c3RvbUV2ZW50KFwiK3Iuc2VyaWFsaXplKGUudHlwZSkrXCIsXCIrci5zZXJpYWxpemUoZS5vcHRpb25zKStcIilcIn0sZGVzZXJpYWxpemUoZSxyKXtyZXR1cm4gbmV3IEN1c3RvbUV2ZW50KHIuZGVzZXJpYWxpemUoZS50eXBlKSxyLmRlc2VyaWFsaXplKGUub3B0aW9ucykpfX0pLEw9VTtpbXBvcnR7Y3JlYXRlUGx1Z2luIGFzIE19ZnJvbVwic2Vyb3ZhbFwiO3ZhciBfPU0oe3RhZzpcInNlcm92YWwtcGx1Z2lucy93ZWIvRE9NRXhjZXB0aW9uXCIsdGVzdChlKXtyZXR1cm4gdHlwZW9mIERPTUV4Y2VwdGlvbj09XCJ1bmRlZmluZWRcIj8hMTplIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9ufSxwYXJzZTp7c3luYyhlLHIpe3JldHVybntuYW1lOnIucGFyc2UoZS5uYW1lKSxtZXNzYWdlOnIucGFyc2UoZS5tZXNzYWdlKX19LGFzeW5jIGFzeW5jKGUscil7cmV0dXJue25hbWU6YXdhaXQgci5wYXJzZShlLm5hbWUpLG1lc3NhZ2U6YXdhaXQgci5wYXJzZShlLm1lc3NhZ2UpfX0sc3RyZWFtKGUscil7cmV0dXJue25hbWU6ci5wYXJzZShlLm5hbWUpLG1lc3NhZ2U6ci5wYXJzZShlLm1lc3NhZ2UpfX19LHNlcmlhbGl6ZShlLHIpe3JldHVyblwibmV3IERPTUV4Y2VwdGlvbihcIityLnNlcmlhbGl6ZShlLm1lc3NhZ2UpK1wiLFwiK3Iuc2VyaWFsaXplKGUubmFtZSkrXCIpXCJ9LGRlc2VyaWFsaXplKGUscil7cmV0dXJuIG5ldyBET01FeGNlcHRpb24oci5kZXNlcmlhbGl6ZShlLm1lc3NhZ2UpLHIuZGVzZXJpYWxpemUoZS5uYW1lKSl9fSkscT1fO2ltcG9ydHtjcmVhdGVQbHVnaW4gYXMgSH1mcm9tXCJzZXJvdmFsXCI7ZnVuY3Rpb24gZihlKXtyZXR1cm57YnViYmxlczplLmJ1YmJsZXMsY2FuY2VsYWJsZTplLmNhbmNlbGFibGUsY29tcG9zZWQ6ZS5jb21wb3NlZH19dmFyIGs9SCh7dGFnOlwic2Vyb3ZhbC1wbHVnaW5zL3dlYi9FdmVudFwiLHRlc3QoZSl7cmV0dXJuIHR5cGVvZiBFdmVudD09XCJ1bmRlZmluZWRcIj8hMTplIGluc3RhbmNlb2YgRXZlbnR9LHBhcnNlOntzeW5jKGUscil7cmV0dXJue3R5cGU6ci5wYXJzZShlLnR5cGUpLG9wdGlvbnM6ci5wYXJzZShmKGUpKX19LGFzeW5jIGFzeW5jKGUscil7cmV0dXJue3R5cGU6YXdhaXQgci5wYXJzZShlLnR5cGUpLG9wdGlvbnM6YXdhaXQgci5wYXJzZShmKGUpKX19LHN0cmVhbShlLHIpe3JldHVybnt0eXBlOnIucGFyc2UoZS50eXBlKSxvcHRpb25zOnIucGFyc2UoZihlKSl9fX0sc2VyaWFsaXplKGUscil7cmV0dXJuXCJuZXcgRXZlbnQoXCIrci5zZXJpYWxpemUoZS50eXBlKStcIixcIityLnNlcmlhbGl6ZShlLm9wdGlvbnMpK1wiKVwifSxkZXNlcmlhbGl6ZShlLHIpe3JldHVybiBuZXcgRXZlbnQoci5kZXNlcmlhbGl6ZShlLnR5cGUpLHIuZGVzZXJpYWxpemUoZS5vcHRpb25zKSl9fSksWT1rO2ltcG9ydHtjcmVhdGVQbHVnaW4gYXMgan1mcm9tXCJzZXJvdmFsXCI7dmFyIFY9aih7dGFnOlwic2Vyb3ZhbC1wbHVnaW5zL3dlYi9GaWxlXCIsdGVzdChlKXtyZXR1cm4gdHlwZW9mIEZpbGU9PVwidW5kZWZpbmVkXCI/ITE6ZSBpbnN0YW5jZW9mIEZpbGV9LHBhcnNlOnthc3luYyBhc3luYyhlLHIpe3JldHVybntuYW1lOmF3YWl0IHIucGFyc2UoZS5uYW1lKSxvcHRpb25zOmF3YWl0IHIucGFyc2Uoe3R5cGU6ZS50eXBlLGxhc3RNb2RpZmllZDplLmxhc3RNb2RpZmllZH0pLGJ1ZmZlcjphd2FpdCByLnBhcnNlKGF3YWl0IGUuYXJyYXlCdWZmZXIoKSl9fX0sc2VyaWFsaXplKGUscil7cmV0dXJuXCJuZXcgRmlsZShbXCIrci5zZXJpYWxpemUoZS5idWZmZXIpK1wiXSxcIityLnNlcmlhbGl6ZShlLm5hbWUpK1wiLFwiK3Iuc2VyaWFsaXplKGUub3B0aW9ucykrXCIpXCJ9LGRlc2VyaWFsaXplKGUscil7cmV0dXJuIG5ldyBGaWxlKFtyLmRlc2VyaWFsaXplKGUuYnVmZmVyKV0sci5kZXNlcmlhbGl6ZShlLm5hbWUpLHIuZGVzZXJpYWxpemUoZS5vcHRpb25zKSl9fSksbT1WO2ltcG9ydHtjcmVhdGVQbHVnaW4gYXMgU31mcm9tXCJzZXJvdmFsXCI7ZnVuY3Rpb24geShlKXtsZXQgcj1bXTtyZXR1cm4gZS5mb3JFYWNoKChhLHQpPT57ci5wdXNoKFt0LGFdKX0pLHJ9dmFyIG89e30sdj0oZSxyPW5ldyBGb3JtRGF0YSxhPTAsdD1lLmxlbmd0aCxzKT0+e2Zvcig7YTx0O2ErKylzPWVbYV0sci5hcHBlbmQoc1swXSxzWzFdKTtyZXR1cm4gcn0sRz1TKHt0YWc6XCJzZXJvdmFsLXBsdWdpbnMvd2ViL0Zvcm1EYXRhRmFjdG9yeVwiLHRlc3QoZSl7cmV0dXJuIGU9PT1vfSxwYXJzZTp7c3luYygpe3JldHVybiBvfSxhc3luYyBhc3luYygpe3JldHVybiBhd2FpdCBQcm9taXNlLnJlc29sdmUobyl9LHN0cmVhbSgpe3JldHVybiBvfX0sc2VyaWFsaXplKCl7cmV0dXJuIHYudG9TdHJpbmcoKX0sZGVzZXJpYWxpemUoKXtyZXR1cm4gb319KSxKPVMoe3RhZzpcInNlcm92YWwtcGx1Z2lucy93ZWIvRm9ybURhdGFcIixleHRlbmRzOlttLEddLHRlc3QoZSl7cmV0dXJuIHR5cGVvZiBGb3JtRGF0YT09XCJ1bmRlZmluZWRcIj8hMTplIGluc3RhbmNlb2YgRm9ybURhdGF9LHBhcnNlOntzeW5jKGUscil7cmV0dXJue2ZhY3Rvcnk6ci5wYXJzZShvKSxlbnRyaWVzOnIucGFyc2UoeShlKSl9fSxhc3luYyBhc3luYyhlLHIpe3JldHVybntmYWN0b3J5OmF3YWl0IHIucGFyc2UobyksZW50cmllczphd2FpdCByLnBhcnNlKHkoZSkpfX0sc3RyZWFtKGUscil7cmV0dXJue2ZhY3Rvcnk6ci5wYXJzZShvKSxlbnRyaWVzOnIucGFyc2UoeShlKSl9fX0sc2VyaWFsaXplKGUscil7cmV0dXJuXCIoXCIrci5zZXJpYWxpemUoZS5mYWN0b3J5KStcIikoXCIrci5zZXJpYWxpemUoZS5lbnRyaWVzKStcIilcIn0sZGVzZXJpYWxpemUoZSxyKXtyZXR1cm4gdihyLmRlc2VyaWFsaXplKGUuZW50cmllcykpfX0pLEs9SjtpbXBvcnR7Y3JlYXRlUGx1Z2luIGFzIFF9ZnJvbVwic2Vyb3ZhbFwiO2Z1bmN0aW9uIGcoZSl7bGV0IHI9W107cmV0dXJuIGUuZm9yRWFjaCgoYSx0KT0+e3IucHVzaChbdCxhXSl9KSxyfXZhciBXPVEoe3RhZzpcInNlcm92YWwtcGx1Z2lucy93ZWIvSGVhZGVyc1wiLHRlc3QoZSl7cmV0dXJuIHR5cGVvZiBIZWFkZXJzPT1cInVuZGVmaW5lZFwiPyExOmUgaW5zdGFuY2VvZiBIZWFkZXJzfSxwYXJzZTp7c3luYyhlLHIpe3JldHVybnt2YWx1ZTpyLnBhcnNlKGcoZSkpfX0sYXN5bmMgYXN5bmMoZSxyKXtyZXR1cm57dmFsdWU6YXdhaXQgci5wYXJzZShnKGUpKX19LHN0cmVhbShlLHIpe3JldHVybnt2YWx1ZTpyLnBhcnNlKGcoZSkpfX19LHNlcmlhbGl6ZShlLHIpe3JldHVyblwibmV3IEhlYWRlcnMoXCIrci5zZXJpYWxpemUoZS52YWx1ZSkrXCIpXCJ9LGRlc2VyaWFsaXplKGUscil7cmV0dXJuIG5ldyBIZWFkZXJzKHIuZGVzZXJpYWxpemUoZS52YWx1ZSkpfX0pLGw9VztpbXBvcnR7Y3JlYXRlUGx1Z2luIGFzIFh9ZnJvbVwic2Vyb3ZhbFwiO3ZhciBaPVgoe3RhZzpcInNlcm92YWwtcGx1Z2lucy93ZWIvSW1hZ2VEYXRhXCIsdGVzdChlKXtyZXR1cm4gdHlwZW9mIEltYWdlRGF0YT09XCJ1bmRlZmluZWRcIj8hMTplIGluc3RhbmNlb2YgSW1hZ2VEYXRhfSxwYXJzZTp7c3luYyhlLHIpe3JldHVybntkYXRhOnIucGFyc2UoZS5kYXRhKSx3aWR0aDpyLnBhcnNlKGUud2lkdGgpLGhlaWdodDpyLnBhcnNlKGUuaGVpZ2h0KSxvcHRpb25zOnIucGFyc2Uoe2NvbG9yU3BhY2U6ZS5jb2xvclNwYWNlfSl9fSxhc3luYyBhc3luYyhlLHIpe3JldHVybntkYXRhOmF3YWl0IHIucGFyc2UoZS5kYXRhKSx3aWR0aDphd2FpdCByLnBhcnNlKGUud2lkdGgpLGhlaWdodDphd2FpdCByLnBhcnNlKGUuaGVpZ2h0KSxvcHRpb25zOmF3YWl0IHIucGFyc2Uoe2NvbG9yU3BhY2U6ZS5jb2xvclNwYWNlfSl9fSxzdHJlYW0oZSxyKXtyZXR1cm57ZGF0YTpyLnBhcnNlKGUuZGF0YSksd2lkdGg6ci5wYXJzZShlLndpZHRoKSxoZWlnaHQ6ci5wYXJzZShlLmhlaWdodCksb3B0aW9uczpyLnBhcnNlKHtjb2xvclNwYWNlOmUuY29sb3JTcGFjZX0pfX19LHNlcmlhbGl6ZShlLHIpe3JldHVyblwibmV3IEltYWdlRGF0YShcIityLnNlcmlhbGl6ZShlLmRhdGEpK1wiLFwiK3Iuc2VyaWFsaXplKGUud2lkdGgpK1wiLFwiK3Iuc2VyaWFsaXplKGUuaGVpZ2h0KStcIixcIityLnNlcmlhbGl6ZShlLm9wdGlvbnMpK1wiKVwifSxkZXNlcmlhbGl6ZShlLHIpe3JldHVybiBuZXcgSW1hZ2VEYXRhKHIuZGVzZXJpYWxpemUoZS5kYXRhKSxyLmRlc2VyaWFsaXplKGUud2lkdGgpLHIuZGVzZXJpYWxpemUoZS5oZWlnaHQpLHIuZGVzZXJpYWxpemUoZS5vcHRpb25zKSl9fSksJD1aO2ltcG9ydHtjcmVhdGVQbHVnaW4gYXMgeixjcmVhdGVTdHJlYW0gYXMgUn1mcm9tXCJzZXJvdmFsXCI7dmFyIG49e30sUD1lPT5uZXcgUmVhZGFibGVTdHJlYW0oe3N0YXJ0OnI9PntlLm9uKHtuZXh0OmE9Pnt0cnl7ci5lbnF1ZXVlKGEpfWNhdGNoKHQpe319LHRocm93OmE9PntyLmVycm9yKGEpfSxyZXR1cm46KCk9Pnt0cnl7ci5jbG9zZSgpfWNhdGNoKGEpe319fSl9fSkseD16KHt0YWc6XCJzZXJvdmFsLXBsdWdpbnMvd2ViL1JlYWRhYmxlU3RyZWFtRmFjdG9yeVwiLHRlc3QoZSl7cmV0dXJuIGU9PT1ufSxwYXJzZTp7c3luYygpe3JldHVybiBufSxhc3luYyBhc3luYygpe3JldHVybiBhd2FpdCBQcm9taXNlLnJlc29sdmUobil9LHN0cmVhbSgpe3JldHVybiBufX0sc2VyaWFsaXplKCl7cmV0dXJuIFAudG9TdHJpbmcoKX0sZGVzZXJpYWxpemUoKXtyZXR1cm4gbn19KTtmdW5jdGlvbiB3KGUpe2xldCByPVIoKSxhPWUuZ2V0UmVhZGVyKCk7YXN5bmMgZnVuY3Rpb24gdCgpe3RyeXtsZXQgcz1hd2FpdCBhLnJlYWQoKTtzLmRvbmU/ci5yZXR1cm4ocy52YWx1ZSk6KHIubmV4dChzLnZhbHVlKSxhd2FpdCB0KCkpfWNhdGNoKHMpe3IudGhyb3cocyl9fXJldHVybiB0KCkuY2F0Y2goKCk9Pnt9KSxyfXZhciBlZT16KHt0YWc6XCJzZXJvdmFsL3BsdWdpbnMvd2ViL1JlYWRhYmxlU3RyZWFtXCIsZXh0ZW5kczpbeF0sdGVzdChlKXtyZXR1cm4gdHlwZW9mIFJlYWRhYmxlU3RyZWFtPT1cInVuZGVmaW5lZFwiPyExOmUgaW5zdGFuY2VvZiBSZWFkYWJsZVN0cmVhbX0scGFyc2U6e3N5bmMoZSxyKXtyZXR1cm57ZmFjdG9yeTpyLnBhcnNlKG4pLHN0cmVhbTpyLnBhcnNlKFIoKSl9fSxhc3luYyBhc3luYyhlLHIpe3JldHVybntmYWN0b3J5OmF3YWl0IHIucGFyc2Uobiksc3RyZWFtOmF3YWl0IHIucGFyc2UodyhlKSl9fSxzdHJlYW0oZSxyKXtyZXR1cm57ZmFjdG9yeTpyLnBhcnNlKG4pLHN0cmVhbTpyLnBhcnNlKHcoZSkpfX19LHNlcmlhbGl6ZShlLHIpe3JldHVyblwiKFwiK3Iuc2VyaWFsaXplKGUuZmFjdG9yeSkrXCIpKFwiK3Iuc2VyaWFsaXplKGUuc3RyZWFtKStcIilcIn0sZGVzZXJpYWxpemUoZSxyKXtsZXQgYT1yLmRlc2VyaWFsaXplKGUuc3RyZWFtKTtyZXR1cm4gUChhKX19KSxwPWVlO2ltcG9ydHtjcmVhdGVQbHVnaW4gYXMgcmV9ZnJvbVwic2Vyb3ZhbFwiO2Z1bmN0aW9uIE4oZSxyKXtyZXR1cm57Ym9keTpyLGNhY2hlOmUuY2FjaGUsY3JlZGVudGlhbHM6ZS5jcmVkZW50aWFscyxoZWFkZXJzOmUuaGVhZGVycyxpbnRlZ3JpdHk6ZS5pbnRlZ3JpdHksa2VlcGFsaXZlOmUua2VlcGFsaXZlLG1ldGhvZDplLm1ldGhvZCxtb2RlOmUubW9kZSxyZWRpcmVjdDplLnJlZGlyZWN0LHJlZmVycmVyOmUucmVmZXJyZXIscmVmZXJyZXJQb2xpY3k6ZS5yZWZlcnJlclBvbGljeX19dmFyIGFlPXJlKHt0YWc6XCJzZXJvdmFsLXBsdWdpbnMvd2ViL1JlcXVlc3RcIixleHRlbmRzOltwLGxdLHRlc3QoZSl7cmV0dXJuIHR5cGVvZiBSZXF1ZXN0PT1cInVuZGVmaW5lZFwiPyExOmUgaW5zdGFuY2VvZiBSZXF1ZXN0fSxwYXJzZTp7YXN5bmMgYXN5bmMoZSxyKXtyZXR1cm57dXJsOmF3YWl0IHIucGFyc2UoZS51cmwpLG9wdGlvbnM6YXdhaXQgci5wYXJzZShOKGUsZS5ib2R5JiYhZS5ib2R5VXNlZD9hd2FpdCBlLmNsb25lKCkuYXJyYXlCdWZmZXIoKTpudWxsKSl9fSxzdHJlYW0oZSxyKXtyZXR1cm57dXJsOnIucGFyc2UoZS51cmwpLG9wdGlvbnM6ci5wYXJzZShOKGUsZS5ib2R5JiYhZS5ib2R5VXNlZD9lLmNsb25lKCkuYm9keTpudWxsKSl9fX0sc2VyaWFsaXplKGUscil7cmV0dXJuXCJuZXcgUmVxdWVzdChcIityLnNlcmlhbGl6ZShlLnVybCkrXCIsXCIrci5zZXJpYWxpemUoZS5vcHRpb25zKStcIilcIn0sZGVzZXJpYWxpemUoZSxyKXtyZXR1cm4gbmV3IFJlcXVlc3Qoci5kZXNlcmlhbGl6ZShlLnVybCksci5kZXNlcmlhbGl6ZShlLm9wdGlvbnMpKX19KSx0ZT1hZTtpbXBvcnR7Y3JlYXRlUGx1Z2luIGFzIHNlfWZyb21cInNlcm92YWxcIjtmdW5jdGlvbiBoKGUpe3JldHVybntoZWFkZXJzOmUuaGVhZGVycyxzdGF0dXM6ZS5zdGF0dXMsc3RhdHVzVGV4dDplLnN0YXR1c1RleHR9fXZhciBvZT1zZSh7dGFnOlwic2Vyb3ZhbC1wbHVnaW5zL3dlYi9SZXNwb25zZVwiLGV4dGVuZHM6W3AsbF0sdGVzdChlKXtyZXR1cm4gdHlwZW9mIFJlc3BvbnNlPT1cInVuZGVmaW5lZFwiPyExOmUgaW5zdGFuY2VvZiBSZXNwb25zZX0scGFyc2U6e2FzeW5jIGFzeW5jKGUscil7cmV0dXJue2JvZHk6YXdhaXQgci5wYXJzZShlLmJvZHkmJiFlLmJvZHlVc2VkP2F3YWl0IGUuY2xvbmUoKS5hcnJheUJ1ZmZlcigpOm51bGwpLG9wdGlvbnM6YXdhaXQgci5wYXJzZShoKGUpKX19LHN0cmVhbShlLHIpe3JldHVybntib2R5OnIucGFyc2UoZS5ib2R5JiYhZS5ib2R5VXNlZD9lLmNsb25lKCkuYm9keTpudWxsKSxvcHRpb25zOnIucGFyc2UoaChlKSl9fX0sc2VyaWFsaXplKGUscil7cmV0dXJuXCJuZXcgUmVzcG9uc2UoXCIrci5zZXJpYWxpemUoZS5ib2R5KStcIixcIityLnNlcmlhbGl6ZShlLm9wdGlvbnMpK1wiKVwifSxkZXNlcmlhbGl6ZShlLHIpe3JldHVybiBuZXcgUmVzcG9uc2Uoci5kZXNlcmlhbGl6ZShlLmJvZHkpLHIuZGVzZXJpYWxpemUoZS5vcHRpb25zKSl9fSksbmU9b2U7aW1wb3J0e2NyZWF0ZVBsdWdpbiBhcyBpZX1mcm9tXCJzZXJvdmFsXCI7dmFyIGxlPWllKHt0YWc6XCJzZXJvdmFsLXBsdWdpbnMvd2ViL1VSTFwiLHRlc3QoZSl7cmV0dXJuIHR5cGVvZiBVUkw9PVwidW5kZWZpbmVkXCI/ITE6ZSBpbnN0YW5jZW9mIFVSTH0scGFyc2U6e3N5bmMoZSxyKXtyZXR1cm57dmFsdWU6ci5wYXJzZShlLmhyZWYpfX0sYXN5bmMgYXN5bmMoZSxyKXtyZXR1cm57dmFsdWU6YXdhaXQgci5wYXJzZShlLmhyZWYpfX0sc3RyZWFtKGUscil7cmV0dXJue3ZhbHVlOnIucGFyc2UoZS5ocmVmKX19fSxzZXJpYWxpemUoZSxyKXtyZXR1cm5cIm5ldyBVUkwoXCIrci5zZXJpYWxpemUoZS52YWx1ZSkrXCIpXCJ9LGRlc2VyaWFsaXplKGUscil7cmV0dXJuIG5ldyBVUkwoci5kZXNlcmlhbGl6ZShlLnZhbHVlKSl9fSkscGU9bGU7aW1wb3J0e2NyZWF0ZVBsdWdpbiBhcyB1ZX1mcm9tXCJzZXJvdmFsXCI7dmFyIGRlPXVlKHt0YWc6XCJzZXJvdmFsLXBsdWdpbnMvd2ViL1VSTFNlYXJjaFBhcmFtc1wiLHRlc3QoZSl7cmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXM9PVwidW5kZWZpbmVkXCI/ITE6ZSBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtc30scGFyc2U6e3N5bmMoZSxyKXtyZXR1cm57dmFsdWU6ci5wYXJzZShlLnRvU3RyaW5nKCkpfX0sYXN5bmMgYXN5bmMoZSxyKXtyZXR1cm57dmFsdWU6YXdhaXQgci5wYXJzZShlLnRvU3RyaW5nKCkpfX0sc3RyZWFtKGUscil7cmV0dXJue3ZhbHVlOnIucGFyc2UoZS50b1N0cmluZygpKX19fSxzZXJpYWxpemUoZSxyKXtyZXR1cm5cIm5ldyBVUkxTZWFyY2hQYXJhbXMoXCIrci5zZXJpYWxpemUoZS52YWx1ZSkrXCIpXCJ9LGRlc2VyaWFsaXplKGUscil7cmV0dXJuIG5ldyBVUkxTZWFyY2hQYXJhbXMoci5kZXNlcmlhbGl6ZShlLnZhbHVlKSl9fSksZmU9ZGU7ZXhwb3J0e08gYXMgQWJvcnRTaWduYWxQbHVnaW4sQiBhcyBCbG9iUGx1Z2luLEwgYXMgQ3VzdG9tRXZlbnRQbHVnaW4scSBhcyBET01FeGNlcHRpb25QbHVnaW4sWSBhcyBFdmVudFBsdWdpbixtIGFzIEZpbGVQbHVnaW4sSyBhcyBGb3JtRGF0YVBsdWdpbixsIGFzIEhlYWRlcnNQbHVnaW4sJCBhcyBJbWFnZURhdGFQbHVnaW4scCBhcyBSZWFkYWJsZVN0cmVhbVBsdWdpbix0ZSBhcyBSZXF1ZXN0UGx1Z2luLG5lIGFzIFJlc3BvbnNlUGx1Z2luLHBlIGFzIFVSTFBsdWdpbixmZSBhcyBVUkxTZWFyY2hQYXJhbXNQbHVnaW59O1xuIiwgImltcG9ydCB7IGNyZWF0ZU1lbW8sIHNoYXJlZENvbmZpZywgY3JlYXRlUm9vdCwgc3BsaXRQcm9wcyB9IGZyb20gJ3NvbGlkLWpzJztcbmV4cG9ydCB7IEVycm9yQm91bmRhcnksIEZvciwgSW5kZXgsIE1hdGNoLCBTaG93LCBTdXNwZW5zZSwgU3VzcGVuc2VMaXN0LCBTd2l0Y2gsIGNyZWF0ZUNvbXBvbmVudCwgY3JlYXRlUmVuZGVyRWZmZWN0IGFzIGVmZmVjdCwgZ2V0T3duZXIsIG1lcmdlUHJvcHMsIHVudHJhY2sgfSBmcm9tICdzb2xpZC1qcyc7XG5pbXBvcnQgeyBGZWF0dXJlLCBTZXJpYWxpemVyLCBnZXRDcm9zc1JlZmVyZW5jZUhlYWRlciB9IGZyb20gJ3Nlcm92YWwnO1xuaW1wb3J0IHsgQWJvcnRTaWduYWxQbHVnaW4sIEN1c3RvbUV2ZW50UGx1Z2luLCBET01FeGNlcHRpb25QbHVnaW4sIEV2ZW50UGx1Z2luLCBGb3JtRGF0YVBsdWdpbiwgSGVhZGVyc1BsdWdpbiwgUmVhZGFibGVTdHJlYW1QbHVnaW4sIFJlcXVlc3RQbHVnaW4sIFJlc3BvbnNlUGx1Z2luLCBVUkxTZWFyY2hQYXJhbXNQbHVnaW4sIFVSTFBsdWdpbiB9IGZyb20gJ3Nlcm92YWwtcGx1Z2lucy93ZWInO1xuXG5jb25zdCBib29sZWFucyA9IFtcImFsbG93ZnVsbHNjcmVlblwiLCBcImFzeW5jXCIsIFwiYWxwaGFcIixcblwiYXV0b2ZvY3VzXCIsXG5cImF1dG9wbGF5XCIsIFwiY2hlY2tlZFwiLCBcImNvbnRyb2xzXCIsIFwiZGVmYXVsdFwiLCBcImRpc2FibGVkXCIsIFwiZm9ybW5vdmFsaWRhdGVcIiwgXCJoaWRkZW5cIixcblwiaW5kZXRlcm1pbmF0ZVwiLCBcImluZXJ0XCIsXG5cImlzbWFwXCIsIFwibG9vcFwiLCBcIm11bHRpcGxlXCIsIFwibXV0ZWRcIiwgXCJub21vZHVsZVwiLCBcIm5vdmFsaWRhdGVcIiwgXCJvcGVuXCIsIFwicGxheXNpbmxpbmVcIiwgXCJyZWFkb25seVwiLCBcInJlcXVpcmVkXCIsIFwicmV2ZXJzZWRcIiwgXCJzZWFtbGVzc1wiLFxuXCJzZWxlY3RlZFwiLCBcImFkYXVjdGlvbmhlYWRlcnNcIixcblwiYnJvd3Npbmd0b3BpY3NcIixcblwiY3JlZGVudGlhbGxlc3NcIixcblwiZGVmYXVsdGNoZWNrZWRcIiwgXCJkZWZhdWx0bXV0ZWRcIiwgXCJkZWZhdWx0c2VsZWN0ZWRcIiwgXCJkZWZlclwiLCBcImRpc2FibGVwaWN0dXJlaW5waWN0dXJlXCIsIFwiZGlzYWJsZXJlbW90ZXBsYXliYWNrXCIsIFwicHJlc2VydmVzcGl0Y2hcIixcblwic2hhZG93cm9vdGNsb25hYmxlXCIsIFwic2hhZG93cm9vdGN1c3RvbWVsZW1lbnRyZWdpc3RyeVwiLFxuXCJzaGFkb3dyb290ZGVsZWdhdGVzZm9jdXNcIiwgXCJzaGFkb3dyb290c2VyaWFsaXphYmxlXCIsXG5cInNoYXJlZHN0b3JhZ2V3cml0YWJsZVwiXG5dO1xuY29uc3QgQm9vbGVhbkF0dHJpYnV0ZXMgPSAvKiNfX1BVUkVfXyovbmV3IFNldChib29sZWFucyk7XG5jb25zdCBQcm9wZXJ0aWVzID0gLyojX19QVVJFX18qL25ldyBTZXQoW1xuXCJjbGFzc05hbWVcIiwgXCJ2YWx1ZVwiLFxuXCJyZWFkT25seVwiLCBcIm5vVmFsaWRhdGVcIiwgXCJmb3JtTm9WYWxpZGF0ZVwiLCBcImlzTWFwXCIsIFwibm9Nb2R1bGVcIiwgXCJwbGF5c0lubGluZVwiLCBcImFkQXVjdGlvbkhlYWRlcnNcIixcblwiYWxsb3dGdWxsc2NyZWVuXCIsIFwiYnJvd3NpbmdUb3BpY3NcIixcblwiZGVmYXVsdENoZWNrZWRcIiwgXCJkZWZhdWx0TXV0ZWRcIiwgXCJkZWZhdWx0U2VsZWN0ZWRcIiwgXCJkaXNhYmxlUGljdHVyZUluUGljdHVyZVwiLCBcImRpc2FibGVSZW1vdGVQbGF5YmFja1wiLCBcInByZXNlcnZlc1BpdGNoXCIsIFwic2hhZG93Um9vdENsb25hYmxlXCIsIFwic2hhZG93Um9vdEN1c3RvbUVsZW1lbnRSZWdpc3RyeVwiLFxuXCJzaGFkb3dSb290RGVsZWdhdGVzRm9jdXNcIiwgXCJzaGFkb3dSb290U2VyaWFsaXphYmxlXCIsXG5cInNoYXJlZFN0b3JhZ2VXcml0YWJsZVwiLFxuLi4uYm9vbGVhbnNdKTtcbmNvbnN0IENoaWxkUHJvcGVydGllcyA9IC8qI19fUFVSRV9fKi9uZXcgU2V0KFtcImlubmVySFRNTFwiLCBcInRleHRDb250ZW50XCIsIFwiaW5uZXJUZXh0XCIsIFwiY2hpbGRyZW5cIl0pO1xuY29uc3QgQWxpYXNlcyA9IC8qI19fUFVSRV9fKi9PYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIHtcbiAgY2xhc3NOYW1lOiBcImNsYXNzXCIsXG4gIGh0bWxGb3I6IFwiZm9yXCJcbn0pO1xuY29uc3QgUHJvcEFsaWFzZXMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCB7XG4gIGNsYXNzOiBcImNsYXNzTmFtZVwiLFxuICBub3ZhbGlkYXRlOiB7XG4gICAgJDogXCJub1ZhbGlkYXRlXCIsXG4gICAgRk9STTogMVxuICB9LFxuICBmb3Jtbm92YWxpZGF0ZToge1xuICAgICQ6IFwiZm9ybU5vVmFsaWRhdGVcIixcbiAgICBCVVRUT046IDEsXG4gICAgSU5QVVQ6IDFcbiAgfSxcbiAgaXNtYXA6IHtcbiAgICAkOiBcImlzTWFwXCIsXG4gICAgSU1HOiAxXG4gIH0sXG4gIG5vbW9kdWxlOiB7XG4gICAgJDogXCJub01vZHVsZVwiLFxuICAgIFNDUklQVDogMVxuICB9LFxuICBwbGF5c2lubGluZToge1xuICAgICQ6IFwicGxheXNJbmxpbmVcIixcbiAgICBWSURFTzogMVxuICB9LFxuICByZWFkb25seToge1xuICAgICQ6IFwicmVhZE9ubHlcIixcbiAgICBJTlBVVDogMSxcbiAgICBURVhUQVJFQTogMVxuICB9LFxuICBhZGF1Y3Rpb25oZWFkZXJzOiB7XG4gICAgJDogXCJhZEF1Y3Rpb25IZWFkZXJzXCIsXG4gICAgSUZSQU1FOiAxXG4gIH0sXG4gIGFsbG93ZnVsbHNjcmVlbjoge1xuICAgICQ6IFwiYWxsb3dGdWxsc2NyZWVuXCIsXG4gICAgSUZSQU1FOiAxXG4gIH0sXG4gIGJyb3dzaW5ndG9waWNzOiB7XG4gICAgJDogXCJicm93c2luZ1RvcGljc1wiLFxuICAgIElNRzogMVxuICB9LFxuICBkZWZhdWx0Y2hlY2tlZDoge1xuICAgICQ6IFwiZGVmYXVsdENoZWNrZWRcIixcbiAgICBJTlBVVDogMVxuICB9LFxuICBkZWZhdWx0bXV0ZWQ6IHtcbiAgICAkOiBcImRlZmF1bHRNdXRlZFwiLFxuICAgIEFVRElPOiAxLFxuICAgIFZJREVPOiAxXG4gIH0sXG4gIGRlZmF1bHRzZWxlY3RlZDoge1xuICAgICQ6IFwiZGVmYXVsdFNlbGVjdGVkXCIsXG4gICAgT1BUSU9OOiAxXG4gIH0sXG4gIGRpc2FibGVwaWN0dXJlaW5waWN0dXJlOiB7XG4gICAgJDogXCJkaXNhYmxlUGljdHVyZUluUGljdHVyZVwiLFxuICAgIFZJREVPOiAxXG4gIH0sXG4gIGRpc2FibGVyZW1vdGVwbGF5YmFjazoge1xuICAgICQ6IFwiZGlzYWJsZVJlbW90ZVBsYXliYWNrXCIsXG4gICAgQVVESU86IDEsXG4gICAgVklERU86IDFcbiAgfSxcbiAgcHJlc2VydmVzcGl0Y2g6IHtcbiAgICAkOiBcInByZXNlcnZlc1BpdGNoXCIsXG4gICAgQVVESU86IDEsXG4gICAgVklERU86IDFcbiAgfSxcbiAgc2hhZG93cm9vdGNsb25hYmxlOiB7XG4gICAgJDogXCJzaGFkb3dSb290Q2xvbmFibGVcIixcbiAgICBURU1QTEFURTogMVxuICB9LFxuICBzaGFkb3dyb290ZGVsZWdhdGVzZm9jdXM6IHtcbiAgICAkOiBcInNoYWRvd1Jvb3REZWxlZ2F0ZXNGb2N1c1wiLFxuICAgIFRFTVBMQVRFOiAxXG4gIH0sXG4gIHNoYWRvd3Jvb3RzZXJpYWxpemFibGU6IHtcbiAgICAkOiBcInNoYWRvd1Jvb3RTZXJpYWxpemFibGVcIixcbiAgICBURU1QTEFURTogMVxuICB9LFxuICBzaGFyZWRzdG9yYWdld3JpdGFibGU6IHtcbiAgICAkOiBcInNoYXJlZFN0b3JhZ2VXcml0YWJsZVwiLFxuICAgIElGUkFNRTogMSxcbiAgICBJTUc6IDFcbiAgfVxufSk7XG5mdW5jdGlvbiBnZXRQcm9wQWxpYXMocHJvcCwgdGFnTmFtZSkge1xuICBjb25zdCBhID0gUHJvcEFsaWFzZXNbcHJvcF07XG4gIHJldHVybiB0eXBlb2YgYSA9PT0gXCJvYmplY3RcIiA/IGFbdGFnTmFtZV0gPyBhW1wiJFwiXSA6IHVuZGVmaW5lZCA6IGE7XG59XG5jb25zdCBEZWxlZ2F0ZWRFdmVudHMgPSAvKiNfX1BVUkVfXyovbmV3IFNldChbXCJiZWZvcmVpbnB1dFwiLCBcImNsaWNrXCIsIFwiZGJsY2xpY2tcIiwgXCJjb250ZXh0bWVudVwiLCBcImZvY3VzaW5cIiwgXCJmb2N1c291dFwiLCBcImlucHV0XCIsIFwia2V5ZG93blwiLCBcImtleXVwXCIsIFwibW91c2Vkb3duXCIsIFwibW91c2Vtb3ZlXCIsIFwibW91c2VvdXRcIiwgXCJtb3VzZW92ZXJcIiwgXCJtb3VzZXVwXCIsIFwicG9pbnRlcmRvd25cIiwgXCJwb2ludGVybW92ZVwiLCBcInBvaW50ZXJvdXRcIiwgXCJwb2ludGVyb3ZlclwiLCBcInBvaW50ZXJ1cFwiLCBcInRvdWNoZW5kXCIsIFwidG91Y2htb3ZlXCIsIFwidG91Y2hzdGFydFwiXSk7XG5jb25zdCBTVkdFbGVtZW50cyA9IC8qI19fUFVSRV9fKi9uZXcgU2V0KFtcblwiYWx0R2x5cGhcIiwgXCJhbHRHbHlwaERlZlwiLCBcImFsdEdseXBoSXRlbVwiLCBcImFuaW1hdGVcIiwgXCJhbmltYXRlQ29sb3JcIiwgXCJhbmltYXRlTW90aW9uXCIsIFwiYW5pbWF0ZVRyYW5zZm9ybVwiLCBcImNpcmNsZVwiLCBcImNsaXBQYXRoXCIsIFwiY29sb3ItcHJvZmlsZVwiLCBcImN1cnNvclwiLCBcImRlZnNcIiwgXCJkZXNjXCIsIFwiZWxsaXBzZVwiLCBcImZlQmxlbmRcIiwgXCJmZUNvbG9yTWF0cml4XCIsIFwiZmVDb21wb25lbnRUcmFuc2ZlclwiLCBcImZlQ29tcG9zaXRlXCIsIFwiZmVDb252b2x2ZU1hdHJpeFwiLCBcImZlRGlmZnVzZUxpZ2h0aW5nXCIsIFwiZmVEaXNwbGFjZW1lbnRNYXBcIiwgXCJmZURpc3RhbnRMaWdodFwiLCBcImZlRHJvcFNoYWRvd1wiLCBcImZlRmxvb2RcIiwgXCJmZUZ1bmNBXCIsIFwiZmVGdW5jQlwiLCBcImZlRnVuY0dcIiwgXCJmZUZ1bmNSXCIsIFwiZmVHYXVzc2lhbkJsdXJcIiwgXCJmZUltYWdlXCIsIFwiZmVNZXJnZVwiLCBcImZlTWVyZ2VOb2RlXCIsIFwiZmVNb3JwaG9sb2d5XCIsIFwiZmVPZmZzZXRcIiwgXCJmZVBvaW50TGlnaHRcIiwgXCJmZVNwZWN1bGFyTGlnaHRpbmdcIiwgXCJmZVNwb3RMaWdodFwiLCBcImZlVGlsZVwiLCBcImZlVHVyYnVsZW5jZVwiLCBcImZpbHRlclwiLCBcImZvbnRcIiwgXCJmb250LWZhY2VcIiwgXCJmb250LWZhY2UtZm9ybWF0XCIsIFwiZm9udC1mYWNlLW5hbWVcIiwgXCJmb250LWZhY2Utc3JjXCIsIFwiZm9udC1mYWNlLXVyaVwiLCBcImZvcmVpZ25PYmplY3RcIiwgXCJnXCIsIFwiZ2x5cGhcIiwgXCJnbHlwaFJlZlwiLCBcImhrZXJuXCIsIFwiaW1hZ2VcIiwgXCJsaW5lXCIsIFwibGluZWFyR3JhZGllbnRcIiwgXCJtYXJrZXJcIiwgXCJtYXNrXCIsIFwibWV0YWRhdGFcIiwgXCJtaXNzaW5nLWdseXBoXCIsIFwibXBhdGhcIiwgXCJwYXRoXCIsIFwicGF0dGVyblwiLCBcInBvbHlnb25cIiwgXCJwb2x5bGluZVwiLCBcInJhZGlhbEdyYWRpZW50XCIsIFwicmVjdFwiLFxuXCJzZXRcIiwgXCJzdG9wXCIsXG5cInN2Z1wiLCBcInN3aXRjaFwiLCBcInN5bWJvbFwiLCBcInRleHRcIiwgXCJ0ZXh0UGF0aFwiLFxuXCJ0cmVmXCIsIFwidHNwYW5cIiwgXCJ1c2VcIiwgXCJ2aWV3XCIsIFwidmtlcm5cIl0pO1xuY29uc3QgU1ZHTmFtZXNwYWNlID0ge1xuICB4bGluazogXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsXG4gIHhtbDogXCJodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2VcIlxufTtcbmNvbnN0IERPTUVsZW1lbnRzID0gLyojX19QVVJFX18qL25ldyBTZXQoW1wiaHRtbFwiLCBcImJhc2VcIiwgXCJoZWFkXCIsIFwibGlua1wiLCBcIm1ldGFcIiwgXCJzdHlsZVwiLCBcInRpdGxlXCIsIFwiYm9keVwiLCBcImFkZHJlc3NcIiwgXCJhcnRpY2xlXCIsIFwiYXNpZGVcIiwgXCJmb290ZXJcIiwgXCJoZWFkZXJcIiwgXCJtYWluXCIsIFwibmF2XCIsIFwic2VjdGlvblwiLCBcImJvZHlcIiwgXCJibG9ja3F1b3RlXCIsIFwiZGRcIiwgXCJkaXZcIiwgXCJkbFwiLCBcImR0XCIsIFwiZmlnY2FwdGlvblwiLCBcImZpZ3VyZVwiLCBcImhyXCIsIFwibGlcIiwgXCJvbFwiLCBcInBcIiwgXCJwcmVcIiwgXCJ1bFwiLCBcImFcIiwgXCJhYmJyXCIsIFwiYlwiLCBcImJkaVwiLCBcImJkb1wiLCBcImJyXCIsIFwiY2l0ZVwiLCBcImNvZGVcIiwgXCJkYXRhXCIsIFwiZGZuXCIsIFwiZW1cIiwgXCJpXCIsIFwia2JkXCIsIFwibWFya1wiLCBcInFcIiwgXCJycFwiLCBcInJ0XCIsIFwicnVieVwiLCBcInNcIiwgXCJzYW1wXCIsIFwic21hbGxcIiwgXCJzcGFuXCIsIFwic3Ryb25nXCIsIFwic3ViXCIsIFwic3VwXCIsIFwidGltZVwiLCBcInVcIiwgXCJ2YXJcIiwgXCJ3YnJcIiwgXCJhcmVhXCIsIFwiYXVkaW9cIiwgXCJpbWdcIiwgXCJtYXBcIiwgXCJ0cmFja1wiLCBcInZpZGVvXCIsIFwiZW1iZWRcIiwgXCJpZnJhbWVcIiwgXCJvYmplY3RcIiwgXCJwYXJhbVwiLCBcInBpY3R1cmVcIiwgXCJwb3J0YWxcIiwgXCJzb3VyY2VcIiwgXCJzdmdcIiwgXCJtYXRoXCIsIFwiY2FudmFzXCIsIFwibm9zY3JpcHRcIiwgXCJzY3JpcHRcIiwgXCJkZWxcIiwgXCJpbnNcIiwgXCJjYXB0aW9uXCIsIFwiY29sXCIsIFwiY29sZ3JvdXBcIiwgXCJ0YWJsZVwiLCBcInRib2R5XCIsIFwidGRcIiwgXCJ0Zm9vdFwiLCBcInRoXCIsIFwidGhlYWRcIiwgXCJ0clwiLCBcImJ1dHRvblwiLCBcImRhdGFsaXN0XCIsIFwiZmllbGRzZXRcIiwgXCJmb3JtXCIsIFwiaW5wdXRcIiwgXCJsYWJlbFwiLCBcImxlZ2VuZFwiLCBcIm1ldGVyXCIsIFwib3B0Z3JvdXBcIiwgXCJvcHRpb25cIiwgXCJvdXRwdXRcIiwgXCJwcm9ncmVzc1wiLCBcInNlbGVjdFwiLCBcInRleHRhcmVhXCIsIFwiZGV0YWlsc1wiLCBcImRpYWxvZ1wiLCBcIm1lbnVcIiwgXCJzdW1tYXJ5XCIsIFwiZGV0YWlsc1wiLCBcInNsb3RcIiwgXCJ0ZW1wbGF0ZVwiLCBcImFjcm9ueW1cIiwgXCJhcHBsZXRcIiwgXCJiYXNlZm9udFwiLCBcImJnc291bmRcIiwgXCJiaWdcIiwgXCJibGlua1wiLCBcImNlbnRlclwiLCBcImNvbnRlbnRcIiwgXCJkaXJcIiwgXCJmb250XCIsIFwiZnJhbWVcIiwgXCJmcmFtZXNldFwiLCBcImhncm91cFwiLCBcImltYWdlXCIsIFwia2V5Z2VuXCIsIFwibWFycXVlZVwiLCBcIm1lbnVpdGVtXCIsIFwibm9iclwiLCBcIm5vZW1iZWRcIiwgXCJub2ZyYW1lc1wiLCBcInBsYWludGV4dFwiLCBcInJiXCIsIFwicnRjXCIsIFwic2hhZG93XCIsIFwic3BhY2VyXCIsIFwic3RyaWtlXCIsIFwidHRcIiwgXCJ4bXBcIiwgXCJhXCIsIFwiYWJiclwiLCBcImFjcm9ueW1cIiwgXCJhZGRyZXNzXCIsIFwiYXBwbGV0XCIsIFwiYXJlYVwiLCBcImFydGljbGVcIiwgXCJhc2lkZVwiLCBcImF1ZGlvXCIsIFwiYlwiLCBcImJhc2VcIiwgXCJiYXNlZm9udFwiLCBcImJkaVwiLCBcImJkb1wiLCBcImJnc291bmRcIiwgXCJiaWdcIiwgXCJibGlua1wiLCBcImJsb2NrcXVvdGVcIiwgXCJib2R5XCIsIFwiYnJcIiwgXCJidXR0b25cIiwgXCJjYW52YXNcIiwgXCJjYXB0aW9uXCIsIFwiY2VudGVyXCIsIFwiY2l0ZVwiLCBcImNvZGVcIiwgXCJjb2xcIiwgXCJjb2xncm91cFwiLCBcImNvbnRlbnRcIiwgXCJkYXRhXCIsIFwiZGF0YWxpc3RcIiwgXCJkZFwiLCBcImRlbFwiLCBcImRldGFpbHNcIiwgXCJkZm5cIiwgXCJkaWFsb2dcIiwgXCJkaXJcIiwgXCJkaXZcIiwgXCJkbFwiLCBcImR0XCIsIFwiZW1cIiwgXCJlbWJlZFwiLCBcImZpZWxkc2V0XCIsIFwiZmlnY2FwdGlvblwiLCBcImZpZ3VyZVwiLCBcImZvbnRcIiwgXCJmb290ZXJcIiwgXCJmb3JtXCIsIFwiZnJhbWVcIiwgXCJmcmFtZXNldFwiLCBcImhlYWRcIiwgXCJoZWFkZXJcIiwgXCJoZ3JvdXBcIiwgXCJoclwiLCBcImh0bWxcIiwgXCJpXCIsIFwiaWZyYW1lXCIsIFwiaW1hZ2VcIiwgXCJpbWdcIiwgXCJpbnB1dFwiLCBcImluc1wiLCBcImtiZFwiLCBcImtleWdlblwiLCBcImxhYmVsXCIsIFwibGVnZW5kXCIsIFwibGlcIiwgXCJsaW5rXCIsIFwibWFpblwiLCBcIm1hcFwiLCBcIm1hcmtcIiwgXCJtYXJxdWVlXCIsIFwibWVudVwiLCBcIm1lbnVpdGVtXCIsIFwibWV0YVwiLCBcIm1ldGVyXCIsIFwibmF2XCIsIFwibm9iclwiLCBcIm5vZW1iZWRcIiwgXCJub2ZyYW1lc1wiLCBcIm5vc2NyaXB0XCIsIFwib2JqZWN0XCIsIFwib2xcIiwgXCJvcHRncm91cFwiLCBcIm9wdGlvblwiLCBcIm91dHB1dFwiLCBcInBcIiwgXCJwYXJhbVwiLCBcInBpY3R1cmVcIiwgXCJwbGFpbnRleHRcIiwgXCJwb3J0YWxcIiwgXCJwcmVcIiwgXCJwcm9ncmVzc1wiLCBcInFcIiwgXCJyYlwiLCBcInJwXCIsIFwicnRcIiwgXCJydGNcIiwgXCJydWJ5XCIsIFwic1wiLCBcInNhbXBcIiwgXCJzY3JpcHRcIiwgXCJzZWN0aW9uXCIsIFwic2VsZWN0XCIsIFwic2hhZG93XCIsIFwic2xvdFwiLCBcInNtYWxsXCIsIFwic291cmNlXCIsIFwic3BhY2VyXCIsIFwic3BhblwiLCBcInN0cmlrZVwiLCBcInN0cm9uZ1wiLCBcInN0eWxlXCIsIFwic3ViXCIsIFwic3VtbWFyeVwiLCBcInN1cFwiLCBcInRhYmxlXCIsIFwidGJvZHlcIiwgXCJ0ZFwiLCBcInRlbXBsYXRlXCIsIFwidGV4dGFyZWFcIiwgXCJ0Zm9vdFwiLCBcInRoXCIsIFwidGhlYWRcIiwgXCJ0aW1lXCIsIFwidGl0bGVcIiwgXCJ0clwiLCBcInRyYWNrXCIsIFwidHRcIiwgXCJ1XCIsIFwidWxcIiwgXCJ2YXJcIiwgXCJ2aWRlb1wiLCBcIndiclwiLCBcInhtcFwiLCBcImlucHV0XCIsIFwiaDFcIiwgXCJoMlwiLCBcImgzXCIsIFwiaDRcIiwgXCJoNVwiLCBcImg2XCIsXG5cIndlYnZpZXdcIixcblwiaXNpbmRleFwiLCBcImxpc3RpbmdcIiwgXCJtdWx0aWNvbFwiLCBcIm5leHRpZFwiLCBcIm5vaW5kZXhcIiwgXCJzZWFyY2hcIl0pO1xuXG5jb25zdCBtZW1vID0gZm4gPT4gY3JlYXRlTWVtbygoKSA9PiBmbigpKTtcblxuY29uc3QgRVMyMDE3RkxBRyA9IEZlYXR1cmUuQWdncmVnYXRlRXJyb3JcbnwgRmVhdHVyZS5CaWdJbnRUeXBlZEFycmF5O1xuY29uc3QgR0xPQkFMX0lERU5USUZJRVIgPSAnXyRIWS5yJztcbmZ1bmN0aW9uIGNyZWF0ZVNlcmlhbGl6ZXIoe1xuICBvbkRhdGEsXG4gIG9uRG9uZSxcbiAgc2NvcGVJZCxcbiAgb25FcnJvcixcbiAgcGx1Z2luczogY3VzdG9tUGx1Z2luc1xufSkge1xuICBjb25zdCBkZWZhdWx0UGx1Z2lucyA9IFtBYm9ydFNpZ25hbFBsdWdpbixcbiAgQ3VzdG9tRXZlbnRQbHVnaW4sIERPTUV4Y2VwdGlvblBsdWdpbiwgRXZlbnRQbHVnaW4sXG4gIEZvcm1EYXRhUGx1Z2luLCBIZWFkZXJzUGx1Z2luLCBSZWFkYWJsZVN0cmVhbVBsdWdpbiwgUmVxdWVzdFBsdWdpbiwgUmVzcG9uc2VQbHVnaW4sIFVSTFNlYXJjaFBhcmFtc1BsdWdpbiwgVVJMUGx1Z2luXTtcbiAgY29uc3QgYWxsUGx1Z2lucyA9IGN1c3RvbVBsdWdpbnMgPyBbLi4uY3VzdG9tUGx1Z2lucywgLi4uZGVmYXVsdFBsdWdpbnNdIDogZGVmYXVsdFBsdWdpbnM7XG4gIHJldHVybiBuZXcgU2VyaWFsaXplcih7XG4gICAgc2NvcGVJZCxcbiAgICBwbHVnaW5zOiBhbGxQbHVnaW5zLFxuICAgIGdsb2JhbElkZW50aWZpZXI6IEdMT0JBTF9JREVOVElGSUVSLFxuICAgIGRpc2FibGVkRmVhdHVyZXM6IEVTMjAxN0ZMQUcsXG4gICAgb25EYXRhLFxuICAgIG9uRG9uZSxcbiAgICBvbkVycm9yXG4gIH0pO1xufVxuZnVuY3Rpb24gZ2V0TG9jYWxIZWFkZXJTY3JpcHQoaWQpIHtcbiAgcmV0dXJuIGdldENyb3NzUmVmZXJlbmNlSGVhZGVyKGlkKSArICc7Jztcbn1cblxuY29uc3QgVk9JRF9FTEVNRU5UUyA9IC9eKD86YXJlYXxiYXNlfGJyfGNvbHxlbWJlZHxocnxpbWd8aW5wdXR8a2V5Z2VufGxpbmt8bWVudWl0ZW18bWV0YXxwYXJhbXxzb3VyY2V8dHJhY2t8d2JyKSQvaTtcbmNvbnN0IFJFUExBQ0VfU0NSSVBUID0gYGZ1bmN0aW9uICRkZihlLG4sbyx0KXtpZihuPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGUpLG89ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbC1cIitlKSl7Zm9yKDtvJiY4IT09by5ub2RlVHlwZSYmby5ub2RlVmFsdWUhPT1cInBsLVwiK2U7KXQ9by5uZXh0U2libGluZyxvLnJlbW92ZSgpLG89dDtfJEhZLmRvbmU/by5yZW1vdmUoKTpvLnJlcGxhY2VXaXRoKG4uY29udGVudCl9bi5yZW1vdmUoKSxfJEhZLmZlKGUpfWA7XG5mdW5jdGlvbiByZW5kZXJUb1N0cmluZyhjb2RlLCBvcHRpb25zID0ge30pIHtcbiAgY29uc3Qge1xuICAgIHJlbmRlcklkXG4gIH0gPSBvcHRpb25zO1xuICBsZXQgc2NyaXB0cyA9IFwiXCI7XG4gIGNvbnN0IHNlcmlhbGl6ZXIgPSBjcmVhdGVTZXJpYWxpemVyKHtcbiAgICBzY29wZUlkOiByZW5kZXJJZCxcbiAgICBwbHVnaW5zOiBvcHRpb25zLnBsdWdpbnMsXG4gICAgb25EYXRhKHNjcmlwdCkge1xuICAgICAgaWYgKCFzY3JpcHRzKSB7XG4gICAgICAgIHNjcmlwdHMgPSBnZXRMb2NhbEhlYWRlclNjcmlwdChyZW5kZXJJZCk7XG4gICAgICB9XG4gICAgICBzY3JpcHRzICs9IHNjcmlwdCArIFwiO1wiO1xuICAgIH0sXG4gICAgb25FcnJvcjogb3B0aW9ucy5vbkVycm9yXG4gIH0pO1xuICBzaGFyZWRDb25maWcuY29udGV4dCA9IHtcbiAgICBpZDogcmVuZGVySWQgfHwgXCJcIixcbiAgICBjb3VudDogMCxcbiAgICBzdXNwZW5zZToge30sXG4gICAgbGF6eToge30sXG4gICAgYXNzZXRzOiBbXSxcbiAgICBub25jZTogb3B0aW9ucy5ub25jZSxcbiAgICBzZXJpYWxpemUoaWQsIHApIHtcbiAgICAgICFzaGFyZWRDb25maWcuY29udGV4dC5ub0h5ZHJhdGUgJiYgc2VyaWFsaXplci53cml0ZShpZCwgcCk7XG4gICAgfSxcbiAgICByb290czogMCxcbiAgICBuZXh0Um9vdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlcklkICsgXCJpLVwiICsgdGhpcy5yb290cysrO1xuICAgIH1cbiAgfTtcbiAgbGV0IGh0bWwgPSBjcmVhdGVSb290KGQgPT4ge1xuICAgIHNldFRpbWVvdXQoZCk7XG4gICAgcmV0dXJuIHJlc29sdmVTU1JOb2RlKGVzY2FwZShjb2RlKCkpKTtcbiAgfSk7XG4gIHNoYXJlZENvbmZpZy5jb250ZXh0Lm5vSHlkcmF0ZSA9IHRydWU7XG4gIHNlcmlhbGl6ZXIuY2xvc2UoKTtcbiAgaHRtbCA9IGluamVjdEFzc2V0cyhzaGFyZWRDb25maWcuY29udGV4dC5hc3NldHMsIGh0bWwpO1xuICBpZiAoc2NyaXB0cy5sZW5ndGgpIGh0bWwgPSBpbmplY3RTY3JpcHRzKGh0bWwsIHNjcmlwdHMsIG9wdGlvbnMubm9uY2UpO1xuICByZXR1cm4gaHRtbDtcbn1cbmZ1bmN0aW9uIHJlbmRlclRvU3RyaW5nQXN5bmMoY29kZSwgb3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IHtcbiAgICB0aW1lb3V0TXMgPSAzMDAwMFxuICB9ID0gb3B0aW9ucztcbiAgbGV0IHRpbWVvdXRIYW5kbGU7XG4gIGNvbnN0IHRpbWVvdXQgPSBuZXcgUHJvbWlzZSgoXywgcmVqZWN0KSA9PiB7XG4gICAgdGltZW91dEhhbmRsZSA9IHNldFRpbWVvdXQoKCkgPT4gcmVqZWN0KFwicmVuZGVyVG9TdHJpbmcgdGltZWQgb3V0XCIpLCB0aW1lb3V0TXMpO1xuICB9KTtcbiAgcmV0dXJuIFByb21pc2UucmFjZShbcmVuZGVyVG9TdHJlYW0oY29kZSwgb3B0aW9ucyksIHRpbWVvdXRdKS50aGVuKGh0bWwgPT4ge1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SGFuZGxlKTtcbiAgICByZXR1cm4gaHRtbDtcbiAgfSk7XG59XG5mdW5jdGlvbiByZW5kZXJUb1N0cmVhbShjb2RlLCBvcHRpb25zID0ge30pIHtcbiAgbGV0IHtcbiAgICBub25jZSxcbiAgICBvbkNvbXBsZXRlU2hlbGwsXG4gICAgb25Db21wbGV0ZUFsbCxcbiAgICByZW5kZXJJZCxcbiAgICBub1NjcmlwdHNcbiAgfSA9IG9wdGlvbnM7XG4gIGxldCBkaXNwb3NlO1xuICBjb25zdCBibG9ja2luZ1Byb21pc2VzID0gW107XG4gIGNvbnN0IHB1c2hUYXNrID0gdGFzayA9PiB7XG4gICAgaWYgKG5vU2NyaXB0cykgcmV0dXJuO1xuICAgIGlmICghdGFza3MgJiYgIWZpcnN0Rmx1c2hlZCkge1xuICAgICAgdGFza3MgPSBnZXRMb2NhbEhlYWRlclNjcmlwdChyZW5kZXJJZCk7XG4gICAgfVxuICAgIHRhc2tzICs9IHRhc2sgKyBcIjtcIjtcbiAgICBpZiAoIXRpbWVyICYmIGZpcnN0Rmx1c2hlZCkge1xuICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KHdyaXRlVGFza3MpO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgb25Eb25lID0gKCkgPT4ge1xuICAgIHdyaXRlVGFza3MoKTtcbiAgICBkb1NoZWxsKCk7XG4gICAgb25Db21wbGV0ZUFsbCAmJiBvbkNvbXBsZXRlQWxsKHtcbiAgICAgIHdyaXRlKHYpIHtcbiAgICAgICAgIWNvbXBsZXRlZCAmJiBidWZmZXIud3JpdGUodik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgd3JpdGFibGUgJiYgd3JpdGFibGUuZW5kKCk7XG4gICAgY29tcGxldGVkID0gdHJ1ZTtcbiAgICBpZiAoZmlyc3RGbHVzaGVkKSBkaXNwb3NlKCk7XG4gIH07XG4gIGNvbnN0IHNlcmlhbGl6ZXIgPSBjcmVhdGVTZXJpYWxpemVyKHtcbiAgICBzY29wZUlkOiBvcHRpb25zLnJlbmRlcklkLFxuICAgIHBsdWdpbnM6IG9wdGlvbnMucGx1Z2lucyxcbiAgICBvbkRhdGE6IHB1c2hUYXNrLFxuICAgIG9uRG9uZSxcbiAgICBvbkVycm9yOiBvcHRpb25zLm9uRXJyb3JcbiAgfSk7XG4gIGNvbnN0IGZsdXNoRW5kID0gKCkgPT4ge1xuICAgIGlmICghcmVnaXN0cnkuc2l6ZSkge1xuICAgICAgcXVldWUoKCkgPT4gcXVldWUoKCkgPT4gc2VyaWFsaXplci5mbHVzaCgpKSk7XG4gICAgfVxuICB9O1xuICBjb25zdCByZWdpc3RyeSA9IG5ldyBNYXAoKTtcbiAgY29uc3Qgd3JpdGVUYXNrcyA9ICgpID0+IHtcbiAgICBpZiAodGFza3MubGVuZ3RoICYmICFjb21wbGV0ZWQgJiYgZmlyc3RGbHVzaGVkKSB7XG4gICAgICBidWZmZXIud3JpdGUoYDxzY3JpcHQke25vbmNlID8gYCBub25jZT1cIiR7bm9uY2V9XCJgIDogXCJcIn0+JHt0YXNrc308L3NjcmlwdD5gKTtcbiAgICAgIHRhc2tzID0gXCJcIjtcbiAgICB9XG4gICAgdGltZXIgJiYgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICB0aW1lciA9IG51bGw7XG4gIH07XG4gIGxldCBjb250ZXh0O1xuICBsZXQgd3JpdGFibGU7XG4gIGxldCB0bXAgPSBcIlwiO1xuICBsZXQgdGFza3MgPSBcIlwiO1xuICBsZXQgZmlyc3RGbHVzaGVkID0gZmFsc2U7XG4gIGxldCBjb21wbGV0ZWQgPSBmYWxzZTtcbiAgbGV0IHNoZWxsQ29tcGxldGVkID0gZmFsc2U7XG4gIGxldCBzY3JpcHRGbHVzaGVkID0gZmFsc2U7XG4gIGxldCB0aW1lciA9IG51bGw7XG4gIGxldCBidWZmZXIgPSB7XG4gICAgd3JpdGUocGF5bG9hZCkge1xuICAgICAgdG1wICs9IHBheWxvYWQ7XG4gICAgfVxuICB9O1xuICBzaGFyZWRDb25maWcuY29udGV4dCA9IGNvbnRleHQgPSB7XG4gICAgaWQ6IHJlbmRlcklkIHx8IFwiXCIsXG4gICAgY291bnQ6IDAsXG4gICAgYXN5bmM6IHRydWUsXG4gICAgcmVzb3VyY2VzOiB7fSxcbiAgICBsYXp5OiB7fSxcbiAgICBzdXNwZW5zZToge30sXG4gICAgYXNzZXRzOiBbXSxcbiAgICBub25jZSxcbiAgICBibG9jayhwKSB7XG4gICAgICBpZiAoIWZpcnN0Rmx1c2hlZCkgYmxvY2tpbmdQcm9taXNlcy5wdXNoKHApO1xuICAgIH0sXG4gICAgcmVwbGFjZShpZCwgcGF5bG9hZEZuKSB7XG4gICAgICBpZiAoZmlyc3RGbHVzaGVkKSByZXR1cm47XG4gICAgICBjb25zdCBwbGFjZWhvbGRlciA9IGA8IS0tISQke2lkfS0tPmA7XG4gICAgICBjb25zdCBmaXJzdCA9IGh0bWwuaW5kZXhPZihwbGFjZWhvbGRlcik7XG4gICAgICBpZiAoZmlyc3QgPT09IC0xKSByZXR1cm47XG4gICAgICBjb25zdCBsYXN0ID0gaHRtbC5pbmRleE9mKGA8IS0tISQvJHtpZH0tLT5gLCBmaXJzdCArIHBsYWNlaG9sZGVyLmxlbmd0aCk7XG4gICAgICBodG1sID0gaHRtbC5zbGljZSgwLCBmaXJzdCkgKyByZXNvbHZlU1NSTm9kZShlc2NhcGUocGF5bG9hZEZuKCkpKSArIGh0bWwuc2xpY2UobGFzdCArIHBsYWNlaG9sZGVyLmxlbmd0aCArIDEpO1xuICAgIH0sXG4gICAgc2VyaWFsaXplKGlkLCBwLCB3YWl0KSB7XG4gICAgICBjb25zdCBzZXJ2ZXJPbmx5ID0gc2hhcmVkQ29uZmlnLmNvbnRleHQubm9IeWRyYXRlO1xuICAgICAgaWYgKCFmaXJzdEZsdXNoZWQgJiYgd2FpdCAmJiB0eXBlb2YgcCA9PT0gXCJvYmplY3RcIiAmJiBcInRoZW5cIiBpbiBwKSB7XG4gICAgICAgIGJsb2NraW5nUHJvbWlzZXMucHVzaChwKTtcbiAgICAgICAgIXNlcnZlck9ubHkgJiYgcC50aGVuKGQgPT4ge1xuICAgICAgICAgIHNlcmlhbGl6ZXIud3JpdGUoaWQsIGQpO1xuICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICBzZXJpYWxpemVyLndyaXRlKGlkLCBlKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKCFzZXJ2ZXJPbmx5KSBzZXJpYWxpemVyLndyaXRlKGlkLCBwKTtcbiAgICB9LFxuICAgIHJvb3RzOiAwLFxuICAgIG5leHRSb290KCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVySWQgKyBcImktXCIgKyB0aGlzLnJvb3RzKys7XG4gICAgfSxcbiAgICByZWdpc3RlckZyYWdtZW50KGtleSkge1xuICAgICAgaWYgKCFyZWdpc3RyeS5oYXMoa2V5KSkge1xuICAgICAgICBsZXQgcmVzb2x2ZSwgcmVqZWN0O1xuICAgICAgICBjb25zdCBwID0gbmV3IFByb21pc2UoKHIsIHJlaikgPT4gKHJlc29sdmUgPSByLCByZWplY3QgPSByZWopKTtcbiAgICAgICAgcmVnaXN0cnkuc2V0KGtleSwgZXJyID0+IHF1ZXVlKCgpID0+IHF1ZXVlKCgpID0+IHtcbiAgICAgICAgICBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgcXVldWUoZmx1c2hFbmQpO1xuICAgICAgICB9KSkpO1xuICAgICAgICBzZXJpYWxpemVyLndyaXRlKGtleSwgcCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKHZhbHVlLCBlcnJvcikgPT4ge1xuICAgICAgICBpZiAocmVnaXN0cnkuaGFzKGtleSkpIHtcbiAgICAgICAgICBjb25zdCByZXNvbHZlID0gcmVnaXN0cnkuZ2V0KGtleSk7XG4gICAgICAgICAgcmVnaXN0cnkuZGVsZXRlKGtleSk7XG4gICAgICAgICAgaWYgKHdhaXRGb3JGcmFnbWVudHMocmVnaXN0cnksIGtleSkpIHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFjb21wbGV0ZWQpIHtcbiAgICAgICAgICAgIGlmICghZmlyc3RGbHVzaGVkKSB7XG4gICAgICAgICAgICAgIHF1ZXVlKCgpID0+IGh0bWwgPSByZXBsYWNlUGxhY2Vob2xkZXIoaHRtbCwga2V5LCB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiBcIlwiKSk7XG4gICAgICAgICAgICAgIHJlc29sdmUoZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnVmZmVyLndyaXRlKGA8dGVtcGxhdGUgaWQ9XCIke2tleX1cIj4ke3ZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IFwiIFwifTwvdGVtcGxhdGU+YCk7XG4gICAgICAgICAgICAgIHB1c2hUYXNrKGAkZGYoXCIke2tleX1cIikkeyFzY3JpcHRGbHVzaGVkID8gXCI7XCIgKyBSRVBMQUNFX1NDUklQVCA6IFwiXCJ9YCk7XG4gICAgICAgICAgICAgIHJlc29sdmUoZXJyb3IpO1xuICAgICAgICAgICAgICBzY3JpcHRGbHVzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpcnN0Rmx1c2hlZDtcbiAgICAgIH07XG4gICAgfVxuICB9O1xuICBsZXQgaHRtbCA9IGNyZWF0ZVJvb3QoZCA9PiB7XG4gICAgZGlzcG9zZSA9IGQ7XG4gICAgcmV0dXJuIHJlc29sdmVTU1JOb2RlKGVzY2FwZShjb2RlKCkpKTtcbiAgfSk7XG4gIGZ1bmN0aW9uIGRvU2hlbGwoKSB7XG4gICAgaWYgKHNoZWxsQ29tcGxldGVkKSByZXR1cm47XG4gICAgc2hhcmVkQ29uZmlnLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIGNvbnRleHQubm9IeWRyYXRlID0gdHJ1ZTtcbiAgICBodG1sID0gaW5qZWN0QXNzZXRzKGNvbnRleHQuYXNzZXRzLCBodG1sKTtcbiAgICBpZiAodGFza3MubGVuZ3RoKSBodG1sID0gaW5qZWN0U2NyaXB0cyhodG1sLCB0YXNrcywgbm9uY2UpO1xuICAgIGJ1ZmZlci53cml0ZShodG1sKTtcbiAgICB0YXNrcyA9IFwiXCI7XG4gICAgb25Db21wbGV0ZVNoZWxsICYmIG9uQ29tcGxldGVTaGVsbCh7XG4gICAgICB3cml0ZSh2KSB7XG4gICAgICAgICFjb21wbGV0ZWQgJiYgYnVmZmVyLndyaXRlKHYpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHNoZWxsQ29tcGxldGVkID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4ge1xuICAgIHRoZW4oZm4pIHtcbiAgICAgIGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xuICAgICAgICBkaXNwb3NlKCk7XG4gICAgICAgIGZuKHRtcCk7XG4gICAgICB9XG4gICAgICBpZiAob25Db21wbGV0ZUFsbCkge1xuICAgICAgICBsZXQgb2dDb21wbGV0ZSA9IG9uQ29tcGxldGVBbGw7XG4gICAgICAgIG9uQ29tcGxldGVBbGwgPSBvcHRpb25zID0+IHtcbiAgICAgICAgICBvZ0NvbXBsZXRlKG9wdGlvbnMpO1xuICAgICAgICAgIGNvbXBsZXRlKCk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Ugb25Db21wbGV0ZUFsbCA9IGNvbXBsZXRlO1xuICAgICAgcXVldWUoZmx1c2hFbmQpO1xuICAgIH0sXG4gICAgcGlwZSh3KSB7XG4gICAgICBhbGxTZXR0bGVkKGJsb2NraW5nUHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBkb1NoZWxsKCk7XG4gICAgICAgICAgYnVmZmVyID0gd3JpdGFibGUgPSB3O1xuICAgICAgICAgIGJ1ZmZlci53cml0ZSh0bXApO1xuICAgICAgICAgIGZpcnN0Rmx1c2hlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKGNvbXBsZXRlZCkge1xuICAgICAgICAgICAgZGlzcG9zZSgpO1xuICAgICAgICAgICAgd3JpdGFibGUuZW5kKCk7XG4gICAgICAgICAgfSBlbHNlIGZsdXNoRW5kKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBwaXBlVG8odykge1xuICAgICAgcmV0dXJuIGFsbFNldHRsZWQoYmxvY2tpbmdQcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgICAgIGxldCByZXNvbHZlO1xuICAgICAgICBjb25zdCBwID0gbmV3IFByb21pc2UociA9PiByZXNvbHZlID0gcik7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGRvU2hlbGwoKTtcbiAgICAgICAgICBjb25zdCBlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG4gICAgICAgICAgY29uc3Qgd3JpdGVyID0gdy5nZXRXcml0ZXIoKTtcbiAgICAgICAgICB3cml0YWJsZSA9IHtcbiAgICAgICAgICAgIGVuZCgpIHtcbiAgICAgICAgICAgICAgd3JpdGVyLnJlbGVhc2VMb2NrKCk7XG4gICAgICAgICAgICAgIHcuY2xvc2UoKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgYnVmZmVyID0ge1xuICAgICAgICAgICAgd3JpdGUocGF5bG9hZCkge1xuICAgICAgICAgICAgICB3cml0ZXIud3JpdGUoZW5jb2Rlci5lbmNvZGUocGF5bG9hZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgYnVmZmVyLndyaXRlKHRtcCk7XG4gICAgICAgICAgZmlyc3RGbHVzaGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoY29tcGxldGVkKSB7XG4gICAgICAgICAgICBkaXNwb3NlKCk7XG4gICAgICAgICAgICB3cml0YWJsZS5lbmQoKTtcbiAgICAgICAgICB9IGVsc2UgZmx1c2hFbmQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gSHlkcmF0aW9uU2NyaXB0KHByb3BzKSB7XG4gIGNvbnN0IHtcbiAgICBub25jZVxuICB9ID0gc2hhcmVkQ29uZmlnLmNvbnRleHQ7XG4gIHJldHVybiBzc3IoZ2VuZXJhdGVIeWRyYXRpb25TY3JpcHQoe1xuICAgIG5vbmNlLFxuICAgIC4uLnByb3BzXG4gIH0pKTtcbn1cbmZ1bmN0aW9uIHNzcih0LCAuLi5ub2Rlcykge1xuICBpZiAobm9kZXMubGVuZ3RoKSB7XG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0ICs9IHRbaV07XG4gICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICBpZiAobm9kZSAhPT0gdW5kZWZpbmVkKSByZXN1bHQgKz0gcmVzb2x2ZVNTUk5vZGUobm9kZSk7XG4gICAgfVxuICAgIHQgPSByZXN1bHQgKyB0W25vZGVzLmxlbmd0aF07XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB0XG4gIH07XG59XG5mdW5jdGlvbiBzc3JDbGFzc0xpc3QodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIFwiXCI7XG4gIGxldCBjbGFzc0tleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSksXG4gICAgcmVzdWx0ID0gXCJcIjtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNsYXNzS2V5cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGNvbnN0IGtleSA9IGNsYXNzS2V5c1tpXSxcbiAgICAgIGNsYXNzVmFsdWUgPSAhIXZhbHVlW2tleV07XG4gICAgaWYgKCFrZXkgfHwga2V5ID09PSBcInVuZGVmaW5lZFwiIHx8ICFjbGFzc1ZhbHVlKSBjb250aW51ZTtcbiAgICBpICYmIChyZXN1bHQgKz0gXCIgXCIpO1xuICAgIHJlc3VsdCArPSBlc2NhcGUoa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gc3NyU3R5bGUodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIFwiXCI7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHJldHVybiBlc2NhcGUodmFsdWUsIHRydWUpO1xuICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgY29uc3QgayA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBrLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcyA9IGtbaV07XG4gICAgY29uc3QgdiA9IHZhbHVlW3NdO1xuICAgIGlmICh2ICE9IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGkpIHJlc3VsdCArPSBcIjtcIjtcbiAgICAgIGNvbnN0IHIgPSBlc2NhcGUodiwgdHJ1ZSk7XG4gICAgICBpZiAociAhPSB1bmRlZmluZWQgJiYgciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXN1bHQgKz0gYCR7c306JHtyfWA7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBzc3JTdHlsZVByb3BlcnR5KG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsID8gbmFtZSArIHZhbHVlIDogXCJcIjtcbn1cbmZ1bmN0aW9uIHNzckVsZW1lbnQodGFnLCBwcm9wcywgY2hpbGRyZW4sIG5lZWRzSWQpIHtcbiAgaWYgKHByb3BzID09IG51bGwpIHByb3BzID0ge307ZWxzZSBpZiAodHlwZW9mIHByb3BzID09PSBcImZ1bmN0aW9uXCIpIHByb3BzID0gcHJvcHMoKTtcbiAgY29uc3Qgc2tpcENoaWxkcmVuID0gVk9JRF9FTEVNRU5UUy50ZXN0KHRhZyk7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcyk7XG4gIGxldCByZXN1bHQgPSBgPCR7dGFnfSR7bmVlZHNJZCA/IHNzckh5ZHJhdGlvbktleSgpIDogXCJcIn0gYDtcbiAgbGV0IGNsYXNzUmVzb2x2ZWQ7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHByb3AgPSBrZXlzW2ldO1xuICAgIGlmIChDaGlsZFByb3BlcnRpZXMuaGFzKHByb3ApKSB7XG4gICAgICBpZiAoY2hpbGRyZW4gPT09IHVuZGVmaW5lZCAmJiAhc2tpcENoaWxkcmVuKSBjaGlsZHJlbiA9IHRhZyA9PT0gXCJzY3JpcHRcIiB8fCB0YWcgPT09IFwic3R5bGVcIiB8fCBwcm9wID09PSBcImlubmVySFRNTFwiID8gcHJvcHNbcHJvcF0gOiBlc2NhcGUocHJvcHNbcHJvcF0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IHZhbHVlID0gcHJvcHNbcHJvcF07XG4gICAgaWYgKHByb3AgPT09IFwic3R5bGVcIikge1xuICAgICAgcmVzdWx0ICs9IGBzdHlsZT1cIiR7c3NyU3R5bGUodmFsdWUpfVwiYDtcbiAgICB9IGVsc2UgaWYgKHByb3AgPT09IFwiY2xhc3NcIiB8fCBwcm9wID09PSBcImNsYXNzTmFtZVwiIHx8IHByb3AgPT09IFwiY2xhc3NMaXN0XCIpIHtcbiAgICAgIGlmIChjbGFzc1Jlc29sdmVkKSBjb250aW51ZTtcbiAgICAgIGxldCBuO1xuICAgICAgcmVzdWx0ICs9IGBjbGFzcz1cIiR7ZXNjYXBlKCgobiA9IHByb3BzLmNsYXNzKSA/IG4gKyBcIiBcIiA6IFwiXCIpICsgKChuID0gcHJvcHMuY2xhc3NOYW1lKSA/IG4gKyBcIiBcIiA6IFwiXCIpLCB0cnVlKSArIHNzckNsYXNzTGlzdChwcm9wcy5jbGFzc0xpc3QpfVwiYDtcbiAgICAgIGNsYXNzUmVzb2x2ZWQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoQm9vbGVhbkF0dHJpYnV0ZXMuaGFzKHByb3ApKSB7XG4gICAgICBpZiAodmFsdWUpIHJlc3VsdCArPSBwcm9wO2Vsc2UgY29udGludWU7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PSB1bmRlZmluZWQgfHwgcHJvcCA9PT0gXCJyZWZcIiB8fCBwcm9wLnNsaWNlKDAsIDIpID09PSBcIm9uXCIgfHwgcHJvcC5zbGljZSgwLCA1KSA9PT0gXCJwcm9wOlwiKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9IGVsc2UgaWYgKHByb3Auc2xpY2UoMCwgNSkgPT09IFwiYm9vbDpcIikge1xuICAgICAgaWYgKCF2YWx1ZSkgY29udGludWU7XG4gICAgICByZXN1bHQgKz0gZXNjYXBlKHByb3Auc2xpY2UoNSkpO1xuICAgIH0gZWxzZSBpZiAocHJvcC5zbGljZSgwLCA1KSA9PT0gXCJhdHRyOlwiKSB7XG4gICAgICByZXN1bHQgKz0gYCR7ZXNjYXBlKHByb3Auc2xpY2UoNSkpfT1cIiR7ZXNjYXBlKHZhbHVlLCB0cnVlKX1cImA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCArPSBgJHtBbGlhc2VzW3Byb3BdIHx8IGVzY2FwZShwcm9wKX09XCIke2VzY2FwZSh2YWx1ZSwgdHJ1ZSl9XCJgO1xuICAgIH1cbiAgICBpZiAoaSAhPT0ga2V5cy5sZW5ndGggLSAxKSByZXN1bHQgKz0gXCIgXCI7XG4gIH1cbiAgaWYgKHNraXBDaGlsZHJlbikgcmV0dXJuIHtcbiAgICB0OiByZXN1bHQgKyBcIi8+XCJcbiAgfTtcbiAgaWYgKHR5cGVvZiBjaGlsZHJlbiA9PT0gXCJmdW5jdGlvblwiKSBjaGlsZHJlbiA9IGNoaWxkcmVuKCk7XG4gIHJldHVybiB7XG4gICAgdDogcmVzdWx0ICsgYD4ke3Jlc29sdmVTU1JOb2RlKGNoaWxkcmVuLCB0cnVlKX08LyR7dGFnfT5gXG4gIH07XG59XG5mdW5jdGlvbiBzc3JBdHRyaWJ1dGUoa2V5LCB2YWx1ZSwgaXNCb29sZWFuKSB7XG4gIHJldHVybiBpc0Jvb2xlYW4gPyB2YWx1ZSA/IFwiIFwiICsga2V5IDogXCJcIiA6IHZhbHVlICE9IG51bGwgPyBgICR7a2V5fT1cIiR7dmFsdWV9XCJgIDogXCJcIjtcbn1cbmZ1bmN0aW9uIHNzckh5ZHJhdGlvbktleSgpIHtcbiAgY29uc3QgaGsgPSBnZXRIeWRyYXRpb25LZXkoKTtcbiAgcmV0dXJuIGhrID8gYCBkYXRhLWhrPVwiJHtoa31cImAgOiBcIlwiO1xufVxuZnVuY3Rpb24gZXNjYXBlKHMsIGF0dHIpIHtcbiAgY29uc3QgdCA9IHR5cGVvZiBzO1xuICBpZiAodCAhPT0gXCJzdHJpbmdcIikge1xuICAgIGlmICghYXR0ciAmJiB0ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBlc2NhcGUocygpKTtcbiAgICBpZiAoIWF0dHIgJiYgQXJyYXkuaXNBcnJheShzKSkge1xuICAgICAgcyA9IHMuc2xpY2UoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykgc1tpXSA9IGVzY2FwZShzW2ldKTtcbiAgICAgIHJldHVybiBzO1xuICAgIH1cbiAgICBpZiAoYXR0ciAmJiB0ID09PSBcImJvb2xlYW5cIikgcmV0dXJuIFN0cmluZyhzKTtcbiAgICByZXR1cm4gcztcbiAgfVxuICBjb25zdCBkZWxpbSA9IGF0dHIgPyAnXCInIDogXCI8XCI7XG4gIGNvbnN0IGVzY0RlbGltID0gYXR0ciA/IFwiJnF1b3Q7XCIgOiBcIiZsdDtcIjtcbiAgbGV0IGlEZWxpbSA9IHMuaW5kZXhPZihkZWxpbSk7XG4gIGxldCBpQW1wID0gcy5pbmRleE9mKFwiJlwiKTtcbiAgaWYgKGlEZWxpbSA8IDAgJiYgaUFtcCA8IDApIHJldHVybiBzO1xuICBsZXQgbGVmdCA9IDAsXG4gICAgb3V0ID0gXCJcIjtcbiAgd2hpbGUgKGlEZWxpbSA+PSAwICYmIGlBbXAgPj0gMCkge1xuICAgIGlmIChpRGVsaW0gPCBpQW1wKSB7XG4gICAgICBpZiAobGVmdCA8IGlEZWxpbSkgb3V0ICs9IHMuc3Vic3RyaW5nKGxlZnQsIGlEZWxpbSk7XG4gICAgICBvdXQgKz0gZXNjRGVsaW07XG4gICAgICBsZWZ0ID0gaURlbGltICsgMTtcbiAgICAgIGlEZWxpbSA9IHMuaW5kZXhPZihkZWxpbSwgbGVmdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChsZWZ0IDwgaUFtcCkgb3V0ICs9IHMuc3Vic3RyaW5nKGxlZnQsIGlBbXApO1xuICAgICAgb3V0ICs9IFwiJmFtcDtcIjtcbiAgICAgIGxlZnQgPSBpQW1wICsgMTtcbiAgICAgIGlBbXAgPSBzLmluZGV4T2YoXCImXCIsIGxlZnQpO1xuICAgIH1cbiAgfVxuICBpZiAoaURlbGltID49IDApIHtcbiAgICBkbyB7XG4gICAgICBpZiAobGVmdCA8IGlEZWxpbSkgb3V0ICs9IHMuc3Vic3RyaW5nKGxlZnQsIGlEZWxpbSk7XG4gICAgICBvdXQgKz0gZXNjRGVsaW07XG4gICAgICBsZWZ0ID0gaURlbGltICsgMTtcbiAgICAgIGlEZWxpbSA9IHMuaW5kZXhPZihkZWxpbSwgbGVmdCk7XG4gICAgfSB3aGlsZSAoaURlbGltID49IDApO1xuICB9IGVsc2Ugd2hpbGUgKGlBbXAgPj0gMCkge1xuICAgIGlmIChsZWZ0IDwgaUFtcCkgb3V0ICs9IHMuc3Vic3RyaW5nKGxlZnQsIGlBbXApO1xuICAgIG91dCArPSBcIiZhbXA7XCI7XG4gICAgbGVmdCA9IGlBbXAgKyAxO1xuICAgIGlBbXAgPSBzLmluZGV4T2YoXCImXCIsIGxlZnQpO1xuICB9XG4gIHJldHVybiBsZWZ0IDwgcy5sZW5ndGggPyBvdXQgKyBzLnN1YnN0cmluZyhsZWZ0KSA6IG91dDtcbn1cbmZ1bmN0aW9uIHJlc29sdmVTU1JOb2RlKG5vZGUsIHRvcCkge1xuICBjb25zdCB0ID0gdHlwZW9mIG5vZGU7XG4gIGlmICh0ID09PSBcInN0cmluZ1wiKSByZXR1cm4gbm9kZTtcbiAgaWYgKG5vZGUgPT0gbnVsbCB8fCB0ID09PSBcImJvb2xlYW5cIikgcmV0dXJuIFwiXCI7XG4gIGlmIChBcnJheS5pc0FycmF5KG5vZGUpKSB7XG4gICAgbGV0IHByZXYgPSB7fTtcbiAgICBsZXQgbWFwcGVkID0gXCJcIjtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbm9kZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKCF0b3AgJiYgdHlwZW9mIHByZXYgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG5vZGVbaV0gIT09IFwib2JqZWN0XCIpIG1hcHBlZCArPSBgPCEtLSEkLS0+YDtcbiAgICAgIG1hcHBlZCArPSByZXNvbHZlU1NSTm9kZShwcmV2ID0gbm9kZVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBtYXBwZWQ7XG4gIH1cbiAgaWYgKHQgPT09IFwib2JqZWN0XCIpIHJldHVybiBub2RlLnQ7XG4gIGlmICh0ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiByZXNvbHZlU1NSTm9kZShub2RlKCkpO1xuICByZXR1cm4gU3RyaW5nKG5vZGUpO1xufVxuZnVuY3Rpb24gZ2V0SHlkcmF0aW9uS2V5KCkge1xuICBjb25zdCBoeWRyYXRlID0gc2hhcmVkQ29uZmlnLmNvbnRleHQ7XG4gIHJldHVybiBoeWRyYXRlICYmICFoeWRyYXRlLm5vSHlkcmF0ZSAmJiBzaGFyZWRDb25maWcuZ2V0TmV4dENvbnRleHRJZCgpO1xufVxuZnVuY3Rpb24gdXNlQXNzZXRzKGZuKSB7XG4gIHNoYXJlZENvbmZpZy5jb250ZXh0LmFzc2V0cy5wdXNoKCgpID0+IHJlc29sdmVTU1JOb2RlKGVzY2FwZShmbigpKSkpO1xufVxuZnVuY3Rpb24gZ2V0QXNzZXRzKCkge1xuICBjb25zdCBhc3NldHMgPSBzaGFyZWRDb25maWcuY29udGV4dC5hc3NldHM7XG4gIGxldCBvdXQgPSBcIlwiO1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gYXNzZXRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSBvdXQgKz0gYXNzZXRzW2ldKCk7XG4gIHJldHVybiBvdXQ7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUh5ZHJhdGlvblNjcmlwdCh7XG4gIGV2ZW50TmFtZXMgPSBbXCJjbGlja1wiLCBcImlucHV0XCJdLFxuICBub25jZVxufSA9IHt9KSB7XG4gIHJldHVybiBgPHNjcmlwdCR7bm9uY2UgPyBgIG5vbmNlPVwiJHtub25jZX1cImAgOiBcIlwifT53aW5kb3cuXyRIWXx8KGU9PntsZXQgdD1lPT5lJiZlLmhhc0F0dHJpYnV0ZSYmKGUuaGFzQXR0cmlidXRlKFwiZGF0YS1oa1wiKT9lOnQoZS5ob3N0JiZlLmhvc3Qubm9kZVR5cGU/ZS5ob3N0OmUucGFyZW50Tm9kZSkpO1tcIiR7ZXZlbnROYW1lcy5qb2luKCdcIiwgXCInKX1cIl0uZm9yRWFjaCgobz0+ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihvLChvPT57aWYoIWUuZXZlbnRzKXJldHVybjtsZXQgcz10KG8uY29tcG9zZWRQYXRoJiZvLmNvbXBvc2VkUGF0aCgpWzBdfHxvLnRhcmdldCk7cyYmIWUuY29tcGxldGVkLmhhcyhzKSYmZS5ldmVudHMucHVzaChbcyxvXSl9KSkpKX0pKF8kSFk9e2V2ZW50czpbXSxjb21wbGV0ZWQ6bmV3IFdlYWtTZXQscjp7fSxmZSgpe319KTs8L3NjcmlwdD48IS0teHMtLT5gO1xufVxuZnVuY3Rpb24gSHlkcmF0aW9uKHByb3BzKSB7XG4gIGlmICghc2hhcmVkQ29uZmlnLmNvbnRleHQubm9IeWRyYXRlKSByZXR1cm4gcHJvcHMuY2hpbGRyZW47XG4gIGNvbnN0IGNvbnRleHQgPSBzaGFyZWRDb25maWcuY29udGV4dDtcbiAgc2hhcmVkQ29uZmlnLmNvbnRleHQgPSB7XG4gICAgLi4uY29udGV4dCxcbiAgICBjb3VudDogMCxcbiAgICBpZDogc2hhcmVkQ29uZmlnLmdldE5leHRDb250ZXh0SWQoKSxcbiAgICBub0h5ZHJhdGU6IGZhbHNlXG4gIH07XG4gIGNvbnN0IHJlcyA9IHByb3BzLmNoaWxkcmVuO1xuICBzaGFyZWRDb25maWcuY29udGV4dCA9IGNvbnRleHQ7XG4gIHJldHVybiByZXM7XG59XG5mdW5jdGlvbiBOb0h5ZHJhdGlvbihwcm9wcykge1xuICBpZiAoc2hhcmVkQ29uZmlnLmNvbnRleHQpIHNoYXJlZENvbmZpZy5jb250ZXh0Lm5vSHlkcmF0ZSA9IHRydWU7XG4gIHJldHVybiBwcm9wcy5jaGlsZHJlbjtcbn1cbmZ1bmN0aW9uIHF1ZXVlKGZuKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZuKTtcbn1cbmZ1bmN0aW9uIGFsbFNldHRsZWQocHJvbWlzZXMpIHtcbiAgbGV0IGxlbmd0aCA9IHByb21pc2VzLmxlbmd0aDtcbiAgcmV0dXJuIFByb21pc2UuYWxsU2V0dGxlZChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgaWYgKHByb21pc2VzLmxlbmd0aCAhPT0gbGVuZ3RoKSByZXR1cm4gYWxsU2V0dGxlZChwcm9taXNlcyk7XG4gICAgcmV0dXJuO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGluamVjdEFzc2V0cyhhc3NldHMsIGh0bWwpIHtcbiAgaWYgKCFhc3NldHMgfHwgIWFzc2V0cy5sZW5ndGgpIHJldHVybiBodG1sO1xuICBsZXQgb3V0ID0gXCJcIjtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGFzc2V0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykgb3V0ICs9IGFzc2V0c1tpXSgpO1xuICBjb25zdCBpbmRleCA9IGh0bWwuaW5kZXhPZihcIjwvaGVhZD5cIik7XG4gIGlmIChpbmRleCA9PT0gLTEpIHJldHVybiBodG1sO1xuICByZXR1cm4gaHRtbC5zbGljZSgwLCBpbmRleCkgKyBvdXQgKyBodG1sLnNsaWNlKGluZGV4KTtcbn1cbmZ1bmN0aW9uIGluamVjdFNjcmlwdHMoaHRtbCwgc2NyaXB0cywgbm9uY2UpIHtcbiAgY29uc3QgdGFnID0gYDxzY3JpcHQke25vbmNlID8gYCBub25jZT1cIiR7bm9uY2V9XCJgIDogXCJcIn0+JHtzY3JpcHRzfTwvc2NyaXB0PmA7XG4gIGNvbnN0IGluZGV4ID0gaHRtbC5pbmRleE9mKFwiPCEtLXhzLS0+XCIpO1xuICBpZiAoaW5kZXggPiAtMSkge1xuICAgIHJldHVybiBodG1sLnNsaWNlKDAsIGluZGV4KSArIHRhZyArIGh0bWwuc2xpY2UoaW5kZXgpO1xuICB9XG4gIHJldHVybiBodG1sICsgdGFnO1xufVxuZnVuY3Rpb24gd2FpdEZvckZyYWdtZW50cyhyZWdpc3RyeSwga2V5KSB7XG4gIGZvciAoY29uc3QgayBvZiBbLi4ucmVnaXN0cnkua2V5cygpXS5yZXZlcnNlKCkpIHtcbiAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoaykpIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIHJlcGxhY2VQbGFjZWhvbGRlcihodG1sLCBrZXksIHZhbHVlKSB7XG4gIGNvbnN0IG1hcmtlciA9IGA8dGVtcGxhdGUgaWQ9XCJwbC0ke2tleX1cIj5gO1xuICBjb25zdCBjbG9zZSA9IGA8IS0tcGwtJHtrZXl9LS0+YDtcbiAgY29uc3QgZmlyc3QgPSBodG1sLmluZGV4T2YobWFya2VyKTtcbiAgaWYgKGZpcnN0ID09PSAtMSkgcmV0dXJuIGh0bWw7XG4gIGNvbnN0IGxhc3QgPSBodG1sLmluZGV4T2YoY2xvc2UsIGZpcnN0ICsgbWFya2VyLmxlbmd0aCk7XG4gIHJldHVybiBodG1sLnNsaWNlKDAsIGZpcnN0KSArIHZhbHVlICsgaHRtbC5zbGljZShsYXN0ICsgY2xvc2UubGVuZ3RoKTtcbn1cbmNvbnN0IFJlcXVlc3RDb250ZXh0ID0gU3ltYm9sKCk7XG5mdW5jdGlvbiBnZXRSZXF1ZXN0RXZlbnQoKSB7XG4gIHJldHVybiBnbG9iYWxUaGlzW1JlcXVlc3RDb250ZXh0XSA/IGdsb2JhbFRoaXNbUmVxdWVzdENvbnRleHRdLmdldFN0b3JlKCkgfHwgc2hhcmVkQ29uZmlnLmNvbnRleHQgJiYgc2hhcmVkQ29uZmlnLmNvbnRleHQuZXZlbnQgfHwgY29uc29sZS5sb2coXCJSZXF1ZXN0RXZlbnQgaXMgbWlzc2luZy4gVGhpcyBpcyBtb3N0IGxpa2VseSBkdWUgdG8gYWNjZXNzaW5nIGBnZXRSZXF1ZXN0RXZlbnRgIG5vbi1tYW5hZ2VkIGFzeW5jIHNjb3BlIGluIGEgcGFydGlhbGx5IHBvbHlmaWxsZWQgZW52aXJvbm1lbnQuIFRyeSBtb3ZpbmcgaXQgYWJvdmUgYWxsIGBhd2FpdGAgY2FsbHMuXCIpIDogdW5kZWZpbmVkO1xufVxuZnVuY3Rpb24gQXNzZXRzKHByb3BzKSB7XG4gIHVzZUFzc2V0cygoKSA9PiBwcm9wcy5jaGlsZHJlbik7XG59XG5mdW5jdGlvbiBwaXBlVG9Ob2RlV3JpdGFibGUoY29kZSwgd3JpdGFibGUsIG9wdGlvbnMgPSB7fSkge1xuICBpZiAob3B0aW9ucy5vblJlYWR5KSB7XG4gICAgb3B0aW9ucy5vbkNvbXBsZXRlU2hlbGwgPSAoe1xuICAgICAgd3JpdGVcbiAgICB9KSA9PiB7XG4gICAgICBvcHRpb25zLm9uUmVhZHkoe1xuICAgICAgICB3cml0ZSxcbiAgICAgICAgc3RhcnRXcml0aW5nKCkge1xuICAgICAgICAgIHN0cmVhbS5waXBlKHdyaXRhYmxlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgfVxuICBjb25zdCBzdHJlYW0gPSByZW5kZXJUb1N0cmVhbShjb2RlLCBvcHRpb25zKTtcbiAgaWYgKCFvcHRpb25zLm9uUmVhZHkpIHN0cmVhbS5waXBlKHdyaXRhYmxlKTtcbn1cbmZ1bmN0aW9uIHBpcGVUb1dyaXRhYmxlKGNvZGUsIHdyaXRhYmxlLCBvcHRpb25zID0ge30pIHtcbiAgaWYgKG9wdGlvbnMub25SZWFkeSkge1xuICAgIG9wdGlvbnMub25Db21wbGV0ZVNoZWxsID0gKHtcbiAgICAgIHdyaXRlXG4gICAgfSkgPT4ge1xuICAgICAgb3B0aW9ucy5vblJlYWR5KHtcbiAgICAgICAgd3JpdGUsXG4gICAgICAgIHN0YXJ0V3JpdGluZygpIHtcbiAgICAgICAgICBzdHJlYW0ucGlwZVRvKHdyaXRhYmxlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgfVxuICBjb25zdCBzdHJlYW0gPSByZW5kZXJUb1N0cmVhbShjb2RlLCBvcHRpb25zKTtcbiAgaWYgKCFvcHRpb25zLm9uUmVhZHkpIHN0cmVhbS5waXBlVG8od3JpdGFibGUpO1xufVxuZnVuY3Rpb24gc3NyU3ByZWFkKHByb3BzLCBpc1NWRywgc2tpcENoaWxkcmVuKSB7XG4gIGxldCByZXN1bHQgPSBcIlwiO1xuICBpZiAocHJvcHMgPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgaWYgKHR5cGVvZiBwcm9wcyA9PT0gXCJmdW5jdGlvblwiKSBwcm9wcyA9IHByb3BzKCk7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcyk7XG4gIGxldCBjbGFzc1Jlc29sdmVkO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgcHJvcCA9IGtleXNbaV07XG4gICAgaWYgKHByb3AgPT09IFwiY2hpbGRyZW5cIikge1xuICAgICAgIXNraXBDaGlsZHJlbiAmJiBjb25zb2xlLndhcm4oYFNTUiBjdXJyZW50bHkgZG9lcyBub3Qgc3VwcG9ydCBzcHJlYWQgY2hpbGRyZW4uYCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgdmFsdWUgPSBwcm9wc1twcm9wXTtcbiAgICBpZiAocHJvcCA9PT0gXCJzdHlsZVwiKSB7XG4gICAgICByZXN1bHQgKz0gYHN0eWxlPVwiJHtzc3JTdHlsZSh2YWx1ZSl9XCJgO1xuICAgIH0gZWxzZSBpZiAocHJvcCA9PT0gXCJjbGFzc1wiIHx8IHByb3AgPT09IFwiY2xhc3NOYW1lXCIgfHwgcHJvcCA9PT0gXCJjbGFzc0xpc3RcIikge1xuICAgICAgaWYgKGNsYXNzUmVzb2x2ZWQpIGNvbnRpbnVlO1xuICAgICAgbGV0IG47XG4gICAgICByZXN1bHQgKz0gYGNsYXNzPVwiJHsobiA9IHByb3BzLmNsYXNzKSA/IG4gKyBcIiBcIiA6IFwiXCJ9JHsobiA9IHByb3BzLmNsYXNzTmFtZSkgPyBuICsgXCIgXCIgOiBcIlwifSR7c3NyQ2xhc3NMaXN0KHByb3BzLmNsYXNzTGlzdCl9XCJgO1xuICAgICAgY2xhc3NSZXNvbHZlZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChwcm9wICE9PSBcInZhbHVlXCIgJiYgUHJvcGVydGllcy5oYXMocHJvcCkpIHtcbiAgICAgIGlmICh2YWx1ZSkgcmVzdWx0ICs9IHByb3A7ZWxzZSBjb250aW51ZTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09IHVuZGVmaW5lZCB8fCBwcm9wID09PSBcInJlZlwiIHx8IHByb3Auc2xpY2UoMCwgMikgPT09IFwib25cIiB8fCBwcm9wLnNsaWNlKDAsIDUpID09PSBcInByb3A6XCIpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZSBpZiAocHJvcC5zbGljZSgwLCA1KSA9PT0gXCJib29sOlwiKSB7XG4gICAgICBpZiAoIXZhbHVlKSBjb250aW51ZTtcbiAgICAgIHJlc3VsdCArPSBlc2NhcGUocHJvcC5zbGljZSg1KSk7XG4gICAgfSBlbHNlIGlmIChwcm9wLnNsaWNlKDAsIDUpID09PSBcImF0dHI6XCIpIHtcbiAgICAgIHJlc3VsdCArPSBgJHtlc2NhcGUocHJvcC5zbGljZSg1KSl9PVwiJHtlc2NhcGUodmFsdWUsIHRydWUpfVwiYDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ICs9IGAke0FsaWFzZXNbcHJvcF0gfHwgZXNjYXBlKHByb3ApfT1cIiR7ZXNjYXBlKHZhbHVlLCB0cnVlKX1cImA7XG4gICAgfVxuICAgIGlmIChpICE9PSBrZXlzLmxlbmd0aCAtIDEpIHJlc3VsdCArPSBcIiBcIjtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbm90U3VwKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoXCJDbGllbnQtb25seSBBUEkgY2FsbGVkIG9uIHRoZSBzZXJ2ZXIgc2lkZS4gUnVuIGNsaWVudC1vbmx5IGNvZGUgaW4gb25Nb3VudCwgb3IgY29uZGl0aW9uYWxseSBydW4gY2xpZW50LW9ubHkgY29tcG9uZW50IHdpdGggPFNob3c+LlwiKTtcbn1cblxuY29uc3QgaXNTZXJ2ZXIgPSB0cnVlO1xuY29uc3QgaXNEZXYgPSBmYWxzZTtcbmZ1bmN0aW9uIGNyZWF0ZUR5bmFtaWMoY29tcG9uZW50LCBwcm9wcykge1xuICBjb25zdCBjb21wID0gY29tcG9uZW50KCksXG4gICAgdCA9IHR5cGVvZiBjb21wO1xuICBpZiAoY29tcCkge1xuICAgIGlmICh0ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjb21wKHByb3BzKTtlbHNlIGlmICh0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gc3NyRWxlbWVudChjb21wLCBwcm9wcywgdW5kZWZpbmVkLCB0cnVlKTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIER5bmFtaWMocHJvcHMpIHtcbiAgY29uc3QgWywgb3RoZXJzXSA9IHNwbGl0UHJvcHMocHJvcHMsIFtcImNvbXBvbmVudFwiXSk7XG4gIHJldHVybiBjcmVhdGVEeW5hbWljKCgpID0+IHByb3BzLmNvbXBvbmVudCwgb3RoZXJzKTtcbn1cbmZ1bmN0aW9uIFBvcnRhbChwcm9wcykge1xuICByZXR1cm4gXCJcIjtcbn1cblxuZXhwb3J0IHsgQWxpYXNlcywgQXNzZXRzLCBDaGlsZFByb3BlcnRpZXMsIERPTUVsZW1lbnRzLCBEZWxlZ2F0ZWRFdmVudHMsIER5bmFtaWMsIEh5ZHJhdGlvbiwgSHlkcmF0aW9uU2NyaXB0LCBOb0h5ZHJhdGlvbiwgUG9ydGFsLCBQcm9wZXJ0aWVzLCBSZXF1ZXN0Q29udGV4dCwgU1ZHRWxlbWVudHMsIFNWR05hbWVzcGFjZSwgbm90U3VwIGFzIGFkZEV2ZW50TGlzdGVuZXIsIG5vdFN1cCBhcyBhc3NpZ24sIG5vdFN1cCBhcyBjbGFzc0xpc3QsIG5vdFN1cCBhcyBjbGFzc05hbWUsIGNyZWF0ZUR5bmFtaWMsIG5vdFN1cCBhcyBkZWxlZ2F0ZUV2ZW50cywgbm90U3VwIGFzIGR5bmFtaWNQcm9wZXJ0eSwgZXNjYXBlLCBnZW5lcmF0ZUh5ZHJhdGlvblNjcmlwdCwgZ2V0QXNzZXRzLCBnZXRIeWRyYXRpb25LZXksIG5vdFN1cCBhcyBnZXROZXh0RWxlbWVudCwgbm90U3VwIGFzIGdldE5leHRNYXJrZXIsIG5vdFN1cCBhcyBnZXROZXh0TWF0Y2gsIGdldFByb3BBbGlhcywgZ2V0UmVxdWVzdEV2ZW50LCBub3RTdXAgYXMgaHlkcmF0ZSwgbm90U3VwIGFzIGluc2VydCwgaXNEZXYsIGlzU2VydmVyLCBtZW1vLCBwaXBlVG9Ob2RlV3JpdGFibGUsIHBpcGVUb1dyaXRhYmxlLCBub3RTdXAgYXMgcmVuZGVyLCByZW5kZXJUb1N0cmVhbSwgcmVuZGVyVG9TdHJpbmcsIHJlbmRlclRvU3RyaW5nQXN5bmMsIHJlc29sdmVTU1JOb2RlLCBub3RTdXAgYXMgcnVuSHlkcmF0aW9uRXZlbnRzLCBub3RTdXAgYXMgc2V0QXR0cmlidXRlLCBub3RTdXAgYXMgc2V0QXR0cmlidXRlTlMsIG5vdFN1cCBhcyBzZXRQcm9wZXJ0eSwgbm90U3VwIGFzIHNwcmVhZCwgc3NyLCBzc3JBdHRyaWJ1dGUsIHNzckNsYXNzTGlzdCwgc3NyRWxlbWVudCwgc3NySHlkcmF0aW9uS2V5LCBzc3JTcHJlYWQsIHNzclN0eWxlLCBzc3JTdHlsZVByb3BlcnR5LCBub3RTdXAgYXMgc3R5bGUsIG5vdFN1cCBhcyB0ZW1wbGF0ZSwgdXNlQXNzZXRzIH07XG4iLCAiaW1wb3J0IHsgaXNTZXJ2ZXIgfSBmcm9tIFwic29saWQtanMvd2ViXCI7XG5cbmNvbnN0IEFETUlOX1RPS0VOX1NUT1JBR0VfS0VZID0gXCJzYWJpX2FkbWluX3Rva2VuXCI7XG5cbmV4cG9ydCBjbGFzcyBNaXNzaW5nQWRtaW5Ub2tlbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihcIkFkbWluIGF1dGggdG9rZW4gaXMgbWlzc2luZy5cIik7XG4gICAgdGhpcy5uYW1lID0gXCJNaXNzaW5nQWRtaW5Ub2tlbkVycm9yXCI7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlYWRBZG1pblRva2VuKCkge1xuICBpZiAoIWNhblVzZVN0b3JhZ2UoKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgdG9rZW4gPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oQURNSU5fVE9LRU5fU1RPUkFHRV9LRVkpPy50cmltKCk7XG5cbiAgcmV0dXJuIHRva2VuID8gdG9rZW4gOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVBZG1pblRva2VuKHRva2VuOiBzdHJpbmcpIHtcbiAgaWYgKCFjYW5Vc2VTdG9yYWdlKCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oQURNSU5fVE9LRU5fU1RPUkFHRV9LRVksIHRva2VuKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyQWRtaW5Ub2tlbigpIHtcbiAgaWYgKCFjYW5Vc2VTdG9yYWdlKCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oQURNSU5fVE9LRU5fU1RPUkFHRV9LRVkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZUFkbWluVG9rZW4odG9rZW4/OiBzdHJpbmcgfCBudWxsKSB7XG4gIGNvbnN0IHJlc29sdmVkVG9rZW4gPSB0b2tlbiA/PyByZWFkQWRtaW5Ub2tlbigpO1xuXG4gIGlmICghcmVzb2x2ZWRUb2tlbikge1xuICAgIHRocm93IG5ldyBNaXNzaW5nQWRtaW5Ub2tlbkVycm9yKCk7XG4gIH1cblxuICByZXR1cm4gcmVzb2x2ZWRUb2tlbjtcbn1cblxuZnVuY3Rpb24gY2FuVXNlU3RvcmFnZSgpIHtcbiAgcmV0dXJuICFpc1NlcnZlciAmJiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB3aW5kb3cubG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiO1xufVxuIiwgImltcG9ydCB7IGFwaVJlcXVlc3QgfSBmcm9tIFwifi9saWIvYXBpL2NvcmVcIjtcbmltcG9ydCB7IHJlc29sdmVBZG1pblRva2VuIH0gZnJvbSBcIn4vbGliL2F1dGgvYWRtaW4tc2Vzc2lvblwiO1xuXG5pbXBvcnQgdHlwZSB7XG4gIEFkbWluTWVSZXNwb25zZSxcbiAgQXV0aFJlc3BvbnNlLFxuICBXYWxsZXRDaGFsbGVuZ2VSZXF1ZXN0LFxuICBXYWxsZXRDaGFsbGVuZ2VSZXNwb25zZSxcbiAgV2FsbGV0Q29ubmVjdFJlcXVlc3QsXG59IGZyb20gXCIuL3R5cGVzXCI7XG5cbmNvbnN0IEFETUlOX0JBU0VfUEFUSCA9IFwiL2FkbWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiByZXF1ZXN0QWRtaW5XYWxsZXRDaGFsbGVuZ2UoXG4gIHBheWxvYWQ6IFdhbGxldENoYWxsZW5nZVJlcXVlc3QsXG4gIHNpZ25hbD86IEFib3J0U2lnbmFsLFxuKSB7XG4gIHJldHVybiBhcGlSZXF1ZXN0PFdhbGxldENoYWxsZW5nZVJlc3BvbnNlLCBXYWxsZXRDaGFsbGVuZ2VSZXF1ZXN0Pih7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBgJHtBRE1JTl9CQVNFX1BBVEh9L2F1dGgvd2FsbGV0L2NoYWxsZW5nZWAsXG4gICAgYm9keTogcGF5bG9hZCxcbiAgICBzaWduYWwsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29ubmVjdEFkbWluV2FsbGV0KHBheWxvYWQ6IFdhbGxldENvbm5lY3RSZXF1ZXN0LCBzaWduYWw/OiBBYm9ydFNpZ25hbCkge1xuICByZXR1cm4gYXBpUmVxdWVzdDxBdXRoUmVzcG9uc2UsIFdhbGxldENvbm5lY3RSZXF1ZXN0Pih7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBgJHtBRE1JTl9CQVNFX1BBVEh9L2F1dGgvd2FsbGV0L2Nvbm5lY3RgLFxuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgc2lnbmFsLFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFkbWluTWUodG9rZW4/OiBzdHJpbmcgfCBudWxsLCBzaWduYWw/OiBBYm9ydFNpZ25hbCkge1xuICByZXR1cm4gYXBpUmVxdWVzdDxBZG1pbk1lUmVzcG9uc2U+KHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgcGF0aDogYCR7QURNSU5fQkFTRV9QQVRIfS9tZWAsXG4gICAgdG9rZW46IHJlc29sdmVBZG1pblRva2VuKHRva2VuKSxcbiAgICBzaWduYWwsXG4gIH0pO1xufVxuIiwgImltcG9ydCB7IGFwaVJlcXVlc3QgfSBmcm9tIFwifi9saWIvYXBpL2NvcmVcIjtcbmltcG9ydCB7IHJlc29sdmVBZG1pblRva2VuIH0gZnJvbSBcIn4vbGliL2F1dGgvYWRtaW4tc2Vzc2lvblwiO1xuXG5pbXBvcnQgdHlwZSB7XG4gIEFkbWluRXZlbnRMaXN0UmVzcG9uc2UsXG4gIEFkbWluRXZlbnRNYXJrZXRzUXVlcnksXG4gIEFkbWluTGlzdEV2ZW50c1F1ZXJ5LFxuICBCb290c3RyYXBFdmVudExpcXVpZGl0eVJlcXVlc3QsXG4gIEJvb3RzdHJhcE1hcmtldExpcXVpZGl0eVJlcXVlc3QsXG4gIENyZWF0ZUV2ZW50TWFya2V0TGFkZGVyUmVxdWVzdCxcbiAgQ3JlYXRlRXZlbnRNYXJrZXRzUmVxdWVzdCxcbiAgQ3JlYXRlRXZlbnRNYXJrZXRzUmVzcG9uc2UsXG4gIENyZWF0ZU1hdGNoRXZlbnRSZXF1ZXN0LFxuICBDcmVhdGVFdmVudFJlcXVlc3QsXG4gIENyZWF0ZUV2ZW50UmVzcG9uc2UsXG4gIENyZWF0ZU1hcmtldFJlcXVlc3QsXG4gIENyZWF0ZU1hcmtldFJlc3BvbnNlLFxuICBEaXNwdXRlTWFya2V0UmVzb2x1dGlvblJlcXVlc3QsXG4gIEVtZXJnZW5jeU1hcmtldFJlc29sdXRpb25SZXF1ZXN0LFxuICBFdmVudERldGFpbFJlc3BvbnNlLFxuICBFdmVudExpcXVpZGl0eUJvb3RzdHJhcFJlc3BvbnNlLFxuICBNYXRjaE1hcmtldENhdGFsb2dSZXNwb25zZSxcbiAgRXZlbnRNYXJrZXRzUmVzcG9uc2UsXG4gIE1hcmtldExpcXVpZGl0eUJvb3RzdHJhcFJlc3BvbnNlLFxuICBNYXJrZXRQcmljZXNSZXNwb25zZSxcbiAgTWFya2V0UmVzb2x1dGlvbldvcmtmbG93UmVzcG9uc2UsXG4gIE1hcmtldFRyYWRpbmdTdGF0dXNSZXNwb25zZSxcbiAgTmVnUmlza1JlZ2lzdHJhdGlvblJlc3BvbnNlLFxuICBQcm9wb3NlTWFya2V0UmVzb2x1dGlvblJlcXVlc3QsXG4gIFJlZ2lzdGVyTmVnUmlza0V2ZW50UmVxdWVzdCxcbiAgU2V0TWFya2V0UHJpY2VzUmVxdWVzdCxcbiAgVXBkYXRlRXZlbnRNYXRjaHVwUmVxdWVzdCxcbiAgVXBkYXRlTWFya2V0UmVxdWVzdCxcbiAgVXBkYXRlTWFya2V0UmVzcG9uc2UsXG59IGZyb20gXCIuL3R5cGVzXCI7XG5cbmludGVyZmFjZSBQcm90ZWN0ZWRSZXF1ZXN0T3B0aW9ucyB7XG4gIHRva2VuPzogc3RyaW5nIHwgbnVsbDtcbiAgc2lnbmFsPzogQWJvcnRTaWduYWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXN0QWRtaW5FdmVudHMoXG4gIHF1ZXJ5PzogQWRtaW5MaXN0RXZlbnRzUXVlcnksXG4gIHsgdG9rZW4sIHNpZ25hbCB9OiBQcm90ZWN0ZWRSZXF1ZXN0T3B0aW9ucyA9IHt9LFxuKSB7XG4gIHJldHVybiBhcGlSZXF1ZXN0PEFkbWluRXZlbnRMaXN0UmVzcG9uc2U+KHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgcGF0aDogXCIvYWRtaW4vZXZlbnRzXCIsXG4gICAgcXVlcnksXG4gICAgdG9rZW46IHJlc29sdmVBZG1pblRva2VuKHRva2VuKSxcbiAgICBzaWduYWwsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQWRtaW5FdmVudChcbiAgcGF5bG9hZDogQ3JlYXRlRXZlbnRSZXF1ZXN0LFxuICB7IHRva2VuLCBzaWduYWwgfTogUHJvdGVjdGVkUmVxdWVzdE9wdGlvbnMgPSB7fSxcbikge1xuICByZXR1cm4gYXBpUmVxdWVzdDxDcmVhdGVFdmVudFJlc3BvbnNlLCBDcmVhdGVFdmVudFJlcXVlc3Q+KHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHBhdGg6IFwiL2FkbWluL2V2ZW50c1wiLFxuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgdG9rZW46IHJlc29sdmVBZG1pblRva2VuKHRva2VuKSxcbiAgICBzaWduYWwsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQWRtaW5NYXRjaEV2ZW50QnVuZGxlKFxuICBwYXlsb2FkOiBDcmVhdGVNYXRjaEV2ZW50UmVxdWVzdCxcbiAgeyB0b2tlbiwgc2lnbmFsIH06IFByb3RlY3RlZFJlcXVlc3RPcHRpb25zID0ge30sXG4pIHtcbiAgcmV0dXJuIGFwaVJlcXVlc3Q8RXZlbnRNYXJrZXRzUmVzcG9uc2UsIENyZWF0ZU1hdGNoRXZlbnRSZXF1ZXN0Pih7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBcIi9hZG1pbi9ldmVudHMvbWF0Y2hlc1wiLFxuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgdG9rZW46IHJlc29sdmVBZG1pblRva2VuKHRva2VuKSxcbiAgICBzaWduYWwsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWRtaW5NYXRjaE1hcmtldENhdGFsb2coXG4gIHNwb3J0U2x1Zzogc3RyaW5nLFxuICB7IHRva2VuLCBzaWduYWwgfTogUHJvdGVjdGVkUmVxdWVzdE9wdGlvbnMgPSB7fSxcbikge1xuICByZXR1cm4gYXBpUmVxdWVzdDxNYXRjaE1hcmtldENhdGFsb2dSZXNwb25zZT4oe1xuICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICBwYXRoOiBgL2FkbWluL2V2ZW50cy9tYXRjaGVzL2NhdGFsb2cvJHtzcG9ydFNsdWd9YCxcbiAgICB0b2tlbjogcmVzb2x2ZUFkbWluVG9rZW4odG9rZW4pLFxuICAgIHNpZ25hbCxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBZG1pbkV2ZW50KFxuICBldmVudElkOiBzdHJpbmcsXG4gIHsgdG9rZW4sIHNpZ25hbCB9OiBQcm90ZWN0ZWRSZXF1ZXN0T3B0aW9ucyA9IHt9LFxuKSB7XG4gIHJldHVybiBhcGlSZXF1ZXN0PEV2ZW50RGV0YWlsUmVzcG9uc2U+KHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgcGF0aDogYC9hZG1pbi9ldmVudHMvJHtldmVudElkfWAsXG4gICAgdG9rZW46IHJlc29sdmVBZG1pblRva2VuKHRva2VuKSxcbiAgICBzaWduYWwsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQWRtaW5FdmVudE1hdGNodXAoXG4gIGV2ZW50SWQ6IHN0cmluZyxcbiAgcGF5bG9hZDogVXBkYXRlRXZlbnRNYXRjaHVwUmVxdWVzdCxcbiAgeyB0b2tlbiwgc2lnbmFsIH06IFByb3RlY3RlZFJlcXVlc3RPcHRpb25zID0ge30sXG4pIHtcbiAgcmV0dXJuIGFwaVJlcXVlc3Q8RXZlbnREZXRhaWxSZXNwb25zZSwgVXBkYXRlRXZlbnRNYXRjaHVwUmVxdWVzdD4oe1xuICAgIG1ldGhvZDogXCJQQVRDSFwiLFxuICAgIHBhdGg6IGAvYWRtaW4vZXZlbnRzLyR7ZXZlbnRJZH0vbWF0Y2h1cGAsXG4gICAgYm9keTogcGF5bG9hZCxcbiAgICB0b2tlbjogcmVzb2x2ZUFkbWluVG9rZW4odG9rZW4pLFxuICAgIHNpZ25hbCxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwdWJsaXNoQWRtaW5FdmVudFNoZWxsKFxuICBldmVudElkOiBzdHJpbmcsXG4gIHsgdG9rZW4sIHNpZ25hbCB9OiBQcm90ZWN0ZWRSZXF1ZXN0T3B0aW9ucyA9IHt9LFxuKSB7XG4gIHJldHVybiBhcGlSZXF1ZXN0PEV2ZW50RGV0YWlsUmVzcG9uc2U+KHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHBhdGg6IGAvYWRtaW4vZXZlbnRzLyR7ZXZlbnRJZH0vcHVibGlzaGAsXG4gICAgdG9rZW46IHJlc29sdmVBZG1pblRva2VuKHRva2VuKSxcbiAgICBzaWduYWwsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQWRtaW5FdmVudE1hcmtldHMoXG4gIGV2ZW50SWQ6IHN0cmluZyxcbiAgcGF5bG9hZDogQ3JlYXRlRXZlbnRNYXJrZXRzUmVxdWVzdCxcbiAgeyB0b2tlbiwgc2lnbmFsIH06IFByb3RlY3RlZFJlcXVlc3RPcHRpb25zID0ge30sXG4pIHtcbiAgcmV0dXJuIGFwaVJlcXVlc3Q8Q3JlYXRlRXZlbnRNYXJrZXRzUmVzcG9uc2UsIENyZWF0ZUV2ZW50TWFya2V0c1JlcXVlc3Q+KHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHBhdGg6IGAvYWRtaW4vZXZlbnRzLyR7ZXZlbnRJZH0vbWFya2V0c2AsXG4gICAgYm9keTogcGF5bG9hZCxcbiAgICB0b2tlbjogcmVzb2x2ZUFkbWluVG9rZW4odG9rZW4pLFxuICAgIHNpZ25hbCxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwdWJsaXNoQWRtaW5FdmVudE1hcmtldHMoXG4gIGV2ZW50SWQ6IHN0cmluZyxcbiAgeyB0b2tlbiwgc2lnbmFsIH06IFByb3RlY3RlZFJlcXVlc3RPcHRpb25zID0ge30sXG4pIHtcbiAgcmV0dXJuIGFwaVJlcXVlc3Q8RXZlbnRNYXJrZXRzUmVzcG9uc2U+KHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHBhdGg6IGAvYWRtaW4vZXZlbnRzLyR7ZXZlbnRJZH0vbWFya2V0cy9wdWJsaXNoYCxcbiAgICB0b2tlbjogcmVzb2x2ZUFkbWluVG9rZW4odG9rZW4pLFxuICAgIHNpZ25hbCxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBZG1pbkV2ZW50TWFya2V0cyhcbiAgZXZlbnRJZDogc3RyaW5nLFxuICBxdWVyeT86IEFkbWluRXZlbnRNYXJrZXRzUXVlcnksXG4gIHsgdG9rZW4sIHNpZ25hbCB9OiBQcm90ZWN0ZWRSZXF1ZXN0T3B0aW9ucyA9IHt9LFxuKSB7XG4gIHJldHVybiBhcGlSZXF1ZXN0PEV2ZW50TWFya2V0c1Jlc3BvbnNlPih7XG4gICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgIHBhdGg6IGAvYWRtaW4vZXZlbnRzLyR7ZXZlbnRJZH0vbWFya2V0c2AsXG4gICAgcXVlcnksXG4gICAgdG9rZW46IHJlc29sdmVBZG1pblRva2VuKHRva2VuKSxcbiAgICBzaWduYWwsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQWRtaW5FdmVudE1hcmtldExhZGRlcihcbiAgZXZlbnRJZDogc3RyaW5nLFxuICBwYXlsb2FkOiBDcmVhdGVFdmVudE1hcmtldExhZGRlclJlcXVlc3QsXG4gIHsgdG9rZW4sIHNpZ25hbCB9OiBQcm90ZWN0ZWRSZXF1ZXN0T3B0aW9ucyA9IHt9LFxuKSB7XG4gIHJldHVybiBhcGlSZXF1ZXN0PENyZWF0ZUV2ZW50TWFya2V0c1Jlc3BvbnNlLCBDcmVhdGVFdmVudE1hcmtldExhZGRlclJlcXVlc3Q+KHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHBhdGg6IGAvYWRtaW4vZXZlbnRzLyR7ZXZlbnRJZH0vbWFya2V0cy9sYWRkZXJzYCxcbiAgICBib2R5OiBwYXlsb2FkLFxuICAgIHRva2VuOiByZXNvbHZlQWRtaW5Ub2tlbih0b2tlbiksXG4gICAgc2lnbmFsLFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyQWRtaW5OZWdSaXNrRXZlbnQoXG4gIGV2ZW50SWQ6IHN0cmluZyxcbiAgcGF5bG9hZDogUmVnaXN0ZXJOZWdSaXNrRXZlbnRSZXF1ZXN0LFxuICB7IHRva2VuLCBzaWduYWwgfTogUHJvdGVjdGVkUmVxdWVzdE9wdGlvbnMgPSB7fSxcbikge1xuICByZXR1cm4gYXBpUmVxdWVzdDxOZWdSaXNrUmVnaXN0cmF0aW9uUmVzcG9uc2UsIFJlZ2lzdGVyTmVnUmlza0V2ZW50UmVxdWVzdD4oe1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgcGF0aDogYC9hZG1pbi9ldmVudHMvJHtldmVudElkfS9uZWctcmlzay9yZWdpc3RlcmAsXG4gICAgYm9keTogcGF5bG9hZCxcbiAgICB0b2tlbjogcmVzb2x2ZUFkbWluVG9rZW4odG9rZW4pLFxuICAgIHNpZ25hbCxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBZG1pbk1hcmtldChcbiAgcGF5bG9hZDogQ3JlYXRlTWFya2V0UmVxdWVzdCxcbiAgeyB0b2tlbiwgc2lnbmFsIH06IFByb3RlY3RlZFJlcXVlc3RPcHRpb25zID0ge30sXG4pIHtcbiAgcmV0dXJuIGFwaVJlcXVlc3Q8Q3JlYXRlTWFya2V0UmVzcG9uc2UsIENyZWF0ZU1hcmtldFJlcXVlc3Q+KHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHBhdGg6IFwiL2FkbWluL21hcmtldHNcIixcbiAgICBib2R5OiBwYXlsb2FkLFxuICAgIHRva2VuOiByZXNvbHZlQWRtaW5Ub2tlbih0b2tlbiksXG4gICAgc2lnbmFsLFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUFkbWluTWFya2V0KFxuICBtYXJrZXRJZDogc3RyaW5nLFxuICBwYXlsb2FkOiBVcGRhdGVNYXJrZXRSZXF1ZXN0LFxuICB7IHRva2VuLCBzaWduYWwgfTogUHJvdGVjdGVkUmVxdWVzdE9wdGlvbnMgPSB7fSxcbikge1xuICByZXR1cm4gYXBpUmVxdWVzdDxVcGRhdGVNYXJrZXRSZXNwb25zZSwgVXBkYXRlTWFya2V0UmVxdWVzdD4oe1xuICAgIG1ldGhvZDogXCJQQVRDSFwiLFxuICAgIHBhdGg6IGAvYWRtaW4vbWFya2V0cy8ke21hcmtldElkfWAsXG4gICAgYm9keTogcGF5bG9hZCxcbiAgICB0b2tlbjogcmVzb2x2ZUFkbWluVG9rZW4odG9rZW4pLFxuICAgIHNpZ25hbCxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRBZG1pbk1hcmtldFByaWNlcyhcbiAgbWFya2V0SWQ6IHN0cmluZyxcbiAgcGF5bG9hZDogU2V0TWFya2V0UHJpY2VzUmVxdWVzdCxcbiAgeyB0b2tlbiwgc2lnbmFsIH06IFByb3RlY3RlZFJlcXVlc3RPcHRpb25zID0ge30sXG4pIHtcbiAgcmV0dXJuIGFwaVJlcXVlc3Q8TWFya2V0UHJpY2VzUmVzcG9uc2UsIFNldE1hcmtldFByaWNlc1JlcXVlc3Q+KHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHBhdGg6IGAvYWRtaW4vbWFya2V0cy8ke21hcmtldElkfS9wcmljZXNgLFxuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgdG9rZW46IHJlc29sdmVBZG1pblRva2VuKHRva2VuKSxcbiAgICBzaWduYWwsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYm9vdHN0cmFwQWRtaW5NYXJrZXRMaXF1aWRpdHkoXG4gIG1hcmtldElkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IEJvb3RzdHJhcE1hcmtldExpcXVpZGl0eVJlcXVlc3QsXG4gIHsgdG9rZW4sIHNpZ25hbCB9OiBQcm90ZWN0ZWRSZXF1ZXN0T3B0aW9ucyA9IHt9LFxuKSB7XG4gIHJldHVybiBhcGlSZXF1ZXN0PE1hcmtldExpcXVpZGl0eUJvb3RzdHJhcFJlc3BvbnNlLCBCb290c3RyYXBNYXJrZXRMaXF1aWRpdHlSZXF1ZXN0Pih7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBgL2FkbWluL21hcmtldHMvJHttYXJrZXRJZH0vbGlxdWlkaXR5L2Jvb3RzdHJhcGAsXG4gICAgYm9keTogcGF5bG9hZCxcbiAgICB0b2tlbjogcmVzb2x2ZUFkbWluVG9rZW4odG9rZW4pLFxuICAgIHNpZ25hbCxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBib290c3RyYXBBZG1pbkV2ZW50TGlxdWlkaXR5KFxuICBldmVudElkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IEJvb3RzdHJhcEV2ZW50TGlxdWlkaXR5UmVxdWVzdCxcbiAgeyB0b2tlbiwgc2lnbmFsIH06IFByb3RlY3RlZFJlcXVlc3RPcHRpb25zID0ge30sXG4pIHtcbiAgcmV0dXJuIGFwaVJlcXVlc3Q8RXZlbnRMaXF1aWRpdHlCb290c3RyYXBSZXNwb25zZSwgQm9vdHN0cmFwRXZlbnRMaXF1aWRpdHlSZXF1ZXN0Pih7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBgL2FkbWluL2V2ZW50cy8ke2V2ZW50SWR9L2xpcXVpZGl0eS9ib290c3RyYXBgLFxuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgdG9rZW46IHJlc29sdmVBZG1pblRva2VuKHRva2VuKSxcbiAgICBzaWduYWwsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGF1c2VBZG1pbk1hcmtldChtYXJrZXRJZDogc3RyaW5nLCB7IHRva2VuLCBzaWduYWwgfTogUHJvdGVjdGVkUmVxdWVzdE9wdGlvbnMgPSB7fSkge1xuICByZXR1cm4gYXBpUmVxdWVzdDxNYXJrZXRUcmFkaW5nU3RhdHVzUmVzcG9uc2U+KHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHBhdGg6IGAvYWRtaW4vbWFya2V0cy8ke21hcmtldElkfS9wYXVzZWAsXG4gICAgdG9rZW46IHJlc29sdmVBZG1pblRva2VuKHRva2VuKSxcbiAgICBzaWduYWwsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5wYXVzZUFkbWluTWFya2V0KFxuICBtYXJrZXRJZDogc3RyaW5nLFxuICB7IHRva2VuLCBzaWduYWwgfTogUHJvdGVjdGVkUmVxdWVzdE9wdGlvbnMgPSB7fSxcbikge1xuICByZXR1cm4gYXBpUmVxdWVzdDxNYXJrZXRUcmFkaW5nU3RhdHVzUmVzcG9uc2U+KHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHBhdGg6IGAvYWRtaW4vbWFya2V0cy8ke21hcmtldElkfS91bnBhdXNlYCxcbiAgICB0b2tlbjogcmVzb2x2ZUFkbWluVG9rZW4odG9rZW4pLFxuICAgIHNpZ25hbCxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wb3NlQWRtaW5NYXJrZXRSZXNvbHV0aW9uKFxuICBtYXJrZXRJZDogc3RyaW5nLFxuICBwYXlsb2FkOiBQcm9wb3NlTWFya2V0UmVzb2x1dGlvblJlcXVlc3QsXG4gIHsgdG9rZW4sIHNpZ25hbCB9OiBQcm90ZWN0ZWRSZXF1ZXN0T3B0aW9ucyA9IHt9LFxuKSB7XG4gIHJldHVybiBhcGlSZXF1ZXN0PE1hcmtldFJlc29sdXRpb25Xb3JrZmxvd1Jlc3BvbnNlLCBQcm9wb3NlTWFya2V0UmVzb2x1dGlvblJlcXVlc3Q+KHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIHBhdGg6IGAvYWRtaW4vbWFya2V0cy8ke21hcmtldElkfS9yZXNvbHV0aW9uL3Byb3Bvc2VgLFxuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgdG9rZW46IHJlc29sdmVBZG1pblRva2VuKHRva2VuKSxcbiAgICBzaWduYWwsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcHV0ZUFkbWluTWFya2V0UmVzb2x1dGlvbihcbiAgbWFya2V0SWQ6IHN0cmluZyxcbiAgcGF5bG9hZDogRGlzcHV0ZU1hcmtldFJlc29sdXRpb25SZXF1ZXN0LFxuICB7IHRva2VuLCBzaWduYWwgfTogUHJvdGVjdGVkUmVxdWVzdE9wdGlvbnMgPSB7fSxcbikge1xuICByZXR1cm4gYXBpUmVxdWVzdDxNYXJrZXRSZXNvbHV0aW9uV29ya2Zsb3dSZXNwb25zZSwgRGlzcHV0ZU1hcmtldFJlc29sdXRpb25SZXF1ZXN0Pih7XG4gICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICBwYXRoOiBgL2FkbWluL21hcmtldHMvJHttYXJrZXRJZH0vcmVzb2x1dGlvbi9kaXNwdXRlYCxcbiAgICBib2R5OiBwYXlsb2FkLFxuICAgIHRva2VuOiByZXNvbHZlQWRtaW5Ub2tlbih0b2tlbiksXG4gICAgc2lnbmFsLFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmFsaXplQWRtaW5NYXJrZXRSZXNvbHV0aW9uKFxuICBtYXJrZXRJZDogc3RyaW5nLFxuICB7IHRva2VuLCBzaWduYWwgfTogUHJvdGVjdGVkUmVxdWVzdE9wdGlvbnMgPSB7fSxcbikge1xuICByZXR1cm4gYXBpUmVxdWVzdDxNYXJrZXRSZXNvbHV0aW9uV29ya2Zsb3dSZXNwb25zZT4oe1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgcGF0aDogYC9hZG1pbi9tYXJrZXRzLyR7bWFya2V0SWR9L3Jlc29sdXRpb24vZmluYWxpemVgLFxuICAgIHRva2VuOiByZXNvbHZlQWRtaW5Ub2tlbih0b2tlbiksXG4gICAgc2lnbmFsLFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVtZXJnZW5jeVJlc29sdmVBZG1pbk1hcmtldChcbiAgbWFya2V0SWQ6IHN0cmluZyxcbiAgcGF5bG9hZDogRW1lcmdlbmN5TWFya2V0UmVzb2x1dGlvblJlcXVlc3QsXG4gIHsgdG9rZW4sIHNpZ25hbCB9OiBQcm90ZWN0ZWRSZXF1ZXN0T3B0aW9ucyA9IHt9LFxuKSB7XG4gIHJldHVybiBhcGlSZXF1ZXN0PE1hcmtldFJlc29sdXRpb25Xb3JrZmxvd1Jlc3BvbnNlLCBFbWVyZ2VuY3lNYXJrZXRSZXNvbHV0aW9uUmVxdWVzdD4oe1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgcGF0aDogYC9hZG1pbi9tYXJrZXRzLyR7bWFya2V0SWR9L3Jlc29sdXRpb24vZW1lcmdlbmN5YCxcbiAgICBib2R5OiBwYXlsb2FkLFxuICAgIHRva2VuOiByZXNvbHZlQWRtaW5Ub2tlbih0b2tlbiksXG4gICAgc2lnbmFsLFxuICB9KTtcbn1cbiIsICJpbXBvcnQgeyBhcGlSZXF1ZXN0IH0gZnJvbSBcIn4vbGliL2FwaS9jb3JlXCI7XG5pbXBvcnQgeyByZXNvbHZlQWRtaW5Ub2tlbiB9IGZyb20gXCJ+L2xpYi9hdXRoL2FkbWluLXNlc3Npb25cIjtcblxuaW1wb3J0IHR5cGUgeyBBZG1pbkltYWdlVXBsb2FkUmVzcG9uc2UgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbnRlcmZhY2UgVXBsb2FkQWRtaW5JbWFnZU9wdGlvbnMge1xuICBmaWxlOiBGaWxlIHwgQmxvYjtcbiAgdG9rZW4/OiBzdHJpbmcgfCBudWxsO1xuICBzY29wZT86IHN0cmluZztcbiAgZmlsZU5hbWU/OiBzdHJpbmc7XG4gIHNpZ25hbD86IEFib3J0U2lnbmFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBsb2FkQWRtaW5JbWFnZSh7XG4gIGZpbGUsXG4gIHRva2VuLFxuICBzY29wZSxcbiAgZmlsZU5hbWUsXG4gIHNpZ25hbCxcbn06IFVwbG9hZEFkbWluSW1hZ2VPcHRpb25zKSB7XG4gIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gIGNvbnN0IG5vcm1hbGl6ZWRGaWxlTmFtZSA9IGZpbGVOYW1lID8/IChcIm5hbWVcIiBpbiBmaWxlID8gZmlsZS5uYW1lIDogXCJ1cGxvYWRcIik7XG5cbiAgZm9ybURhdGEuYXBwZW5kKFwiZmlsZVwiLCBmaWxlLCBub3JtYWxpemVkRmlsZU5hbWUpO1xuXG4gIGlmIChzY29wZSkge1xuICAgIGZvcm1EYXRhLmFwcGVuZChcInNjb3BlXCIsIHNjb3BlKTtcbiAgfVxuXG4gIHJldHVybiBhcGlSZXF1ZXN0PEFkbWluSW1hZ2VVcGxvYWRSZXNwb25zZT4oe1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgcGF0aDogXCIvYWRtaW4vdXBsb2Fkcy9pbWFnZXNcIixcbiAgICBmb3JtRGF0YSxcbiAgICB0b2tlbjogcmVzb2x2ZUFkbWluVG9rZW4odG9rZW4pLFxuICAgIHNpZ25hbCxcbiAgfSk7XG59XG4iLCAiZXhwb3J0IGludGVyZmFjZSBNYXRjaFBhcnRpY2lwYW50TGlrZSB7XG4gIG5hbWU6IHN0cmluZztcbiAgc2hvcnRfbmFtZT86IHN0cmluZyB8IG51bGw7XG4gIGNvZGU/OiBzdHJpbmcgfCBudWxsO1xuICBpbWFnZV91cmw/OiBzdHJpbmcgfCBudWxsO1xuICBzY29yZT86IG51bWJlciB8IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWF0Y2h1cExpa2Uge1xuICBzcG9ydF9zbHVnOiBzdHJpbmc7XG4gIGNvbXBldGl0aW9uX25hbWU/OiBzdHJpbmcgfCBudWxsO1xuICByb3VuZF9uYW1lPzogc3RyaW5nIHwgbnVsbDtcbiAgZml4dHVyZV9pZD86IHN0cmluZyB8IG51bGw7XG4gIHN0YXR1czogc3RyaW5nO1xuICBob21lOiBNYXRjaFBhcnRpY2lwYW50TGlrZTtcbiAgYXdheTogTWF0Y2hQYXJ0aWNpcGFudExpa2U7XG59XG5cbmNvbnN0IE1BVENIX1NUQVRVU0VTX1dJVEhfVklTSUJMRV9aRVJPX1pFUk9fU0NPUkUgPSBuZXcgU2V0KFtcbiAgXCJsaXZlXCIsXG4gIFwiZmluYWxcIixcbiAgXCJkZWxheWVkXCIsXG4gIFwic3VzcGVuZGVkXCIsXG5dKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGNoUGFydGljaXBhbnRMYWJlbChwYXJ0aWNpcGFudDogTWF0Y2hQYXJ0aWNpcGFudExpa2UpOiBzdHJpbmcge1xuICByZXR1cm4gcGFydGljaXBhbnQuc2hvcnRfbmFtZT8udHJpbSgpIHx8IHBhcnRpY2lwYW50Lm5hbWUudHJpbSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0Y2hQYXJ0aWNpcGFudENvZGUocGFydGljaXBhbnQ6IE1hdGNoUGFydGljaXBhbnRMaWtlKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGNvZGUgPSBwYXJ0aWNpcGFudC5jb2RlPy50cmltKCk7XG4gIHJldHVybiBjb2RlID8gY29kZS50b1VwcGVyQ2FzZSgpIDogbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdE1hdGNoU3RhdHVzTGFiZWwoc3RhdHVzOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgY29uc3Qgbm9ybWFsaXplZCA9IHN0YXR1cz8udHJpbSgpLnRvTG93ZXJDYXNlKCk7XG5cbiAgc3dpdGNoIChub3JtYWxpemVkKSB7XG4gICAgY2FzZSBcInNjaGVkdWxlZFwiOlxuICAgICAgcmV0dXJuIFwiU2NoZWR1bGVkXCI7XG4gICAgY2FzZSBcImxpdmVcIjpcbiAgICAgIHJldHVybiBcIkxpdmVcIjtcbiAgICBjYXNlIFwiZmluYWxcIjpcbiAgICAgIHJldHVybiBcIkZpbmFsXCI7XG4gICAgY2FzZSBcInBvc3Rwb25lZFwiOlxuICAgICAgcmV0dXJuIFwiUG9zdHBvbmVkXCI7XG4gICAgY2FzZSBcImNhbmNlbGxlZFwiOlxuICAgICAgcmV0dXJuIFwiQ2FuY2VsbGVkXCI7XG4gICAgY2FzZSBcImRlbGF5ZWRcIjpcbiAgICAgIHJldHVybiBcIkRlbGF5ZWRcIjtcbiAgICBjYXNlIFwic3VzcGVuZGVkXCI6XG4gICAgICByZXR1cm4gXCJTdXNwZW5kZWRcIjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG5vcm1hbGl6ZWRcbiAgICAgICAgPyBub3JtYWxpemVkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbm9ybWFsaXplZC5zbGljZSgxKVxuICAgICAgICA6IFwiU3RhdHVzXCI7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdE1hdGNoS2lja29mZkxhYmVsKHZhbHVlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSk7XG5cbiAgaWYgKE51bWJlci5pc05hTihkYXRlLmdldFRpbWUoKSkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChcImVuLVVTXCIsIHtcbiAgICBtb250aDogXCJzaG9ydFwiLFxuICAgIGRheTogXCJudW1lcmljXCIsXG4gICAgaG91cjogXCJudW1lcmljXCIsXG4gICAgbWludXRlOiBcIjItZGlnaXRcIixcbiAgfSkuZm9ybWF0KGRhdGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0TWF0Y2h1cE1ldGFMaW5lKFxuICBtYXRjaHVwOiBNYXRjaHVwTGlrZSB8IG51bGwgfCB1bmRlZmluZWQsXG4gIHN0YXJ0c0F0Pzogc3RyaW5nIHwgbnVsbCxcbik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIW1hdGNodXApIHtcbiAgICByZXR1cm4gZm9ybWF0TWF0Y2hLaWNrb2ZmTGFiZWwoc3RhcnRzQXQpO1xuICB9XG5cbiAgY29uc3QgcGFydHMgPSBbXG4gICAgbWF0Y2h1cC5jb21wZXRpdGlvbl9uYW1lPy50cmltKCksXG4gICAgbWF0Y2h1cC5yb3VuZF9uYW1lPy50cmltKCksXG4gICAgZm9ybWF0TWF0Y2hLaWNrb2ZmTGFiZWwoc3RhcnRzQXQpLFxuICBdLmZpbHRlcihCb29sZWFuKTtcblxuICByZXR1cm4gcGFydHMubGVuZ3RoID4gMCA/IHBhcnRzLmpvaW4oXCIgXHUyMDIyIFwiKSA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNNYXRjaFNjb3JlKG1hdGNodXA6IE1hdGNodXBMaWtlIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4ge1xuICBpZiAoIW1hdGNodXApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBob21lSGFzU2NvcmUgPSB0eXBlb2YgbWF0Y2h1cC5ob21lLnNjb3JlID09PSBcIm51bWJlclwiO1xuICBjb25zdCBhd2F5SGFzU2NvcmUgPSB0eXBlb2YgbWF0Y2h1cC5hd2F5LnNjb3JlID09PSBcIm51bWJlclwiO1xuXG4gIGlmICghaG9tZUhhc1Njb3JlICYmICFhd2F5SGFzU2NvcmUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBob21lU2NvcmUgPSBob21lSGFzU2NvcmUgPyBtYXRjaHVwLmhvbWUuc2NvcmUgPz8gMCA6IDA7XG4gIGNvbnN0IGF3YXlTY29yZSA9IGF3YXlIYXNTY29yZSA/IG1hdGNodXAuYXdheS5zY29yZSA/PyAwIDogMDtcblxuICBpZiAoaG9tZVNjb3JlICE9PSAwIHx8IGF3YXlTY29yZSAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIE1BVENIX1NUQVRVU0VTX1dJVEhfVklTSUJMRV9aRVJPX1pFUk9fU0NPUkUuaGFzKG1hdGNodXAuc3RhdHVzLnRyaW0oKS50b0xvd2VyQ2FzZSgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdE1hdGNoU2NvcmUobWF0Y2h1cDogTWF0Y2h1cExpa2UgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghbWF0Y2h1cCB8fCAhaGFzTWF0Y2hTY29yZShtYXRjaHVwKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGAke21hdGNodXAuaG9tZS5zY29yZSA/PyAwfSAtICR7bWF0Y2h1cC5hd2F5LnNjb3JlID8/IDB9YDtcbn1cbiIsICJpbXBvcnQgeyBhcGlSZXF1ZXN0IH0gZnJvbSBcIn4vbGliL2FwaS9jb3JlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmF1Y2V0VXNkY1JlcXVlc3Qge1xuICBhZGRyZXNzOiBzdHJpbmc7XG4gIGFtb3VudDogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZhdWNldFVzZGNSZXNwb25zZSB7XG4gIHRva2VuX2FkZHJlc3M6IHN0cmluZztcbiAgcmVjaXBpZW50OiBzdHJpbmc7XG4gIGFtb3VudDogc3RyaW5nO1xuICB0eF9oYXNoOiBzdHJpbmc7XG4gIHJlcXVlc3RlZF9hdDogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZhdWNldFVzZGNCYWxhbmNlUmVzcG9uc2Uge1xuICB0b2tlbl9hZGRyZXNzOiBzdHJpbmc7XG4gIGFkZHJlc3M6IHN0cmluZztcbiAgYmFsYW5jZTogc3RyaW5nO1xuICBxdWVyaWVkX2F0OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXF1ZXN0VXNkY0ZhdWNldChwYXlsb2FkOiBGYXVjZXRVc2RjUmVxdWVzdCwgc2lnbmFsPzogQWJvcnRTaWduYWwpIHtcbiAgcmV0dXJuIGFwaVJlcXVlc3Q8RmF1Y2V0VXNkY1Jlc3BvbnNlLCBGYXVjZXRVc2RjUmVxdWVzdD4oe1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgcGF0aDogXCIvZmF1Y2V0L3VzZGNcIixcbiAgICBib2R5OiBwYXlsb2FkLFxuICAgIHNpZ25hbCxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVc2RjRmF1Y2V0QmFsYW5jZShhZGRyZXNzOiBzdHJpbmcsIHNpZ25hbD86IEFib3J0U2lnbmFsKSB7XG4gIHJldHVybiBhcGlSZXF1ZXN0PEZhdWNldFVzZGNCYWxhbmNlUmVzcG9uc2U+KHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgcGF0aDogXCIvZmF1Y2V0L3VzZGMvYmFsYW5jZVwiLFxuICAgIHF1ZXJ5OiB7XG4gICAgICBhZGRyZXNzLFxuICAgIH0sXG4gICAgc2lnbmFsLFxuICB9KTtcbn1cbiIsICJjb25zdCBVU0RDX0JBU0VfVU5JVFNfUEVSX0RPTExBUiA9IDFfMDAwXzAwMG47XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVVzZGNEb2xsYXJJbnB1dCh2YWx1ZTogc3RyaW5nKSB7XG4gIGNvbnN0IHRyaW1tZWRWYWx1ZSA9IHZhbHVlLnRyaW0oKTtcblxuICBpZiAodHJpbW1lZFZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgY29uc3Qgd2l0aG91dEN1cnJlbmN5U3ltYm9sID0gdHJpbW1lZFZhbHVlLnN0YXJ0c1dpdGgoXCIkXCIpXG4gICAgPyB0cmltbWVkVmFsdWUuc2xpY2UoMSkudHJpbSgpXG4gICAgOiB0cmltbWVkVmFsdWU7XG4gIGNvbnN0IG5vcm1hbGl6ZWRWYWx1ZSA9IHdpdGhvdXRDdXJyZW5jeVN5bWJvbC5yZXBsYWNlQWxsKFwiLFwiLCBcIlwiKTtcblxuICByZXR1cm4gbm9ybWFsaXplZFZhbHVlLnN0YXJ0c1dpdGgoXCIuXCIpID8gYDAke25vcm1hbGl6ZWRWYWx1ZX1gIDogbm9ybWFsaXplZFZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VVc2RjRG9sbGFyc1RvQmFzZVVuaXRzKFxuICB2YWx1ZTogc3RyaW5nLFxuICBsYWJlbDogc3RyaW5nLFxuICBvcHRpb25zOiB7IGFsbG93WmVybz86IGJvb2xlYW4gfSA9IHt9LFxuKSB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRWYWx1ZSA9IG5vcm1hbGl6ZVVzZGNEb2xsYXJJbnB1dCh2YWx1ZSk7XG5cbiAgaWYgKCFub3JtYWxpemVkVmFsdWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bGFiZWx9IGlzIHJlcXVpcmVkLmApO1xuICB9XG5cbiAgaWYgKCEvXlxcZCsoXFwuXFxkezAsNn0pPyQvLnRlc3Qobm9ybWFsaXplZFZhbHVlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHtsYWJlbH0gbXVzdCBiZSBhIGRvbGxhciBhbW91bnQgd2l0aCB1cCB0byA2IGRlY2ltYWwgcGxhY2VzLmApO1xuICB9XG5cbiAgY29uc3QgW3dob2xlVW5pdHMsIGZyYWN0aW9uYWxVbml0cyA9IFwiXCJdID0gbm9ybWFsaXplZFZhbHVlLnNwbGl0KFwiLlwiKTtcbiAgY29uc3QgYmFzZVVuaXRzID1cbiAgICBCaWdJbnQod2hvbGVVbml0cykgKiBVU0RDX0JBU0VfVU5JVFNfUEVSX0RPTExBUiArXG4gICAgQmlnSW50KGZyYWN0aW9uYWxVbml0cy5wYWRFbmQoNiwgXCIwXCIpIHx8IFwiMFwiKTtcblxuICBpZiAoYmFzZVVuaXRzID09PSAwbiAmJiAhb3B0aW9ucy5hbGxvd1plcm8pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bGFiZWx9IG11c3QgYmUgZ3JlYXRlciB0aGFuIHplcm8uYCk7XG4gIH1cblxuICByZXR1cm4gYmFzZVVuaXRzLnRvU3RyaW5nKCk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsT0FBTyxZQUFZO0FBQ25CLE9BQU8sUUFBUSxpQkFBaUI7OztBQ0RoQyxJQUFNLHVCQUF1QjtBQTRCdEIsSUFBTSxXQUFOLGNBQXVCLE1BQU07QUFBQSxFQUN6QjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFVCxZQUFZLFFBQWdCLFlBQW9CLFNBQWtCO0FBQ2hFLFVBQU0sVUFDSCxlQUFlLE9BQU8sTUFBTSxRQUFRLFNBQVMsUUFBUSxZQUN0RCxHQUFHLE1BQU0sSUFBSSxVQUFVLEdBQUcsS0FBSztBQUVqQyxVQUFNLE9BQU87QUFDYixTQUFLLE9BQU87QUFDWixTQUFLLFNBQVM7QUFDZCxTQUFLLGFBQWE7QUFDbEIsU0FBSyxVQUFVO0FBQUEsRUFDakI7QUFDRjtBQUVPLFNBQVMsZ0JBQWdCO0FBQzlCLFFBQU0sYUFBYSxZQUFZLEtBQUssbUJBQW1CLEtBQUs7QUFDNUQsUUFBTSxVQUFVLGNBQWMsV0FBVyxTQUFTLElB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LEVBQUUsQ0FBQyxDQUFDLEVBQUM7QUFBQyxHQUFFLE9BQU8sR0FBRSxHQUFFO0FBQUMsU0FBTSxFQUFDLFNBQVEsRUFBRSxNQUFNQSxFQUFDLEdBQUUsU0FBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBQztBQUFDLEVBQUMsR0FBRSxVQUFVLEdBQUUsR0FBRTtBQUFDLFNBQU0sTUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLElBQUUsT0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLElBQUU7QUFBRyxHQUFFLFlBQVksR0FBRSxHQUFFO0FBQUMsU0FBT0MsR0FBRSxFQUFFLFlBQVksRUFBRSxPQUFPLENBQUM7QUFBQyxFQUFDLENBQUM7QUFBNkMsU0FBUyxFQUFFLEdBQUU7QUFBQyxNQUFJLElBQUUsQ0FBQztBQUFFLFNBQU8sRUFBRSxRQUFRLENBQUMsR0FBRSxNQUFJO0FBQUMsTUFBRSxLQUFLLENBQUMsR0FBRSxDQUFDLENBQUM7QUFBQSxFQUFDLENBQUMsR0FBRTtBQUFDO0FBQUMsSUFBSSxJQUFFLEdBQUUsRUFBQyxLQUFJLCtCQUE4QixLQUFLLEdBQUU7QUFBQyxTQUFPLE9BQU8sV0FBUyxjQUFZLFFBQUcsYUFBYTtBQUFPLEdBQUUsT0FBTSxFQUFDLEtBQUssR0FBRSxHQUFFO0FBQUMsU0FBTSxFQUFDLE9BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUM7QUFBQyxHQUFFLE1BQU0sTUFBTSxHQUFFLEdBQUU7QUFBQyxTQUFNLEVBQUMsT0FBTSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFDO0FBQUMsR0FBRSxPQUFPLEdBQUUsR0FBRTtBQUFDLFNBQU0sRUFBQyxPQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFDO0FBQUMsRUFBQyxHQUFFLFVBQVUsR0FBRSxHQUFFO0FBQUMsU0FBTSxpQkFBZSxFQUFFLFVBQVUsRUFBRSxLQUFLLElBQUU7QUFBRyxHQUFFLFlBQVksR0FBRSxHQUFFO0FBQUMsU0FBTyxJQUFJLFFBQVEsRUFBRSxZQUFZLEVBQUUsS0FB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QU0sQ0FBQztBQUFBLElBQUM7QUFBQSxFQUFDO0FBQUMsU0FBTyxFQUFFLEVBQUUsTUFBTSxNQUFJO0FBQUEsRUFBQyxDQUFDLEdBQUU7QUFBQztBQUFDLElBQUksS0FBRyxHQUFFLEVBQUMsS0FBSSxzQ0FBcUMsU0FBUSxDQUFDLENBQUMsR0FBRSxLQUFLLEdBQUU7QUFBQyxTQUFPLE9BQU8sa0JBQWdCLGNBQVksUUFBRyxhQUFhO0FBQWMsR0FBRSxPQUFNLEVBQUMsS0FBSyxHQUFFLEdBQUU7QUFBQyxTQUFNLEVBQUMsU0FBUSxFQUFFLE1BQU0sQ0FBQyxHQUFFLFFBQU8sRUFBRSxNQUFNLEdBQUUsQ0FBQyxFQUFDO0FBQUMsR0FBRSxNQUFNLE1BQU0sR0FBRSxHQUFFO0FBQUMsU0FBTSxFQUFDLFNBQVEsTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFFLFFBQU8sTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBQztBQUFDLEdBQUUsT0FBTyxHQUFFLEdBQUU7QUFBQyxTQUFNLEVBQUMsU0FBUSxFQUFFLE1BQU0sQ0FBQyxHQUFFLFFBQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUM7QUFBQyxFQUFDLEdBQUUsVUFBVSxHQUFFLEdBQUU7QUFBQyxTQUFNLE1BQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxJQUFFLE9BQUssRUFBRSxVQUFVLEVBQUUsTUFBTSxJQUFFO0FBQUcsR0FBRSxZQUFZLEdBQUUsR0FBRTtBQUFDLE1BQUksSUFBRSxFQUFFLFlBQVksRUFBRSxNQUFNO0FBQUUsU0FBT0EsR0FBRSxDQUFDO0FBQUMsRUFBQyxDQUFDO0FBQTFlLElBQTRlLElBQUU7QUFBMkMsU0FBUyxFQUFFLEdBQUUsR0FBRTtBQUFDLFNBQU0sRUFBQyxNQUFLLEdBQUUsT0FBTSxFQUFFLE9BQU0sYUFBWSxFQUFFLGFBQVksU0FBUSxFQUFFLFNBQVEsV0FBVSxFQUFFLFdBQVUsV0FBVSxFQUFFLFdBQVUsUUFBTyxFQUFFLFFBQU8sTUFBSyxFQUFFLE1BQUssVUFBUyxFQUFFLFVBQVMsVUFBUyxFQUFFLFVBQVMsZ0JBQWUsRUFBRSxlQUFjO0FBQUM7QUFBQyxJQUFJQyxNQUFHLEdBQUcsRUFBQyxLQUFJLCtCQUE4QixTQUFRLENBQUMsR0FBRSxDQUFDLEdBQUUsS0FBSyxHQUFFO0FBQUMsU0FBTyxPQUFPLFdBQVMsY0FBWSxRQUFHLGFBQWE7QUFBTyxHQUFFLE9BQU0sRUFBQyxNQUFNLE1BQU0sR0FBRSxHQUFFO0FBQUMsU0FBTSxFQUFDLEtBQUksTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEdBQUUsU0FBUSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUUsRUFBRSxRQUFNLENBQUMsRUFBRSxXQUFTLE1BQU0sRUFBRSxNQUFNLEVBQUUsWUFBWSxJQUFFLElBQUksQ0FBQyxFQUFDO0FBQUMsR0FBRSxPQUFPLEdBQUUsR0FBRTtBQUFDLFNBQU0sRUFBQyxLQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsR0FBRSxTQUFRLEVBQUUsTUFBTSxFQUFFLEdBQUUsRUFBRSxRQUFNLENBQUMsRUFBRSxXQUFTLEVBQUUsTUFBTSxFQUFFLE9BQUssSUFBSSxDQUFDLEVBQUM7QUFBQyxFQUFDLEdBQUUsVUFBVSxHQUFFLEdBQUU7QUFBQyxTQUFNLGlCQUFlLEVBQUUsVUFBVSxFQUFFLEdBQUcsSUFBRSxNQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sSUFBRTtBQUFHLEdBQUUsWUFBWSxHQUFFLEdBQUU7QUFBQyxTQUFPLElBQUksUUFBUSxFQUFFLFlBQVksRUFBRSxHQUFHLEdBQUUsRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDO0FBQUMsRUFBQyxDQUFDO0FBQWdELFNBQVMsRUFBRSxHQUFFO0FBQUMsU0FBTSxFQUFDLFNBQVEsRUFBRSxTQUFRLFFBQU8sRUFBRSxRQUFPLFlBQVcsRUFBRSxXQUFVO0FBQUM7QUFBQyxJQUFJLEtBQUcsR0FBRyxFQUFDLEtBQUksZ0NBQStCLFNBQVEsQ0FBQyxHQUFFLENBQUMsR0FBRSxLQUFLLEdBQUU7QUFBQyxTQUFPLE9BQU8sWUFBVSxjQUFZLFFBQUcsYUFBYTtBQUFRLEdBQUUsT0FBTSxFQUFDLE1BQU0sTUFBTSxHQUFFLEdBQUU7QUFBQyxTQUFNLEVBQUMsTUFBSyxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQU0sQ0FBQyxFQUFFLFdBQVMsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLElBQUUsSUFBSSxHQUFFLFNBQVEsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBQztBQUFDLEdBQUUsT0FBTyxHQUFFLEdBQUU7QUFBQyxTQUFNLEVBQUMsTUFBSyxFQUFFLE1BQU0sRUFBRSxRQUFNLENBQUMsRUFBRSxXQUFTLEVBQUUsTUFBTSxFQUFFLE9BQUssSUFBSSxHQUFFLFNBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUM7QUFBQyxFQUFDLEdBQUUsVUFBVSxHQUFFLEdBQUU7QUFBQyxTQUFNLGtCQUFnQixFQUFFLFVBQVUsRUFBRSxJQUFJLElBQUUsTUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLElBQUU7QUFBRyxHQUFFLFlBQVksR0FBRSxHQUFFO0FBQUMsU0FBTyxJQUFJLFNBQVMsRUFBRSxZQUFZLEVBQUUsSUFBSSxHQUFFLEVBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQztBQUFDLEVBQUMsQ0FBQztBQUFnRCxJQUFJLEtBQUcsR0FBRyxFQUFDLEtBQUksMkJBQTBCLEtBQUssR0FBRTtBQUFDLFNBQU8sT0FBTyxPQUFLLGNBQVksUUFBRyxhQUFhO0FBQUcsR0FBRSxPQUFNLEVBQUMsS0FBSyxHQUFFLEdBQUU7QUFBQyxTQUFNLEVBQUMsT0FBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUM7QUFBQyxHQUFFLE1BQU0sTUFBTSxHQUFFLEdBQUU7QUFBQyxTQUFNLEVBQUMsT0FBTSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQztBQUFDLEdBQUUsT0FBTyxHQUFFLEdBQUU7QUFBQyxTQUFNLEVBQUMsT0FBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUM7QUFBQyxFQUFDLEdBQUUsVUFBVSxHQUFFLEdBQUU7QUFBQyxTQUFNLGFBQVcsRUFBRSxVQUFVLEVBQUUsS0FBSyxJ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QUNBLFVBQVUsa0JBQWtCO0FBQUEsSUFDNUIsU0FBUztBQUFBLE1BQ1A7QUFBQSxRQUNFLFFBQVE7QUFBQSxVQUNOLEdBQUcsWUFBWTtBQUFBLFVBQ2YsY0FBYztBQUFBLFVBQ2Qsb0JBQW9CO0FBQUEsVUFDcEIsZ0JBQWdCO0FBQUEsUUFDbEI7QUFBQSxRQUNBLFdBQVc7QUFBQSxVQUNULFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxVQUNSLHVCQUF1QjtBQUFBLFVBQ3ZCLDZCQUE2QjtBQUFBLFVBQzdCLFdBQVc7QUFBQSxZQUNULFdBQVc7QUFBQSxZQUNYLFVBQVU7QUFBQSxZQUNWLHlCQUF5QjtBQUFBLFlBQ3pCLG9CQUFvQjtBQUFBLFVBQ3RCO0FBQUEsUUFDRjtBQUFBLFFBQ0EsV0FBVyw2QkFBNkI7QUFBQSxNQUMxQztBQUFBLElBQ0Y7QUFBQSxJQUNBLFlBQVk7QUFBQSxFQUNkO0FBQ0Y7QUFFQSxTQUFTLGtDQUFrQztBQUN6QyxTQUFPO0FBQUEsSUFDTCxPQUFPLFdBQVc7QUFBQSxJQUNsQixVQUFVLGtCQUFrQjtBQUFBLElBQzVCLFFBQVEsWUFBWTtBQUFBLElBQ3BCLFlBQVk7QUFBQSxNQUNWLFFBQVE7QUFBQSxNQUNSLDBCQUEwQjtBQUFBLE1BQzFCLHVCQUF1QjtBQUFBLE1BQ3ZCLG9CQUFvQjtBQUFBLE1BQ3BCLHFCQUFxQjtBQUFBLE1BQ3JCLGFBQWE7QUFBQSxNQUNiLGtCQUFrQjtBQUFBLE1BQ2xCLE9BQU87QUFBQSxNQUNQLHFCQUFxQjtBQUFBLE1BQ3JCLGFBQWE7QUFBQSxNQUNiLGdCQUFnQjtBQUFBLE1BQ2hCLHNCQUFzQjtBQUFBLE1BQ3RCLGNBQWM7QUFBQSxNQUNkLCtCQUErQjtBQUFBLE1BQy9CLHVCQUF1QjtBQUFBLElBQ3pCO0FBQUEsSUFDQSxZQUFZO0FBQUEsRUFDZDtBQUNGOyIsCiAgIm5hbWVzIjogWyJpIiwgIm4iLCAiaSIsICJ1IiwgImwiLCAiZyIsICJkIiwgIm4iLCAibCIsICJnIiwgImkiLCAiZCIsICJ1IiwgIksiLCAiYyIsICJGIiwgIlUiLCAibyIsICJ2IiwgIkoiLCAiWiIsICJQIiwgImFlIl0KfQo=
