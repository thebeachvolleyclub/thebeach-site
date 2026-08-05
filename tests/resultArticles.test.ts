import assert from "node:assert/strict";
import test from "node:test";

import { parseResultArticle } from "../src/lib/nyheter.ts";

test("accepts the Resultat editor website contract", () => {
  assert.deepEqual(
    parseResultArticle({
      slug: "sbt-resultat-2026-w32",
      datum: "2026-08-05",
      kicker: "Swedish Beach Tour",
      title: "Veckans resultat",
      ingress: "Nya framgångar för The Beach.",
      hero: {
        src: "https://thebeach.one/media/nyheter/sm26-senior-dam.webp",
        alt: "Prispallen.",
        credit: "Robert Boman",
      },
      taggar: ["SBT", "Resultat", 7],
      body: [
        { t: "p", text: "Verifierad text." },
        { t: "future", value: "ignoreras säkert" },
      ],
      source: { edition_id: 18 },
    }),
    {
      slug: "sbt-resultat-2026-w32",
      datum: "2026-08-05",
      kicker: "Swedish Beach Tour",
      title: "Veckans resultat",
      ingress: "Nya framgångar för The Beach.",
      hero: {
        src: "https://thebeach.one/media/nyheter/sm26-senior-dam.webp",
        alt: "Prispallen.",
        credit: "Robert Boman",
      },
      taggar: ["SBT", "Resultat"],
      body: [{ t: "p", text: "Verifierad text." }],
    },
  );
});

test("rejects malformed remote articles instead of breaking Nyheter", () => {
  assert.equal(parseResultArticle({ slug: "../../bad", body: [] }), null);
  assert.equal(parseResultArticle(null), null);
});
