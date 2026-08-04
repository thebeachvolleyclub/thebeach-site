import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// @ts-expect-error Node's native TypeScript runner needs the explicit extension.
import {
  classifyCoursePayment,
  clearCourseAttempt,
  courseAttemptKey,
  courseInvoiceId,
  courseSwishLaunchUrl,
  courseSwishMobileDevice,
  courseSwishQrCode,
  courseSwishReturnInvoice,
  pendingCourseInvoice,
  pollCoursePayment,
  recentPaidCourseEnrolment,
  remainingCoursePaymentTimeout,
  rememberCourseInvoice,
  validInvoiceId,
} from "../src/lib/coursePayment.core.ts";
// @ts-expect-error Node's native TypeScript runner needs the explicit extension.
import {
  createCourseInvoiceStatusGet,
  createCourseSwishPost,
  createMyCourseEnrolmentsGet,
} from "../src/lib/coursePaymentRoute.core.ts";

const invoiceId = "2adb3894-2460-4a88-98c0-e4440b31d3ae";
const qrCodeDataUrl = "data:image/png;base64,c3dpc2gtcXItY29kZQ==";
const swishQrCode = async () => qrCodeDataUrl;

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

test("accepts only a tokenized Swish payment handoff in the browser", () => {
  const handoff = "swish://paymentrequest?token=provider-token&callbackurl=https%3A%2F%2Fsite.test%2Ftrana";
  assert.equal(courseSwishLaunchUrl({ deepLinkUrl: handoff }), handoff);
  assert.equal(courseSwishLaunchUrl({ deepLinkUrl: "swish://paymentrequest?callbackurl=https://site.test" }), null);
  assert.equal(courseSwishLaunchUrl({ deepLinkUrl: "https://evil.test/paymentrequest?token=x" }), null);
  assert.equal(courseSwishLaunchUrl({ deepLinkUrl: "not-a-url" }), null);
});

test("accepts only a bounded PNG QR image from the course payment BFF", () => {
  assert.equal(courseSwishQrCode({ qrCodeDataUrl }), qrCodeDataUrl);
  assert.equal(courseSwishQrCode({ qrCodeDataUrl: "data:image/svg+xml;base64,PHN2Zz4=" }), null);
  assert.equal(courseSwishQrCode({ qrCodeDataUrl: "https://evil.test/qr.png" }), null);
  assert.equal(courseSwishQrCode({ qrCodeDataUrl: "data:image/png;base64,not valid" }), null);
});

test("opens Swish automatically only on phones and tablets", () => {
  assert.equal(courseSwishMobileDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0)"), true);
  assert.equal(courseSwishMobileDevice("Mozilla/5.0 (Linux; Android 15; Pixel 9)"), true);
  assert.equal(courseSwishMobileDevice("Mozilla/5.0 (Macintosh; Intel Mac OS X)", 5), true);
  assert.equal(courseSwishMobileDevice("Mozilla/5.0 (Macintosh; Intel Mac OS X)", 0), false);
  assert.equal(courseSwishMobileDevice("Mozilla/5.0 (Windows NT 10.0; Win64; x64)"), false);
});

test("recovers only a validated invoice from a course Swish browser return", () => {
  assert.equal(
    courseSwishReturnInvoice(`?swish-return=course&invoice=${invoiceId}`),
    invoiceId,
  );
  assert.equal(courseSwishReturnInvoice(`?swish-return=other&invoice=${invoiceId}`), null);
  assert.equal(courseSwishReturnInvoice("?swish-return=course&invoice=../../admin"), null);
  assert.equal(courseSwishReturnInvoice("?swish-return=course"), null);
});

