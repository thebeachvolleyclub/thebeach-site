export type AppEnvironment = "production" | "demo";

const DEMO_PUBLIC_HOSTS = new Set(["arena.dev.thebeach.one"]);
const DEMO_SERVICE_SUFFIX = ".dev.thebeach.one";

function normalizedHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/\.$/, "");
}

export function parseAppEnvironment(value: string | undefined): AppEnvironment {
  const normalized = value?.trim().toLowerCase();
  if (!normalized || normalized === "production") return "production";
  if (normalized === "demo") return "demo";
  throw new Error(`Unsupported APP_ENV: ${value}`);
}

export function isDemoHostname(hostname: string): boolean {
  return DEMO_PUBLIC_HOSTS.has(normalizedHostname(hostname));
}

export function hostnameEnvironment(hostname: string): AppEnvironment {
  return isDemoHostname(hostname) ? "demo" : "production";
}

export function environmentMatchesHostname(
  environment: AppEnvironment,
  hostname: string,
): boolean {
  return environment === hostnameEnvironment(hostname);
}

function isDemoServiceHostname(hostname: string): boolean {
  const normalized = normalizedHostname(hostname);
  if (
    normalized.endsWith(DEMO_SERVICE_SUFFIX) ||
    normalized.endsWith(".demo.internal")
  ) {
    return true;
  }

  // Docker Compose service names stay on the private demo network and contain
  // no dots. In particular, this excludes host.docker.internal: demo services
  // must never use it as a shortcut back into production listeners.
  return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(normalized);
}

export function serviceEndpoint(
  name: string,
  rawValue: string | undefined,
  environment: AppEnvironment,
  productionDefault?: string,
): string {
  const raw = (rawValue || (environment === "production" ? productionDefault : ""))?.trim();
  if (!raw) throw new Error(`${name} must be configured in ${environment}`);

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`${name} must be an absolute http(s) URL`);
  }
  if (!(["http:", "https:"] as string[]).includes(url.protocol)) {
    throw new Error(`${name} must use http(s)`);
  }
  if (url.username || url.password) {
    throw new Error(`${name} must not contain credentials`);
  }

  const hostname = normalizedHostname(url.hostname);
  if (environment === "demo" && !isDemoServiceHostname(hostname)) {
    throw new Error(`${name} must point to an isolated demo service`);
  }
  if (
    environment === "production" &&
    (hostname.endsWith(DEMO_SERVICE_SUFFIX) ||
      hostname.endsWith(".demo.internal"))
  ) {
    throw new Error(`${name} must not point to a demo service in production`);
  }

  return url.toString().replace(/\/$/, "");
}

export function responseEnvironmentMatches(
  environment: AppEnvironment,
  responseValue: string | null,
): boolean {
  const actual = responseValue?.trim().toLowerCase();
  // Existing production services can be rolled out before they emit the
  // marker. Demo is stricter because a missing marker could mean prod data.
  if (!actual) return environment === "production";
  return actual === environment;
}
