import assert from "node:assert/strict";
import test from "node:test";
import { invoiceAmountDue, invoiceEmailRequestConfirmation } from "../src/lib/accountInvoice.core.ts";

const unpaid = { amount_sek: 4000, amount_due_sek: 4000, status: "sent", traditional_fee_sek: 150 };

test("email invoice consent quotes the server fee and total before any request", () => {
  const text = invoiceEmailRequestConfirmation(unpaid)!;
  assert.match(text, /150 kr/);
  assert.match(text.replace(/\s/g, " "), /4 150 kr/);
  assert.match(text, /e-post/);
  assert.equal(invoiceAmountDue(unpaid), 4000);
});

test("existing requested invoice uses server due amount without adding the fee twice", () => {
  const requested = { ...unpaid, traditional_requested: true, amount_due_sek: 4150 };
  assert.equal(invoiceAmountDue(requested), 4150);
  assert.equal(invoiceEmailRequestConfirmation(requested), null);
  assert.equal(invoiceAmountDue({ ...requested, amount_due_sek: undefined }), 4150);
});

test("only payable invoices with a known fee can request email invoices", () => {
  assert.equal(invoiceEmailRequestConfirmation({ ...unpaid, amount_sek: 0, amount_due_sek: 0 }), null);
  for (const status of ["paid", "cancelled", "refunded", "draft"]) {
    assert.equal(invoiceEmailRequestConfirmation({ ...unpaid, status }), null);
  }
  for (const traditional_fee_sek of [undefined, NaN, -1]) {
    assert.equal(invoiceEmailRequestConfirmation({ ...unpaid, traditional_fee_sek }), null);
  }
  assert.match(invoiceEmailRequestConfirmation({ ...unpaid, traditional_fee_sek: 75 })!, /75 kr/);
});
