/**
 * Serverhjälpare för formulärinskick — miljöväxlingsbar enligt GO_LIVE.md.
 *
 * PROD:  sätt FORMS_ENDPOINT (+ ev. FORMS_ENDPOINT_KEY) → inskick POST:as dit.
 * DEV:   utan FORMS_ENDPOINT sparas inskick via contract-sql till
 *        dev_own_david.form_submissions (fungerar bara på dev-VM:en).
 * Mejl:  BREVO_API_KEY sätter på notisen till boka@thebeach.one i båda miljöer.
 */
import { execFile } from "node:child_process";

export type Submission = {
  form: string;
  namn?: string;
  epost?: string;
  telefon?: string;
  datum?: string;
  antal?: string;
  intresse?: string;
  meddelande?: string;
  [k: string]: string | undefined;
};

const esc = (v: string | undefined) =>
  v == null ? "NULL" : `'${v.replace(/\\/g, "\\\\").replace(/'/g, "''").slice(0, 4000)}'`;

const DEV_TABLE = process.env.FORMS_DEV_TABLE ?? "dev_own_david.form_submissions";

function saveViaContractSql(s: Submission): Promise<void> {
  const raw = JSON.stringify(s).replace(/\\/g, "\\\\").replace(/'/g, "''");
  const sql = `INSERT INTO ${DEV_TABLE}
    (form, namn, epost, telefon, datum, antal, intresse, meddelande, raw)
    VALUES (${esc(s.form)}, ${esc(s.namn)}, ${esc(s.epost)}, ${esc(s.telefon)},
            ${esc(s.datum)}, ${esc(s.antal)}, ${esc(s.intresse)}, ${esc(s.meddelande)}, '${raw}')`;
  return new Promise((resolve, reject) => {
    execFile("contract-sql", [sql], { timeout: 15000 }, (err) =>
      err ? reject(err) : resolve()
    );
  });
}

async function saveViaEndpoint(s: Submission, endpoint: string): Promise<void> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.FORMS_ENDPOINT_KEY
        ? { authorization: `Bearer ${process.env.FORMS_ENDPOINT_KEY}` }
        : {}),
    },
    body: JSON.stringify(s),
  });
  if (!res.ok) throw new Error(`forms endpoint ${res.status}`);
}

export function saveToDb(s: Submission): Promise<void> {
  const endpoint = process.env.FORMS_ENDPOINT;
  return endpoint ? saveViaEndpoint(s, endpoint) : saveViaContractSql(s);
}

export async function notifyByEmail(s: Submission): Promise<void> {
  const key = process.env.BREVO_API_KEY;
  if (!key) return; // nyckel saknas ännu — datat ligger tryggt i listan
  const rows = Object.entries(s)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><strong>${v}</strong></td></tr>`)
    .join("");
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json" },
    body: JSON.stringify({
      sender: { name: "TheBeach.se webbformulär", email: "boka@thebeach.one" },
      to: [{ email: "boka@thebeach.one" }],
      replyTo: s.epost ? { email: s.epost } : undefined,
      subject: `Ny förfrågan (${s.form}): ${s.namn ?? "okänt namn"}`,
      htmlContent: `<h2 style="font-family:sans-serif">Ny förfrågan — ${s.form}</h2><table style="font-family:sans-serif;font-size:14px">${rows}</table>`,
    }),
  });
}

/** Kvitto till kunden — just nu bara för eventplaneraren. Kräver BREVO_API_KEY. */
export async function receiptByEmail(s: Submission): Promise<void> {
  const key = process.env.BREVO_API_KEY;
  if (!key || s.form !== "eventplaneraren" || !s.epost) return;
  const row = (label: string, v?: string) =>
    v ? `<tr><td style="padding:5px 14px 5px 0;color:#8a8a7a;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:5px 0"><strong>${v}</strong></td></tr>` : "";
  const tidsplan = s.tidsplan
    ? `<h3 style="margin:22px 0 6px">Exempel på tidsplan</h3><p style="margin:0;color:#444;line-height:1.7">${s.tidsplan.split(" / ").join("<br>")}</p><p style="color:#8a8a7a;font-size:12px">Preliminär — körschemat spikar vi tillsammans i offerten.</p>`
    : "";
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json" },
    body: JSON.stringify({
      sender: { name: "The Beach", email: "boka@thebeach.one" },
      to: [{ email: s.epost, name: s.namn }],
      replyTo: { email: "david@thebeach.one" },
      subject: "Er eventplan är mottagen — The Beach",
      htmlContent: `<div style="font-family:sans-serif;font-size:14px;max-width:560px;margin:0 auto;color:#14160f">
<h2 style="margin:0 0 4px">Tack${s.namn ? " " + s.namn : ""} — er eventplan är hos oss!</h2>
<p style="color:#444;line-height:1.6">Vi återkommer inom 24 timmar med datum och en offert. Här är planen ni byggde:</p>
<table style="font-size:14px;border-collapse:collapse">
${row("Koncept", s.koncept)}${row("Format", s.format)}${row("Antal", s.antal)}${row("Önskad starttid", s.starttid)}${row("Önskat datum", s.datum)}${row("Alternativt datum", s["alternativt datum"])}${row("Välkomstdrink", s["välkomstdrink"])}${row("Tillval", s.tillval)}${row("I offerten", s["i offerten"])}${row("Estimat", s.estimat)}
</table>
${tidsplan}
<p style="color:#444;line-height:1.6;margin-top:22px">Frågor eller ändringar? Svara på det här mejlet eller skriv till david@thebeach.one.</p>
<p style="color:#8a8a7a;font-size:12px">The Beach · Novavägen 35, Huddinge · thebeach.one — där det alltid är sommar</p>
</div>`,
    }),
  });
}
