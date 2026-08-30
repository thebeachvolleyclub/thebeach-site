import { tvAccountToken, unauthorized } from "@/lib/accountSession";
import { projectTvTrainingSessions } from "@/lib/accountTvTraining.core";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

export async function GET() {
  const token = await tvAccountToken();
  if (!token) {
    const response = unauthorized();
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  const profileResponse = await appApi("/matchmaking/auth/me", undefined, { token });
  if (!profileResponse.ok) return proxyAppJson(profileResponse);
  const profile = record(await profileResponse.json().catch(() => ({})));

  const trainingResponse = await appApi(
    "/training/sessions?include_past=true&include_recordings=true",
    undefined,
    { token },
  );
  if (!trainingResponse.ok) return proxyAppJson(trainingResponse);
  const training = await trainingResponse.json().catch(() => ({}));

  return Response.json(
    {
      profile: {
        first_name: typeof profile.first_name === "string" ? profile.first_name : null,
        name: typeof profile.name === "string" ? profile.name : null,
      },
      sessions: projectTvTrainingSessions(training),
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
