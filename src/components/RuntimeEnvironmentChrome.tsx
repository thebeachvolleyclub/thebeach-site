"use client";

import { useEffect, useSyncExternalStore } from "react";
import { isDemoHostname } from "@/lib/runtimeEnvironment.core";

const subscribe = () => () => undefined;
const browserSnapshot = () => isDemoHostname(window.location.hostname);
const serverSnapshot = () => false;

export default function RuntimeEnvironmentChrome() {
  const demo = useSyncExternalStore(subscribe, browserSnapshot, serverSnapshot);

  useEffect(() => {
    document.documentElement.dataset.theBeachEnvironment = demo ? "demo" : "production";
    return () => {
      delete document.documentElement.dataset.theBeachEnvironment;
    };
  }, [demo]);

  if (!demo) return null;

  return (
    <div
      role="status"
      aria-label="Demomiljö med syntetisk testdata"
      className="pointer-events-none fixed inset-x-0 top-0 z-[250] flex h-8 items-center justify-center border-b border-black/35 bg-amber-300 px-3 text-center text-xs font-black uppercase tracking-[0.18em] text-black shadow-lg"
    >
      Demo · syntetisk testdata · inga riktiga betalningar
    </div>
  );
}
