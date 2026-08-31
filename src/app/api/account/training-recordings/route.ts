import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";
import { trainingRecordingFeedFromWire } from "@/lib/accountTrainingRecordings.core";

export const dynamic = "force-dynamic";

function privateResponse(response: Response) {
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET() {
  const token = await accountToken();
  if (!token) return privateResponse(unauthorized());

  const upstream = await appApi(
    "/training/sessions?include_past=true&include_recordings=true",
    undefined,
    { token },
  );
  if (!upstream.ok) return privateResponse(await proxyAppJson(upstream));

  const payload = await upstream.json().catch(() => null);
  if (!payload) {
    return privateResponse(Response.json(
      { detail: "Kunde inte läsa träningsfilmerna" },
      { status: 502 },
    ));
  }
  return privateResponse(Response.json(trainingRecordingFeedFromWire(payload)));
}
