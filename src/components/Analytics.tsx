"use client";

import { useEffect } from "react";
import { isDemoHostname } from "@/lib/runtimeEnvironment.core";

const GTM_ID = "GTM-K3J7NWXJ";

export default function Analytics() {
  useEffect(() => {
    if (isDemoHostname(window.location.hostname)) return;

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments as unknown as Record<string, unknown>);
    }
    const consent = gtag as unknown as (...args: unknown[]) => void;
    consent("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      wait_for_update: 500,
    });
    try {
      if (localStorage.getItem("cookie_consent") === "granted") {
        consent("consent", "update", {
          ad_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
          analytics_storage: "granted",
        });
        window.dataLayer.push({ event: "consent_granted" });
      }
    } catch {
      // Storage can be unavailable in private browsing; denied remains active.
    }

    if (document.getElementById("thebeach-gtm")) return;
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.id = "thebeach-gtm";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(script);
  }, []);

  return null;
}
