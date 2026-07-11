"use client";

import { pushEvent } from "@/lib/gtm";

/**
 * Serialiserar ett formulär och postar till /api/forfragan.
 * Checkboxar med samma name slås ihop till en kommaseparerad sträng.
 */
export async function postForm(
  el: HTMLFormElement,
  form: string
): Promise<boolean> {
  const fd = new FormData(el);
  const data: Record<string, string> = { form };
  for (const [k, v] of fd.entries()) {
    const s = String(v);
    if (!s) continue;
    data[k] = data[k] ? `${data[k]}, ${s}` : s;
  }
  try {
    const res = await fetch("/api/forfragan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      // Konverteringsevent → GTM → GA4/Meta. form = t.ex. "event-startsida".
      pushEvent("form_submit_lead", { form_id: form });
    }
    return res.ok;
  } catch {
    return false;
  }
}
