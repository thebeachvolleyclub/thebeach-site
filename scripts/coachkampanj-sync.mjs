#!/usr/bin/env node
/**
 * Synkar ställningen i coachkampanjen.
 *
 * Körs av det schemalagda jobbet: läs `usedCount` per kampanjkod ur
 * bokningssystemet (booking_course_promotions), skicka in dem här som
 * {"<promotionId>": <antal>} och committa resultatet.
 *
 *   node scripts/coachkampanj-sync.mjs '{"d80c2286-…":2,"5271df52-…":2}'
 *   cat counts.json | node scripts/coachkampanj-sync.mjs
 *
 * Namn↔kod-mappningen ligger i src/data/coachkampanj.json (promotionId, aldrig
 * själva koden). Okända id:n avbryter körningen — hellre stopp än fel namn på
 * en publik topplista.
 *
 * Exit 0 = klart. Skriver "CHANGED=1" på sista raden om siffrorna faktiskt
 * ändrades, annars "CHANGED=0" (då behöver inget publiceras).
 */
import { readFileSync, writeFileSync } from "node:fs";

const FIL = new URL("../src/data/coachkampanj.json", import.meta.url);

function läsInput() {
  const arg = process.argv[2];
  if (arg && arg.trim()) return arg;
  return readFileSync(0, "utf8");
}

let räkning;
try {
  räkning = JSON.parse(läsInput());
} catch {
  console.error("FEL: kunde inte läsa JSON med antal per promotionId.");
  process.exit(1);
}
if (!räkning || typeof räkning !== "object" || Array.isArray(räkning)) {
  console.error("FEL: förväntade ett objekt {\"<promotionId>\": <antal>}.");
  process.exit(1);
}

const data = JSON.parse(readFileSync(FIL, "utf8"));
const kända = new Map(data.deltagare.map((d) => [d.promotionId, d]));

const okända = Object.keys(räkning).filter((id) => !kända.has(id));
if (okända.length) {
  console.error(
    `FEL: ${okända.length} okänt promotionId (ny coach som saknas i mappningen?):\n  ` +
      okända.join("\n  ") +
      "\nLägg till coachen i src/data/coachkampanj.json först. Inget skrevs.",
  );
  process.exit(1);
}

let ändrat = false;
const ändringar = [];
for (const deltagare of data.deltagare) {
  const nytt = räkning[deltagare.promotionId];
  const antal = Number.isSafeInteger(nytt) && nytt >= 0 ? nytt : 0;
  if (antal !== deltagare.antal) {
    ändringar.push(`${deltagare.namn}: ${deltagare.antal} → ${antal}`);
    deltagare.antal = antal;
    ändrat = true;
  }
}

if (ändrat) {
  data.uppdaterad = new Date().toISOString();
  writeFileSync(FIL, JSON.stringify(data, null, 2) + "\n");
}

const totalt = data.deltagare.reduce((s, d) => s + d.antal, 0);
const kvalade = data.deltagare.filter((d) => d.antal >= data.troskel).length;
console.log(`Totalt ${totalt} värvade, ${kvalade} har nått ${data.troskel}.`);
for (const rad of ändringar) console.log("  " + rad);
if (!ändrat) console.log("  (inga ändringar)");
console.log(`CHANGED=${ändrat ? 1 : 0}`);
