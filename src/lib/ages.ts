/**
 * Åldersgränser för ungdomsrabatterna — räknas alltid på kalenderår, aldrig
 * på exakt födelsedatum. "Under 20 år" 2026 = född 2007 eller senare.
 *
 * Texterna i i18n-ordböckerna skriver INTE ut årtal utan tokens:
 *   {year} → innevarande år        (2026)
 *   {y20}  → födelseår för "under 20" (2007)
 *   {y26}  → födelseår för "under 26" (2001)
 * Kör strängen genom fillYears() vid rendering så håller sig copyn själv
 * uppdaterad vid årsskiftet — inget manuellt bumpande i januari.
 */

/** Tidigaste födelseår som fortfarande är under `maxAgeExclusive` år under `year`. */
export function birthYearUnder(maxAgeExclusive: number, year: number = new Date().getFullYear()): number {
  return year - maxAgeExclusive + 1;
}

/** Ersätter {year}, {y20} och {y26} i en textsträng. */
export function fillYears(text: string, year: number = new Date().getFullYear()): string {
  return text
    .replace(/\{year\}/g, String(year))
    .replace(/\{y20\}/g, String(birthYearUnder(20, year)))
    .replace(/\{y26\}/g, String(birthYearUnder(26, year)));
}
