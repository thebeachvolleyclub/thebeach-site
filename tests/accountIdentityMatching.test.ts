import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const portal = readFileSync("src/components/account/AccountPortal.tsx", "utf8");
const profileRoute = readFileSync("src/app/api/account/profile/route.ts", "utf8");
const matchingRoute = readFileSync("src/app/api/account/profile/match-rating/route.ts", "utf8");

test("new web identities require birthdate and opt into the Master duplicate guard", () => {
  assert.match(portal, /Födelsedatum krävs när vi skapar en ny spelarprofil/);
  assert.match(portal, /check_duplicates: true/);
  assert.match(portal, /confirm_new_identity: confirmNewIdentity/);
  assert.match(profileRoute, /"check_duplicates", "confirm_new_identity"/);
});

test("web profile matching completes before the signup hand-back", () => {
  const saveStart = portal.indexOf("const saveProfile");
  const saveEnd = portal.indexOf("const requestMerge", saveStart);
  const saveFlow = portal.slice(saveStart, saveEnd);
  assert.ok(saveFlow.indexOf("/api/account/profile/match-rating") < saveFlow.indexOf("applyProfile(ratingMatch.profile ?? next)"));
  assert.match(portal, /if \(nextPath && profile\?\.name\?\.trim\(\) && !dupAlert\)/);
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
