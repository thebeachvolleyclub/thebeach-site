/** Synthetic loopback-only BFF/browser verification. No database or real emails. */
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createHash, randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const playwrightPath = process.env.FAMILY_PLAYWRIGHT_MODULE;
if (!playwrightPath) throw new Error("Set FAMILY_PLAYWRIGHT_MODULE to an existing Playwright module; this script installs nothing.");
const playwright = await import(pathToFileURL(playwrightPath));
const { chromium } = playwright.default ?? playwright;
const requests = [];
let nextSessionRead = null;
let childExists = true;
let retiredParentContact = false;
const tokens = new Map([["fixture-parent", 1]]);
const replays = new Map();
const profile = (playerId) => ({ id: playerId === 1 ? "11111111-1111-4111-8111-111111111111" : "22222222-2222-4222-8222-222222222222",
  canonical_player_id: playerId, email: playerId === 2 && retiredParentContact ? "child@example.test" : "parent@example.test", name: playerId === 1 ? "Fixture Parent" : "Fixture Child",
  first_name: "Fixture", last_name: playerId === 1 ? "Parent" : "Child", birthdate: playerId === 1 ? "1985-01-01" : "2015-01-01",
  swish_phone: "0700000000", emoji_icon: "🏐", is_public: false, profile_complete: true,
  identity_status: "active", identity_onboarding_v2_enabled: true, description: null, avatar_url: null, banner_url: null });
const family = (playerId) => ({ actor_player_id: retiredParentContact ? playerId : 1, current_player_id: playerId, can_create_child: playerId === 1,
  contact_email: playerId === 2 && retiredParentContact ? "child@example.test" : "parent@example.test", contact_provenance: "account_contact", requires_email_verification: false,
  current_has_parent_contact: playerId === 2 && !retiredParentContact, current_parent_contacts: playerId === 2 && !retiredParentContact ? ["parent@example.test"] : [],
  profiles: (retiredParentContact ? [playerId] : childExists ? [1, 2] : [1]).map((id) => ({ ...profile(id), player_id: id, relationship: id === 1 || retiredParentContact ? "self" : "child",
    is_current: id === playerId, email_type: id === 1 || retiredParentContact ? "personal" : "parent", gender: "W" })) });
