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
