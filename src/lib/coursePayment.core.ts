export type CoursePaymentState = "pending" | "paid" | "failed" | "unknown";

export type CoursePaymentOutcome =
  | { state: "paid"; status: string }
  | { state: "failed"; status: string }
  | { state: "timeout"; status: string };

type PollOptions = {
  intervalMs?: number;
  timeoutMs?: number;
  signal?: AbortSignal;
  now?: () => number;
  sleep?: (milliseconds: number, signal?: AbortSignal) => Promise<void>;
  shouldRetry?: (cause: unknown) => boolean;
};

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type PendingCourseInvoice = {
  invoiceId: string;
  createdAt: number;
  amountSek?: number;
  deepLinkUrl?: string;
  qrCodeDataUrl?: string;
};

export type PaidCourseEnrolment = {
  courseId: number;
  courseName: string | null;
  invoiceId: string;
  createdAt: string;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PAID = new Set(["paid"]);
const FAILED = new Set([
  "cancelled",
  "canceled",
  "declined",
  "expired",
  "failed",
  "refunded",
  "void",
]);
const PENDING = new Set([
  "created",
  "pending",
  "pending_payment",
  "sent",
  "started",
  "waiting",
]);
const ATTEMPT_TTL_MS = 20 * 60_000;
export const COURSE_PAYMENT_WINDOW_MS = 14.5 * 60_000;

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function validInvoiceId(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

export function remainingCoursePaymentTimeout(
  createdAt: number,
  now = Date.now(),
): number {
  if (!Number.isFinite(createdAt)) return 0;
  return Math.max(0, COURSE_PAYMENT_WINDOW_MS - Math.max(0, now - createdAt));
}

function validAttemptKey(value: unknown): value is string {
  return typeof value === "string" && /^[\w-]{8,64}$/.test(value);
}

function attemptStorageKey(courseId: number) {
  return `tb_course_attempt_${courseId}`;
}

function invoiceStorageKey(courseId: number) {
  return `tb_course_invoice_${courseId}`;
}

export function courseAttemptKey(
  courseId: number,
  storage: StorageLike,
  create: () => string,
  now = Date.now(),
): string {
  try {
    const saved = JSON.parse(storage.getItem(attemptStorageKey(courseId)) ?? "null") as {
      key?: unknown;
      createdAt?: unknown;
    } | null;
    if (
      saved &&
      validAttemptKey(saved.key) &&
      typeof saved.createdAt === "number" &&
      now - saved.createdAt < ATTEMPT_TTL_MS
    ) {
      return saved.key;
    }
  } catch {
    // Replace malformed or unavailable storage with a fresh in-memory key.
  }

  const key = create();
  try {
    storage.setItem(attemptStorageKey(courseId), JSON.stringify({ key, createdAt: now }));
  } catch {
    // Private mode can deny storage. The caller still keeps the returned key.
  }
  return key;
}

export function pendingCourseInvoice(
  courseId: number,
  storage: StorageLike,
  now = Date.now(),
): PendingCourseInvoice | null {
  try {
    const saved = JSON.parse(storage.getItem(invoiceStorageKey(courseId)) ?? "null") as {
      invoiceId?: unknown;
      createdAt?: unknown;
      amountSek?: unknown;
    } | null;
    if (
      saved &&
      validInvoiceId(saved.invoiceId) &&
      typeof saved.createdAt === "number" &&
      now - saved.createdAt < ATTEMPT_TTL_MS
    ) {
      const deepLinkUrl = courseSwishLaunchUrl(saved);
      const qrCodeDataUrl = courseSwishQrCode(saved);
      const amountSek = typeof saved.amountSek === "number" &&
        Number.isSafeInteger(saved.amountSek) &&
        saved.amountSek >= 0 &&
        saved.amountSek <= 100000
        ? saved.amountSek
        : null;
      return {
        invoiceId: saved.invoiceId,
        createdAt: saved.createdAt,
        ...(amountSek !== null ? { amountSek } : {}),
        ...(deepLinkUrl ? { deepLinkUrl } : {}),
        ...(qrCodeDataUrl ? { qrCodeDataUrl } : {}),
      };
    }
  } catch {
    return null;
  }
  return null;
}

export function rememberCourseInvoice(
  courseId: number,
  invoiceId: string,
  storage: StorageLike,
  now = Date.now(),
  handoff?: { deepLinkUrl?: string; qrCodeDataUrl?: string; amountSek?: number },
) {
  if (!validInvoiceId(invoiceId)) return;
  try {
    const deepLinkUrl = handoff ? courseSwishLaunchUrl(handoff) : null;
    const qrCodeDataUrl = handoff ? courseSwishQrCode(handoff) : null;
    const amountSek = handoff && Number.isSafeInteger(handoff.amountSek) &&
      Number(handoff.amountSek) >= 0 && Number(handoff.amountSek) <= 100000
      ? Number(handoff.amountSek)
      : null;
    storage.setItem(invoiceStorageKey(courseId), JSON.stringify({
      invoiceId,
      createdAt: now,
      ...(amountSek !== null ? { amountSek } : {}),
      ...(deepLinkUrl ? { deepLinkUrl } : {}),
      ...(qrCodeDataUrl ? { qrCodeDataUrl } : {}),
    }));
  } catch {
    // The active render still keeps the invoice id even if storage is denied.
  }
}

export function clearCourseAttempt(courseId: number, storage: StorageLike) {
  try {
    storage.removeItem(attemptStorageKey(courseId));
    storage.removeItem(invoiceStorageKey(courseId));
  } catch {
    // Storage cleanup is best effort only.
  }
}

/**
 * The current App API response is intentionally open ended. Accept only the
 * documented invoice fields and validate the value as a UUID before it can be
 * used in a server route.
 */
export function courseInvoiceId(payload: unknown): string | null {
  const root = record(payload);
  if (!root) return null;
  const candidates = [
    root.invoice_id,
    root.invoiceId,
    record(root.invoice)?.id,
    record(root.invoice)?.invoice_id,
    record(root.invoice)?.invoiceId,
    record(root.enrolment)?.invoice_id,
    record(root.enrolment)?.invoiceId,
    record(record(root.enrolment)?.invoice)?.id,
    record(record(root.enrolment)?.invoice)?.invoice_id,
    record(record(root.enrolment)?.invoice)?.invoiceId,
    record(root.enrollment)?.invoice_id,
    record(root.enrollment)?.invoiceId,
    record(record(root.enrollment)?.invoice)?.id,
    record(record(root.enrollment)?.invoice)?.invoice_id,
    record(record(root.enrollment)?.invoice)?.invoiceId,
  ];
  return candidates.find(validInvoiceId) ?? null;
}

export function courseSwishLaunchUrl(payload: unknown): string | null {
  const root = record(payload);
  const raw = root ? stringValue(root.deepLinkUrl) : null;
  if (!raw) return null;
  try {
    const target = new URL(raw);
    if (target.protocol !== "swish:" || target.hostname !== "paymentrequest") return null;
    return target.searchParams.get("token") ? target.toString() : null;
  } catch {
    return null;
  }
}

/** Accept only the PNG data URL emitted by our authenticated Swish BFF. */
export function courseSwishQrCode(payload: unknown): string | null {
  const root = record(payload);
  const raw = root ? stringValue(root.qrCodeDataUrl) : null;
  if (
    !raw ||
    raw.length > 200_000 ||
    !/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(raw)
  ) {
    return null;
  }
  return raw;
}

/** A protocol handoff should happen automatically only on phones/tablets. */
export function courseSwishMobileDevice(userAgent: string, maxTouchPoints = 0): boolean {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && maxTouchPoints > 1);
}

export function courseSwishReturnInvoice(search: string): string | null {
  const params = new URLSearchParams(search);
  if (
    params.get("swish-return") !== "course"
    && params.get("payment-return") !== "course"
  ) return null;
  const invoiceId = params.get("invoice");
  return validInvoiceId(invoiceId) ? invoiceId : null;
}

export function recentPaidCourseEnrolment(
  payload: unknown,
  now = Date.now(),
  maxAgeMs = 2 * 60 * 60_000,
  expectedInvoiceId?: string,
): PaidCourseEnrolment | null {
  const root = record(payload);
  const enrolments = root && Array.isArray(root.enrolments) ? root.enrolments : [];
  const paid = enrolments.flatMap((value) => {
    const item = record(value);
    if (!item) return [];
    const courseId = item.courseId;
    const status = stringValue(item.status)?.toLowerCase();
    const paymentStatus = stringValue(item.paymentStatus)?.toLowerCase();
    const invoiceId = stringValue(item.invoiceId);
    const createdAt = stringValue(item.createdAt);
    const created = createdAt ? Date.parse(createdAt) : Number.NaN;
    if (
      typeof courseId !== "number" ||
      !Number.isSafeInteger(courseId) ||
      courseId <= 0 ||
      status !== "confirmed" ||
      paymentStatus !== "paid" ||
      !validInvoiceId(invoiceId) ||
      (expectedInvoiceId !== undefined && invoiceId !== expectedInvoiceId) ||
      !createdAt ||
      !Number.isFinite(created) ||
      created > now + 5 * 60_000 ||
      now - created > maxAgeMs
    ) {
      return [];
    }
    return [{
      courseId,
      courseName: stringValue(item.courseName),
      invoiceId,
      createdAt,
      created,
    }];
  });
  paid.sort((a, b) => b.created - a.created);
  const latest = paid[0];
  return latest
    ? {
        courseId: latest.courseId,
        courseName: latest.courseName,
        invoiceId: latest.invoiceId,
        createdAt: latest.createdAt,
      }
    : null;
}

export function courseInvoiceStatus(payload: unknown): string {
  const root = record(payload);
  if (!root) return "";
  return (
    stringValue(root.payment_status) ??
    stringValue(root.paymentStatus) ??
    stringValue(root.status) ??
    stringValue(record(root.invoice)?.payment_status) ??
    stringValue(record(root.invoice)?.paymentStatus) ??
    stringValue(record(root.invoice)?.status) ??
    ""
  ).toLowerCase();
}

export function classifyCoursePayment(payload: unknown): CoursePaymentState {
  const status = courseInvoiceStatus(payload);
  if (PAID.has(status)) return "paid";
  if (FAILED.has(status)) return "failed";
  if (PENDING.has(status)) return "pending";
  return "unknown";
}

function abortError() {
  return new DOMException("The operation was aborted", "AbortError");
}

function defaultSleep(milliseconds: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(abortError());
    const timer = setTimeout(resolve, milliseconds);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(abortError());
      },
      { once: true },
    );
  });
}

/** Polls the authenticated invoice view. Transient read errors are retried. */
export async function pollCoursePayment(
  readStatus: () => Promise<unknown>,
  options: PollOptions = {},
): Promise<CoursePaymentOutcome> {
  const intervalMs = options.intervalMs ?? 2_500;
  const timeoutMs = options.timeoutMs ?? COURSE_PAYMENT_WINDOW_MS;
  const now = options.now ?? Date.now;
  const sleep = options.sleep ?? defaultSleep;
  const started = now();
  let lastStatus = "";

  while (now() - started <= timeoutMs) {
    if (options.signal?.aborted) throw abortError();
    try {
      const payload = await readStatus();
      lastStatus = courseInvoiceStatus(payload) || lastStatus;
      const state = classifyCoursePayment(payload);
      if (state === "paid") return { state, status: lastStatus };
      if (state === "failed") return { state, status: lastStatus };
    } catch (cause) {
      if (options.signal?.aborted) throw cause;
      if (options.shouldRetry && !options.shouldRetry(cause)) throw cause;
    }

    const remaining = timeoutMs - (now() - started);
    if (remaining <= 0) break;
    await sleep(Math.min(intervalMs, remaining), options.signal);
  }

  return { state: "timeout", status: lastStatus };
}
