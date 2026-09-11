"use client";

import { useEffect, useState, type ReactNode } from "react";
import { listenForAccountContext } from "@/lib/accountClient";

export default function AccountContextBoundary({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState("unchanged");
  useEffect(() => listenForAccountContext((phase) => {
    setPhase(phase);
    if (phase === "changed") window.location.reload();
  }), []);
  // Unmount the entire page, including booking/payment/signup components and
  // their timers, instead of trying to remember every private field to reset.
  if (phase === "changing" || phase === "changed") return <main role="status" aria-live="polite" className="min-h-screen bg-black p-10 text-bone">Uppdaterar profil…</main>;
  return <><div hidden={phase === "checking"} className={phase === "checking" ? undefined : "contents"}>{children}</div>{phase === "checking" ? <p role="status" className="p-10">Kontrollerar inloggning…</p> : null}</>;
}
