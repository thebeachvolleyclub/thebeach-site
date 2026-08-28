export type MembershipSource = "MATCHI" | "NATIVE";
export type MembershipCategory = "junior" | "senior" | null;

export type MembershipRecord = {
  id: string;
  productId: string;
  typeName: string;
  category: MembershipCategory;
  year: number | null;
  venueName: string | null;
  validFrom: string | null;
  validTo: string | null;
  status: string;
  paid: boolean;
  current: boolean;
  active: boolean;
  readOnly: boolean;
  source: MembershipSource;
  purchasedAt: string | null;
  amountOre: number | null;
  paymentMethod: string | null;
  paymentReference: string | null;
};

export type MembershipUnavailableReason =
  | "active_membership"
  | "payment_pending"
  | "not_available"
  | null;

export type MembershipPurchaseOption = {
  productId: string;
  typeName: string;
  category: Exclude<MembershipCategory, null>;
  year: number;
  priceOre: number;
  vatBasisPoints: number;
  validFrom: string;
  validTo: string;
  available: boolean;
  unavailableReason: MembershipUnavailableReason;
};

export type MembershipPurchase = {
  id: string;
  productId: string;
  year: number;
  status: "AWAITING_PAYMENT" | "PAID" | "CANCELLED";
  attemptStatus:
    | "CREATING"
    | "CREATED"
    | "PAID"
    | "DECLINED"
    | "ERROR"
    | "CANCELLED"
    | null;
  amountOre: number;
  paymentMethod: "SWISH";
  instructionUuid: string | null;
  paymentRequestToken: string | null;
  deepLinkUrl: string | null;
  paymentVerificationPending: boolean;
  createdAt: string;
  paidAt: string | null;
};

export type MembershipFeed = {
  memberships: MembershipRecord[];
  activeCount: number;
  purchaseOptions: MembershipPurchaseOption[];
  purchase: MembershipPurchase | null;
};

