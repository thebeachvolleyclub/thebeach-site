/**
 * Säljaruppgifter i kursbetalningen.
 *
 * ⚠️ org.nr är medvetet null tills David bekräftat VILKET bolag som är säljare
 * av kurserna (föreningen The Beach Volley Club Huddinge, 802503-0928, står i
 * integritetspolicyn — men det är personuppgiftsansvarig, inte nödvändigtvis
 * avtalspart för kursköpet). Hellre ingen uppgift än fel uppgift på en
 * betalskärm. Fyll i här när det är bekräftat, så visas raden automatiskt.
 */
export const COURSE_SELLER = {
  name: "The Beach",
  orgNr: null as string | null,
  supportEmail: "boka@thebeach.one",
};

/** "The Beach (org.nr 000000-0000)" — utan org.nr blir det bara namnet. */
export function courseSellerLine(): string {
  return COURSE_SELLER.orgNr
    ? `${COURSE_SELLER.name} (org.nr ${COURSE_SELLER.orgNr})`
    : COURSE_SELLER.name;
}

/** mm:ss för nedräkningen på platsreservationen. */
export function holdClock(remainingMs: number): string {
  const total = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