test("finds only a recent confirmed paid course receipt", () => {
  const now = Date.parse("2026-08-03T15:00:00Z");
  const newerInvoice = "d2fdd014-e004-4de6-833f-26026fb3e6f3";
  const payload = {
    enrolments: [
      {
        courseId: 160,
        courseName: "Swish test",
        invoiceId,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        createdAt: "2026-08-03T14:50:01Z",
        privateField: "do-not-use",
      },
      {
        courseId: 159,
        courseName: "Newer payment",
        invoiceId: newerInvoice,
        status: "confirmed",
        paymentStatus: "paid",
        createdAt: "2026-08-03T14:55:00Z",
      },
      {
        courseId: 158,
        invoiceId: "b62d2a0a-3eb1-4bbc-940d-237175dcc93b",
        status: "held",
        paymentStatus: "sent",
        createdAt: "2026-08-03T14:59:00Z",
      },
    ],
  };
  assert.deepEqual(recentPaidCourseEnrolment(payload, now), {
    courseId: 159,
    courseName: "Newer payment",
    invoiceId: newerInvoice,
    createdAt: "2026-08-03T14:55:00Z",
  });
  assert.deepEqual(recentPaidCourseEnrolment(payload, now, 2 * 60 * 60_000, invoiceId), {
    courseId: 160,
    courseName: "Swish test",
    invoiceId,
    createdAt: "2026-08-03T14:50:01Z",
  });
  assert.equal(recentPaidCourseEnrolment(payload, now + 3 * 60 * 60_000), null);
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

  rememberCourseInvoice(156, invoiceId, storage, 3_000, {
    deepLinkUrl: "swish://paymentrequest?token=provider-token",
    qrCodeDataUrl,
  });
  assert.deepEqual(pendingCourseInvoice(156, storage, 4_000), {
    invoiceId,
    createdAt: 3_000,
    deepLinkUrl: "swish://paymentrequest?token=provider-token",
    qrCodeDataUrl,
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
    swishQrCode,
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
    swishQrCode,
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
    swishQrCode,
    unauthorized,
    validInvoiceId,
  });
  assert.equal(
    (await invalid(new Request("https://site.test/api", { method: "POST" }), context("../../admin"))).status,
    400,
  );
  assert.equal(upstreamCalls, 0);
});

