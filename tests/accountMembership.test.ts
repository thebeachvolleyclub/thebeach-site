import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  buildMembershipOverview,
  hasActiveMembershipForYear,
  membershipCategoryForYear,
  membershipFeedFromWire,
  membershipHistory,
  membershipPurchaseNeedsBirthdate,
  membershipPurchaseCanRetry,
  membershipPurchaseFromWire,
  membershipPurchaseStorageKey,
  moneyFromOre,
  safeSwishDeepLink,
  validSwishPayerAlias,
} from "../src/lib/accountMembership.core.ts";

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
  assert.match(route, /privateResponse\(unauthorized\(\)\)/);
  assert.match(route, /appApi\("\/booking\/memberships\/mine", undefined, \{ token \}\)/);
  assert.match(route, /headers\.set\("Cache-Control", "private, no-store"\)/);
  assert.doesNotMatch(route, /searchParams|playerId|email/);
});

test("membership BFF permits only an authenticated same-origin web purchase", () => {
  assert.match(route, /export async function POST\(request: Request\)/);
  assert.match(route, /sameOrigin\(request\)/);
  assert.match(route, /\/booking\/memberships\/purchases/);
  assert.match(route, /productId,/);
  assert.match(route, /idempotencyKey,/);
  assert.match(route, /payerAlias,/);
  assert.match(route, /channel: "WEB"/);
  assert.match(route, /\^\[\+\\d\]\[\\d \(\)-\]\{7,19\}\$/);
  assert.doesNotMatch(route, /amountOre|priceOre|validFrom|validTo|customerId|playerId/);
});

test("wire adapter keeps full membership, catalogue and pending purchase metadata", () => {
  const feed = membershipFeedFromWire({
    memberships: [{
      id: "membership-current",
      productId: "senior-2026",
      typeName: "Senior 2026",
      category: "senior",
      year: 2026,
      venueName: "The Beach",
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      status: "Betalt",
      paid: true,
      current: true,
      active: true,
      readOnly: false,
      source: "NATIVE",
      purchasedAt: "2026-08-28T12:00:00Z",
      amountOre: 35000,
      paymentMethod: "SWISH",
      paymentReference: "membership-reference",
    }, {
      typeName: "Senior 2025",
      validFrom: "2025-01-01",
      validTo: "2025-12-31",
      status: "Betalt",
      paid: true,
      current: false,
      active: false,
    }],
    activeCount: 1,
    purchaseOptions: [{
      productId: "junior-2026",
      typeName: "Junior 2026",
      category: "junior",
      year: 2026,
      priceOre: 19000,
      vatBasisPoints: 600,
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      available: false,
      unavailableReason: "active_membership",
    }],
    purchase: {
      id: "purchase-one",
      productId: "senior-2026",
      year: 2026,
      status: "PAID",
      attemptStatus: "PAID",
      amountOre: 35000,
      paymentMethod: "SWISH",
      instructionUuid: "instruction",
      paymentRequestToken: "provider-token",
      deepLinkUrl: "swish://paymentrequest?token=provider-token",
      paymentVerificationPending: false,
      createdAt: "2026-08-28T12:00:00Z",
      paidAt: "2026-08-28T12:01:00Z",
    },
    purchases: [{
      id: "purchase-one",
      productId: "senior-2026",
      year: 2026,
      status: "PAID",
      attemptStatus: "PAID",
      amountOre: 35000,
      paymentMethod: "SWISH",
      createdAt: "2026-08-28T12:00:00Z",
      paidAt: "2026-08-28T12:01:00Z",
    }],
    currentYear: 2026,
    purchaseEligibility: { available: false, reason: null },
  });

  assert.equal(feed.memberships[0].paymentReference, "membership-reference");
  assert.equal(feed.memberships[1].source, "MATCHI");
  assert.equal(feed.memberships[1].readOnly, true);
  assert.equal(feed.purchaseOptions[0].priceOre, 19000);
  assert.equal(feed.purchase?.status, "PAID");
  assert.equal(feed.purchases[0].status, "PAID");
  assert.equal(feed.currentYear, 2026);
  assert.deepEqual(feed.purchaseEligibility, { available: false, reason: null });
  assert.equal(membershipPurchaseFromWire({ ...feed.purchase, status: "UNKNOWN" }), null);
  assert.equal(membershipHistory(feed)[0].id, "membership-current");
  assert.equal(hasActiveMembershipForYear(feed, 2026), true);
  assert.equal(moneyFromOre(19000)?.replace(/\u00a0/g, " "), "190 kr");
});

