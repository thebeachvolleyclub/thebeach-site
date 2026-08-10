import assert from "node:assert/strict";
import test from "node:test";

import {
  fetchResultArticles,
  parseResultArticle,
} from "../src/lib/resultArticles.core.ts";

test("accepts the Resultat editor website contract", () => {
  assert.deepEqual(
    parseResultArticle({
      slug: "sbt-resultat-2026-w32",
      datum: "2026-08-05",
      uppdaterad: "2026-08-06",
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
      uppdaterad: "2026-08-06",
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

test("drops structurally invalid and unsafe AI blocks", () => {
  const parsed = parseResultArticle({
    slug: "sbt-resultat-2026-w32",
    datum: "2026-08-05",
    kicker: "SBT",
    title: "Resultat",
    ingress: "Verifierat.",
    body: [
      { t: "p", text: "Säker text." },
      { t: "table", head: "inte en lista", rows: [] },
      { t: "cta", label: "Farlig", href: "javascript:alert(1)" },
      { t: "img", src: "https://evil.example/photo.jpg", alt: "Fel källa" },
    ],
  });

  assert.deepEqual(parsed?.body, [{ t: "p", text: "Säker text." }]);
});

test("fetches a newly published remote slug without the build-time cache", async () => {
  let observedCache: RequestCache | undefined;
  const articles = await fetchResultArticles(
    "https://api.beachtv.se/results/articles",
    "production",
    true,
    async (_input, init) => {
      observedCache = init.cache;
      return new Response(JSON.stringify({
        articles: [{
          slug: "sbt-resultat-2026-w99",
          datum: "2026-12-31",
          kicker: "Swedish Beach Tour",
          title: "Ny utgåva",
          ingress: "Publicerad efter webbbygget.",
          body: [{ t: "p", text: "Verifierad text." }],
        }],
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-The-Beach-Environment": "production",
        },
      });
    },
  );

  assert.equal(articles[0]?.title, "Ny utgåva");
  assert.equal(observedCache, "no-store");
});

test("rejects an article response from the wrong runtime environment", async () => {
  const articles = await fetchResultArticles(
    "http://app-api:8849/results/articles",
    "demo",
    false,
    async () => new Response(JSON.stringify({ articles: [] }), {
      headers: { "X-The-Beach-Environment": "production" },
    }),
  );
  assert.deepEqual(articles, []);
});
