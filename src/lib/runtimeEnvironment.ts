import "server-only";

import {
  parseAppEnvironment,
  responseEnvironmentMatches,
  serviceEndpoint,
  type AppEnvironment,
} from "./runtimeEnvironment.core";

const ENVIRONMENT_HEADER = "X-The-Beach-Environment";

export function appEnvironment(): AppEnvironment {
  return parseAppEnvironment(process.env.APP_ENV);
}

export function configuredServiceEndpoint(
  name: string,
  value: string | undefined,
  productionDefault?: string,
): string {
  return serviceEndpoint(name, value, appEnvironment(), productionDefault);
}

export function configuredSecret(
  name: string,
  value: string | undefined,
  productionDefault?: string,
): string {
  const environment = appEnvironment();
  const resolved = (value || (environment === "production" ? productionDefault : ""))?.trim();
  if (!resolved) throw new Error(`${name} must be configured in ${environment}`);
  return resolved;
}

export function verifiedUpstreamResponse(response: Response, service: string): Response {
  const environment = appEnvironment();
  if (responseEnvironmentMatches(environment, response.headers.get(ENVIRONMENT_HEADER))) {
    return response;
  }
  return Response.json(
    { detail: `${service} svarade från fel miljö` },
    {
      status: 502,
      headers: {
        "Cache-Control": "no-store",
        [ENVIRONMENT_HEADER]: environment,
      },
    },
  );
}
