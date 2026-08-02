import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// @ts-expect-error Node's native TypeScript runner needs the explicit extension.
import {
  classifyCoursePayment,
  clearCourseAttempt,
  courseAttemptKey,
  courseInvoiceId,
  pendingCourseInvoice,
  pollCoursePayment,
  remainingCoursePaymentTimeout,
  rememberCourseInvoice,
  validInvoiceId,
} from "../src/lib/coursePayment.core.ts";
// @ts-expect-error Node's native TypeScript runner needs the explicit extension.
import {
  createCourseInvoiceStatusGet,
  createCourseSwishPost,
} from "../src/lib/coursePaymentRoute.core.ts";

const invoiceId = "2adb3894-2460-4a88-98c0-e4440b31d3ae";

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
}

test("accepts the supported enrollment invoice shapes and rejects unsafe identifiers", () => {
  assert.equal(courseInvoiceId({ invoice_id: invoiceId }), invoiceId);
  assert.equal(courseInvoiceId({ invoiceId }), invoiceId);
  assert.equal(courseInvoiceId({ invoice: { id: invoiceId } }), invoiceId);
  assert.equal(courseInvoiceId({ invoice: { invoice_id: invoiceId } }), invoiceId);
  assert.equal(courseInvoiceId({ enrolment: { invoice_id: invoiceId } }), invoiceId);
  assert.equal(courseInvoiceId({ enrollment: { invoiceId } }), invoiceId);
  assert.equal(courseInvoiceId({ enrollment: { invoice: { id: invoiceId } } }), invoiceId);
  assert.equal(courseInvoiceId({ invoice_id: "../../admin" }), null);
  assert.equal(validInvoiceId(invoiceId), true);
  assert.equal(validInvoiceId("not-an-invoice"), false);
});

test("classifies callback driven payment states without trusting letter case", () => {
  assert.equal(classifyCoursePayment({ status: "PAID" }), "paid");
  assert.equal(classifyCoursePayment({ status: "confirmed" }), "unknown");
  assert.equal(classifyCoursePayment({ status: "succeeded" }), "unknown");
  assert.equal(classifyCoursePayment({ payment_status: "pending_payment" }), "pending");
  assert.equal(classifyCoursePayment({ invoice: { status: "cancelled" } }), "failed");
  assert.equal(classifyCoursePayment({ status: "backend_added_something_new" }), "unknown");
});

test("polls through transient errors and pending status until paid", async () => {
  const results: Array<unknown | Error> = [
    new Error("temporary network failure"),
    { status: "sent" },
    { status: "paid" },
  ];
  let clock = 0;
  const outcome = await pollCoursePayment(
    async () => {
      const value = results.shift();
      if (value instanceof Error) throw value;
      return value;
    },
    {
      intervalMs: 10,
      timeoutMs: 100,
      now: () => clock,
      sleep: async (milliseconds) => {
        clock += milliseconds;
      },
    },
  );
  assert.deepEqual(outcome, { state: "paid", status: "paid" });
});

test("stops on terminal failure and returns a bounded timeout", async () => {
  let failureClock = 0;
  const failed = await pollCoursePayment(async () => ({ status: "expired" }), {
    now: () => failureClock,
    sleep: async (milliseconds) => {
      failureClock += milliseconds;
    },
  });
  assert.deepEqual(failed, { state: "failed", status: "expired" });

  let timeoutClock = 0;
  const timedOut = await pollCoursePayment(async () => ({ status: "sent" }), {
    intervalMs: 10,
    timeoutMs: 25,
    now: () => timeoutClock,
    sleep: async (milliseconds) => {
      timeoutClock += milliseconds;
    },
  });
  assert.deepEqual(timedOut, { state: "timeout", status: "sent" });
});

test("does not retry terminal invoice read errors", async () => {
  const denied = new Error("session expired");
  let calls = 0;
  await assert.rejects(
    pollCoursePayment(
      async () => {
        calls += 1;
        throw denied;
      },
      { shouldRetry: () => false },
    ),
    denied,
  );
  assert.equal(calls, 1);
});

test("persists one enrollment attempt and invoice across reloads during the hold", () => {
  const storage = new MemoryStorage();
  let created = 0;
  const create = () => `attempt-${++created}-stable`;
  const first = courseAttemptKey(156, storage, create, 1_000);
  const reload = courseAttemptKey(156, storage, create, 2_000);
  assert.equal(first, reload);
  assert.equal(created, 1);

  rememberCourseInvoice(156, invoiceId, storage, 3_000);
  assert.deepEqual(pendingCourseInvoice(156, storage, 4_000), {
    invoiceId,
    createdAt: 3_000,
  });

  clearCourseAttempt(156, storage);
  assert.equal(pendingCourseInvoice(156, storage, 4_000), null);
  assert.notEqual(courseAttemptKey(156, storage, create, 4_000), first);
});

test("expires stale attempts instead of reusing them after the payment hold", () => {
  const storage = new MemoryStorage();
  const first = courseAttemptKey(159, storage, () => "attempt-first", 0);
  const second = courseAttemptKey(159, storage, () => "attempt-second", 21 * 60_000);
  assert.equal(first, "attempt-first");
  assert.equal(second, "attempt-second");
});

test("reload keeps the original payment deadline", () => {
  const createdAt = 1_000;
  assert.equal(remainingCoursePaymentTimeout(createdAt, createdAt), 14.5 * 60_000);
  assert.equal(remainingCoursePaymentTimeout(createdAt, createdAt + 10 * 60_000), 4.5 * 60_000);
  assert.equal(remainingCoursePaymentTimeout(createdAt, createdAt + 16 * 60_000), 0);
});

