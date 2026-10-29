/**
 * Förval av paket i förfrågningsformuläret på /events (EventRequestFormClient).
 *
 * Två vägar in:
 *  - ?paket=<slug> i URL:en (landningssidorna länkar /events?paket=algarve#forfragan)
 *  - ett klick på "Önska datum →" på ett paketkort på samma sida — då finns ingen
 *    navigering, så kortet anropar preselectEventPackage(slug) och formuläret
 *    lyssnar via subscribeEventPackage. Hash-länken (#forfragan) sköter scrollen.
 *
 * Slugs = samma som ?paket= (laspalmas, algarve, miami, konferens, barnkalas,
 * teneriffa, privat, skraddarsytt, julbord).
 */
export type EventPackageSlug =
  | "laspalmas" | "algarve" | "miami" | "konferens" | "barnkalas"
  | "teneriffa" | "privat" | "skraddarsytt" | "julbord";

const EVENT_NAME = "beach:event-paket";

export function preselectEventPackage(slug: EventPackageSlug) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<EventPackageSlug>(EVENT_NAME, { detail: slug }));
}

export function subscribeEventPackage(cb: (slug: EventPackageSlug) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => cb((e as CustomEvent<EventPackageSlug>).detail);
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
