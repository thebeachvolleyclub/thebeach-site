// The Beach — solenergidata från FusionSolar-kioskens publika endpoint.
// Kiosk-token är en publik, read-only delningslänk (roteras ~årligen).
// Kan överstyras via env SOLAR_KIOSK_URL. Se runbook för förnyelse.

const KIOSK_URL =
  process.env.SOLAR_KIOSK_URL ??
  "https://uni002eu5.fusionsolar.huawei.com/rest/pvms/web/kiosk/v1/station-kiosk-file?kk=BhCOEr1wgkHOdeg1nzPjAvMnK5BLos6E";

export type SolarData = {
  realTimePowerKw: number;   // effekt just nu, kW
  dailyEnergyKwh: number;    // producerat idag, kWh
  monthEnergyMwh: number;    // producerat denna månad, MWh
  yearEnergyMwh: number;     // producerat i år, MWh
  totalEnergyMwh: number;    // total egen sol sedan start, MWh
  co2Ton: number;            // CO2 undviket sedan start, ton
  trees: number;             // motsvarande antal träd
};

function unescapeEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

// Hämtas server-side. Cache 5 min. Returnerar null vid fel så att sidan aldrig kraschar.
export async function getSolarData(): Promise<SolarData | null> {
  try {
    const res = await fetch(KIOSK_URL, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const outer = (await res.json()) as { data?: string };
    if (!outer?.data) return null;
    const inner = JSON.parse(unescapeEntities(outer.data)) as {
      realKpi?: { realTimePower?: number; cumulativeEnergy?: number; monthEnergy?: number; dailyEnergy?: number; yearEnergy?: number };
      socialContribution?: { co2Reduction?: number; equivalentTreePlanting?: number };
    };
    const k = inner.realKpi ?? {};
    const s = inner.socialContribution ?? {};
    return {
      realTimePowerKw: Math.max(0, Math.round((k.realTimePower ?? 0) * 10) / 10),
      dailyEnergyKwh: Math.round(k.dailyEnergy ?? 0),
      monthEnergyMwh: Math.round((k.monthEnergy ?? 0) / 100) / 10,
      yearEnergyMwh: Math.round((k.yearEnergy ?? 0) / 100) / 10,
      totalEnergyMwh: Math.round((k.cumulativeEnergy ?? 0) / 1000),
      co2Ton: Math.round((s.co2Reduction ?? 0) / 100) / 10,
      trees: Math.round(s.equivalentTreePlanting ?? 0),
    };
  } catch {
    return null;
  }
}
