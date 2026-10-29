// Built Next + real same-origin BFF routes against an owned loopback synthetic
// App API. No production accounts, databases, emails or notifications are used.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const { default: puppeteer } = await import(pathToFileURL(process.env.PUPPETEER_MODULE));
const people = new Map(), mutations = [], failures = [], draftStatuses = new Map();
let sequence = 0, loginToken;
const choices = ['herr', 'dam', 'ickebinar'];
function person({ required = true, oldServer = false, draftStatus = null } = {}) {
  const id = ++sequence;
  const token = createHash('sha256').update(`synthetic-gender-${id}`).digest('hex');
  const profile = { id: `gender-fixture-${id}`, canonical_player_id: required ? null : id,
    email: 'synthetic@example.com', name: 'Example Person', first_name: 'Example', last_name: 'Person', birthdate: '1990-01-02',
    gender: null, ...(oldServer ? {} : { gender_required: required }), swish_phone: null,
    emoji_icon: '🏐', description: null, is_public: false, avatar_url: null, avatar_thumb_url: null, banner_url: null,
    profile_complete: !required, identity_status: draftStatus ?? (required ? 'pending_identity' : 'active'), identity_onboarding_v2_enabled: true };
  if (draftStatus) draftStatuses.set(profile.id, draftStatus);
  people.set(token, profile); return { token, profile };
}
const state = (profile) => ({ identity_status: profile.identity_status, first_name: profile.first_name,
  last_name: profile.last_name, birthdate: profile.birthdate, gender: profile.gender, gender_required: profile.gender_required,
  candidates: profile.identity_status === 'duplicate_review' ? [{ player_id: 500, name: 'Existing Example', masked_email: 'e***@example.com', birthdate_match: true }] : [],
  message: null, profile_revision: 7 });
