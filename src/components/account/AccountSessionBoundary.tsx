"use client";

import { useEffect } from "react";

/** Shared HttpOnly sessions require other tabs/back-cache views to follow a switch. */
export default function AccountSessionBoundary() {
  useEffect(() => {
    const currentOwner = () => {
      try { return localStorage.getItem("tb-account-draft-owner"); }
      catch { return undefined; }
    };
    let ownerAtLeave = currentOwner();
    const accountChanged = (event: StorageEvent) => {
      if (event.key === "tb-account-draft-owner" && event.oldValue !== event.newValue) window.location.reload();
    };
    const accountRestored = (event: PageTransitionEvent) => {
      if (event.persisted && (ownerAtLeave === undefined || currentOwner() !== ownerAtLeave)) window.location.reload();
    };
    const rememberAccount = () => { ownerAtLeave = currentOwner(); };
    window.addEventListener("storage", accountChanged);
    window.addEventListener("pageshow", accountRestored);
    window.addEventListener("pagehide", rememberAccount);
    return () => {
      window.removeEventListener("storage", accountChanged);
      window.removeEventListener("pageshow", accountRestored);
      window.removeEventListener("pagehide", rememberAccount);
    };
  }, []);
  return null;
}
