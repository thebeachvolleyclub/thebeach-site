import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import * as contextCore from "../src/lib/accountContext.core.ts";

function browserClient(options: { locks?: boolean; abortAny?: boolean } = {}) {
  const requests: { url: string; init: RequestInit }[] = [];
  const events: string[] = [];
  const windowTarget = new EventTarget();
  const documentTarget = new EventTarget();
  const stored = new Map<string, string>();
  const storage = { getItem: (key: string) => stored.get(key) ?? null, setItem: (key: string, value: string) => stored.set(key, value),
    removeItem: (key: string) => stored.delete(key), key: (index: number) => [...stored.keys()][index] ?? null,
    get length() { return stored.size; } };
  let network: (url: string, init: RequestInit) => Promise<Response> = async (url) => Response.json(url === "/api/account/session"
    ? { authenticated: true, context: "parent-fingerprint" } : {});
  const exports: Record<string, (...args: unknown[]) => unknown> = {};
  const sandbox = {
    exports, require: () => contextCore, Headers, Response, AbortController, AbortSignal: options.abortAny === false ? { timeout: AbortSignal.timeout } : AbortSignal, DOMException, CustomEvent,
    crypto: globalThis.crypto, console, setTimeout,
    window: Object.assign(windowTarget, { sessionStorage: storage, location: { reload() { events.push("reload"); }, replace(path: string) { events.push(`replace:${path}`); } } }),
    document: Object.assign(documentTarget, { visibilityState: "visible" }),
    navigator: options.locks === false ? {} : { locks: { request: async (_name: string, callback: () => Promise<unknown>) => callback() } },
    localStorage: storage, sessionStorage: storage,
    fetch: async (url: string, init: RequestInit = {}) => { requests.push({ url, init }); return network(url, init); },
  };
  const source = readFileSync(new URL("../src/lib/accountClient.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(compiled, sandbox);
  return {
    client: exports as unknown as typeof import("../src/lib/accountClient.ts"), requests, events, stored, windowTarget, documentTarget,
    setNetwork(next: typeof network) { network = next; },
  };
}

test("private requests bind to the first session fingerprint, not a subsequently changed cookie", async () => {
  const browser = browserClient();
  await browser.client.accountFetch("/api/account/invoices");
  assert.equal(new Headers(browser.requests[1].init.headers).get("X-Account-Context"), "parent-fingerprint");
  browser.setNetwork(async () => Response.json({ authenticated: true, context: "child-fingerprint" }));
  await browser.client.accountFetch("/api/account/profile", { method: "PUT" });
  assert.equal(new Headers(browser.requests.at(-1)!.init.headers).get("X-Account-Context"), "parent-fingerprint");
});

test("a cross-tab switch aborts pending private reads and rejects their late results", async () => {
  const browser = browserClient();
  const phases: string[] = [];
  const stop = browser.client.listenForAccountContext((phase) => phases.push(phase));
  let release: (response: Response) => void = () => {};
  let started: () => void = () => {};
  const began = new Promise<void>((resolve) => { started = resolve; });
  browser.setNetwork(async (url) => {
    if (url === "/api/account/session") return Response.json({ authenticated: true, context: "parent-fingerprint" });
    started();
    return new Promise<Response>((resolve) => { release = resolve; });
  });
  const pending = browser.client.accountFetch("/api/account/invoices");
  await began;
  const storageEvent = new Event("storage");
  Object.assign(storageEvent, { key: contextCore.ACCOUNT_CONTEXT_STORAGE, newValue: JSON.stringify({ phase: "changing", nonce: "other-tab" }) });
  browser.windowTarget.dispatchEvent(storageEvent);
  assert.equal(browser.requests.at(-1)!.init.signal?.aborted, true);
  release(Response.json({ invoices: [{ id: "old-parent-invoice" }] }));
  await assert.rejects(pending, { name: "AbortError" });
  await assert.rejects(browser.client.accountFetch("/api/account/profile", { method: "PUT" }), { name: "AbortError" });
  assert.deepEqual(phases, ["changing"]);
  stop();
});

test("a stale-context BFF rejection triggers whole-document invalidation", async () => {
  const browser = browserClient();
  const phases: string[] = [];
  const stop = browser.client.listenForAccountContext((phase) => phases.push(phase));
  await browser.client.accountFetch("/api/account/profile");
  browser.setNetwork(async () => Response.json({}, { status: 409, headers: { "X-Account-Context-Changed": "1" } }));
  await assert.rejects(browser.client.accountFetch("/api/booking/checkout", { method: "POST" }), { name: "AbortError" });
  assert.deepEqual(phases, ["changed"]);
  stop();
});

test("switch bypasses the aborted request scope only for the serialized cookie rotation", async () => {
  const browser = browserClient();
  const phases: string[] = [];
  const stop = browser.client.listenForAccountContext((phase) => phases.push(phase));
  browser.stored.set("tb_course_invoice_1", "old-invoice");
  await browser.client.changeAccountContext("/api/account/family/switch", { player_id: 2 });
  assert.deepEqual(phases, ["changing", "changed"]);
  const request = browser.requests.at(-1)!;
  assert.equal(request.url, "/api/account/family/switch");
  assert.equal(new Headers(request.init.headers).get("X-Account-Context"), "parent-fingerprint");
  assert.equal(request.init.body, JSON.stringify({ player_id: 2 }));
  assert.equal(browser.stored.has("tb_course_invoice_1"), false);
  assert.deepEqual(browser.events, ["replace:/konto#profil"]);
  stop();
});

test("uncertain switch failure still discards the old document without restoring a token", async () => {
  const browser = browserClient();
  browser.setNetwork(async (url) => {
    if (url === "/api/account/session") return Response.json({ context: "parent-fingerprint" });
    throw new Error("connection dropped after server commit");
  });
  await browser.client.changeAccountContext("/api/account/family/switch", { player_id: 2 });
  assert.match(browser.stored.get("tb-account-transition-error")!, /Svaret avbröts/);
  assert.deepEqual(browser.events, ["replace:/konto#profil"]);
});

test("body decoding and clones cannot deliver private data after the profile changes", async () => {
  const browser = browserClient();
  const stop = browser.client.listenForAccountContext(() => {});
  await browser.client.accountFetch("/api/account/profile");
  let release: () => void = () => {};
  const stream = new ReadableStream({ start(controller) { release = () => { controller.enqueue(new TextEncoder().encode('{"private":"old-parent-data"}')); controller.close(); }; } });
  browser.setNetwork(async () => new Response(stream, { headers: { "Content-Type": "application/json" } }));
  const response = await browser.client.accountFetch("/api/account/invoices");
  const clone = response.clone();
  const pending = response.json();
  const changed = new Event("storage");
  Object.assign(changed, { key: contextCore.ACCOUNT_CONTEXT_STORAGE, newValue: JSON.stringify({ phase: "changed", nonce: "other-tab" }) });
  browser.windowTarget.dispatchEvent(changed);
  release();
  await assert.rejects(pending, { name: "AbortError" });
  await assert.rejects(clone.text(), { name: "AbortError" });
  stop();
});

test("a lost switch is replayed on reload with the same key and expected source context", async () => {
  const browser = browserClient();
  const pending = { context: "old-fingerprint", key: "791b3920-f889-467f-95ec-616d326e4823", body: JSON.stringify({ player_id: 2 }) };
  browser.stored.set("tb-account-pending-switch", JSON.stringify(pending));
  browser.setNetwork(async (url) => Response.json(url === "/api/account/family/switch" ? { authenticated: true } : { context: "child-fingerprint" }));
  await assert.rejects(browser.client.accountFetch("/api/account/profile"), { name: "AbortError" });
  assert.equal(browser.requests[0].url, "/api/account/family/switch");
  const headers = new Headers(browser.requests[0].init.headers);
  assert.equal(headers.get("Idempotency-Key"), pending.key);
  assert.equal(headers.get("X-Account-Context"), pending.context);
  assert.equal(browser.stored.has("tb-account-pending-switch"), false);
});

test("ordinary legacy shared-email login remains available without Web Locks", async () => {
  const browser = browserClient({ locks: false });
  const phases: string[] = [];
  const stop = browser.client.listenForAccountContext((phase) => phases.push(phase));
  browser.setNetwork(async (url) => Response.json(url === "/api/account/session" ? { context: "anonymous" }
    : { requiresSelection: true, familyUsers: [{ id: "1" }, { id: "2" }] }));
  const result = await browser.client.accountFetch("/api/account/auth/verify", { method: "POST", body: JSON.stringify({ email: "parent@example.test", code: "123456" }) });
  assert.equal((await result.json()).requiresSelection, true);
  assert.deepEqual(phases, ["checking", "unchanged"]);
  assert.deepEqual(browser.events, []);
  stop();
});

test("successful login hides then discards the previous document exactly once", async () => {
  const browser = browserClient();
  const phases: string[] = [];
  const stop = browser.client.listenForAccountContext((phase) => phases.push(phase));
  browser.setNetwork(async (url) => Response.json(url === "/api/account/session" ? { context: "anonymous" } : { authenticated: true }));
  await assert.rejects(browser.client.accountFetch("/api/account/auth/verify", { method: "POST" }), { name: "AbortError" });
  assert.deepEqual(phases, ["checking", "changed"]);
  assert.deepEqual(browser.events, ["reload"]);
  stop();
});

test("private request cancellation works without AbortSignal.any", async () => {
  const browser = browserClient({ abortAny: false });
  const controller = new AbortController();
  await browser.client.accountFetch("/api/account/profile", { signal: controller.signal });
  const signal = browser.requests.at(-1)!.init.signal!;
  assert.equal(signal.aborted, false);
  controller.abort();
  assert.equal(signal.aborted, true);
});

test("takeover retries the same body in memory and never journals the verification code", async () => {
  const browser = browserClient();
  let confirmations = 0;
  browser.setNetwork(async (url) => {
    if (url === "/api/account/session") return Response.json({ context: "parent-fingerprint" });
    if (++confirmations === 1) throw new Error("lost response");
    return Response.json({ authenticated: true });
  });
  const body = JSON.stringify({ new_email: "child@example.test", code: "123456", retire_parent_contact: true });
  await assert.rejects(browser.client.accountFetch("/api/account/family/personal-email/confirm", { method: "POST", body }), { name: "AbortError" });
  assert.equal(confirmations, 2);
  assert.deepEqual(browser.requests.slice(1).map((request) => request.init.body), [body, body]);
  assert.equal(JSON.stringify([...browser.stored]).includes("123456"), false);
});

test("takeover recovery detects a cookie already rotated before the interrupted body", async () => {
  const browser = browserClient();
  const phases: string[] = [];
  const stop = browser.client.listenForAccountContext((phase) => phases.push(phase));
  browser.setNetwork(async (url) => url === "/api/account/session" ? Response.json({ context: "old-context" })
    : Response.json({ detail: "Profilen ändrades" }, { status: 409, headers: { "X-Account-Context-Changed": "1" } }));
  await assert.rejects(browser.client.accountFetch("/api/account/family/personal-email/confirm", { method: "POST" }), { name: "AbortError" });
  assert.deepEqual(phases, ["checking", "changed"]);
  assert.deepEqual(browser.events, ["reload"]);
  stop();
});
