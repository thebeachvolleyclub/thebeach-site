"use client";

import {
  ACCOUNT_CONTEXT_EVENT,
  ACCOUNT_CONTEXT_HEADER,
  ACCOUNT_CONTEXT_STORAGE,
  clearUnscopedAccountStorage,
} from "./accountContext.core";

type ContextMessage = { phase: "checking" | "unchanged" | "changing" | "changed"; nonce: string };
let context: string | undefined;
let initialSession: Promise<Response> | undefined;
const epoch = new AbortController();
let changing = false;
const SWITCH_JOURNAL = "tb-account-pending-switch";

function timeoutSignal(milliseconds: number) {
  if (typeof AbortSignal.timeout === "function") return AbortSignal.timeout(milliseconds);
  const controller = new AbortController();
  setTimeout(() => controller.abort(), milliseconds);
  return controller.signal;
}

function combinedSignal(first: AbortSignal, second?: AbortSignal | null) {
  if (!second) return first;
  if (typeof AbortSignal.any === "function") return AbortSignal.any([first, second]);
  const controller = new AbortController();
  const abort = () => {
    controller.abort();
    first.removeEventListener("abort", abort);
    second.removeEventListener("abort", abort);
  };
  if (first.aborted || second.aborted) abort();
  else { first.addEventListener("abort", abort, { once: true }); second.addEventListener("abort", abort, { once: true }); }
  return controller.signal;
}