const send = (response, body, status = 200) => { response.writeHead(status, { "Content-Type": "application/json" }); response.end(JSON.stringify(body)); };
const app = createServer(async (request, response) => {
  let raw = "";
  for await (const part of request) raw += part;
  const body = raw ? JSON.parse(raw) : {};
  const token = String(request.headers.authorization ?? "").replace(/^Bearer /, "");
  const playerId = tokens.get(token);
  requests.push({ path: request.url, body, token, key: request.headers["idempotency-key"] });
  if (request.url === "/matchmaking/family/switch") {
    const replayKey = `${token}:${request.headers["idempotency-key"]}:${body.player_id}`;
    if (replays.has(replayKey)) return send(response, replays.get(replayKey));
    if (!playerId) return send(response, { detail: "Invalid session" }, 401);
    if (![1, 2].includes(body.player_id) || (retiredParentContact && body.player_id !== playerId)) return send(response, { detail: "Not your child" }, 403);
    const next = `fixture-${body.player_id}-${randomUUID()}`;
    tokens.delete(token); tokens.set(next, body.player_id);
    const result = { success: true, auth_token: next, user: profile(body.player_id) };
    replays.set(replayKey, result);
    return send(response, result);
  }
  if (!playerId) return send(response, { detail: "Invalid session" }, 401);
  if (request.url === "/matchmaking/auth/me") {
    if (nextSessionRead) { const held = nextSessionRead; nextSessionRead = null; held.started(); return held.capture(() => send(response, profile(playerId))); }
    return send(response, profile(playerId));
  }
  if (request.url === "/matchmaking/family/profiles") return send(response, family(playerId));
  if (request.url === "/matchmaking/family/children") { childExists = true; return send(response, { child: family(playerId).profiles.at(-1), idempotent_replay: false }); }
  if (request.url === "/matchmaking/family/personal-email/request") return send(response, { success: true, email: body.new_email });
  if (request.url === "/matchmaking/family/personal-email/confirm") {
    if (body.code !== "123456" || body.retire_parent_contact !== true) return send(response, { detail: "Kontrollera koden" }, 400);
    retiredParentContact = true;
    for (const [existing, id] of tokens) if (id === 2) tokens.delete(existing);
    const next = `fixture-personal-${randomUUID()}`; tokens.set(next, 2);
    return send(response, { success: true, email: "child@example.test", auth_token: next, user: profile(2), retired_parent_contacts: 1 });
  }
  if (request.url === "/matchmaking/auth/me/emails") return send(response, { addresses: [{ email: profile(playerId).email, is_primary: true, email_type: playerId === 1 || retiredParentContact ? "personal" : "parent" }] });
  if (request.url === "/training/invoices/mine") return send(response, { invoices: [{ id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", amount_sek: playerId === 1 ? 100 : 25, status: "paid", lines: [{ group_name: playerId === 1 ? "PRIVATE PARENT INVOICE" : "CHILD INVOICE", amount_sek: playerId === 1 ? 100 : 25 }] }] });
  if (request.url === "/booking/mine") return send(response, []);
  if (request.url === "/training/lookup") return send(response, { found: false, groups: [] });
  if (request.url === "/matchmaking/auth/revoke-token") { tokens.delete(token); return send(response, { success: true }); }
  return send(response, {});
});
await new Promise((resolve) => app.listen(0, "127.0.0.1", resolve));
const reservation = createServer();
await new Promise((resolve) => reservation.listen(0, "127.0.0.1", resolve));
const sitePort = reservation.address().port;
await new Promise((resolve) => reservation.close(resolve));
const siteUrl = `http://127.0.0.1:${sitePort}`;
const site = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(sitePort)], {
  cwd: process.cwd(), env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", APP_API_URL: `http://127.0.0.1:${app.address().port}`, APP_API_KEY: "synthetic", OPS_CALLER_SECRET: "synthetic", BOOKING_API_URL: `http://127.0.0.1:${app.address().port}` }, stdio: ["ignore", "pipe", "pipe"],
});
let logs = "";
site.stdout.on("data", (chunk) => { logs += chunk; }); site.stderr.on("data", (chunk) => { logs += chunk; });
let browser;
try {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try { if ((await fetch(`${siteUrl}/api/account/session`)).ok) break; } catch { /* start */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const parentContext = createHash("sha256").update("fixture-parent").digest("hex");
  const cookie = "tb_account_session=fixture-parent";
  const headers = { Cookie: cookie, Origin: siteUrl, "X-Account-Context": parentContext, "Content-Type": "application/json" };
  assert.equal((await fetch(`${siteUrl}/api/account/family`)).status, 401);
  assert.equal((await fetch(`${siteUrl}/api/account/family/children`, { method: "POST", headers: { ...headers, Origin: "https://evil.example" }, body: "{}" })).status, 403);
  let releaseRead;
  let started;
  const readStarted = new Promise((resolve) => { started = resolve; });
  nextSessionRead = { started, capture(release) { releaseRead = release; } };
  const slowRead = fetch(`${siteUrl}/api/account/session`, { headers });
  await readStarted;
  const switchResponse = await fetch(`${siteUrl}/api/account/family/switch`, { method: "POST", headers: { ...headers, "Idempotency-Key": randomUUID() }, body: JSON.stringify({ player_id: 2 }) });
  assert.equal(switchResponse.status, 200);
  assert.deepEqual(await switchResponse.json(), { authenticated: true });
  const setCookie = switchResponse.headers.getSetCookie().find((value) => value.startsWith("tb_account_session="));
  assert.match(setCookie, /HttpOnly/i);
  releaseRead();
  const late = await slowRead;
  assert.equal(late.headers.get("set-cookie"), null, "old session GET cannot overwrite the new cookie");
  const childCookie = setCookie.split(";")[0];
  const before = requests.length;
  const stale = await fetch(`${siteUrl}/api/signup/submit`, { method: "POST", headers: { ...headers, Cookie: childCookie }, body: "{}" });
  assert.equal(stale.status, 409);
  assert.equal(requests.length, before, "stale optional-auth request must not reach upstream as anonymous");

  // Browser fixtures are in a fresh cookie jar and never contact an external host.
  tokens.set("browser-parent", 1);
  browser = await chromium.launch({ executablePath: process.env.FAMILY_CHROME_BINARY ?? "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox"] });
  const context = await browser.newContext({ viewport: { width: 393, height: 852 } });
  await context.route("**/*", (route) => route.request().url().startsWith(siteUrl) ? route.continue() : route.abort());
  await context.addCookies([{ name: "tb_account_session", value: "browser-parent", url: siteUrl, httpOnly: true, sameSite: "Lax" }]);
  const page = await context.newPage();
  const other = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  other.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${siteUrl}/konto#profil`);
  await page.getByRole("button", { name: "Endast nödvändiga", exact: true }).click();
  await other.goto(`${siteUrl}/konto#fakturor`);
  await page.getByRole("heading", { name: "Fixture Parent", exact: true }).waitFor();
  await other.getByText("PRIVATE PARENT INVOICE", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Skapa barnprofil", exact: true }).click();
  await page.getByLabel("Förnamn", { exact: true }).first().fill("Fixture");
  await page.getByLabel("Efternamn", { exact: true }).first().fill("Child");
  await page.getByLabel("Födelsedatum", { exact: true }).first().fill("2015-01-01");
  await page.getByRole("combobox", { name: /Kön/ }).selectOption("W");
  await page.getByRole("checkbox", { name: /Jag är vårdnadshavare/ }).check();
  const artifacts = await mkdtemp(join(tmpdir(), "family-site-browser-"));
  await mkdir(artifacts, { recursive: true });
  await page.getByRole("heading", { name: "Familjeprofiler", exact: true }).scrollIntoViewIfNeeded();
  const familyRegion = page.getByRole("region", { name: "Familjeprofiler", exact: true });
  await familyRegion.screenshot({ path: join(artifacts, "family-create-mobile.png") });
  await page.getByLabel("Förnamn", { exact: true }).first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(artifacts, "family-create-viewport-393x852.png") });
  await page.getByRole("button", { name: "Skapa barnprofil", exact: true }).click();
  await page.getByText("Barnets profil är skapad.", { exact: false }).waitFor();
  const create = requests.findLast((request) => request.path === "/matchmaking/family/children");
  assert.equal(create.body.expected_contact_email, "parent@example.test");
  assert.equal(create.body.email, undefined);
  assert.equal(create.body.is_public, undefined);
  assert.ok(create.key);
  await page.evaluate(() => sessionStorage.setItem("tb_course_invoice_7", "PRIVATE PARENT INVOICE"));
  await other.evaluate(() => sessionStorage.setItem("tb_course_invoice_7", "PRIVATE PARENT INVOICE"));
  await page.getByRole("button", { name: "Byt profil", exact: true }).click();
  await page.getByRole("heading", { name: "Fixture Child", exact: true }).waitFor();
  await other.getByRole("heading", { name: "Fixture Child", exact: true }).waitFor();
  assert.equal(await other.getByText("PRIVATE PARENT INVOICE", { exact: true }).count(), 0);
  assert.equal(await page.evaluate(() => sessionStorage.getItem("tb_course_invoice_7")), null);
  assert.equal(await other.evaluate(() => sessionStorage.getItem("tb_course_invoice_7")), null);
  assert.equal(await page.getByText("Logga in eller skapa konto", { exact: true }).count(), 0);
  await page.getByRole("heading", { name: "Familjeprofiler", exact: true }).scrollIntoViewIfNeeded();
  await familyRegion.screenshot({ path: join(artifacts, "family-child-mobile.png") });
  const ordinaryEmail = page.getByPlaceholder("namn@exempel.se", { exact: true });
  assert.equal(await ordinaryEmail.isDisabled(), true, "parent-contact profiles use explicit verified handover");
  await page.getByText("Använd ”Egen e-post när barnet tar över”", { exact: false }).waitFor();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await familyRegion.screenshot({ path: join(artifacts, "family-child-desktop.png") });
  await page.getByLabel("Barnets egen e-post", { exact: true }).fill("child@example.test");
  await page.getByRole("button", { name: "Skicka verifieringskod", exact: true }).click();
  await page.getByLabel("Verifieringskod", { exact: true }).fill("123456");
  const takeoverButton = page.getByRole("button", { name: "Bekräfta och ta bort föräldrakontakt", exact: true });
  assert.equal(await takeoverButton.isDisabled(), true, "takeover requires explicit retirement consent");
  await page.getByRole("checkbox", { name: /Jag bekräftar att barnet ska ta över/ }).check();
  await familyRegion.screenshot({ path: join(artifacts, "family-takeover-desktop.png") });
  await takeoverButton.click();
  await page.getByRole("heading", { name: "Fixture Child", exact: true }).waitFor();
  await page.getByText("child@example.test", { exact: true }).first().waitFor();
  await other.getByText("child@example.test", { exact: true }).first().waitFor();
  assert.equal(await page.getByRole("heading", { name: "Egen e-post när barnet tar över", exact: true }).count(), 0);
  assert.equal(await page.getByRole("button", { name: "Byt profil", exact: true }).count(), 0);
  const takeover = requests.findLast((request) => request.path === "/matchmaking/family/personal-email/confirm");
  assert.equal(takeover.body.retire_parent_contact, true);
  const browserStorage = await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } }));
  assert.equal(browserStorage.includes("123456"), false, "OTP is never persisted");
  tokens.set("independent-parent", 1);
  const denied = await fetch(`${siteUrl}/api/account/family/switch`, { method: "POST", headers: {
    Cookie: "tb_account_session=independent-parent", Origin: siteUrl, "Content-Type": "application/json", "Idempotency-Key": randomUUID(),
    "X-Account-Context": createHash("sha256").update("independent-parent").digest("hex"),
  }, body: JSON.stringify({ player_id: 2 }) });
  assert.equal(denied.status, 403, "retired parent cannot switch to the child");
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ result: "PASS", cases: ["anonymous 401", "cross-origin 403", "HttpOnly rotation", "late session read cannot set cookies", "stale optional-auth mutation blocked", "confirmed parent email + idempotent child creation", "cross-tab parent→child without OTP", "unscoped storage cleared in both tabs", "no stale invoice in child context", "393px/desktop screenshots", "own-email verification + explicit retirement", "takeover rotates both tabs without persisting OTP", "retired parent no access"], artifacts }, null, 2));
} catch (error) {
  console.error(logs.slice(-6000));
  throw error;
} finally {
  await browser?.close();
  site.kill("SIGTERM");
  await new Promise((resolve) => site.once("exit", resolve));
  app.closeAllConnections();
  await new Promise((resolve) => app.close(resolve));
}
