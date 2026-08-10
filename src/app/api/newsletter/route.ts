import { NextResponse } from "next/server";

import {
  appEnvironment,
  configuredServiceEndpoint,
  verifiedUpstreamResponse,
} from "@/lib/runtimeEnvironment";

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
    const demo = appEnvironment() === "demo";
    const endpoint = demo
      ? configuredServiceEndpoint("NEWSLETTER_ENDPOINT", process.env.NEWSLETTER_ENDPOINT)
      : BREVO_ENDPOINT;
    const upstream = await fetch(endpoint, { method: "POST", body: fd });
    const res = demo
      ? verifiedUpstreamResponse(upstream, "Nyhetsbrevstjänsten")
      : upstream;
    const data = (await res.json().catch(() => null)) as
      | { success?: boolean; ok?: boolean }
      | null;
    const ok = res.ok && !!(data?.success ?? data?.ok);
    return NextResponse.json({ ok }, { status: ok ? 200 : 502 });
  } catch (e) {
    console.error("newsletter forward failed", e);
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}
