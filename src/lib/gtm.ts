"use client";

/**
 * Google Tag Manager-hjälpare.
 * Sajten laddar GTM (GTM-K3J7NWXJ) i layout.tsx med Consent Mode v2 —
 * default "denied", uppdateras av CookieConsent-bannern.
 */

type DataLayerObject = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerObject[];
  }
}

/** Säker dataLayer-push (no-op på servern). */
export function pushEvent(event: string, params: DataLayerObject = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
