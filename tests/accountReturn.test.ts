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

test("booking hand back waits for both name and Swish number", () => {
  assert.equal(accountReturnNeedsSwish("/boka"), true);
  assert.equal(accountReturnNeedsSwish("/en/book"), true);
  assert.equal(canReturnFromAccount("/boka", { name: "Mattias", swish_phone: null }), false);
  assert.equal(canReturnFromAccount("/boka", { name: "Mattias", swish_phone: "46701234567" }), true);
});

test("other account hand backs only require a named profile", () => {
  assert.equal(accountReturnNeedsSwish("/anmalan"), false);
  assert.equal(canReturnFromAccount("/anmalan", { name: "Mattias", swish_phone: null }), true);
  assert.equal(canReturnFromAccount("/anmalan", { name: "  ", swish_phone: "46701234567" }), false);
});
