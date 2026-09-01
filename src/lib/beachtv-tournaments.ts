const BEACH_TV_ORIGIN = "https://tv.thebeach.one";
const LOOKUP_REVALIDATE_SECONDS = 6 * 60 * 60;
const LOOKUP_TIMEOUT_MS = 4_000;
export const BEACH_TV_LOOKUP_CONCURRENCY = 4;
export const BEACH_TV_LOOKUP_CACHE_MAX_ENTRIES = 256;

type BeachTvTournament = {
  id: string;
  profixio_invitation_id: string;
};

type FetchInit = RequestInit & {
  next?: { revalidate: number };
};

type Fetcher = (input: string, init?: FetchInit) => Promise<Response>;
type ErrorLogger = (message: string, error: unknown) => void;

type CachedLookup = {
  expiresAt: number;
  href: string | null;
};

type LookupResult = {
  cacheable: boolean;
  href: string | null;
};

type LookupState = {
  availablePermits: number;
  cache: Map<string, CachedLookup>;
  inFlight: Map<string, Promise<string | null>>;
  permitWaiters: Array<() => void>;
};

// Each fetch implementation gets one process-wide state. Production uses the
// global fetch function, while tests can remain isolated with injected fetchers.
const lookupStates = new WeakMap<Fetcher, LookupState>();

function getLookupState(fetcher: Fetcher): LookupState {
  const existing = lookupStates.get(fetcher);
  if (existing) return existing;

  const created: LookupState = {
    availablePermits: BEACH_TV_LOOKUP_CONCURRENCY,
    cache: new Map(),
    inFlight: new Map(),
    permitWaiters: [],
  };
  lookupStates.set(fetcher, created);
  return created;
}

function pruneLookupCache(state: LookupState, now: number): void {
  for (const [invitationId, cached] of state.cache) {
    if (cached.expiresAt <= now) state.cache.delete(invitationId);
  }

  while (state.cache.size > BEACH_TV_LOOKUP_CACHE_MAX_ENTRIES) {
    const oldestInvitationId = state.cache.keys().next().value;
    if (oldestInvitationId === undefined) break;
    state.cache.delete(oldestInvitationId);
  }
}

function cacheLookup(
  state: LookupState,
  invitationId: string,
  href: string | null,
): void {
  const now = Date.now();
  pruneLookupCache(state, now);

  // Reinsert an existing key so insertion order remains a useful eviction
  // order even if a value is refreshed after its six-hour lifetime.
  state.cache.delete(invitationId);
  state.cache.set(invitationId, {
    expiresAt: now + LOOKUP_REVALIDATE_SECONDS * 1_000,
    href,
  });
  pruneLookupCache(state, now);
}

async function withLookupPermit<T>(state: LookupState, task: () => Promise<T>): Promise<T> {
  if (state.availablePermits > 0) {
    state.availablePermits -= 1;
  } else {
    await new Promise<void>((resolve) => state.permitWaiters.push(resolve));
  }

  try {
    return await task();
  } finally {
    const next = state.permitWaiters.shift();
    if (next) {
      // Hand the released permit directly to the next waiter. This prevents a
      // newly arriving request from jumping the queue and exceeding the bound.
      next();
    } else {
      state.availablePermits += 1;
    }
  }
}

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

  const state = getLookupState(fetcher);
  pruneLookupCache(state, Date.now());
  const cached = state.cache.get(invitationId);
  if (cached) return cached.href;

  const pending = state.inFlight.get(invitationId);
  if (pending) return pending;

  const lookup = withLookupPermit(state, async (): Promise<LookupResult> => {
    try {
      const response = await fetcher(
        `${BEACH_TV_ORIGIN}/public/v1/tournaments/by-invitation/${encodeURIComponent(invitationId)}`,
        {
          next: { revalidate: LOOKUP_REVALIDATE_SECONDS },
          signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
        },
      );
      if (response.status === 404) return { cacheable: true, href: null };
      if (!response.ok) throw new Error(`BeachTV svarade ${response.status}`);

      const tournament: unknown = await response.json();
      if (!isBeachTvTournament(tournament, invitationId)) {
        throw new Error("BeachTV returnerade ett oväntat svar");
      }
      return {
        cacheable: true,
        href: `${BEACH_TV_ORIGIN}/turnering/by-ibid/${encodeURIComponent(invitationId)}`,
      };
    } catch (error) {
      logError(`[beachtv-calendar] uppslag misslyckades för Profixio ibId ${invitationId}:`, error);
      return { cacheable: false, href: null };
    }
  }).then((result) => {
    if (result.cacheable) {
      cacheLookup(state, invitationId, result.href);
    }
    return result.href;
  });

  state.inFlight.set(invitationId, lookup);

  try {
    return await lookup;
  } finally {
    if (state.inFlight.get(invitationId) === lookup) {
      state.inFlight.delete(invitationId);
    }
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
