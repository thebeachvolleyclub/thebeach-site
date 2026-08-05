import type { Locale } from "@/lib/i18n";

/** Etiketter som bara finns på den egna kurssidan (/kurser/[slug]). */
export type KursSidaDict = {
  backToCourses: string;
  signupHeading: string;
  factSessions: string;
  factWhen: string;
  factWhere: string;
  factPrice: string;
  venue: string;
  metaSuffix: string;
  readMore: string;
};

export const kursSidaDict: Record<Locale, KursSidaDict> = {
  sv: {
    backToCourses: "Alla kurser",
    signupHeading: "Anmälan",
    factSessions: "Antal pass",
    factWhen: "När",
    factWhere: "Var",
    factPrice: "Pris",
    venue: "The Beach, Huddinge",
    metaSuffix: "The Beach, Huddinge",
    readMore: "Läs mer om kursen",
  },
  en: {
    backToCourses: "All courses",
    signupHeading: "Sign up",
    factSessions: "Sessions",
    factWhen: "When",
    factWhere: "Where",
    factPrice: "Price",
    venue: "The Beach, Huddinge",
    metaSuffix: "The Beach, Huddinge",
    readMore: "More about this course",
  },
};
