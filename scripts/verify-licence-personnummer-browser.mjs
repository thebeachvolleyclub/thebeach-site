// Built website UI against intercepted fictional BFF responses. Every API is
// intercepted; no production API, personal record, email or provider is used.
// Build first: npm run build -- --webpack. PUPPETEER_MODULE and CHROME_PATH can
// override the same existing local browser/dependency paths as other verifiers.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const { default: puppeteer } = await import(pathToFileURL(process.env.PUPPETEER_MODULE ?? '/home/henric/thebeach-app-v2/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'));
const portChooser = createServer(); await new Promise((resolve) => portChooser.listen(0, '127.0.0.1', resolve));
const port = portChooser.address().port; await new Promise((resolve) => portChooser.close(resolve));
const origin = `http://localhost:${port}`;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', 'localhost', '-p', String(port)], { cwd: process.cwd(), stdio: ['ignore', 'ignore', 'ignore'] });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let browser, step = 'startup';
const sample = (() => { const prefix = '19900101001'; const sum = [...prefix.slice(2)].reduce((total, digit, i) => { const n = Number(digit) * (i % 2 === 0 ? 2 : 1); return total + (n > 9 ? n - 9 : n); }, 0); return prefix + String((10 - sum % 10) % 10); })();
const formatted = `${sample.slice(0, 8)}-${sample.slice(8)}`;
async function click(page, label) {
  await page.waitForFunction((label) => [...document.querySelectorAll('button')].some((node) => node.textContent.trim() === label && !node.disabled), { polling: 'mutation' }, label);
  await page.evaluate((label) => [...document.querySelectorAll('button')].find((node) => node.textContent.trim() === label && !node.disabled).click(), label);
}
async function open(page) { await click(page, 'Begär tävlingslicens'); await page.waitForSelector('input[aria-label="Personnummer för tävlingslicens"]'); }
async function assertPrivate(page) {
  const stored = await page.evaluate(() => ['localStorage', 'sessionStorage'].flatMap((kind) => { const storage = window[kind]; return Array.from({ length: storage.length }, (_, i) => `${storage.key(i)}:${storage.getItem(storage.key(i))}`); }).join('\n'));
  assert.ok(!stored.includes(sample) && !stored.includes(formatted), 'private number never stored');
}
try {
  for (let attempt = 0; attempt < 60; attempt++) { try { if ((await fetch(`${origin}/konto`)).ok) break; } catch {} if (attempt === 59) throw new Error('startup'); await pause(500); }
  browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  for (const width of [320, 390, 1280]) {
    step = `${width}px form`;
    const context = await browser.createBrowserContext(); const page = await context.newPage();
    page.setDefaultTimeout(20_000); await page.setViewport({ width, height: 900 });
    await page.evaluateOnNewDocument(() => localStorage.setItem('cookie_consent', 'denied'));
    let loggedIn = true, requestState = null, failNext = true, slowNext = false, person = 10;
    const posts = [], errors = [], mutations = [];
    const profile = () => ({ id: `licence-browser-${person}`, canonical_player_id: person, name: person === 10 ? 'Licence Parent' : 'Licence Child', email: 'licence@example.com', first_name: 'Licence', last_name: person === 10 ? 'Parent' : 'Child', birthdate: person === 10 ? '1980-04-05' : '2014-05-06', emoji_icon: '☀️', swish_phone: null, is_public: false, profile_complete: true, identity_status: 'active', identity_onboarding_v2_enabled: true });
    const licence = () => ({ request: requestState, eligibility: { eligible: !requestState, membershipYear: 2026, membershipType: 'Senior 2026' }, competition_licences: [] });
    page.on('pageerror', () => errors.push('pageerror'));
    await page.setRequestInterception(true);
    page.on('request', (request) => { void (async () => {
      const url = new URL(request.url());
      if (url.origin !== origin && !['data:', 'blob:'].includes(url.protocol)) return request.abort();
      if (!url.pathname.startsWith('/api/')) return request.continue();
      const answer = (data, status = 200) => request.respond({ status, contentType: 'application/json', headers: { 'Cache-Control': 'no-store' }, body: JSON.stringify(data) });
      if (request.method() !== 'GET') mutations.push(url.pathname);
      if (url.pathname === '/api/account/session') return answer(loggedIn ? { authenticated: true, profile: profile() } : { authenticated: false });
      if (url.pathname === '/api/account/membership') return answer({ currentYear: 2026, activeCount: 2, memberships: [2026, 2027].map((year) => ({ id: `${person}-${year}`, productId: String(year), typeName: `Membership ${year}`, category: person === 10 ? 'senior' : 'junior', year, paid: true, current: year === 2026, active: true, source: 'MATCHI', validFrom: `${year}-01-01`, validTo: `${year}-12-31` })), purchaseOptions: [], purchases: [] });
      if (url.pathname === '/api/account/competition-licence') {
        if (request.method() === 'GET') return answer(licence());
        const body = JSON.parse(request.postData()); posts.push(body);
        assert.equal(body.personnummer, sample); assert.ok(body.idempotencyKey);
        if (slowNext) { slowNext = false; await pause(1500); return answer({ request: { id: 9, membership_year: 2026, membership_type: 'Senior 2026', status: 'pending', created_at: '2026-10-08T12:00:00Z' } }); }
        await pause(250);
        if (failNext) { failNext = false; return answer({ detail: 'Synthetic safe failure' }, 503); }
        requestState = { id: 8, membership_year: 2026, membership_type: 'Senior 2026', status: 'pending', created_at: '2026-10-08T12:00:00Z' }; return answer({ request: requestState });
      }
      if (url.pathname === '/api/account/family/profiles') return answer({ actor_player_id: 10, current_player_id: person, can_create_child: person === 10, requires_email_verification: false, shared_profiles_require_email_verification: false, contact_email: 'licence@example.com', profiles: [10, 30].map((id) => ({ player_id: id, name: id === 10 ? 'Licence Parent' : 'Licence Child', relationship: id === 10 ? 'self' : 'shared_email', is_current: person === id, emoji_icon: '☀️', is_public: false })) });
      if (url.pathname === '/api/account/family/switch') { person = JSON.parse(request.postData()).playerId; requestState = null; return answer({ authenticated: true }); }
      if (url.pathname === '/api/account/auth/logout') { loggedIn = false; return answer({ success: true }); }
      if (url.pathname === '/api/account/training') return answer({ found: false, groups: [] });
      if (url.pathname === '/api/account/training-recordings') return answer({ groups: [], sessions: [] });
      if (url.pathname === '/api/account/invoices') return answer({ invoices: [], active_count: 0 });
      if (url.pathname === '/api/booking/mine') return answer([]);
      if (url.pathname === '/api/account/profile/emails') return answer({ addresses: [] });
      if (url.pathname === '/api/account/activity') return answer({ events: [], training_groups: [] });
      if (url.pathname === '/api/courses/mine') return answer({ enrolments: [] });
      if (request.method() !== 'GET') { errors.push('unexpected-write'); return request.abort(); }
      return answer({ subscriptions: [] });
    })().catch(() => { void request.abort().catch(() => {}); }); });
    await page.goto(`${origin}/konto#medlemskap`, { waitUntil: 'domcontentloaded' });
    await open(page);
    assert.ok(await page.evaluate(() => document.activeElement?.getAttribute('aria-label') === 'Personnummer för tävlingslicens'));
    assert.equal(await page.$('button[aria-label="Begär tävlingslicens 2027"]'), null);
    await page.type('input[aria-label="Personnummer för tävlingslicens"]', sample.slice(2));
    await click(page, 'Skicka licensbegäran'); await page.waitForSelector('input[aria-invalid="true"]'); assert.equal(posts.length, 0);
    await click(page, 'Avbryt'); await open(page);
    assert.equal(await page.$eval('input[aria-label="Personnummer för tävlingslicens"]', (node) => node.value), '');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no horizontal overflow');
    await page.screenshot({ path: `/tmp/hq310-licence-form-${width}.png`, fullPage: true }); // empty input only
    await (await page.$('form[aria-label="Begär tävlingslicens 2026"]')).screenshot({ path: `/tmp/hq310-licence-form-card-${width}.png` });
    await page.type('input[aria-label="Personnummer för tävlingslicens"]', formatted); await assertPrivate(page);
    await click(page, 'Profil'); await click(page, 'Medlemskap'); await open(page);
    assert.equal(await page.$eval('input[aria-label="Personnummer för tävlingslicens"]', (node) => node.value), '');
    await page.type('input[aria-label="Personnummer för tävlingslicens"]', `  ${formatted}  `);
    await page.evaluate(() => { const form = document.querySelector('input[aria-label="Personnummer för tävlingslicens"]').form; form.requestSubmit(); form.requestSubmit(); });
    await page.waitForFunction(() => document.body.textContent.includes('Ange personnumret igen'));
    assert.equal(posts.length, 1); assert.equal(await page.$eval('input[aria-label="Personnummer för tävlingslicens"]', (node) => node.value), ''); await assertPrivate(page);
    await page.type('input[aria-label="Personnummer för tävlingslicens"]', sample); await click(page, 'Skicka licensbegäran');
    await page.waitForFunction(() => document.body.textContent.includes('Väntar på hantering'));
    assert.equal(posts.length, 2); assert.equal(posts[0].idempotencyKey, posts[1].idempotencyKey);
    assert.equal(await page.$('input[aria-label="Personnummer för tävlingslicens"]'), null); await assertPrivate(page);
    requestState = null; slowNext = true; await page.reload({ waitUntil: 'domcontentloaded' }); await open(page);
    await page.type('input[aria-label="Personnummer för tävlingslicens"]', sample); await click(page, 'Skicka licensbegäran');
    await click(page, 'Familj'); await page.waitForSelector('button[aria-label="Licence Child · Byt profil"]');
    await page.$eval('button[aria-label="Licence Child · Byt profil"]', (node) => node.click());
    await page.waitForFunction(() => [...document.querySelectorAll('h2')].some((node) => node.textContent === 'Licence Child'), { polling: 'mutation' });
    await click(page, 'Medlemskap'); await open(page); await pause(1800);
    assert.equal(await page.$eval('input[aria-label="Personnummer för tävlingslicens"]', (node) => node.value), '');
    assert.ok(!(await page.evaluate(() => document.body.textContent)).includes('Väntar på hantering'), 'old-account result absent'); await assertPrivate(page);
    await page.type('input[aria-label="Personnummer för tävlingslicens"]', sample);
    const navigation = page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await click(page, 'Logga ut'); await navigation;
    await page.waitForFunction(() => document.body.textContent.includes('Logga in eller skapa konto'));
    assert.ok(!(await page.evaluate(() => document.body.textContent)).includes(sample)); await assertPrivate(page);
    assert.deepEqual(errors, []); assert.ok(mutations.every((path) => ['/api/account/competition-licence', '/api/account/family/switch', '/api/account/auth/logout'].includes(path)));
    await page.close(); await context.close();
    console.log(`PASS ${width}px form: full-number validation, focus, close/unmount/logout privacy, normalized submit, single-flight same-key retry, annual gating, stale-account isolation`);
  }
} catch { console.error(`FAIL ${step}`); process.exitCode = 1; }
finally { if (browser) await browser.close(); server.kill('SIGTERM'); }
