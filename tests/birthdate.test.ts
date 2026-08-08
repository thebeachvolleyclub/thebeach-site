import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  maskBirthdate,
  normalizeBirthdate,
  isBirthdateValid,
} from "../src/lib/birthdate.ts";

test("birthdate mask supplies the hyphens a numeric keypad cannot type", () => {
  // iOS shows a digits-only keypad for inputMode="numeric" — no hyphen key —
  // so ÅÅÅÅ-MM-DD was literally untypeable on a phone and the save button
  // stayed disabled forever. The mask is what makes the field reachable.
  assert.equal(maskBirthdate("1"), "1");
  assert.equal(maskBirthdate("1990"), "1990");
  assert.equal(maskBirthdate("19900"), "1990-0");
  assert.equal(maskBirthdate("199005"), "1990-05");
  assert.equal(maskBirthdate("19900512"), "1990-05-12");
  assert.equal(maskBirthdate("1990-05-12"), "1990-05-12");
  assert.equal(maskBirthdate("199005123456"), "1990-05-12");
  assert.equal(maskBirthdate(""), "");
});

test("birthdate normalisation accepts the formats people actually paste", () => {
  assert.equal(normalizeBirthdate("19900512"), "1990-05-12");
  assert.equal(normalizeBirthdate("1990/05/12"), "1990-05-12");
  assert.equal(normalizeBirthdate("1990.05.12"), "1990-05-12");
  assert.equal(normalizeBirthdate("12/5-1990"), "1990-05-12");
  assert.equal(normalizeBirthdate("1990-5-2"), "1990-05-02");
  assert.equal(normalizeBirthdate("900512"), "1990-05-12");
});

test("birthdate normalisation rejects junk and impossible dates", () => {
  assert.equal(normalizeBirthdate(""), "");
  assert.equal(normalizeBirthdate("hej"), "");
  assert.equal(normalizeBirthdate("1990-02-31"), "");
  assert.equal(normalizeBirthdate("1990-13-01"), "");
});

test("birthdate validation requires a real, past calendar date", () => {
  assert.equal(isBirthdateValid("1990-05-12"), true);
  assert.equal(isBirthdateValid("2000-02-29"), true);
  assert.equal(isBirthdateValid("1900-01-01"), true);
  assert.equal(isBirthdateValid("1999-02-29"), false);
  assert.equal(isBirthdateValid("1899-12-31"), false);
  assert.equal(isBirthdateValid("2999-01-01"), false);
  assert.equal(isBirthdateValid("19900512"), false);
  assert.equal(isBirthdateValid(""), false);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  assert.equal(isBirthdateValid(today), false);
});

test("all web identity forms use a native date selector", () => {
  const portal = readFileSync("src/components/account/AccountPortal.tsx", "utf8");
  const signup = readFileSync("src/components/anmalan/SignupFormClient.tsx", "utf8");
  const course = readFileSync("src/components/trana/CourseEnrolButton.tsx", "utf8");

  for (const [label, source] of [["AccountPortal", portal], ["SignupFormClient", signup], ["CourseEnrolButton", course]] as const) {
    assert.ok(source.includes('type="date"'), `${label} renders a native date selector`);
    assert.ok(source.includes('min="1900-01-01"'), `${label} rejects dates before the supported range`);
    assert.ok(source.includes("normalizeBirthdate("), `${label} normalises pasted birthdates`);
    assert.ok(source.includes("isBirthdateValid("), `${label} validates via shared helper`);
  }
  assert.ok(portal.includes("birthdateHint("), "AccountPortal explains invalid dates");
  assert.ok(signup.includes("birthdateHint("), "SignupFormClient explains invalid dates");
  assert.ok(!portal.includes('placeholder="ÅÅÅÅ-MM-DD"'), "account form has no format instruction");
  assert.ok(!signup.includes("(ÅÅÅÅ-MM-DD)"), "signup form has no format instruction");

  // The login step must submit on the phone keyboard's Go/Enter key, not only
  // via a button that sits behind the keyboard.
  assert.ok(portal.includes('event.key === "Enter"'), "login submits on Enter");
  assert.ok(portal.includes('enterKeyHint="send"'), "email field labels its Go key");
});