function guardedResponse(response: Response, source: AbortSignal): Response {
  const assertCurrent = () => {
    if (changing || source.aborted) throw new DOMException("Profilen ändrades", "AbortError");
  };
  return new Proxy(response, {
    get(target, property) {
      if (property === "clone") return () => { assertCurrent(); return guardedResponse(target.clone(), source); };
      if (["json", "text", "blob", "formData", "arrayBuffer", "bytes"].includes(String(property))) {
        return async (...args: unknown[]) => {
          assertCurrent();
          const result = await Reflect.get(target, property).apply(target, args);
          assertCurrent();
          return result;
        };
      }
      const value = Reflect.get(target, property, target);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}

async function resumePendingSwitch() {
  let pending: { context: string; key: string; body: string } | null = null;
  try { pending = JSON.parse(sessionStorage.getItem(SWITCH_JOURNAL) ?? "null"); } catch { /* no journal */ }
  if (!pending || typeof pending.context !== "string" || typeof pending.key !== "string" || typeof pending.body !== "string") return;
  const replay = async () => {
    try {
      const response = await fetch("/api/account/family/switch", {
        method: "POST", credentials: "same-origin", cache: "no-store", signal: timeoutSignal(30_000),
        headers: { "Content-Type": "application/json", [ACCOUNT_CONTEXT_HEADER]: pending!.context, "Idempotency-Key": pending!.key }, body: pending!.body,
      });
      if (response.ok || response.status < 500) sessionStorage.removeItem(SWITCH_JOURNAL);
      if (response.ok) {
        announceContext({ phase: "changed", nonce: crypto.randomUUID() });
        window.location.replace("/konto#profil");
      }
    } catch { /* retain the same key for the next load, never restore a token */ }
  };
  if (navigator.locks) await navigator.locks.request("tb-account-auth-transition", replay);
}

async function sessionSnapshot(): Promise<Response> {
  return fetch("/api/account/session", { cache: "no-store", credentials: "same-origin" });
}

async function initializeContext() {
  initialSession ??= resumePendingSwitch().then(sessionSnapshot).then(async (response) => {
    if (!response.ok) throw new Error("Kunde inte kontrollera kontot. Försök igen.");
    const payload = await response.clone().json();
    if (typeof payload.context !== "string") throw new Error("Kontotjänsten behöver uppdateras. Försök igen senare.");
    context = payload.context;
    return response;
  }).catch((error) => { initialSession = undefined; throw error; });
  return initialSession;
}

/** All account-bearing browser requests share a context and cancellation scope. */
export async function accountFetch(url: string, init?: RequestInit): Promise<Response> {
  if (["/api/account/auth/verify", "/api/account/auth/select-family", "/api/account/auth/logout", "/api/account/family/personal-email/confirm"].includes(url)) {
    await initializeContext();
    const authenticate = async () => {
      if (changing) throw new DOMException("Profilen ändras", "AbortError");
      const nonce = crypto.randomUUID();
      announceContext({ phase: "checking", nonce });
      let settled = false;
      try {
        const headers = new Headers(init?.headers);
        headers.set(ACCOUNT_CONTEXT_HEADER, context!);
        const post = () => fetch(url, { ...init, headers, credentials: "same-origin", cache: "no-store", signal: timeoutSignal(30_000) });
        // Takeover confirmation has a backend replay receipt bound to the same
        // source bearer + email + code. Retry in memory; never persist an OTP.
        const takeover = url === "/api/account/family/personal-email/confirm";
        let response: Response;
        try { response = await post(); }
        catch (error) { if (!takeover) throw error; response = await post(); }
        if (takeover && response.status >= 500) response = await post();
        const payload = await response.clone().json();
        if (response.headers.get("X-Account-Context-Changed") === "1"
          || (response.ok && (payload.authenticated || url.endsWith("/logout")))) {
          announceContext({ phase: "changed", nonce });
          settled = true;
          window.location.reload();
          throw new DOMException("Profilen ändrades", "AbortError");
        }
        announceContext({ phase: "unchanged", nonce });
        settled = true;
        return response;
      } catch (error) {
        // Transport failure may have happened after Set-Cookie. Re-read from a
        // clean document; do not reactivate a form whose identity is uncertain.
        if (changing && !settled) { announceContext({ phase: "changed", nonce }); window.location.reload(); }
        throw error;
      }
    };
    // Existing login remains available in browsers without Web Locks. The new
    // seamless switch requires them; all requests still carry a stale-tab guard.
    return navigator.locks ? navigator.locks.request("tb-account-auth-transition", authenticate) : authenticate();
  }
  return contextFetch(url, init);
}

async function contextFetch(url: string, init?: RequestInit): Promise<Response> {
  if (changing) throw new DOMException("Profilen ändras", "AbortError");
  const currentEpoch = epoch;
  await initializeContext();
  if (changing || currentEpoch.signal.aborted) throw new DOMException("Profilen ändrades", "AbortError");
  const headers = new Headers(init?.headers);
  headers.set(ACCOUNT_CONTEXT_HEADER, context!);
  const response = await fetch(url, {
    ...init,
    headers,
    cache: "no-store",
    credentials: "same-origin",
    signal: combinedSignal(currentEpoch.signal, init?.signal),
  });
  if (changing || currentEpoch.signal.aborted) throw new DOMException("Profilen ändrades", "AbortError");
  if (response.headers.get("X-Account-Context-Changed") === "1") {
    announceContext({ phase: "changed", nonce: crypto.randomUUID() });
    throw new DOMException("Profilen ändrades", "AbortError");
  }
  return guardedResponse(response, currentEpoch.signal);
}

function receiveContext(message: ContextMessage) {
  changing = message.phase !== "unchanged";
  if (message.phase === "changing" || message.phase === "changed") {
    epoch.abort();
    try { clearUnscopedAccountStorage(window.sessionStorage); } catch { /* private browsing */ }
  }
  window.dispatchEvent(new CustomEvent(ACCOUNT_CONTEXT_EVENT, { detail: message }));
}

function announceContext(message: ContextMessage) {
  receiveContext(message);
  try { localStorage.setItem(ACCOUNT_CONTEXT_STORAGE, JSON.stringify(message)); } catch { /* use channel */ }
  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(ACCOUNT_CONTEXT_EVENT);
    channel.postMessage(message);
    channel.close();
  }
}

/** Serialize cookie-changing auth operations across tabs. No email OTP is needed. */
export async function changeAccountContext(url: string, body: unknown): Promise<void> {
  if (url !== "/api/account/family/switch") throw new Error("Ogiltigt profilbyte.");
  if (!navigator.locks) throw new Error("Uppdatera webbläsaren för att byta profil säkert.");
  await initializeContext();
  const sourceContext = context!;
  await navigator.locks.request("tb-account-auth-transition", async () => {
    if (changing) return;
    const nonce = crypto.randomUUID();
    const journal = { context: sourceContext, key: crypto.randomUUID(), body: JSON.stringify(body) };
    try { sessionStorage.setItem(SWITCH_JOURNAL, JSON.stringify(journal)); } catch { throw new Error("Tillåt lagring i webbläsaren för att kunna återställa ett avbrutet profilbyte säkert."); }
    announceContext({ phase: "changing", nonce });
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", [ACCOUNT_CONTEXT_HEADER]: sourceContext, "Idempotency-Key": journal.key },
        body: journal.body,
        credentials: "same-origin",
        cache: "no-store",
        signal: timeoutSignal(30_000),
      });
      const payload = await response.json().catch(() => ({}));
      if (response.ok || response.status < 500) sessionStorage.removeItem(SWITCH_JOURNAL);
      if (!response.ok) {
        try { sessionStorage.setItem("tb-account-transition-error", typeof payload.detail === "string" ? payload.detail : "Kunde inte byta profil. Försök igen."); } catch { /* no storage */ }
      }
    } catch {
      try { sessionStorage.setItem("tb-account-transition-error", "Svaret avbröts. Kontrollera vilken profil som är aktiv innan du försöker igen."); } catch { /* no storage */ }
    } finally {
      // Even on an uncertain response, discard the document and re-read the
      // authoritative cookie. Never restore a token captured before switching.
      announceContext({ phase: "changed", nonce });
      window.location.replace("/konto#profil");
    }
  });
}

