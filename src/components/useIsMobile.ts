"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 1023px)";

function subscribe(cb: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

/**
 * true under lg-brytpunkten. SSR-safe (false på servern, uppdateras
 * direkt vid hydrering utan mismatch tack vare useSyncExternalStore).
 */
export default function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeDesktop(cb: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

/**
 * true på desktop (lg+). Server-snapshot är false → SSR-HTML blir alltid
 * mobil-/lättviktsvarianten och tunga resurser (t.ex. hero-video) laddas
 * först efter hydrering, och bara på desktop.
 */
export function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );
}