export const EMPTY_MEMBERSHIP_FEED: MembershipFeed = {
  memberships: [],
  activeCount: 0,
  purchaseOptions: [],
  purchase: null,
};

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function nullableText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function number(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function membership(value: unknown, index: number): MembershipRecord {
  const row = object(value);
  const category = row.category === "junior" || row.category === "senior"
    ? row.category
    : null;
  const source: MembershipSource = row.source === "NATIVE" ? "NATIVE" : "MATCHI";
  const typeName = text(row.typeName, "Medlemskap");
  const validFrom = nullableText(row.validFrom);
  const validTo = nullableText(row.validTo);
  return {
    id: text(row.id, `${text(row.productId, "membership")}-${validFrom ?? validTo ?? index}`),
    productId: text(row.productId),
    typeName,
    category,
    year: number(row.year),
    venueName: nullableText(row.venueName),
    validFrom,
    validTo,
    status: text(row.status),
    paid: row.paid === true,
    current: row.current === true,
    active: row.active === true,
    readOnly: row.readOnly === true || source === "MATCHI",
    source,
    purchasedAt: nullableText(row.purchasedAt),
    amountOre: number(row.amountOre),
    paymentMethod: nullableText(row.paymentMethod),
    paymentReference: nullableText(row.paymentReference),
  };
}

function option(value: unknown): MembershipPurchaseOption | null {
  const row = object(value);
  if (
    typeof row.productId !== "string"
    || typeof row.typeName !== "string"
    || (row.category !== "junior" && row.category !== "senior")
    || typeof row.year !== "number"
    || typeof row.priceOre !== "number"
  ) return null;
  const unavailableReason = ["active_membership", "payment_pending", "not_available"]
    .includes(String(row.unavailableReason))
    ? row.unavailableReason as Exclude<MembershipUnavailableReason, null>
    : null;
  return {
    productId: row.productId,
    typeName: row.typeName,
    category: row.category,
    year: row.year,
    priceOre: row.priceOre,
    vatBasisPoints: typeof row.vatBasisPoints === "number" ? row.vatBasisPoints : 0,
    validFrom: text(row.validFrom),
    validTo: text(row.validTo),
    available: row.available === true,
    unavailableReason,
  };
}

export function membershipPurchaseFromWire(value: unknown): MembershipPurchase | null {
  if (value === null || value === undefined) return null;
  const row = object(value);
  if (
    typeof row.id !== "string"
    || typeof row.productId !== "string"
    || typeof row.year !== "number"
    || !["AWAITING_PAYMENT", "PAID", "CANCELLED"].includes(String(row.status))
  ) return null;
  const attemptStatus = ["CREATING", "CREATED", "PAID", "DECLINED", "ERROR", "CANCELLED"]
    .includes(String(row.attemptStatus))
    ? row.attemptStatus as Exclude<MembershipPurchase["attemptStatus"], null>
    : null;
  return {
    id: row.id,
    productId: row.productId,
    year: row.year,
    status: row.status as MembershipPurchase["status"],
    attemptStatus,
    amountOre: typeof row.amountOre === "number" ? row.amountOre : 0,
    paymentMethod: "SWISH",
    instructionUuid: nullableText(row.instructionUuid),
    paymentRequestToken: nullableText(row.paymentRequestToken),
    deepLinkUrl: nullableText(row.deepLinkUrl),
    paymentVerificationPending: row.paymentVerificationPending === true,
    createdAt: text(row.createdAt),
    paidAt: nullableText(row.paidAt),
  };
}

/** Keep upstream wire parsing out of the large account component. */
export function membershipFeedFromWire(value: unknown): MembershipFeed {
  const payload = object(value);
  const memberships = Array.isArray(payload.memberships)
    ? payload.memberships.map(membership)
    : [];
  const purchaseOptions = Array.isArray(payload.purchaseOptions)
    ? payload.purchaseOptions.map(option).filter((item): item is MembershipPurchaseOption => item !== null)
    : [];
  return {
    memberships,
    activeCount: typeof payload.activeCount === "number"
      ? payload.activeCount
      : memberships.filter((item) => item.active).length,
    purchaseOptions,
    purchase: membershipPurchaseFromWire(payload.purchase),
  };
}

export function membershipHistory(feed: MembershipFeed): MembershipRecord[] {
  return [...feed.memberships].sort((left, right) => {
    const rank = (item: MembershipRecord) => item.active ? 3 : item.current ? 2 : item.paid ? 1 : 0;
    return rank(right) - rank(left)
      || (right.year ?? 0) - (left.year ?? 0)
      || (right.validTo ?? "").localeCompare(left.validTo ?? "")
      || (right.purchasedAt ?? "").localeCompare(left.purchasedAt ?? "");
  });
}

export function hasActiveMembershipForYear(feed: MembershipFeed, year: number): boolean {
  return feed.memberships.some((item) => item.active && item.year === year)
    || feed.purchase?.status === "PAID" && feed.purchase.year === year;
}

export function membershipPurchaseCanRetry(
  purchase: MembershipPurchase | null,
): boolean {
  return Boolean(
    purchase
    && purchase.status === "AWAITING_PAYMENT"
    && ["DECLINED", "ERROR", "CANCELLED"].includes(purchase.attemptStatus ?? ""),
  );
}

export function moneyFromOre(amountOre: number | null): string | null {
  if (amountOre === null) return null;
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: amountOre % 100 === 0 ? 0 : 2,
  }).format(amountOre / 100);
}

export function validSwishPayerAlias(value: string): boolean {
  const candidate = value.trim();
  return /^[+\d][\d ()-]{7,19}$/.test(candidate);
}

export function membershipPurchaseStorageKey(accountId: string, option: MembershipPurchaseOption): string {
  const identity = accountId.trim();
  if (!identity) throw new Error("membership purchase storage requires account identity");
  return `tb-membership-purchase:${encodeURIComponent(identity)}:${option.year}:${option.productId}`;
}

export function safeSwishDeepLink(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "swish:" || url.hostname !== "paymentrequest") return null;
    return url.searchParams.get("token") ? url.toString() : null;
  } catch {
    return null;
  }
}
