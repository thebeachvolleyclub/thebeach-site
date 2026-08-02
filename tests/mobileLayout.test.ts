import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const privacyPage = readFileSync("src/app/integritetspolicy/page.tsx", "utf8");
const aboutPage = readFileSync("src/app/om-beachvolley/page.tsx", "utf8");
const trainingHero = readFileSync("src/components/trana/TranaHero.tsx", "utf8");
const homeCalendar = readFileSync("src/components/Calendar.tsx", "utf8");
const calendarPage = readFileSync("src/components/kalender/UpcomingEvents.tsx", "utf8");

test("long Swedish headings fit narrow phone screens", () => {
  assert.match(privacyPage, /break-words font-display text-\[clamp\(1\.9rem,8vw,3\.5rem\)\]/);
  assert.match(aboutPage, /break-words font-display text-\[clamp\(1\.9rem,9vw,3\.5rem\)\]/);
  assert.match(trainingHero, /break-words font-display text-\[clamp\(2\.25rem,11vw,7rem\)\]/);
});

test("calendar rows keep titles and badges inside a narrow phone screen", () => {
  for (const calendar of [homeCalendar, calendarPage]) {
    assert.match(calendar, /items-start gap-2/);
    assert.match(calendar, /min-w-0 flex-1/);
    assert.match(calendar, /max-w-\[5\.5rem\]/);
    assert.match(calendar, /sm:max-w-none/);
  }

  assert.match(calendarPage, /hidden text-black\/25 sm:inline/);
});
