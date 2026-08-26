import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { isRetiredWebsiteForm } from "../src/lib/formSubmissionPolicy.ts";

const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
const trainingGroups = readFileSync("src/components/trana/TrainingGroups.tsx", "utf8");
const trainingCopy = readFileSync("src/lib/i18n/trana.ts", "utf8");
const faqCopy = readFileSync("src/lib/i18n/faq.ts", "utf8");
const sharedFormEndpoint = readFileSync("src/app/api/forfragan/route.ts", "utf8");

test("the retired website change form has no route or public entry point", () => {
  assert.equal(existsSync("src/app/andringsanmalan/page.tsx"), false);
  assert.doesNotMatch(sitemap, /andringsanmalan/);
  assert.doesNotMatch(trainingGroups, /andringsanmalan/);
  assert.doesNotMatch(trainingCopy, /andringsanmalan/);
  assert.doesNotMatch(faqCopy, /andringsanmalan/);
});

test("training-group change guidance points customers to the authenticated app flow", () => {
  for (const copy of [trainingCopy, faqCopy]) {
    assert.match(copy, /Profil → Inställningar → Allmänt → Ändringsförfrågan/);
  }
});

test("shared request-form infrastructure remains available to other website flows", () => {
  assert.equal(existsSync("src/components/trana/TrainingFormClient.tsx"), true);
  assert.match(sharedFormEndpoint, /export async function POST/);
});

test("the shared endpoint rejects exactly the retired form before any side effect", () => {
  assert.equal(isRetiredWebsiteForm("andringsanmalan"), true);
  assert.equal(isRetiredWebsiteForm("avanmalan"), false);
  assert.equal(isRetiredWebsiteForm("eventplaneraren"), false);
  assert.equal(isRetiredWebsiteForm("Andringsanmalan"), false);

  const guardPosition = sharedFormEndpoint.indexOf("isRetiredWebsiteForm(body.form)");
  const savePosition = sharedFormEndpoint.indexOf("await saveToDb(body)");
  assert.ok(guardPosition >= 0);
  assert.ok(savePosition > guardPosition);
  assert.match(sharedFormEndpoint, /status: 410/);
});
