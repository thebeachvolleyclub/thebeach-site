import assert from "node:assert/strict";
import test from "node:test";

import {
  accountReturnNeedsSwish,
  canReturnFromAccount,
  safeAccountNext,
} from "../src/lib/accountReturn.core.ts";

test("account hand back only accepts safe same origin paths", () => {
  assert.equal(safeAccountNext("/boka"), "/boka");
  assert.equal(safeAccountNext("/en/book"), "/en/book");
  assert.equal(safeAccountNext("//example.com"), null);
  assert.equal(safeAccountNext("https://example.com"), null);
  assert.equal(safeAccountNext("/boka?unsafe=true"), null);
});

test("account hand back keeps the anchor the course cards send", () => {
  assert.equal(safeAccountNext("/trana#kurser"), "/trana#kurser");
  assert.equal(safeAccountNext("/en/training#kurser"), "/en/training#kurser");
  assert.equal(safeAccountNext("/trana#kurser?x=1"), null);
  assert.equal(safeAccountNext("/trana#a#b"), null);
  assert.equal(canReturnFromAccount("/trana#kurser", { name: "Mattias", swish_phone: null }), true);
  assert.equal(accountReturnNeedsSwish("/boka#tider"), false);
});

test("booking hand back allows Stripe users without a Swish number", () => {
  assert.equal(accountReturnNeedsSwish("/boka"), false);
  assert.equal(accountReturnNeedsSwish("/en/book"), false);
  assert.equal(canReturnFromAccount("/boka", { name: "Mattias", swish_phone: null }), true);
  assert.equal(canReturnFromAccount("/boka", { name: "Mattias", swish_phone: "46701234567" }), true);
});

test("other account hand backs only require a named profile", () => {
  assert.equal(accountReturnNeedsSwish("/anmalan"), false);
  assert.equal(canReturnFromAccount("/anmalan", { name: "Mattias", swish_phone: null }), true);
  assert.equal(canReturnFromAccount("/anmalan", { name: "  ", swish_phone: "46701234567" }), false);
});