test("charge handler rejects cross origin, missing session, and invalid invoice before upstream", async () => {
  let upstreamCalls = 0;
  const appApi = async () => {
    upstreamCalls += 1;
    return Response.json({ secret: "must-not-leak" });
  };
  const unauthorized = () => Response.json({ detail: "Logga in" }, { status: 401 });
  const context = (value: string) => ({ params: Promise.resolve({ invoiceId: value }) });

  const crossOrigin = createCourseSwishPost({
    accountToken: async () => "account-token",
    appApi,
    courseInvoiceStatus: () => "",
    sameOrigin: () => false,
    unauthorized,
    validInvoiceId,
  });
  assert.equal(
    (await crossOrigin(new Request("https://site.test/api", { method: "POST" }), context(invoiceId))).status,
    403,
  );

  const signedOut = createCourseSwishPost({
    accountToken: async () => null,
    appApi,
    courseInvoiceStatus: () => "",
    sameOrigin: () => true,
    unauthorized,
    validInvoiceId,
  });
  assert.equal(
    (await signedOut(new Request("https://site.test/api", { method: "POST" }), context(invoiceId))).status,
    401,
  );

  const invalid = createCourseSwishPost({
    accountToken: async () => "account-token",
    appApi,
    courseInvoiceStatus: () => "",
    sameOrigin: () => true,
    unauthorized,
    validInvoiceId,
  });
  assert.equal(
    (await invalid(new Request("https://site.test/api", { method: "POST" }), context("../../admin"))).status,
    400,
  );
  assert.equal(upstreamCalls, 0);
});

test("charge handler minimizes success and sanitizes unknown upstream errors", async () => {
  const calls: Array<{ path: string; method?: string; token?: string }> = [];
  const handler = createCourseSwishPost({
    accountToken: async () => "account-token",
    courseInvoiceStatus: () => "",
    sameOrigin: () => true,
    unauthorized: () => Response.json({}, { status: 401 }),
    validInvoiceId,
    appApi: async (path, init, options) => {
      calls.push({ path, method: init?.method, token: options?.token });
      return Response.json({ paymentReference: "private", signedToken: "private" });
    },
  });
  const response = await handler(
    new Request("https://site.test/api", { method: "POST" }),
    { params: Promise.resolve({ invoiceId }) },
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { started: true });
  assert.deepEqual(calls, [{
    path: `/training/invoices/${invoiceId}/swish/charge`,
    method: "POST",
    token: "account-token",
  }]);

  const failing = createCourseSwishPost({
    accountToken: async () => "account-token",
    courseInvoiceStatus: () => "",
    sameOrigin: () => true,
    unauthorized: () => Response.json({}, { status: 401 }),
    validInvoiceId,
    appApi: async () => Response.json({ internal: "do-not-leak" }, { status: 502 }),
  });
  const failure = await failing(
    new Request("https://site.test/api", { method: "POST" }),
    { params: Promise.resolve({ invoiceId }) },
  );
  assert.equal(failure.status, 502);
  assert.deepEqual(await failure.json(), { detail: "Kunde inte starta Swish" });
});

test("status handler returns only normalized status", async () => {
  const handler = createCourseInvoiceStatusGet({
    accountToken: async () => "account-token",
    courseInvoiceStatus: (payload) => {
      const value = (payload as { status?: unknown }).status;
      return typeof value === "string" ? value.toLowerCase() : "";
    },
    unauthorized: () => Response.json({}, { status: 401 }),
    validInvoiceId,
    appApi: async () => Response.json({
      status: "PAID",
      amount_sek: 795,
      signedToken: "private",
      customer: { email: "private@example.test" },
    }),
  });
  const response = await handler(
    new Request("https://site.test/api"),
    { params: Promise.resolve({ invoiceId }) },
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "paid" });
});

test("course payment routes keep credentials and invoice details on the server", () => {
  const charge = readFileSync(
    "src/app/api/courses/invoices/[invoiceId]/swish/route.ts",
    "utf8",
  );
  const status = readFileSync(
    "src/app/api/courses/invoices/[invoiceId]/status/route.ts",
    "utf8",
  );
  const component = readFileSync("src/components/trana/CourseEnrolButton.tsx", "utf8");

  assert.match(charge, /createCourseSwishPost\(\{/);
  assert.doesNotMatch(charge, /X-API-Key|Authorization/);

  assert.match(status, /createCourseInvoiceStatusGet\(\{/);
  assert.doesNotMatch(status, /proxyAppJson|pay-status|\bexp\b/);
  assert.doesNotMatch(status, /Response\.json\([^)]*token/);

  assert.match(component, /\/api\/account\/session/);
  assert.match(component, /profile\?\.swish_phone/);
  assert.match(component, /courseInvoiceId\(data\)/);
  assert.match(component, /pollCoursePayment/);
  assert.match(component, /if \(inFlight\.current\) return/);
  assert.match(component, /pendingCourseInvoice\(courseId, storage\)/);
  assert.match(component, /rememberCourseInvoice\(courseId, invoiceId, storage, invoiceCreatedAt\)/);
  assert.match(component, /await finishPayment\(invoiceId, controller, storage, invoiceCreatedAt\)/);
  assert.match(component, /aria-live="polite"/);

  const copy = readFileSync("src/lib/i18n/kurser.ts", "utf8");
  assert.doesNotMatch(copy, /kursplats är bekräftad|course place is confirmed/i);
  assert.match(copy, /se aktuell platsstatus|see the current place status/i);
});
