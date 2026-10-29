import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { isProfileGender, profileGenderFromWire, requiresProfileGender } from "../src/lib/profileGender.core.ts";

test("profile gender accepts only explicit App choices without coercion or default selection", () => {
  for (const gender of ["herr", "dam", "ickebinar"] as const) {
    assert.equal(isProfileGender(gender), true);
    assert.equal(profileGenderFromWire(gender), gender);
  }
  for (const gender of [undefined, null, "", "M", "W", "X", "woman", true, 0, [], {}]) {
    assert.equal(isProfileGender(gender), false);
    assert.equal(profileGenderFromWire(gender), "");
  }
});

test("only a server-owned true flag requires gender; old or completed historical profiles remain compatible", () => {
  for (const profile of [undefined, null, {}, { gender_required: false }]) assert.equal(requiresProfileGender(profile), false);
  assert.equal(requiresProfileGender({ gender_required: true }), true);
});

test("both profile BFF paths validate explicit gender and forward it without browser-owned requirement flags", () => {
  for (const file of ["identity", "profile"]) {
    const route = readFileSync(`src/app/api/account/${file}/route.ts`, "utf8");
    assert.match(route, /sameOrigin\(request\)/);
    assert.match(route, /body\.gender !== undefined && !isProfileGender\(body\.gender\)/);
    assert.doesNotMatch(route, /body\.gender_required/);
    assert.match(route, /status: 422/);
  }
});

test("account gender drafts reset with the canonical person and requiredness never derives from missing gender alone", () => {
  const portal = readFileSync("src/components/account/AccountPortal.tsx", "utf8");
  assert.match(portal, /setGender\(profileGenderFromWire\(next\.gender\)\)/);
  assert.match(portal, /setGender\(profileGenderFromWire\(state\.gender\)\)/);
  assert.match(portal, /setLastName\(""\); setGender\(""\)/);
  assert.match(portal, /genderRequired && !isProfileGender\(gender\)/);
  assert.match(portal, /requiresProfileGender\(profile\) && !isProfileGender\(profile\?\.gender\)/);
  assert.match(portal, /option value="ickebinar">Icke-binär/);
  assert.match(portal, /required=\{genderRequired\}/);
});

test("inline course account completion has the same explicit gender gate without changing enrolment or payment", () => {
  const source = readFileSync("src/components/trana/CourseEnrolButton.tsx", "utf8");
  const inline = source.slice(source.indexOf("function InlineSignup"));
  assert.match(inline, /setGender\(profileGenderFromWire\(profile\.gender\)\)/);
  assert.match(inline, /setGenderRequired\(requiresProfileGender\(profile\)\)/);
  assert.match(inline, /genderRequired && !isProfileGender\(gender\)/);
  assert.match(inline, /!requiresProfileGender\(profile\) \|\| isProfileGender\(profile\.gender\)/);
  assert.equal((inline.match(/\.\.\.\(isProfileGender\(gender\) \? \{ gender \} : \{\}\)/g) ?? []).length, 2);
  assert.match(inline, /required=\{genderRequired\}/);
  assert.match(inline, /option value="ickebinar"/);
});

test("unfinished duplicate and merge drafts can add gender without reopening identity or silently bypassing it", () => {
  const portal = readFileSync("src/components/account/AccountPortal.tsx", "utf8");
  const inline = readFileSync("src/components/trana/CourseEnrolButton.tsx", "utf8");
  for (const source of [portal, inline]) {
    assert.match(source, /genderDraftRequired/);
    assert.match(source, /aria-label="Kön för identitetskontroll"/);
    assert.match(source, /disabled=\{busy \|\| genderDraftRequired\}/);
    assert.match(source, /Spara kön och fortsätt/);
  }
  assert.match(portal, /identityState\?\.identity_status === "duplicate_review" \|\| identityState\?\.identity_status === "merge_pending"/);
  assert.match(inline, /step === "duplicate" \|\| step === "merged"/);
  assert.match(inline, /requiresProfileGender\(state\) && !isProfileGender\(state\.gender\)/);
});
