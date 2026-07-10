import { NextResponse } from "next/server";

/**
 * Serverside-proxy för nyhetsbrevsanmälan → Brevo.
 * Browsern postar hit (same-origin) i stället för direkt till Brevo, så vi
 * slipper CORS och annonsblockerare, och kan läsa Brevos riktiga svar.
 */
const BREVO_ENDPOINT =
  "https://407ccf77.sibforms.com/serve/MUIFAFEOMibvaZ5ur4jcCa6kQeEtwIe3YnMA62Sgo4YlTJwJ28HlgGz4x16Tlb2YRcy1yEqhvpeM0zrIWRJ5HFOsJeiWoMOFK3oeQSbZl5cGH9xkcyKUq95BKScNgnPwAjLBw9uSiX71UOkhHF-1bQf34QMcicuB7yhbYg3GZ8D1-f35qwN8nDayK8Si5Tr2uFAy_d-w3hnLMqzJ";

export async function POST(req: Request) {
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "bad form" }, { status: 400 });
  }
  if (!fd.get("EMAIL")) {
    return NextResponse.json({ ok: false, error: "missing email" }, { status: 400 });
  }
  try {
    const res = await fetch(BREVO_ENDPOINT, { method: "POST", body: fd });
    const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
    return NextResponse.json({ ok: !!data?.success });
  } catch (e) {
    console.error("brevo newsletter forward failed", e);
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}
