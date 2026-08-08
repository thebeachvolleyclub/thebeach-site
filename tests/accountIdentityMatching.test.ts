import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const portal = readFileSync("src/components/account/AccountPortal.tsx", "utf8");
const profileRoute = readFileSync("src/app/api/account/profile/route.ts", "utf8");
const matchingRoute = readFileSync("src/app/api/account/profile/match-rating/route.ts", "utf8");
const identityRoute = readFileSync("src/app/api/account/identity/route.ts", "utf8");
const decisionRoute = readFileSync("src/app/api/account/identity/[playerId]/route.ts", "utf8");
const courseSignup = readFileSync("src/components/trana/CourseEnrolButton.tsx", "utf8");

test("all web account profiles require birthdate and opt into the Master duplicate guard", () => {
  // Birthdate is still mandatory — the gate just moved from a bare
  // ÅÅÅÅ-MM-DD regex to the shared validator, so a phone keypad (which has
  // no hyphen key) can actually satisfy it. See tests/birthdate.test.ts.
  assert.match(portal, /if \(!isBirthdateValid\(normalizedBirthdate\)\)/);
  assert.match(portal, /setError\(birthdateHint\(birthdate\)\)/);
  assert.doesNotMatch(portal, /!profile\?\.canonical_player_id && !/);
  assert.match(portal, /check_duplicates: true/);
  assert.match(portal, /confirm_new_identity: confirmNewIdentity/);
  assert.match(profileRoute, /"check_duplicates", "confirm_new_identity"/);
});

test("web profile matching completes before the signup hand-back", () => {
  const saveStart = portal.indexOf("const saveProfile");
  const saveEnd = portal.indexOf("const requestMerge", saveStart);
  const saveFlow = portal.slice(saveStart, saveEnd);
  assert.ok(saveFlow.indexOf("/api/account/profile/match-rating") < saveFlow.indexOf("applyProfile(ratingMatch.profile ?? next)"));
  assert.match(portal, /if \(canReturnFromAccount\(nextPath, profile\) && !dupAlert && !identityRequired\)/);
});

test("durable identity onboarding is server-capability gated and blocks person-scoped account data", () => {
  assert.match(portal, /profile\?\.identity_onboarding_v2_enabled/);
  assert.match(portal, /profile\.identity_status !== "active"/);
  assert.match(portal, /const profileId = identityRequired \? undefined : profile\?\.id/);
  assert.match(portal, /!identityRequired \? \[\["overview"/);
  assert.match(courseSignup, /Boolean\(profile\.identity_onboarding_v2_enabled\)/);
});

test("web onboarding persists a structured identity and requires an explicit yes or no", () => {
  assert.match(portal, /first_name: trimmedFirstName/);
  assert.match(portal, /last_name: trimmedLastName/);
  assert.match(portal, /decideIdentityCandidate\("yes"\)/);
  assert.match(portal, /decideIdentityCandidate\("no"\)/);
  assert.match(portal, /Ja, det är jag/);
  assert.match(portal, /Nej, det är inte jag/);
  assert.match(courseSignup, /body: JSON\.stringify\(\{ decision: "yes" \}\)/);
  assert.match(courseSignup, /body: JSON\.stringify\(\{ decision: "no" \}\)/);
});

test("identity BFF routes keep the bearer token server-side and reject cross-origin mutations", () => {
  assert.match(identityRoute, /accountToken\(\)/);
  assert.match(identityRoute, /sameOrigin\(request\)/);
  assert.match(identityRoute, /\/matchmaking\/identity\/onboarding\/profile/);
  assert.match(decisionRoute, /accountToken\(\)/);
  assert.match(decisionRoute, /sameOrigin\(request\)/);
  assert.match(decisionRoute, /body\.decision !== "yes" && body\.decision !== "no"/);
  assert.match(decisionRoute, /\^\\d\+\$/);
});

test("server-side web matching uses trusted lookup then persists found data", () => {
  assert.match(matchingRoute, /\/matchmaking\/users\/me\/lookup-rating/);
  assert.match(matchingRoute, /lookup\.status !== "found"/);
  assert.match(matchingRoute, /\/matchmaking\/users\/me\/apply-lookup/);
  assert.match(matchingRoute, /sameOrigin\(request\)/);
  assert.match(matchingRoute, /accountToken\(\)/);
});

test("merge path stays blocked from redirect until profile matching finishes", () => {
  const mergeStart = portal.indexOf("const requestMerge");
  const mergeEnd = portal.indexOf("const upload", mergeStart);
  const mergeFlow = portal.slice(mergeStart, mergeEnd);
  assert.match(mergeFlow, /await saveProfile\(true\)/);
  assert.doesNotMatch(mergeFlow, /setDupAlert\(null\)/);
});
