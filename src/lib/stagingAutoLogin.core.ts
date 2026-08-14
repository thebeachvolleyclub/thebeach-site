export type StagingAutoLoginConfig = {
  deviceId: string;
};

type StagingAutoLoginInput = {
  enabled: string | undefined;
  requestHost: string | null;
  appApiUrl: string | undefined;
  deviceId: string | undefined;
};

const STAGING_HOST = "staging.thebeach.one";
const STAGING_API_HOST = "api.dev.thebeach.one";
const DEVICE_ID_PATTERN = /^staging-web-[a-z0-9-]{8,52}$/;

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
  if (requestHost !== STAGING_HOST) return null;

  let apiUrl: URL;
  try {
    apiUrl = new URL(input.appApiUrl ?? "");
  } catch {
    return null;
  }
  if (apiUrl.protocol !== "https:" || apiUrl.hostname.toLowerCase() !== STAGING_API_HOST) return null;

  const deviceId = input.deviceId?.trim();
  if (!deviceId || !DEVICE_ID_PATTERN.test(deviceId)) return null;
  return { deviceId };
}
