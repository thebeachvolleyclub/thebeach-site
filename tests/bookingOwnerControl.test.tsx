import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import BookingOwnerControl from "../src/components/account/BookingOwnerControl.tsx";

const noop = () => undefined;
const render = (booking: Record<string, unknown>, extra: Record<string, unknown> = {}) =>
  renderToStaticMarkup(createElement(BookingOwnerControl, { booking: { id: "b1", status: "CONFIRMED", ...booking }, onAction: noop, busy: false, ...extra }));

test("HQ #295: regular confirmed booking keeps Avboka", () => {
  const html = render({});
  assert.match(html, />Avboka</);
  assert.doesNotMatch(html, /Släpp tiden/);
  assert.match(render({}, { longLabel: true }), />Avboka bokning</);
});

test("HQ #295: paid subscription time shows Släpp tiden with the credit hint, never Avboka", () => {
  const html = render({ subscriptionId: "s1", subscriptionOccurrenceId: "o1", subscriptionStatus: "ACTIVE", subscriptionOccurrenceStatus: "SCHEDULED" });
  assert.match(html, />Släpp tiden</);
  assert.match(html, /släpps med tillgodo, avbokas inte/);
  assert.doesNotMatch(html, /Avboka/);
  assert.match(render({ subscriptionId: "s1", subscriptionOccurrenceId: "o1", subscriptionStatus: "ACTIVE", subscriptionOccurrenceStatus: "SCHEDULED" }, { busy: true }), /Släpper…/);
});

test("HQ #295: unpaid subscription time points to the subscription instead of a cancel button", () => {
  for (const status of ["OFFERED", "AWAITING_PAYMENT"]) {
    const html = render({ subscriptionId: "s1", subscriptionOccurrenceId: "o1", subscriptionStatus: status, subscriptionOccurrenceStatus: "SCHEDULED" });
    assert.match(html, /Ingår i banabonnemang · väntar på betalning/);
    assert.match(html, /Öppna abonnemanget/);
    assert.doesNotMatch(html, /Avboka|Släpp tiden/);
  }
});

test("HQ #295: nothing is rendered for non-confirmed rows or released times", () => {
  assert.equal(render({ status: "PENDING_PAYMENT" }), "");
  assert.equal(render({ subscriptionId: "s1", subscriptionOccurrenceId: "o1", subscriptionStatus: "ACTIVE", subscriptionOccurrenceStatus: "RELEASED" }), "");
});
