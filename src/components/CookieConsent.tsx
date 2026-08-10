"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { isDemoHostname } from "@/lib/runtimeEnvironment.core";

/**
 * Cookie-banner + Google Consent Mode v2.
 * Default är allt "denied" (sätts i layout.tsx innan GTM laddar).
 * Vid samtycke uppdateras consent och valet sparas i localStorage.
 */

const KEY = "cookie_consent"; // "granted" | "denied"
const CHANGE_EVENT = "thebeach-cookie-consent";

type ConsentSnapshot = "loading" | "disabled" | "unset" | "granted" | "denied";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function browserSnapshot(): ConsentSnapshot {
  if (isDemoHostname(window.location.hostname)) return "disabled";
  try {
    const value = localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : "unset";
  } catch {
    return "disabled";
  }
}

const serverSnapshot = (): ConsentSnapshot => "loading";

function updateConsent(granted: boolean) {
  window.dataLayer = window.dataLayer || [];
  // GTM:s consent-API kräver ett arguments-objekt (som gtag pushar) — inte en array.
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments as unknown as Record<string, unknown>);
  }
  const g = gtag as unknown as (...args: unknown[]) => void;
  const v = granted ? "granted" : "denied";
  g("consent", "update", {
    ad_storage: v,
    ad_user_data: v,
    ad_personalization: v,
    analytics_storage: v,
  });
  window.dataLayer.push({ event: granted ? "consent_granted" : "consent_denied" });
}

export default function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, browserSnapshot, serverSnapshot);
  const pathname = usePathname();
  const en = pathname?.startsWith("/en");

  function choose(granted: boolean) {
    try {
      localStorage.setItem(KEY, granted ? "granted" : "denied");
    } catch {
      /* ignore */
    }
    updateConsent(granted);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  if (consent !== "unset") return null;

  return (
    <div
      role="dialog"
      aria-label={en ? "Cookie settings" : "Cookie-inställningar"}
      className="fixed inset-x-4 bottom-4 z-[120] max-w-md border border-white/15 bg-black/95 p-5 shadow-2xl backdrop-blur sm:left-6 sm:right-auto"
    >
      <p className="text-sm leading-relaxed text-white/80">
        {en ? (
          <>
            We use cookies to understand how the site is used and to improve
            our marketing. You choose.{" "}
            <a href="/integritetspolicy" className="underline decoration-lime underline-offset-2 hover:text-lime">
              Privacy policy
            </a>
          </>
        ) : (
          <>
            Vi använder cookies för att förstå hur sajten används och för att
            förbättra vår marknadsföring. Du väljer själv.{" "}
            <a href="/integritetspolicy" className="underline decoration-lime underline-offset-2 hover:text-lime">
              Integritetspolicy
            </a>
          </>
        )}
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => choose(true)}
          className="flex-1 bg-lime px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-black transition hover:brightness-110"
        >
          {en ? "Accept" : "Okej"}
        </button>
        <button
          type="button"
          onClick={() => choose(false)}
          className="flex-1 border border-white/25 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white/70 transition hover:border-white/50 hover:text-white"
        >
          {en ? "Essential only" : "Endast nödvändiga"}
        </button>
      </div>
    </div>
  );
}
