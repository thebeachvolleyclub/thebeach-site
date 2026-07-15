"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Menu, Close } from "./icons";
import Logo from "./Logo";
import LangSwitch from "./LangSwitch";

const LINKS_SV = [
  { label: "Boka bana", href: "/boka", ext: false },
  { label: "Boka event", href: "/events", ext: false },
  { label: "Träna", href: "/trana", ext: false },
  { label: "Kalender", href: "/kalender", ext: false },
  { label: "Om oss", href: "/om-oss", ext: false },
  { label: "Konto", href: "/konto", ext: false },
];

const LINKS_EN = [
  { label: "Book a court", href: "/en/book", ext: false },
  { label: "Book an event", href: "/en/events", ext: false },
  { label: "Schools", href: "/en/school", ext: false },
  { label: "About", href: "/en/about", ext: false },
  { label: "Account", href: "/konto", ext: false },
];

export default function Navbar({ locale = "sv" }: { locale?: "sv" | "en" }) {
  const LINKS = locale === "en" ? LINKS_EN : LINKS_SV;
  const ctaHref = locale === "en" ? "/en/events#request" : "/events";
  const ctaLabel = locale === "en" ? "Book event" : "Boka event";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-black py-3 lg:py-3.5"
          : "bg-transparent py-4 lg:py-6"
      }`}
    >
      <div className="flex items-center justify-between px-5 sm:px-8 lg:px-14">
        <Link href={locale === "en" ? "/en" : "/"} aria-label="The Beach — startsidan" className="flex items-center">
          <Logo variant="green" className="h-[26px] w-auto lg:h-[30px]" />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => {
            const isActive = !l.ext && pathname === l.href;
            return l.ext ? (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-lime"
                >
                  {l.label}
                </a>
              </li>
            ) : (
              <li key={l.label}>
                <Link
                  href={l.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:text-lime ${
                    isActive
                      ? "text-lime underline underline-offset-4"
                      : "text-white/70"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <LangSwitch />
          <Link
            href={ctaHref}
            className="hidden cursor-pointer bg-lime px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-lime-bright sm:block lg:px-[22px]"
          >
            {ctaLabel}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Stäng meny" : "Öppna meny"}
            aria-expanded={open}
            className="grid h-10 w-10 cursor-pointer place-items-center text-white lg:hidden"
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/10 bg-black px-5 py-4 lg:hidden"
          >
            <ul className="flex flex-col">
              {LINKS.map((l) => {
                const isActive = !l.ext && pathname === l.href;
                return l.ext ? (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="block py-3.5 font-display text-2xl uppercase text-white transition-colors hover:text-lime"
                    >
                      {l.label}
                    </a>
                  </li>
                ) : (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`block py-3.5 font-display text-2xl uppercase transition-colors hover:text-lime ${
                        isActive ? "text-lime" : "text-white"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href={ctaHref}
              onClick={() => setOpen(false)}
              className="mt-3 block cursor-pointer bg-lime py-4 text-center text-sm font-bold uppercase tracking-[0.08em] text-black"
            >
              {ctaLabel}
            </Link>
            <LangSwitch variant="row" onNavigate={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