test("charge handler returns validated mobile and desktop handoffs with a same-site web return", async () => {
  const calls: Array<{ path: string; method?: string; token?: string }> = [];
  const qrTokens: string[] = [];
  const handler = createCourseSwishPost({
    accountToken: async () => "account-token",
    courseInvoiceStatus: () => "",
    sameOrigin: () => true,
    swishQrCode: async (token) => {
      qrTokens.push(token);
      return qrCodeDataUrl;
    },
    unauthorized: () => Response.json({}, { status: 401 }),
    validInvoiceId,
    appApi: async (path, init, options) => {
      calls.push({ path, method: init?.method, token: options?.token });
      return Response.json({
        paymentReference: "private",
        signedToken: "private",
        deep_link_url: "swish://paymentrequest?token=provider-token&callbackurl=thebeach%3A%2F%2Fswish-return",
      });
    },
  });
  const response = await handler(
    new Request("https://site.test/api?locale=en", {
      method: "POST",
      headers: { Origin: "https://site.test" },
    }),
    { params: Promise.resolve({ invoiceId }) },
  );
  assert.equal(response.status, 200);
  const result = await response.json() as { deepLinkUrl: string; qrCodeDataUrl: string };
  assert.deepEqual(Object.keys(result), ["deepLinkUrl", "qrCodeDataUrl"]);
  assert.equal(result.qrCodeDataUrl, qrCodeDataUrl);
  const handoff = new URL(result.deepLinkUrl);
  assert.equal(handoff.protocol, "swish:");
  assert.equal(handoff.hostname, "paymentrequest");
  assert.equal(handoff.searchParams.get("token"), "provider-token");
  assert.equal(
    handoff.searchParams.get("callbackurl"),
    `https://site.test/en/training?swish-return=course&invoice=${invoiceId}#kursbetalning`,
  );
  assert.deepEqual(calls, [{
    path: `/training/invoices/${invoiceId}/swish/charge`,
    method: "POST",
    token: "account-token",
  }]);
  assert.deepEqual(qrTokens, ["provider-token"]);

  const failing = createCourseSwishPost({
    accountToken: async () => "account-token",
    courseInvoiceStatus: () => "",
    sameOrigin: () => true,
    swishQrCode,
    unauthorized: () => Response.json({}, { status: 401 }),
    validInvoiceId,
    appApi: async () => Response.json({ internal: "do-not-leak" }, { status: 502 }),
  });
  const failure = await failing(
    new Request("https://site.test/api", {
      method: "POST",
      headers: { Origin: "https://site.test" },
    }),
    { params: Promise.resolve({ invoiceId }) },
  );
  assert.equal(failure.status, 502);
  assert.deepEqual(await failure.json(), { detail: "Kunde inte starta Swish" });

  const invalidHandoff = createCourseSwishPost({
    accountToken: async () => "account-token",
    courseInvoiceStatus: () => "",
    sameOrigin: () => true,
    swishQrCode,
    unauthorized: () => Response.json({}, { status: 401 }),
    validInvoiceId,
    appApi: async () => Response.json({ deep_link_url: "https://evil.test/payment?token=x" }),
  });
  const invalidResponse = await invalidHandoff(
    new Request("https://site.test/api", {
      method: "POST",
      headers: { Origin: "https://site.test" },
    }),
    { params: Promise.resolve({ invoiceId }) },
  );
  assert.equal(invalidResponse.status, 502);
  assert.deepEqual(await invalidResponse.json(), { detail: "Swish kunde inte öppnas" });
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

test("my course handler returns only customer-safe receipt and profile fields", async () => {
  const handler = createMyCourseEnrolmentsGet({
    accountToken: async () => "account-token",
    unauthorized: () => Response.json({}, { status: 401 }),
    appApi: async () => Response.json({
      enrolments: [{
        courseId: 160,
        courseName: "Swish test",
        invoiceId,
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod: "Swish",
        createdAt: "2026-08-03T14:50:01Z",
        userId: "private",
        grossAmountSek: 1,
        discountAmountSek: 1,
        netAmountSek: 0,
        waitlistPosition: 2,
        confirmedAt: "2026-08-03T14:51:01Z",
        cancelledAt: null,
      }],
    }),
  });
  const response = await handler();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    enrolments: [{
      courseId: 160,
      courseName: "Swish test",
      invoiceId,
      status: "confirmed",
      paymentStatus: "paid",
      paymentMethod: "Swish",
      grossAmountSek: 1,
      discountAmountSek: 1,
      netAmountSek: 0,
      waitlistPosition: 2,
      confirmedAt: "2026-08-03T14:51:01Z",
      cancelledAt: null,
      createdAt: "2026-08-03T14:50:01Z",
    }],
  });
  assert.equal(response.headers.get("cache-control"), "private, no-store");
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
  const paymentReturn = readFileSync("src/components/trana/CoursePaymentReturn.tsx", "utf8");
  const ladder = readFileSync("src/components/trana/CourseLadder.tsx", "utf8");
  const mine = readFileSync("src/app/api/courses/mine/route.ts", "utf8");

  assert.match(charge, /createCourseSwishPost\(\{/);
  assert.match(charge, /QRCode\.toDataURL\(`D\$\{paymentRequestToken\}`/);
  assert.doesNotMatch(charge, /X-API-Key|Authorization/);

  assert.match(status, /createCourseInvoiceStatusGet\(\{/);
  assert.doesNotMatch(status, /proxyAppJson|pay-status|\bexp\b/);
  assert.doesNotMatch(status, /Response\.json\([^)]*token/);

  assert.doesNotMatch(component, /profile\?\.swish_phone/);
  assert.match(component, /courseInvoiceId\(data\)/);
  assert.match(component, /courseSwishLaunchUrl\(charge\)/);
  assert.match(component, /courseSwishQrCode\(charge\)/);
  assert.match(component, /courseSwishMobileDevice/);
  assert.match(component, /if \(mobileDevice\) window\.location\.assign\(deepLinkUrl\)/);
  assert.match(component, /swishHandoff\.qrCodeDataUrl/);
  assert.match(component, /pollCoursePayment/);
  assert.match(component, /if \(inFlight\.current\) return/);
  assert.match(component, /pendingCourseInvoice\(courseId, storage\)/);
  assert.match(component, /rememberCourseInvoice\(courseId, invoiceId, storage, invoiceCreatedAt\)/);
  assert.match(component, /await finishPayment\(invoiceId, controller, storage, invoiceCreatedAt\)/);
  assert.match(component, /aria-live="polite"/);
  const chargeFailureBranch = component.split("if (!chargeResponse.ok) {", 2)[1]
    ?.split("const deepLinkUrl", 1)[0] ?? "";
  assert.match(chargeFailureBranch, /setResult\(\{ ok: false, message: detail \}\)/);
  assert.doesNotMatch(chargeFailureBranch, /finishPayment/);

  assert.match(ladder, /<CoursePaymentReturn/);
  assert.match(paymentReturn, /id="kursbetalning"/);
  assert.match(paymentReturn, /courseSwishReturnInvoice\(window\.location\.search\)/);
  assert.match(paymentReturn, /\/api\/courses\/mine/);
  assert.match(paymentReturn, /role=\{state\.kind === "error" \? "alert" : "status"\}/);
  assert.match(mine, /createMyCourseEnrolmentsGet/);
  assert.doesNotMatch(mine, /proxyAppJson|X-API-Key|Authorization/);

  const copy = readFileSync("src/lib/i18n/kurser.ts", "utf8");
  assert.doesNotMatch(copy, /kursplats är bekräftad|course place is confirmed/i);
  assert.match(copy, /se aktuell platsstatus|see the current place status/i);
});
