import { NextResponse } from "next/server";
import { saveToDb, notifyByEmail, type Submission } from "@/lib/submit";

export async function POST(req: Request) {
  let body: Submission;
  try {
    body = (await req.json()) as Submission;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  if (!body.form || (!body.epost && !body.telefon)) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }
  try {
    await saveToDb(body);
  } catch (e) {
    console.error("form save failed", e);
    return NextResponse.json({ ok: false, error: "save failed" }, { status: 500 });
  }
  // mejl är best-effort — får inte stoppa inskicket
  notifyByEmail(body).catch((e) => console.error("brevo notify failed", e));
  return NextResponse.json({ ok: true });
}
