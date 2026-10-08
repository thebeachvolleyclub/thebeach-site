// Built-site + real Next BFF verification against a loopback-only synthetic App API.
// No production database, provider, email or API is used. The script owns and stops
// both temporary listeners. Run after npm run build -- --webpack, with the same
// PUPPETEER_MODULE and CHROME_PATH settings as the existing browser verifiers.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const { default: puppeteer } = await import(pathToFileURL(process.env.PUPPETEER_MODULE));
const parent = { id: 'family-browser-parent', canonical_player_id: 10, name: 'Parent Example', first_name: 'Parent', last_name: 'Example',
  email: 'parent@example.com', birthdate: '1980-01-01', emoji_icon: '🌊', swish_phone: '+46701234567',
  is_public: false, profile_complete: true, identity_status: 'active', identity_onboarding_v2_enabled: true,
  avatar_url: null, avatar_thumb_url: null, banner_url: null, description: null };
const existing = { ...parent, id: 'family-browser-existing', canonical_player_id: 30, name: 'Existing Child', first_name: 'Existing', last_name: 'Child', birthdate: '2015-01-01', emoji_icon: '☀️', swish_phone: null };
const created = { ...parent, id: 'family-browser-created', canonical_player_id: 40, name: 'New Child', first_name: 'New', last_name: 'Child', birthdate: '2016-01-01', emoji_icon: '🏐', swish_phone: null, profile_complete: false };
const all = new Map([[10, parent], [30, existing], [40, created]]);
let counter = 0, childCreated = false;
const tokens = new Map(), receipts = new Map(), createReceipts = new Map();
const mutations = [], failures = [];
const mint = (playerId, proven = true) => {
  const token = createHash('sha256').update(`synthetic-family-${++counter}`).digest('hex');
  tokens.set(token, { playerId, proven, revoked: false }); return token;
};
const api = createServer(async (request, response) => {
  try {
    const path = new URL(request.url, 'http://fixture').pathname;
    let raw = ''; for await (const chunk of request) raw += chunk;
    const body = raw ? JSON.parse(raw) : {};
    const token = String(request.headers.authorization ?? '').replace(/^Bearer /, '');
    const context = tokens.get(token);
    const json = (data, status = 200) => { response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); response.end(JSON.stringify(data)); };
    const deny = (code = 'FAMILY_ACCESS_DENIED', status = 403) => json({ detail: { code, message: 'Synthetic access denied' } }, status);
    if (request.method !== 'GET') mutations.push({ path, body, key: request.headers['idempotency-key'], playerId: context?.playerId });
    if (path.endsWith('/auth/request-code')) return json({ success: true });
    if (path.endsWith('/auth/verify-code')) {
      if (body.code !== '123456') return json({ detail: 'Synthetic wrong code' }, 401);
      return json({ success: true, identity_challenge: 'synthetic-private-choice', family_users: [existing, parent].map((user) => ({ id: String(user.canonical_player_id), player_id: user.canonical_player_id, name: user.name })) });
    }
    if (path.endsWith('/auth/select-identity')) {
      if (body.challenge !== 'synthetic-private-choice' || ![10, 30].includes(body.player_id)) return deny();
      return json({ success: true, user: all.get(body.player_id), auth_token: mint(body.player_id) });
    }
    if (path.endsWith('/family/switch')) {
      const prior = receipts.get(token), key = request.headers['idempotency-key'];
      if (prior) {
        if (prior.key !== key || prior.playerId !== body.player_id) return deny('SWITCH_ALREADY_COMPLETED', 409);
        if (tokens.get(prior.resultToken)?.revoked) return deny('VERIFIED_PERSON_REQUIRED', 401);
        return json({ success: true, user: all.get(prior.playerId), auth_token: prior.resultToken });
      }
      if (!context || context.revoked) return deny('VERIFIED_PERSON_REQUIRED', 401);
      if (!context.proven) return deny('FAMILY_EMAIL_VERIFICATION_REQUIRED');
      if (![10, 30, ...(childCreated ? [40] : [])].includes(body.player_id)) return deny();
      const resultToken = mint(body.player_id);
      receipts.set(token, { key, playerId: body.player_id, resultToken }); context.revoked = true;
      return json({ success: true, user: all.get(body.player_id), auth_token: resultToken });
    }
    if (!context || context.revoked) return deny('VERIFIED_PERSON_REQUIRED', 401);
    const user = all.get(context.playerId);
    if (path.endsWith('/auth/revoke-token')) { context.revoked = true; return json({ success: true }); }
    if (path.endsWith('/auth/me')) return json(user);
    if (path.endsWith('/family/profiles')) return json({ actor_player_id: 10, current_player_id: context.playerId, can_create_child: context.playerId === 10 && context.proven,
      requires_email_verification: false, shared_profiles_require_email_verification: !context.proven, contact_email: parent.email,
      profiles: [parent, ...(context.proven ? [existing] : []), ...(childCreated ? [created] : [])].map((item) => ({ ...item, player_id: item.canonical_player_id, relationship: item === parent ? 'self' : item === created ? 'child' : 'shared_email', is_current: context.playerId === item.canonical_player_id })) });
    if (path.endsWith('/family/children')) {
      if (!context.proven || context.playerId !== 10) return deny();
      const key = request.headers['idempotency-key'];
      const prior = createReceipts.get(key);
      if (prior && JSON.stringify(prior) !== JSON.stringify(body)) return deny('IDEMPOTENCY_KEY_REUSED', 409);
      if (body.expected_contact_email !== parent.email) return deny('FAMILY_CONTACT_CHANGED', 409);
      if (!body.parental_responsibility_confirmed) return deny('PARENT_CONFIRMATION_REQUIRED', 422);
      childCreated = true; createReceipts.set(key, body);
      return json({ child: { ...created, player_id: 40, relationship: 'child', is_current: false }, idempotent_replay: !!prior }, 201);
    }
    const label = context.playerId === 10 ? 'Parent' : 'Child';
    if (path === '/booking/memberships/mine') return json({ currentYear: 2026, activeCount: 1, memberships: [{ id: `membership-${context.playerId}`, productId: `product-${context.playerId}`, typeName: `${label} Membership Only`, category: context.playerId === 10 ? 'senior' : 'junior', year: 2026, paid: true, current: true, active: true, source: 'MATCHI', validFrom: '2026-01-01', validTo: '2026-12-31' }], purchaseOptions: [], purchases: [] });
    if (path === '/training/lookup') return json({ found: true, groups: [{ group_name: `${label} Training Only`, day_time: 'Tisdag 18:00', court: 1 }] });
    if (path === '/training/sessions') return json({ groups: [], sessions: [] });
    if (path === '/booking/mine') return json([{ id: `booking-${context.playerId}`, courtName: `${label} Court Only`, date: '2027-01-10', startTime: '18:00', endTime: '19:00', status: 'CONFIRMED', priceSek: 100 }]);
    if (path === '/training/invoices/mine') return json({ invoices: [], active_count: 0 });
    if (path.includes('/profile/emails')) return json({ addresses: [{ email: parent.email, is_primary: true }] });
    if (path.endsWith('/activity')) return json({ events: [], training_groups: [] });
    if (path.endsWith('/subscriptions/mine')) return json({ subscriptions: [] });
    if (path.endsWith('/competition-licence/request')) return json({ request: null, eligibility: { eligible: false } });
    if (path === '/matchmaking/users/me' && request.method === 'PUT') { Object.assign(user, body); return json(user); }
    if (path.endsWith('/lookup-rating')) return json({ status: 'not_found' });
    if (path === '/training/courses/mine') return json({ enrolments: [{ courseId: context.playerId, courseName: `${label} Course Only`, status: 'confirmed', paymentStatus: 'paid', createdAt: '2026-09-01' }] });
    if (request.method !== 'GET') return json({ success: true });
    return json({ subscriptions: [], enrolments: [], addresses: [], groups: [], events: [], training_groups: [] });
  } catch (error) { failures.push(error.message); response.writeHead(500); response.end('{}'); }
});
await new Promise((resolve) => api.listen(0, '127.0.0.1', resolve));
const portChooser = createServer(); await new Promise((resolve) => portChooser.listen(0, '127.0.0.1', resolve));
const sitePort = portChooser.address().port; await new Promise((resolve) => portChooser.close(resolve));
const origin = `http://localhost:${sitePort}`;
const site = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', 'localhost', '-p', String(sitePort)], {
  cwd: process.cwd(), env: { ...process.env, APP_API_URL: `http://127.0.0.1:${api.address().port}`, APP_API_KEY: 'synthetic-test-key', NEXT_TELEMETRY_DISABLED: '1' }, stdio: ['ignore', 'pipe', 'pipe'],
});
let siteOutput = '';
site.stdout.on('data', (chunk) => { siteOutput = (siteOutput + chunk).slice(-2000); });
site.stderr.on('data', (chunk) => { siteOutput = (siteOutput + chunk).slice(-2000); });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let browser, diagnosticPage;
const webStatuses = [];
async function click(page, label) {
  await page.bringToFront();
  await page.waitForFunction((value) => [...document.querySelectorAll('button')].some((node) => node.textContent.trim() === value && !node.disabled), {}, label);
  await page.evaluate((value) => [...document.querySelectorAll('button')].find((node) => node.textContent.trim() === value && !node.disabled).click(), label);
  await pause(100);
}
async function profile(page, name) {
  await page.waitForFunction((value) => [...document.querySelectorAll('h2')].some((node) => node.textContent.trim() === value), { polling: 'mutation' }, name);
}
async function choose(page, name) {
  await page.bringToFront();
  await page.waitForSelector(`button[aria-label="${name} · Byt profil"]`);
  await page.$eval(`button[aria-label="${name} · Byt profil"]`, (node) => node.click());
  await profile(page, name);
  await page.waitForSelector(`button[aria-label="${name} · Aktiv profil"]`);
}
async function text(page) { return page.evaluate(() => document.body.textContent); }
try {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(`${origin}/konto`)).ok) break; } catch { /* startup */ }
    if (attempt === 59) throw new Error(`local Next preview did not start: ${siteOutput}`);
    await pause(500);
  }
  browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  for (const width of [375, 1280]) {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    diagnosticPage = page;
    await page.setViewport({ width, height: 900 });
    await page.evaluateOnNewDocument(() => {
      // This synthetic browser declines optional cookies; keep consent UI from
      // covering the family-card screenshots without enabling external calls.
      localStorage.setItem('cookie_consent', 'denied');
    });
    page.on('pageerror', (error) => failures.push(error.message));
    page.on('response', (response) => { if (new URL(response.url()).pathname.startsWith('/api/account/')) webStatuses.push({ path: new URL(response.url()).pathname, status: response.status() }); });
    await page.setRequestInterception(true);
    let loseCreate = true;
    page.on('request', (request) => { void (async () => {
      const url = new URL(request.url());
      if (url.origin !== origin && !['data:', 'blob:'].includes(url.protocol)) return request.abort();
      if (url.pathname === '/api/account/family/children' && loseCreate) {
        loseCreate = false;
        const completed = await fetch(request.url(), { method: 'POST', headers: request.headers(), body: request.postData() });
        assert.equal(completed.status, 201); await completed.json(); return request.abort('failed');
      }
      return request.continue();
    })().catch((error) => { failures.push(error.message); void request.abort().catch(() => {}); }); });
    await context.setCookie({ name: 'tb_account_session', value: mint(10, false), domain: 'localhost', path: '/', httpOnly: true });
    childCreated = false; createReceipts.clear();
    await page.goto(`${origin}/konto#familj`, { waitUntil: 'domcontentloaded' });
    await profile(page, parent.name);
    assert.ok(!(await text(page)).includes(existing.name));
    await click(page, 'Skicka verifieringskod');
    await page.waitForSelector('input[aria-label="Verifieringskod"]');
    await page.type('input[aria-label="Verifieringskod"]', '000000');
    await click(page, 'Verifiera och visa profiler');
    await page.waitForFunction(() => document.body.textContent.includes('Synthetic wrong code'));
    await profile(page, parent.name);
    await page.click('input[aria-label="Verifieringskod"]', { clickCount: 3 });
    await page.keyboard.press('Backspace'); await page.type('input[aria-label="Verifieringskod"]', '123456');
    await click(page, 'Verifiera och visa profiler');
    await page.waitForSelector(`button[aria-label="${existing.name} · Byt profil"]`);
    await profile(page, parent.name);
    const sibling = await context.newPage();
    await sibling.setViewport({ width, height: 900 });
    sibling.on('pageerror', (error) => failures.push(error.message));
    await sibling.setRequestInterception(true);
    sibling.on('request', (request) => { const url = new URL(request.url()); void (url.origin === origin || ['data:', 'blob:'].includes(url.protocol) ? request.continue() : request.abort()); });
    await sibling.goto(`${origin}/konto#medlemskap`, { waitUntil: 'domcontentloaded' });
    diagnosticPage = sibling;
    await click(sibling, 'Medlemskap');
    await sibling.waitForFunction(() => document.body.textContent.includes('Parent Membership Only'));
    diagnosticPage = page;
    await page.evaluate(() => {
      sessionStorage.setItem('tb_course_attempt_123', 'parent-course-retry');
      localStorage.setItem('tb-competition-licence:2026', 'parent-license-retry');
    });
    await choose(page, existing.name);
    await profile(sibling, existing.name);
    await sibling.waitForFunction(() => document.body.textContent.includes('Child Membership Only'), { polling: 'mutation' });
    assert.ok(!(await text(sibling)).includes('Parent Membership Only'));
    assert.equal(await page.evaluate(() => sessionStorage.getItem('tb_course_attempt_123')), null);
    assert.equal(await page.evaluate(() => localStorage.getItem('tb-competition-licence:2026')), null);
    await click(page, 'Medlemskap'); await page.waitForFunction(() => document.body.textContent.includes('Child Membership Only'));
    assert.ok(!(await text(page)).includes('Parent Membership Only'));
    await click(page, 'Träningsgrupper'); await page.waitForFunction(() => document.body.textContent.includes('Child Training Only'));
    assert.ok(!(await text(page)).includes('Parent Training Only'));
    await click(page, 'Bokningar'); await page.waitForFunction(() => document.body.textContent.includes('Child Court Only'));
    assert.ok(!(await text(page)).includes('Parent Court Only'));
    await click(page, 'Kurser'); await page.waitForFunction(() => document.body.textContent.includes('Child Course Only'));
    assert.ok(!(await text(page)).includes('Parent Course Only'));
    await click(page, 'Profil');
    assert.equal(await page.evaluate(() => [...document.querySelectorAll('input')].some((node) => node.value === 'Existing')), true);
    await click(page, 'Familj'); await choose(page, parent.name);
    await profile(sibling, parent.name);
    assert.equal(await page.evaluate(() => sessionStorage.getItem('tb_course_attempt_123')), 'parent-course-retry');
    assert.equal(await page.evaluate(() => localStorage.getItem('tb-competition-licence:2026')), 'parent-license-retry');
    await click(page, 'Lägg till barn');
    await page.waitForSelector('input[aria-label="Barnets förnamn"]');
    await page.type('input[aria-label="Barnets förnamn"]', 'New'); await page.type('input[aria-label="Barnets efternamn"]', 'Child');
    await page.$eval('input[aria-label="Barnets födelsedatum"]', (node) => { const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(node, '2016-01-01'); node.dispatchEvent(new Event('input', { bubbles: true })); node.dispatchEvent(new Event('change', { bubbles: true })); });
    await page.select('select[aria-label="Kön"]', 'W'); await page.click('form input[type="checkbox"]');
    const before = mutations.filter((entry) => entry.path.endsWith('/family/children')).length;
    await click(page, 'Skapa barnprofil');
    await page.waitForFunction(() => [...document.querySelectorAll('[role="alert"]')].length > 0);
    await click(page, 'Skapa barnprofil');
    await page.waitForSelector(`button[aria-label="${created.name} · Byt profil"]`);
    await profile(page, parent.name);
    const attempts = mutations.filter((entry) => entry.path.endsWith('/family/children')).slice(before);
    assert.equal(attempts.length, 2); assert.equal(attempts[0].key, attempts[1].key); assert.deepEqual(attempts[0].body, attempts[1].body);
    await choose(page, created.name);
    await click(page, 'Profil'); await page.waitForFunction(() => [...document.querySelectorAll('input')].some((node) => node.value === 'New'));
    await click(page, 'Spara profil'); await page.waitForFunction(() => document.body.textContent.includes('Profilen är sparad'));
    await click(page, 'Familj'); await choose(page, parent.name);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    assert.equal(overflow, false);
    await page.screenshot({ path: `/tmp/site-family-parity-${width}.png`, fullPage: true });
    await (await page.$('section[aria-busy]')).screenshot({ path: `/tmp/site-family-parity-card-${width}.png` });
    const cookies = await context.cookies(origin, `${origin}/api/account/family/switch`);
    for (const cookie of cookies.filter((item) => ['tb_account_session', 'tb_account_family_switch'].includes(item.name))) {
      assert.equal(cookie.httpOnly, true); assert.equal(cookie.secure, true);
    }
    assert.ok(!(await page.evaluate(() => document.cookie)).includes('tb_account_session'));
    const denied = await page.evaluate(async () => {
      const response = await fetch('/api/account/family/switch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ playerId: 999, idempotencyKey: 'unrelated-profile-request' }) }); return response.status;
    }); assert.equal(denied, 403);
    const source = cookies.find((item) => item.name === 'tb_account_session').value;
    const crossOrigin = await fetch(`${origin}/api/account/family/children`, { method: 'POST', headers: { Origin: 'https://unrelated.example.com', Cookie: `tb_account_session=${source}`, 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(crossOrigin.status, 403);
    const chosen = await page.evaluate(async () => {
      const response = await fetch('/api/account/family/switch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ playerId: 30, idempotencyKey: 'http-response-replay-001' }) }); return { status: response.status, body: await response.json() };
    }); assert.deepEqual(chosen, { status: 200, body: { authenticated: true } });
    const recovered = await page.evaluate(async () => {
      const response = await fetch('/api/account/family/switch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ playerId: 30, idempotencyKey: 'http-response-replay-001' }) }); return { status: response.status, body: await response.json() };
    }); assert.deepEqual(recovered, chosen);
    assert.equal(receipts.has(source), true);
    await page.reload({ waitUntil: 'domcontentloaded' }); await profile(page, existing.name);
    await click(page, 'Logga ut'); await page.waitForFunction(() => document.body.textContent.includes('Logga in eller skapa konto'));
    await sibling.waitForFunction(() => document.body.textContent.includes('Logga in eller skapa konto'), { polling: 'mutation' });
    const anonymous = await page.evaluate(async () => (await fetch('/api/account/family/profiles')).status); assert.equal(anonymous, 401);
    assert.ok(!(await text(page)).includes(existing.name));
    if (width === 1280) {
      await page.type('input[autocomplete="email"]', parent.email); await click(page, 'Skicka kod');
      await page.type('input[autocomplete="one-time-code"]', '123456'); await click(page, 'Logga in');
      await page.waitForFunction(() => document.body.textContent.includes('Vem loggar in?'));
      await page.evaluate((name) => [...document.querySelectorAll('button')].find((node) => node.textContent.includes(name) && !node.disabled).click(), parent.name);
      await profile(page, parent.name);
    }
    await context.close();
    console.log(`PASS ${width}px real BFF: legacy proof/current ID, implicit switch/back, isolated feeds/drafts and other tabs, child-create replay/onboarding, HttpOnly switch replay, denials and logout`);
  }
  assert.deepEqual(failures, []);
  console.log('No production writes, provider calls or real emails.');
} catch (error) {
  if (diagnosticPage && !diagnosticPage.isClosed()) {
    console.error(JSON.stringify({ fixtureUi: await diagnosticPage.evaluate(() => ({ headings: [...document.querySelectorAll('h2,h3,h4')].map((node) => node.textContent), alerts: [...document.querySelectorAll('[role="alert"]')].map((node) => node.textContent), codeValue: document.querySelector('input[aria-label="Verifieringskod"]')?.value, panels: [...document.querySelectorAll('section.bg-cream')].map((node) => node.innerText.slice(-1000)) })),
      cookieAttributes: (await diagnosticPage.cookies()).map(({ name, secure, httpOnly, path }) => ({ name, secure, httpOnly, path })),
      fixtureSteps: mutations.slice(-20).map(({ path, playerId }) => ({ path, playerId })), webStatuses: webStatuses.slice(-20), failures }));
  }
  throw error;
} finally {
  if (browser) await browser.close();
  site.kill('SIGTERM'); api.closeAllConnections(); await new Promise((resolve) => api.close(resolve));
}
