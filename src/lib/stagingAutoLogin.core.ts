export type StagingAutoLoginConfig = {
  deviceId: string;
};

type StagingAutoLoginInput = {
  enabled: string | undefined;
  environment?: string | undefined;
  requestHost: string | null;
  appApiUrl: string | undefined;
  deviceId: string | undefined;
};

const STAGING_HOST = "staging.thebeach.one";
const STAGING_API_HOST = "api.dev.thebeach.one";
const DEVICE_ID_PATTERN = /^staging-web-[a-z0-9-]{8,52}$/;
const DEMO_HOST = "arena.dev.thebeach.one";
const DEMO_INTERNAL_API_HOST = "app-api";
const DEMO_DEVICE_ID_PATTERN = /^demo-web-[a-z0-9-]{8,55}$/;

/**
 * Fail-closed boundary for the staging-only passwordless login shortcut.
 *
 * A flag alone is deliberately insufficient: the incoming public hostname,
 * isolated API hostname and a server-only registered device id must all agree.
 * This makes an accidentally copied environment flag harmless in production.
 */
export function stagingAutoLoginConfig(input: StagingAutoLoginInput): StagingAutoLoginConfig | null {
  if (input.enabled?.trim().toLowerCase() !== "true") return null;

  const requestHost = input.requestHost?.split(",", 1)[0]?.trim().toLowerCase().split(":", 1)[0];
  let apiUrl: URL;
  try {
    apiUrl = new URL(input.appApiUrl ?? "");
  } catch {
    return null;
  }

  const deviceId = input.deviceId?.trim();
  if (
    requestHost === STAGING_HOST &&
    apiUrl.protocol === "https:" &&
    apiUrl.hostname.toLowerCase() === STAGING_API_HOST &&
    deviceId &&
    DEVICE_ID_PATTERN.test(deviceId)
  ) {
    return { deviceId };
  }

  // The approved one-container demo has no outbound route. Its website talks
  // to the App API over the container loopback alias, and the seeded device
  // can mint tokens only in the synthetic demo database. Requiring all four
  // signals keeps copying one flag to production harmless.
  if (
    input.environment?.trim().toLowerCase() === "demo" &&
    requestHost === DEMO_HOST &&
    apiUrl.protocol === "http:" &&
    apiUrl.hostname.toLowerCase() === DEMO_INTERNAL_API_HOST &&
    apiUrl.port === "8849" &&
    deviceId &&
    DEMO_DEVICE_ID_PATTERN.test(deviceId)
  ) {
    return { deviceId };
  }

  return null;
}
