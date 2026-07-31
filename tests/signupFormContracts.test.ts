import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("src/components/anmalan/SignupFormClient.tsx", "utf8");

test("pilot feedback is server-gated, editable, prefilled, and submitted", () => {
  assert.match(source, /pilot_feedback_required: boolean/);
  assert.match(source, /setPilotFeedbackRating\(sub\.pilot_feedback_rating\)/);
  assert.match(source, /setPilotFeedbackComment\(sub\.pilot_feedback_comment \?\? ""\)/);
  assert.match(source, /config\.pilot_feedback_required \? \(/);
  assert.match(source, /onClick=\{\(\) => setPilotFeedbackRating\(value\)\}/);
  assert.match(source, /onChange=\{\(event\) => setPilotFeedbackComment\(event\.target\.value\)\}/);
  assert.match(source, /pilot_feedback_rating: config\?\.pilot_feedback_required \? pilotFeedbackRating : null/);
  assert.match(source, /pilot_feedback_comment: config\?\.pilot_feedback_required \? pilotFeedbackComment\.trim\(\) : null/);
});

test("retired language choices and participation acknowledgement are not selectable", () => {
  const wishOrder = source.match(/const WISH_ORDER:[^=]+=\s*\[([\s\S]*?)\];/)?.[1] ?? "";
  assert.doesNotMatch(wishOrder, /language_swedish|language_english/);
  assert.doesNotMatch(source, /<CheckRow checked=\{commitmentAck\}/);
  assert.match(source, /const acksOk = paymentAck && cancellationAck/);
});

test("any-day availability disables individual choices and clears stale selections", () => {
  assert.match(source, /const toggleAnySlot = useCallback\([\s\S]*setPrimarySlots\(\[\]\);[\s\S]*setSecondarySlots\(\[\]\)/);
  assert.match(source, /checked=\{anySlot\} onToggle=\{toggleAnySlot\}/);
  assert.match(source, /isDisabled=\{\(\) => anySlot\}/);
  assert.match(source, /isStruck=\{\(\) => anySlot\}/);
  assert.match(source, /const slotPrefs = anySlot \? \[\] : \[/);
});

test("junior signup pricing and the private membership reminder share the app contract", () => {
  assert.match(source, /junior_pricing\?: JuniorPricing/);
  assert.match(source, /birth_year_from: 2007/);
  assert.match(source, /discount_pct: 30/);
  assert.match(source, /membership_fee_sek: 190/);
  assert.match(source, /api<MembershipFeed>\("\/api\/account\/membership"\)/);
  assert.match(source, /Har du tävlingslicens ska den vara hos oss/);
  assert.match(source, /If you have a competition licence, it must be with us/);
  assert.match(source, /Om du istället vill betala fullt pris, skriv det som ett övrigt önskemål ovan/);
  assert.match(source, /If you would rather pay full price, add this under other requests above/);
  assert.match(source, /juniorDiscountApplies\(birthdate, juniorPricing\)/);
  assert.match(source, /discountPct=\{juniorDiscountPct\}/);
  assert.match(source, /discountedPriceSek\(s\.price_sek, discountPct\)/);
  assert.match(source, /showJuniorMembershipNotice \? \(/);
  assert.match(source, /junioravgiften \$\{fee\} kr/);
});

test("registration withdrawal uses explicit copy and a destructive confirmation dialog", () => {
  assert.match(source, /cancelBtn: "Dra tillbaka anmälan"/);
  assert.match(source, /cancelConfirmTitle: "Dra tillbaka anmälan\?"/);
  assert.match(source, /cancelConfirmYes: "Ja, dra tillbaka"/);
  assert.match(source, /cancelledBanner:[\s\S]*Din anmälan har dragits tillbaka/);
  assert.doesNotMatch(source, /Avbryt min anmälan|Avbryta anmälan\?/);
  assert.doesNotMatch(source, /window\.confirm/);
  assert.match(source, /setCancelConfirmOpen\(true\)/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /onClick=\{onConfirm\}/);
  assert.match(source, /await api\("\/api\/signup\/cancel", \{ method: "POST" \}\)/);
});
