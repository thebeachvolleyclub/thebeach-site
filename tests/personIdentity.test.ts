import assert from "node:assert/strict";
import test from "node:test";

import { normalizePersonName, splitValidFullName, validNameComponent } from "../src/lib/personIdentity.ts";

test("person names are normalized with Unicode preserved", () => {
  assert.equal(normalizePersonName("  A\u030Angstro\u0308m   Lind  "), "Ångström Lind");
});

test("a legacy full-name field still requires distinct valid first and last names", () => {
  assert.deepEqual(splitValidFullName("Måns Aurelius"), {
    firstName: "Måns",
    lastName: "Aurelius",
  });
  assert.equal(splitValidFullName("Måns"), null);
  assert.equal(splitValidFullName("19870412 Aurelius"), null);
});

test("a person name component requires real letters and permits ordinary separators", () => {
  for (const name of ["Måns", "Anne-Marie", "O’Neill", "de la Cruz"]) {
    assert.equal(validNameComponent(name), true, name);
  }
  for (const name of ["", "1", "19870412", "A", "--", "Måns!", "<script>"]) {
    assert.equal(validNameComponent(name), false, name);
  }
});
