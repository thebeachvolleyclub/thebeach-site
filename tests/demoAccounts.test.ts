import assert from "node:assert/strict";
import test from "node:test";

import { demoWebAccounts } from "../src/lib/demoAccounts.ts";

test("synthetic website accounts are exposed only in the demo environment", () => {
  assert.deepEqual(demoWebAccounts("production"), []);
  assert.deepEqual(demoWebAccounts(undefined), []);

  const accounts = demoWebAccounts("demo");
  assert.equal(accounts.length, 2);
  assert.ok(accounts.every((account) => account.email.endsWith("@example.test")));
  assert.ok(accounts.some((account) => account.email === "member-coach-youth@example.test"));
  assert.ok(accounts.some((account) => account.email === "nonmember@example.test"));
});
