"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toEnglish, toSwedish } from "@/lib/routes";

/** SV|EN-pill (desktop) och rad (mobilmeny). */
export default function LangSwitch({
  variant = "pill",
  onNavigate,
}: {
  variant?: "pill" | "row";
  onNavigate?: () => void;
}) {
  const pathname = usePathname() ?? "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const svHref = isEn ? toSwedish(pathname) : pathname;
  const enHref = isEn ? pathname : toEnglish(pathname);

  if (variant === "row") {
    return (
      <div className="mt-3 flex items-center gap-3 border-t border-white/10 pt-4">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-white/40">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
        </svg>
        <Link
          href={svHref}
          onClick={onNavigate}
          aria-current={!isEn ? "true" : undefined}
          className={`text-xs font-bold uppercase tracking-[0.12em] transition-colors ${!isEn ? "text-lime" : "text-white/45 hover:text-white"}`}
        >
          Svenska
        </Link>
        <span className="text-white/25">·</span>
        <Link
          href={enHref}
          onClick={onNavigate}
          aria-current={isEn ? "true" : undefined}
          className={`text-xs font-bold uppercase tracking-[0.12em] transition-colors ${isEn ? "text-lime" : "text-white/45 hover:text-white"}`}
        >
          English
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden overflow-hidden rounded-full border border-white/25 text-[10px] font-bold uppercase tracking-[0.1em] lg:flex">
      <Link
        href={svHref}
        aria-current={!isEn ? "true" : undefined}
        className={`px-3 py-1.5 transition-colors ${!isEn ? "bg-lime text-black" : "text-white/55 hover:text-white"}`}
      >
        SV
      </Link>
      <Link
        href={enHref}
        aria-current={isEn ? "true" : undefined}
        className={`px-3 py-1.5 transition-colors ${isEn ? "bg-lime text-black" : "text-white/55 hover:text-white"}`}
      >
        EN
      </Link>
    </div>
  );
}
