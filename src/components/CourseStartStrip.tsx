import Link from "next/link";
import type { Locale } from "@/lib/i18n";

/**
 * Tidsbegränsad remsa på startsidan inför kursstart. Kurserna är det enda
 * med platser kvar i höst — allt annat är fullt — så de får synas direkt
 * under hjälten i stället för längst ner. Tas bort (eller döljs via
 * SHOW_UNTIL) när kurserna startat.
 */
const SHOW_UNTIL = "2026-09-04"; // dagen efter torsdagskursernas start

const COPY: Record<Locale, { kicker: string; text: string; cta: string; href: string }> = {
  sv: {
    kicker: "Säsongen startar 30 aug",
    text: "Grundkurs 795 kr · Fortsättningskurs 15 pass · Tisdagarna nästan fulla",
    cta: "Anmäl dig",
    href: "/trana#kurser",
  },
  en: {
    kicker: "Season starts 30 Aug",
    text: "Beginner course 795 kr · Continuation course 15 sessions · Tuesdays almost full",
    cta: "Sign up",
    href: "/trana#kurser",
  },
};

export default function CourseStartStrip({ locale = "sv" }: { locale?: Locale }) {
  if (new Date().toISOString().slice(0, 10) >= SHOW_UNTIL) return null;
  const t = COPY[locale];
  return (
    <Link
      href={t.href}
      className="group flex items-center justify-between gap-4 border-b border-black/10 bg-orange px-5 py-3 text-white transition-colors hover:bg-orange/90 sm:px-10 lg:px-14"
    >
      <span className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
        <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.18em]">{t.kicker}</span>
        <span className="truncate text-[13px] text-white/85">{t.text}</span>
      </span>
      <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.12em] underline-offset-4 group-hover:underline">
        {t.cta} <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
