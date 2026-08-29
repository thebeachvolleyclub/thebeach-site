import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  activeCompetitionLicencesForYear,
  competitionLicenceContentForYear,
  competitionLicenceDisplayYear,
  type LicenceState,
} from "../src/lib/accountCompetitionLicence.core.ts";

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
  assert.match(portal, /competitionLicenceContentForYear\(licenceState, section\.year, feed\.currentYear\)/);
  assert.match(portal, /licenceContent === "request"/);
  assert.match(portal, /licenceContent === "status"/);
  assert.match(portal, /Begär tävlingslicens/);
  assert.match(portal, /crypto\.randomUUID\(\)/);
  assert.match(portal, /licenceIdempotencyKey\.current/);
  assert.match(portal, /localStorage\.getItem\(storageKey\)/);
  assert.match(portal, /await refreshMembershipLifecycle\(\)/);
});

test("terminal licence requests stop same-year retries and lead to human help", () => {
  assert.match(portal, /request\.status === "rejected" \|\| request\.status === "cancelled"/);
  assert.match(portal, /Du kan inte skicka en ny begäran för samma medlemsår/);
  assert.match(portal, /mailto:rasmus\.boden@thebeach\.one/);
  assert.match(portal, /Kontakta klubben/);
  assert.match(portal, /Du behöver inte skicka den igen/);
});

test("licence content stays inside its membership year and future actions remain hidden", () => {
  const eligible: LicenceState = {
    request: null,
    eligibility: {
      eligible: true,
      membershipYear: 2026,
      membershipType: "Senior 2026",
    },
  };
  assert.equal(competitionLicenceDisplayYear(eligible), 2026);
  assert.equal(competitionLicenceContentForYear(eligible, 2026, 2026), "request");
  assert.equal(competitionLicenceContentForYear(eligible, 2027, 2026), null);

  const futureEligible: LicenceState = {
    request: null,
    eligibility: {
      eligible: true,
      membershipYear: 2027,
      membershipType: "Senior 2027",
    },
  };
  assert.equal(competitionLicenceContentForYear(futureEligible, 2027, 2026), null);

  const existing: LicenceState = {
    request: {
      id: 17,
      membership_type: "Senior 2027",
      membership_year: 2027,
      status: "pending",
      created_at: "2027-01-03T10:00:00Z",
    },
    eligibility: { eligible: false },
  };
  assert.equal(competitionLicenceContentForYear(existing, 2027, 2026), "status");
});

test("registered yearly licence replaces the request action with verified licence content", () => {
  const licensed: LicenceState = {
    request: null,
    eligibility: {
      eligible: true,
      membershipYear: 2026,
      membershipType: "Senior 2026",
    },
    has_active_competition_licence: true,
    competition_licences: [{
      provider: "profixio",
      year: 2026,
      type: "beachvolley",
      label: "Beachvolley 2026",
      status: "valid",
      activated_on: "2026-05-14",
    }],
  };

  assert.equal(competitionLicenceContentForYear(licensed, 2026, 2026), "licensed");
  assert.equal(competitionLicenceContentForYear(licensed, 2027, 2026), null);
  assert.equal(activeCompetitionLicencesForYear(licensed, 2026)[0]?.label, "Beachvolley 2026");
  assert.match(portal, /Du har tävlingslicens/);
  assert.match(portal, /licenceContent === "licensed"/);
});

test("licence request or verified card is rendered directly beneath the matching membership", () => {
  const membershipPosition = portal.indexOf("<MembershipRecordCard item={section.membership}");
  const licencePosition = portal.indexOf('licenceContent === "request"');
  const purchaseOptionPosition = portal.indexOf("section.purchaseOption ? <MembershipPurchaseOptionCard");
  assert.ok(membershipPosition >= 0);
  assert.ok(licencePosition > membershipPosition);
  assert.ok(purchaseOptionPosition > licencePosition);
  assert.match(portal, /aria-label={`Begär tävlingslicens \${year}`}[^>]+bg-black[^>]+text-white/s);
  assert.doesNotMatch(portal, /aria-label={`Begär tävlingslicens \${year}`}[^>]+w-full/s);
  assert.match(portal, /function CompetitionLicenceCard/);
  assert.match(portal, /aria-label={`Du har tävlingslicens för \${year}`}/);
});
