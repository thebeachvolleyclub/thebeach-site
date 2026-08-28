import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const route = readFileSync("src/app/api/account/competition-licence/route.ts", "utf8");
const portal = readFileSync("src/components/account/AccountPortal.tsx", "utf8");

test("licence route keeps the bearer server-side and accepts only retry identity", () => {
  assert.match(route, /accountToken\(\)/);
  assert.match(route, /sameOrigin\(request\)/);
  assert.match(route, /\/competition-licence\/request/);
  assert.match(route, /\/competition-licence\/requests/);
  assert.match(route, /idempotency_key: body\.idempotencyKey/);
  assert.match(route, /private, no-store/);
  assert.doesNotMatch(route, /X-User-Id|beach_id|membershipId|membershipYear|created_at/);
});

test("account shows the action only after server-verified eligibility and keeps status visible", () => {
  assert.match(portal, /api<LicenceState>\("\/api\/account\/competition-licence"\)/);
  assert.match(portal, /state\.eligibility\.eligible/);
  assert.match(portal, /state\.request/);
  assert.match(portal, /Begär tävlingslicens/);
  assert.match(portal, /Ingen extern licens beställs automatiskt/);
  assert.match(portal, /Junior- eller Seniormedlemskap/);
  assert.match(portal, /crypto\.randomUUID\(\)/);
  assert.match(portal, /licenceIdempotencyKey\.current/);
  assert.match(portal, /localStorage\.getItem\(storageKey\)/);
  assert.match(portal, /await refreshMembershipLifecycle\(\)/);
});

test("terminal licence requests stop same-year retries and lead to human help", () => {
  assert.match(portal, /state\.request\.status === "rejected" \|\| state\.request\.status === "cancelled"/);
  assert.match(portal, /Du kan inte skicka en ny begäran för samma medlemsår/);
  assert.match(portal, /mailto:rasmus\.boden@thebeach\.one/);
  assert.match(portal, /Kontakta klubben/);
  assert.match(portal, /Du behöver inte skicka den igen/);
});
