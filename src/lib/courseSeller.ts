/**
 * Säljaruppgifter i kursbetalningen.
 *
 * Avtalspart för kursköpet är Beachhallen Tropical AB, som verkar under
 * varumärket The Beach (bekräftat av David 2026-08-05). Båda står i
 * betalrutan med flit: kunden känner igen "The Beach" men behöver kunna se
 * vem hen faktiskt betalar till — och Swish-appen visar bolagsnamnet, så en
 * kund som bara sett "The Beach" på sajten ska inte tveka när ett annat namn
 * dyker upp i betalningen.
 */
export const COURSE_SELLER = {
  brand: "The Beach",
  legalName: "Beachhallen Tropical AB",
  orgNr: "556699-2839",
  supportEmail: "boka@thebeach.one",
};

/** "The Beach (Beachhallen Tropical AB, org.nr 556699-2839)" */
export function courseSellerLine(): string {
  return `${COURSE_SELLER.brand} (${COURSE_SELLER.legalName}, org.nr ${COURSE_SELLER.orgNr})`;
}

/** mm:ss för nedräkningen på platsreservationen. */
export function holdClock(remainingMs: number): string {
  const total = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