const api = createServer(async (request, response) => {
  try {
    const path = new URL(request.url, 'http://fixture').pathname;
    let raw = ''; for await (const chunk of request) raw += chunk;
    const body = raw ? JSON.parse(raw) : {};
    const token = String(request.headers.authorization ?? '').replace(/^Bearer /, '');
    const profile = people.get(token);
    const json = (data, status = 200) => { response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); response.end(JSON.stringify(data)); };
    if (path === '/training/courses') return json({ courses: [{ id: 90001, name: 'Synthetic Gender Course', nameEn: 'Synthetic Gender Course', level: 'Grundkurs',
      description: 'Synthetic account completion fixture.', prerequisites: null, termsMarkdown: null, termsVersion: 'fixture', season: null, schedule: null,
      coaches: [], capacity: 10, remainingPlaces: 5, waitlistCount: 0, priceSek: 100, personalPriceSek: profile ? 100 : null,
      personalPriceStatus: profile ? 'resolved' : 'sign_in_required', registrationOpensAt: null, registrationClosesAt: null, sessions: [] }] });
    if (path.endsWith('/auth/request-code')) return json({ success: true });
    if (path.endsWith('/auth/verify-code')) {
      assert.equal(body.code, '123456');
      return json({ user: people.get(loginToken), auth_token: loginToken });
    }
    if (!profile) return json({ detail: 'Synthetic session required' }, 401);
    if (path.endsWith('/auth/me')) return json(profile);
    if (path.endsWith('/identity/onboarding')) return json(state(profile));
    if (path.endsWith('/identity/onboarding/profile') || path === '/matchmaking/users/me') {
      if (profile.gender_required && !choices.includes(body.gender)) return json({ detail: 'Välj kön för att slutföra din profil.' }, 422);
      if (body.gender !== undefined && !choices.includes(body.gender)) return json({ detail: 'Invalid synthetic gender' }, 422);
      if (draftStatuses.has(profile.id)) {
        assert.equal(body.first_name, profile.first_name); assert.equal(body.last_name, profile.last_name); assert.equal(body.birthdate, profile.birthdate);
      }
      mutations.push({ path, body, id: profile.id });
      Object.assign(profile, body);
      profile.name = `${profile.first_name} ${profile.last_name}`;
      if (draftStatuses.has(profile.id)) return json(state(profile));
      profile.identity_status = 'active'; profile.gender_required = false; profile.profile_complete = true;
      profile.canonical_player_id ??= sequence;
      return json(path.endsWith('/identity/onboarding/profile') ? state(profile) : profile);
    }
    if (path.endsWith('/lookup-rating')) return json({ status: 'not_found' });
    if (path.endsWith('/users/me/swish-phone')) { profile.swish_phone = body.swish_phone; return json({ success: true }); }
    if (path.endsWith('/family/profiles')) return json({ actor_player_id: profile.canonical_player_id, current_player_id: profile.canonical_player_id,
      can_create_child: true, requires_email_verification: false, contact_email: profile.email,
      profiles: [{ ...profile, player_id: profile.canonical_player_id, relationship: 'self', is_current: true }] });
    if (path.endsWith('/family/children')) {
      if (!['M', 'W', 'X'].includes(body.gender)) return json({ detail: 'Synthetic child requires gender' }, 422);
      mutations.push({ path, body, id: profile.id });
      return json({ child: { player_id: 999, name: 'Synthetic Child', gender: body.gender }, idempotent_replay: false }, 201);
    }
    if (path.includes('/profile/emails')) return json({ addresses: [{ email: profile.email, is_primary: true }] });
    if (path.includes('/competition-licence')) return json({ request: null, eligibility: { eligible: false } });
    if (path === '/booking/mine') return json([]);
    if (path.includes('/invoices/')) return json({ invoices: [], active_count: 0 });
    if (path.includes('/memberships/')) return json({ memberships: [], purchaseOptions: [], purchases: [], currentYear: 2026 });
    if (request.method !== 'GET') throw new Error(`Unexpected synthetic mutation ${path}`);
    return json({ found: false, subscriptions: [], enrolments: [], addresses: [], groups: [], sessions: [], events: [], training_groups: [] });
  } catch (error) { failures.push(error.message); response.writeHead(500); response.end('{}'); }
});
await new Promise((resolve) => api.listen(0, '127.0.0.1', resolve));
const choosePort = createServer(); await new Promise((resolve) => choosePort.listen(0, '127.0.0.1', resolve));
const sitePort = choosePort.address().port; await new Promise((resolve) => choosePort.close(resolve));
const origin = `http://localhost:${sitePort}`;
const site = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', 'localhost', '-p', String(sitePort)], {
  cwd: process.cwd(), env: { ...process.env, APP_API_URL: `http://127.0.0.1:${api.address().port}`, APP_API_KEY: 'synthetic-gender-only', NEXT_TELEMETRY_DISABLED: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = ''; site.stdout.on('data', (data) => { output = (output + data).slice(-2000); }); site.stderr.on('data', (data) => { output = (output + data).slice(-2000); });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let browser, currentPage;
async function open(token, width, draft = false) {
  const context = await browser.createBrowserContext(), page = await context.newPage();
  currentPage = page;
  await page.setViewport({ width, height: 900 });
  await page.evaluateOnNewDocument(() => localStorage.setItem('cookie_consent', 'denied'));
  if (token) await context.setCookie({ name: 'tb_account_session', value: token, domain: 'localhost', path: '/', httpOnly: true });
  await page.setRequestInterception(true);
  page.on('request', (request) => { const url = new URL(request.url()); void (url.origin === origin || ['data:', 'blob:'].includes(url.protocol) ? request.continue() : request.abort()); });
  page.on('pageerror', (error) => failures.push(error.message));
  await page.goto(`${origin}/konto#profil`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector(draft ? 'select[aria-label="Kön för identitetskontroll"]' : 'select[aria-label="Kön"]');
  if (!draft) await page.waitForFunction(() => document.querySelector('input[autocomplete="given-name"]')?.value === 'Example');
  return { context, page };
}
async function save(page) {
  const before = mutations.length;
  await page.evaluate(() => [...document.querySelectorAll('button')].find((node) => node.textContent.trim() === 'Spara profil' && !node.disabled).click());
  for (let attempt = 0; mutations.length === before; attempt++) {
    if (attempt > 100) throw new Error('Profile save did not reach the synthetic upstream');
    await pause(50);
  }
  await page.waitForFunction(() => document.body.textContent.includes('Profilen är sparad'));
}
async function click(page, label) {
  await page.waitForFunction((value) => [...document.querySelectorAll('button')].some((node) => node.textContent.trim() === value && !node.disabled), {}, label);
  await page.evaluate((value) => [...document.querySelectorAll('button')].find((node) => node.textContent.trim() === value && !node.disabled).click(), label);
}
async function openInline(fixture, width) {
  loginToken = fixture.token;
  const context = await browser.createBrowserContext(), page = await context.newPage(); currentPage = page;
  await page.setViewport({ width, height: 900 });
  await page.evaluateOnNewDocument(() => localStorage.setItem('cookie_consent', 'denied'));
  await page.setRequestInterception(true);
  page.on('request', (request) => { const url = new URL(request.url()); void (url.origin === origin || ['data:', 'blob:'].includes(url.protocol) ? request.continue() : request.abort()); });
  page.on('pageerror', (error) => failures.push(error.message));
  await page.goto(`${origin}/kurser/synthetic-gender-course`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#anmalan input[autocomplete="email"]');
  await page.type('#anmalan input[autocomplete="email"]', 'synthetic@example.com'); await click(page, 'Skicka kod');
  await page.waitForSelector('#anmalan input[autocomplete="one-time-code"]');
  await page.type('#anmalan input[autocomplete="one-time-code"]', '123456'); await click(page, 'Fortsätt');
  return { context, page };
}
try {
  for (let attempt = 0; attempt < 90; attempt++) {
    try { if ((await fetch(`${origin}/konto`)).ok) break; } catch { /* startup */ }
    if (attempt === 89) throw new Error(`Next fixture failed to start: ${output}`);
    await pause(500);
  }
  console.log(`Owned loopback Next ${sitePort}; synthetic App ${api.address().port}`);
  browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  for (const width of [390, 1280]) {
    for (const gender of choices) {
      const { token, profile } = person(); const { context, page } = await open(token, width);
      await page.waitForFunction(() => document.body.textContent.includes('Välj kön för att slutföra din profil.'));
      assert.equal(await page.$eval('select[aria-label="Kön"]', (node) => node.value), '');
      assert.equal(await page.$eval('select[aria-label="Kön"]', (node) => node.required), true);
      assert.equal(await page.evaluate(() => [...document.querySelectorAll('button')].find((node) => node.textContent.trim() === 'Spara profil').disabled), true);
      const before = mutations.length;
      await page.evaluate(() => [...document.querySelectorAll('button')].find((node) => node.textContent.trim() === 'Spara profil').click());
      await pause(60); assert.equal(mutations.length, before);
      if (gender === 'herr') await page.screenshot({ path: `/tmp/site-required-gender-${width}-required.png`, fullPage: true });
      await page.select('select[aria-label="Kön"]', gender); await save(page);
      assert.equal(profile.gender, gender);
      assert.equal(mutations.at(-1).body.gender, gender);
      assert.equal('gender_required' in mutations.at(-1).body, false);
      await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForSelector('select[aria-label="Kön"]');
      await page.waitForFunction((value) => document.querySelector('select[aria-label="Kön"]').value === value, {}, gender);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      if (gender === 'ickebinar') await page.screenshot({ path: `/tmp/site-required-gender-${width}-saved.png`, fullPage: true });
      await context.close();
    }
    for (const oldServer of [false, true]) {
      const { token, profile } = person({ required: false, oldServer }); const { context, page } = await open(token, width);
      assert.equal(await page.$eval('select[aria-label="Kön"]', (node) => node.required), false);
      await save(page);
      assert.equal(profile.gender, null);
      assert.equal('gender' in mutations.at(-1).body, false);
      assert.equal('gender_required' in mutations.at(-1).body, false);
      await page.select('select[aria-label="Kön"]', 'ickebinar'); await save(page);
      assert.equal(profile.gender, 'ickebinar');
      await context.close();
    }
    console.log(`PASS ${width}px: blank required blocked; all three choices saved and canonical reload; flagfalse/absent legacyNULL remains editable; no horizontal overflow`);
  }
  for (const width of [390, 1280]) {
    for (const gender of choices) {
      const fixture = person(); const { context, page } = await openInline(fixture, width);
      await page.waitForSelector('#anmalan select[name="gender"]');
      assert.equal(await page.$eval('#anmalan select[name="gender"]', (node) => node.required && node.value === ''), true);
      assert.equal(await page.evaluate(() => [...document.querySelectorAll('button')].find((node) => node.textContent.trim() === 'Spara och fortsätt').disabled), true);
      await page.select('#anmalan select[name="gender"]', gender); await click(page, 'Spara och fortsätt');
      await page.waitForFunction(() => !document.querySelector('#anmalan select[name="gender"]'));
      assert.equal(fixture.profile.gender, gender);
      assert.equal(mutations.at(-1).body.gender, gender);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      await context.close();
    }
    console.log(`PASS ${width}px inline course account signup: required blank blocked; explicit allthree saved; no enrolment or payment initiated`);
  }
  for (const width of [390, 1280]) {
    for (const draftStatus of ['duplicate_review', 'merge_pending']) {
      for (const surface of ['account', 'inline']) {
        const fixture = person({ draftStatus });
        const { context, page } = surface === 'account' ? await open(fixture.token, width, true) : await openInline(fixture, width);
        await page.waitForSelector('select[aria-label="Kön för identitetskontroll"]');
        assert.equal(await page.$eval('select[aria-label="Kön för identitetskontroll"]', (node) => node.value), '');
        assert.equal(await page.evaluate(() => [...document.querySelectorAll('button')].find((node) => node.textContent.trim() === 'Spara kön och fortsätt').disabled), true);
        if (draftStatus === 'duplicate_review') assert.equal(await page.evaluate(() => {
          const buttons = [...document.querySelectorAll('button')].filter((node) => /Ja, det är jag|Nej, det är inte jag|Det är inte jag —/.test(node.textContent));
          return buttons.length === 2 && buttons.every((node) => node.disabled);
        }), true);
        await page.select('select[aria-label="Kön för identitetskontroll"]', 'ickebinar');
        await click(page, 'Spara kön och fortsätt');
        await page.waitForFunction(() => !document.querySelector('select[aria-label="Kön för identitetskontroll"]'));
        assert.equal(fixture.profile.gender, 'ickebinar'); assert.equal(fixture.profile.identity_status, draftStatus);
        assert.equal(state(fixture.profile).profile_revision, 7);
        assert.equal(mutations.at(-1).body.first_name, 'Example'); assert.equal(mutations.at(-1).body.last_name, 'Person'); assert.equal(mutations.at(-1).body.birthdate, '1990-01-02');
        assert.ok(!mutations.some((entry) => entry.id === fixture.profile.id && entry.path.includes('/decision')));
        if (draftStatus === 'duplicate_review') assert.equal(await page.evaluate(() => {
          const buttons = [...document.querySelectorAll('button')].filter((node) => /Ja, det är jag|Nej, det är inte jag|Det är inte jag —/.test(node.textContent));
          return buttons.length === 2 && buttons.every((node) => !node.disabled);
        }), true);
        await context.close();
      }
    }
    console.log(`PASS ${width}px resumed drafts: account+inline duplicate/merge add gender only; identity status/revision/names/DOB and decisions preserved`);
  }
  const { token } = person({ required: false });
  const headers = { Cookie: `tb_account_session=${token}`, 'Content-Type': 'application/json' };
  const names = { first_name: 'Example', last_name: 'Person', birthdate: '1990-01-02' };
  for (const route of ['identity', 'profile']) {
    for (const gender of [null, '', 'M', 'X', 'unknown', true, 1, {}]) {
      const before = mutations.length;
      assert.equal((await fetch(`${origin}/api/account/${route}`, { method: 'PUT', headers, body: JSON.stringify({ ...names, gender }) })).status, 422);
      assert.equal(mutations.length, before);
    }
    assert.equal((await fetch(`${origin}/api/account/${route}`, { method: 'PUT', headers: { ...headers, Origin: 'https://unrelated.example.com' }, body: JSON.stringify({ ...names, gender: 'dam' }) })).status, 403);
    assert.equal((await fetch(`${origin}/api/account/${route}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...names, gender: 'dam' }) })).status, 401);
  }
  const required = person();
  for (const route of ['identity', 'profile']) {
    assert.equal((await fetch(`${origin}/api/account/${route}`, { method: 'PUT', headers: { ...headers, Cookie: `tb_account_session=${required.token}` }, body: JSON.stringify({ ...names, gender_required: false }) })).status, 422);
  }
  for (const gender of [undefined, null, '', 'herr', 'ickebinar', true]) {
    const before = mutations.length;
    assert.equal((await fetch(`${origin}/api/account/family/children`, { method: 'POST', headers, body: JSON.stringify({ idempotencyKey: 'gender-family-test-0001', gender }) })).status, 422);
    assert.equal(mutations.length, before);
  }
  for (const gender of ['M', 'W', 'X']) {
    assert.equal((await fetch(`${origin}/api/account/family/children`, { method: 'POST', headers, body: JSON.stringify({ idempotencyKey: `gender-family-test-${gender}`, gender }) })).status, 201);
    assert.equal(mutations.at(-1).body.gender, gender);
  }
  assert.deepEqual(failures, []);
  console.log('PASS real BFF: malformed/null genders422 before upstream mutation, anonymous401/crossorigin403, browser cannot disable required policy, familyM/W/X exact with no default; zero browser errors. No production writes.');
} catch (error) {
  if (currentPage && !currentPage.isClosed()) console.error(await currentPage.evaluate(() => ({ text: document.body.innerText.slice(-2000), inputs: [...document.querySelectorAll('#anmalan input')].map((node) => ({ name: node.name, value: node.value })), buttons: [...document.querySelectorAll('#anmalan button')].map((node) => ({ text: node.textContent, disabled: node.disabled })), selectors: [...document.querySelectorAll('select')].map((node) => ({ value: node.value, required: node.required })) })));
  console.error(output); throw error;
} finally {
  if (browser) await browser.close();
  site.kill('SIGTERM'); api.closeAllConnections(); await new Promise((resolve) => api.close(resolve));
}
