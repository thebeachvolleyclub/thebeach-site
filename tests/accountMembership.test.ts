import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const route = readFileSync(
  new URL("../src/app/api/account/membership/route.ts", import.meta.url),
  "utf8",
);
const portal = readFileSync(
  new URL("../src/components/account/AccountPortal.tsx", import.meta.url),
  "utf8",
);

test("membership route uses the HttpOnly account session and private caching", () => {
  assert.match(route, /accountToken\(\)/);
  assert.match(route, /if \(!token\)/);
  assert.match(route, /const response = unauthorized\(\)/);
  assert.match(route, /appApi\("\/booking\/memberships\/mine", undefined, \{ token \}\)/);
  assert.match(route, /"Cache-Control": "private, no-store"/);
  assert.doesNotMatch(route, /searchParams|playerId|email/);
});

test("account overview presents membership status without exposing source identity", () => {
  assert.match(portal, /api<MembershipFeed>\("\/api\/account\/membership"\)/);
  assert.match(portal, /Aktivt medlemskap|Medlemskap/);
  assert.match(portal, /Betalning saknas/);
  assert.match(portal, /membershipFeed\.activeCount > 0/);
  assert.doesNotMatch(portal, /sourceSystem|externalSourceId/);
});
