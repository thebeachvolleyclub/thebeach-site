import "server-only";

import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const ACCOUNT_COOKIE = "tb_account_session";
export const DEVICE_COOKIE = "tb_account_device";
const YEAR = 60 * 60 * 24 * 365;

const baseCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function accountToken(): Promise<string | null> {
  return (await cookies()).get(ACCOUNT_COOKIE)?.value ?? null;
}

export async function accountDeviceId(): Promise<string | null> {
  return (await cookies()).get(DEVICE_COOKIE)?.value ?? null;
}

export function setAccountSession(response: NextResponse, token: string) {
  response.cookies.set(ACCOUNT_COOKIE, token, { ...baseCookie, maxAge: YEAR });
}

export function clearAccountSession(response: NextResponse) {
  response.cookies.set(ACCOUNT_COOKIE, "", { ...baseCookie, maxAge: 0 });
}

export function setAccountDevice(response: NextResponse, deviceId: string) {
  response.cookies.set(DEVICE_COOKIE, deviceId, { ...baseCookie, maxAge: YEAR });
}

export function familyChoiceCookie(userId: string): string {
  return `tb_account_choice_${userId}`;
}

export function setFamilyChoice(response: NextResponse, userId: string, token: string) {
  response.cookies.set(familyChoiceCookie(userId), token, {
    ...baseCookie,
    path: "/api/account/auth/select-family",
    maxAge: 10 * 60,
  });
}

export function clearFamilyChoice(response: NextResponse, userId: string) {
  response.cookies.set(familyChoiceCookie(userId), "", {
    ...baseCookie,
    path: "/api/account/auth/select-family",
    maxAge: 0,
  });
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const requestUrl = new URL(request.url);
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? requestUrl.host)
    .split(",")[0]
    .trim();
  const protocol = (request.headers.get("x-forwarded-proto") ?? requestUrl.protocol.replace(":", ""))
    .split(",")[0]
    .trim();
  return origin === `${protocol}://${host}`;
}

export function unauthorized(): Response {
  return Response.json({ detail: "Logga in för att fortsätta" }, { status: 401 });
}