test("membership overview groups annual status and exposes only the age-qualified option", () => {
  const feed = membershipFeedFromWire({
    memberships: [{
      id: "senior-2026",
      productId: "senior-2026",
      typeName: "Senior 2026",
      category: "senior",
      year: 2026,
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      status: "Betalt",
      paid: true,
      current: true,
      active: true,
      source: "NATIVE",
    }, {
      id: "senior-2025",
      productId: "senior-2025",
      typeName: "Senior 2025",
      category: "senior",
      year: 2025,
      validFrom: "2025-01-01",
      validTo: "2025-12-31",
      status: "Betalt",
      paid: true,
      current: false,
      active: false,
      source: "MATCHI",
    }],
    purchaseOptions: [{
      productId: "junior-2027",
      typeName: "Junior 2027",
      category: "junior",
      year: 2027,
      priceOre: 19000,
      available: true,
    }, {
      productId: "senior-2027",
      typeName: "Senior 2027",
      category: "senior",
      year: 2027,
      priceOre: 35000,
      available: true,
    }],
    currentYear: 2026,
  });
  const overview = buildMembershipOverview(feed, new Date("1988-06-04T12:00:00Z"));
  assert.deepEqual(overview.yearSections.map((section) => section.year), [2026, 2027]);
  assert.equal(overview.yearSections[0].membership?.id, "senior-2026");
  assert.equal(overview.yearSections[0].purchaseOption, null);
  assert.equal(overview.yearSections[1].purchaseOption?.productId, "senior-2027");
  assert.deepEqual(overview.history.map((record) => record.id), ["senior-2025"]);
  assert.equal(membershipCategoryForYear(new Date("2008-01-01T12:00:00Z"), 2027), "junior");
});

test("paid and in-progress annual purchases prevent duplicate purchase options", () => {
  const base = {
    memberships: [],
    purchaseOptions: [{
      productId: "senior-2027",
      typeName: "Senior 2027",
      category: "senior",
      year: 2027,
      priceOre: 35000,
      available: true,
    }],
    currentYear: 2026,
    purchaseEligibility: { available: true, reason: null },
  };
  for (const status of ["AWAITING_PAYMENT", "PAID"] as const) {
    const feed = membershipFeedFromWire({
      ...base,
      purchases: [{
        id: `purchase-${status}`,
        productId: "senior-2027",
        year: 2027,
        status,
        attemptStatus: status === "PAID" ? "PAID" : "CREATED",
        amountOre: 35000,
        paymentMethod: "SWISH",
        createdAt: "2026-08-29T12:00:00Z",
      }],
    });
    const section = buildMembershipOverview(feed, new Date("1988-06-04T12:00:00Z"))
      .yearSections.find((candidate) => candidate.year === 2027);
    assert.equal(section?.purchaseOption, null);
  }
});

test("missing birthdate follows server eligibility and fails closed for legacy feeds", () => {
  const legacyFeed = membershipFeedFromWire({
    purchaseOptions: [{
      productId: "junior-2026",
      typeName: "Junior 2026",
      category: "junior",
      year: 2026,
      priceOre: 19000,
      available: true,
    }],
    currentYear: 2026,
  });
  assert.equal(membershipPurchaseNeedsBirthdate(legacyFeed, null), true);
  assert.equal(buildMembershipOverview(legacyFeed, null).yearSections[0].purchaseOption, null);

  const serverFeed = membershipFeedFromWire({
    ...legacyFeed,
    purchaseEligibility: { available: false, reason: "birthdate_required" },
  });
  assert.equal(membershipPurchaseNeedsBirthdate(serverFeed, null), true);
});

