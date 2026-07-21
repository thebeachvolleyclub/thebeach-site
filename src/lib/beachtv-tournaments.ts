const BEACH_TV_ORIGIN = "https://tv.thebeach.one";
const LOOKUP_REVALIDATE_SECONDS = 6 * 60 * 60;
const LOOKUP_TIMEOUT_MS = 4_000;

type BeachTvTournament = {
  id: string;
  profixio_invitation_id: string;
};

type FetchInit = RequestInit & {
  next?: { revalidate: number };
};

type Fetcher = (input: string, init?: FetchInit) => Promise<Response>;
type ErrorLogger = (message: string, error: unknown) => void;

function isBeachTvTournament(value: unknown, invitationId: string): value is BeachTvTournament {
  if (typeof value !== "object" || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    row.profixio_invitation_id === invitationId
  );
}

export async function resolveBeachTvTournament(
  ibId: string,
  fetcher: Fetcher = fetch,
  logError: ErrorLogger = console.error,
): Promise<string | null> {
  const invitationId = ibId.trim();
  if (!invitationId) return null;

  try {
    const response = await fetcher(
      `${BEACH_TV_ORIGIN}/public/v1/tournaments/by-invitation/${encodeURIComponent(invitationId)}`,
      {
        next: { revalidate: LOOKUP_REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
      },
    );
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`BeachTV svarade ${response.status}`);

    const tournament: unknown = await response.json();
    if (!isBeachTvTournament(tournament, invitationId)) {
      throw new Error("BeachTV returnerade ett oväntat svar");
    }
    return `${BEACH_TV_ORIGIN}/turnering/by-ibid/${encodeURIComponent(invitationId)}`;
  } catch (error) {
    logError(`[beachtv-calendar] uppslag misslyckades för Profixio ibId ${invitationId}:`, error);
    return null;
  }
}

export async function resolveBeachTvTournaments(
  ibIds: string[],
  fetcher: Fetcher = fetch,
  logError: ErrorLogger = console.error,
): Promise<Map<string, string>> {
  const uniqueIds = [...new Set(ibIds.map((value) => value.trim()).filter(Boolean))];
  const rows = await Promise.all(
    uniqueIds.map(async (ibId) => [
      ibId,
      await resolveBeachTvTournament(ibId, fetcher, logError),
    ] as const),
  );
  return new Map(
    rows.filter((row): row is readonly [string, string] => row[1] !== null),
  );
}
