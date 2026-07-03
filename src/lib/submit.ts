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