test("Swish input and resumable attempt helpers fail closed", () => {
  assert.equal(validSwishPayerAlias("070-123 45 67"), true);
  assert.equal(validSwishPayerAlias("46701234567"), true);
  assert.equal(validSwishPayerAlias("123"), false);
  assert.equal(safeSwishDeepLink("swish://paymentrequest?token=ok"), "swish://paymentrequest?token=ok");
  assert.equal(safeSwishDeepLink("swish://paymentrequest"), null);
  assert.equal(safeSwishDeepLink("swish://untrusted?token=ok"), null);
  assert.equal(safeSwishDeepLink("https://evil.example/payment"), null);
  const option = {
    productId: "junior-2026",
    typeName: "Junior 2026",
    category: "junior",
    year: 2026,
    priceOre: 19000,
    vatBasisPoints: 600,
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    available: true,
    unavailableReason: null,
  } as const;
  assert.equal(
    membershipPurchaseStorageKey("account-one", option),
    "tb-membership-purchase:account-one:2026:junior-2026",
  );
  assert.notEqual(
    membershipPurchaseStorageKey("account-one", option),
    membershipPurchaseStorageKey("account-two", option),
  );
  assert.throws(() => membershipPurchaseStorageKey("", option), /account identity/);
  const terminal = membershipPurchaseFromWire({
    id: "purchase-one",
    productId: option.productId,
    year: option.year,
    status: "AWAITING_PAYMENT",
    attemptStatus: "DECLINED",
    amountOre: option.priceOre,
    createdAt: "2026-08-28T12:00:00Z",
  });
  assert.equal(membershipPurchaseCanRetry(terminal), true);
  assert.equal(
    membershipPurchaseCanRetry(terminal && { ...terminal, attemptStatus: "CREATING" }),
    false,
  );
  assert.equal(
    membershipPurchaseCanRetry(terminal && { ...terminal, status: "PAID" }),
    false,
  );
});

test("account keeps membership as a permanent destination with history and accessible purchase", () => {
  assert.match(portal, /\["membership", "Medlemskap"\]/);
  assert.match(portal, /tab === "membership" \? <MembershipCentre/);
  assert.match(portal, /membershipFeedFromWire/);
  assert.doesNotMatch(portal, /Historik från MATCHI · skrivskyddad/);
  assert.match(portal, /paymentReference/);
  assert.match(portal, /Swish-referens/);
  assert.match(portal, /moms \{option\.vatBasisPoints \/ 100\}%/);
  assert.match(portal, /purchasedAt/);
  assert.match(portal, /buildMembershipOverview/);
  assert.match(portal, /section\.purchaseOption/);
  assert.match(portal, /visibilitychange/);
  assert.match(portal, /window\.addEventListener\("focus"/);
  assert.match(portal, /`membership-payer-alias-\${option\.productId}`/);
  assert.match(portal, /type="tel" inputMode="tel" enterKeyHint="send" autoComplete="tel" required/);
  assert.match(portal, /onKeyDown=\{\(event\).*event\.key === "Enter"/s);
  assert.match(portal, /aria-describedby={`\${hintId} \${errorId}`}/);
  assert.match(portal, /aria-live="polite"/);
  assert.match(portal, /localStorage\.getItem\(storageKey\)/);
  assert.match(portal, /membershipPurchaseStorageKey\(profileId, option\)/);
  assert.match(portal, /if \(freshAttempt\) localStorage\.removeItem\(storageKey\)/);
  assert.match(portal, /retryingTerminalAttempt/);
  assert.match(portal, /\(!option\.available && !retryingTerminalAttempt\)/);
  assert.match(portal, /Försök med Swish igen/);
  assert.match(portal, /Betala med Swish/);
  assert.match(portal, /bg-black[^>]+text-white/);
});