export function listenForAccountContext(onChange: (phase: ContextMessage["phase"]) => void) {
  const valid = (value: unknown): value is ContextMessage => Boolean(value && typeof value === "object"
    && "phase" in value && ["checking", "unchanged", "changing", "changed"].includes(String(value.phase)));
  const onLocal = (event: Event) => {
    const message = (event as CustomEvent).detail;
    if (valid(message)) onChange(message.phase);
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== ACCOUNT_CONTEXT_STORAGE || !event.newValue) return;
    try { const message: unknown = JSON.parse(event.newValue); if (valid(message)) receiveContext(message); } catch { /* malformed message */ }
  };
  const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(ACCOUNT_CONTEXT_EVENT) : null;
  if (channel) channel.onmessage = (event) => { if (valid(event.data)) receiveContext(event.data); };
  const checkContext = async () => {
    if (changing || !context || document.visibilityState === "hidden") return;
    try {
      const response = await sessionSnapshot();
      if (!response.ok) return;
      const payload = await response.json();
      if (typeof payload.context === "string" && payload.context !== context) {
        receiveContext({ phase: "changed", nonce: crypto.randomUUID() });
      }
    } catch { /* network outages are not a change of identity */ }
  };
  const onPageShow = (event: PageTransitionEvent) => {
    // A restored document contains old forms and private results. Do not render it.
    if (event.persisted) receiveContext({ phase: "changed", nonce: crypto.randomUUID() });
  };
  const onPageHide = (event: PageTransitionEvent) => {
    // Avoid freezing a live private form into the back/forward cache.
    if (event.persisted) receiveContext({ phase: "changing", nonce: crypto.randomUUID() });
  };
  window.addEventListener(ACCOUNT_CONTEXT_EVENT, onLocal);
  window.addEventListener("storage", onStorage);
  window.addEventListener("focus", checkContext);
  window.addEventListener("pageshow", onPageShow);
  window.addEventListener("pagehide", onPageHide);
  document.addEventListener("visibilitychange", checkContext);
  return () => {
    window.removeEventListener(ACCOUNT_CONTEXT_EVENT, onLocal);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("focus", checkContext);
    window.removeEventListener("pageshow", onPageShow);
    window.removeEventListener("pagehide", onPageHide);
    document.removeEventListener("visibilitychange", checkContext);
    channel?.close();
  };
}
