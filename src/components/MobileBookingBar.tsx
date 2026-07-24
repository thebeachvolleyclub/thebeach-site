"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "./icons";
import { stickyMode } from "@/lib/stickyMode";

/**
 * Sticky bottom booking bar — mobile only. Kontextmedveten via stickyMode():
 *  - browse-sidor: Event + Boka bana (som förut)
 *  - eventsidor: en enda CTA → eventplaneraren (ingen nedförsäljning till bana)
 *  - aktiva funnels (boka, planeraren, formulär, konto, skärm): ingen bar alls
 */
export default function MobileBookingBar() {
  const [show, setShow] = useState(false);
  const pathname = usePathname() ?? "/";
  const en = pathname === "/en" || pathname.startsWith("/en/");
  const mode = stickyMode(pathname);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (mode === "hidden") return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden"
        >
          <div className="flex items-center gap-2 rounded-full border border-bone/10 bg-black/85 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
            {mode === "event" ? (
              <a
                href={en ? "/en/events/plan" : "/events/planera"}
                className="group flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-brass px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-black transition-colors hover:bg-brass-bright"
              >
                {en ? "Plan your event" : "Planera ert event"}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            ) : (
              <>
                <a
                  href={en ? "/en/events" : "/events"}
                  className="flex-1 cursor-pointer rounded-full px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-bone/80 transition-colors hover:bg-bone/10"
                >
                  {en ? "Events" : "Event"}
                </a>
                <a
                  href={en ? "/en/book" : "/boka"}
                  className="group flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-brass px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-black transition-colors hover:bg-brass-bright"
                >
                  {en ? "Book a court" : "Boka bana"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
