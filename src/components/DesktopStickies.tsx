"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "./icons";
import { stickyMode } from "@/lib/stickyMode";


/**
 * Desktop-only stickies (mobil har MobileBookingBar):
 *  - flytande "Boka bana"-knapp nere till höger (efter hero)
 *  - stängbar nyhetsbrevs-nudge nere till vänster (ej på startsidan som redan
 *    har nyhetsbrevssektionen). Kom-ihåg via sessionStorage.
 */
export default function DesktopStickies() {
  const pathname = usePathname() ?? "/";
  const en = pathname === "/en" || pathname.startsWith("/en/");
  const isHome = pathname === "/" || pathname === "/en";
  const mode = stickyMode(pathname);

  const [showBook, setShowBook] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem("nl-nudge-dismissed") === "1");
    } catch {
      setDismissed(false);
    }
    const onScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      setShowBook(y > h * 0.8);
      setShowNudge(y > h * 1.4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem("nl-nudge-dismissed", "1");
    } catch {}
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("EMAIL", email);
      fd.append("OPT_IN", "1");
      fd.append("email_address_check", "");
      fd.append("locale", en ? "en" : "sv");
      const res = await fetch("/api/newsletter", { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (data?.ok) {
        setSent(true);
        setTimeout(dismiss, 3000);
      }
    } catch {
      /* nätverksfel — låt användaren försöka igen */
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Floating "Boka bana" — desktop */}
      <AnimatePresence>
        {showBook && mode !== "hidden" && (
          <motion.a
            href={
              mode === "event"
                ? en ? "/en/events/plan" : "/events/planera"
                : en ? "/en/book" : "/boka"
            }
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="group fixed bottom-6 right-6 z-40 hidden cursor-pointer items-center gap-2 bg-lime px-6 py-4 text-xs font-bold uppercase tracking-[0.1em] text-black shadow-2xl shadow-black/40 transition-colors hover:bg-lime-bright lg:inline-flex"
          >
            {mode === "event"
              ? en ? "Plan your event" : "Planera ert event"
              : en ? "Book a court" : "Boka bana"}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.a>
        )}
      </AnimatePresence>

      {/* Newsletter nudge — desktop, not on home */}
      <AnimatePresence>
        {showNudge && !dismissed && !isHome && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 left-6 z-40 hidden w-[330px] border border-bone/10 bg-black/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl lg:block"
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label={en ? "Close" : "Stäng"}
              className="absolute right-3 top-3 cursor-pointer text-lg leading-none text-bone/40 transition-colors hover:text-bone"
            >
              ×
            </button>
            {sent ? (
              <p className="pr-4 text-sm leading-relaxed text-bone/80">
                {en
                  ? "Thanks — you're in! ☀️"
                  : "Tack — du är med! ☀️"}
              </p>
            ) : (
              <>
                <p className="mb-1 pr-5 font-display text-lg uppercase leading-none text-bone">
                  {en ? "Join The Beach" : "Häng med på The Beach"}
                </p>
                <p className="mb-3 text-[13px] leading-snug text-bone/50">
                  {en
                    ? "Releases, events & last-minute slots — straight to your inbox."
                    : "Släpp, event & lediga tider — direkt i inboxen."}
                </p>
                <form onSubmit={submit} className="flex gap-2">
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder={en ? "you@email.com" : "din@epost.se"}
                    className="min-w-0 flex-1 border border-bone/15 bg-bone/[0.06] px-3 py-2.5 text-sm text-bone outline-none transition-colors placeholder:text-bone/35 focus:border-lime"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="shrink-0 cursor-pointer bg-lime px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-lime-bright disabled:opacity-60"
                  >
                    {busy ? "…" : en ? "Join" : "Gå med"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
