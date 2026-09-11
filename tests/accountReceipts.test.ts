import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

test("authenticated account receipt routes proxy only the existing owned-invoice API", () => {
  const requestRoute = fs.readFileSync(
    path.join(root, "src/app/api/account/invoices/[invoiceId]/receipt/request/route.ts"),
    "utf8",
  );
  const linkRoute = fs.readFileSync(
    path.join(root, "src/app/api/account/invoices/[invoiceId]/receipt/route.ts"),
    "utf8",
  );

  for (const source of [requestRoute, linkRoute]) {
    assert.match(source, /accountToken\(\)/);
    assert.match(source, /if \(!token\) return unauthorized\(\)/);
    assert.match(source, /validInvoiceId\(invoiceId\)/);
    assert.match(source, /encodeURIComponent\(invoiceId\)/);
    assert.match(source, /\{ token \}/);
  }
  assert.match(requestRoute, /request-friskvard/);
  assert.match(linkRoute, /friskvard-link/);
});

test("account invoices expose request, pending and PDF-download receipt states", () => {
  const portal = fs.readFileSync(
    path.join(root, "src/components/account/AccountPortal.tsx"),
    "utf8",
  );

  assert.match(portal, /friskvard_requested\?: boolean/);
  assert.match(portal, /friskvard_generated\?: boolean/);
  assert.match(portal, /friskvard_receipt_number\?: string \| null/);
  assert.match(portal, /Begär friskvårdskvitto/);
  assert.match(portal, /Friskvårdskvitto begärt/);
  assert.match(portal, /Ladda ner kvitto \(PDF\)/);
  assert.match(portal, /window\.location\.assign\(result\.url\)/);
});
