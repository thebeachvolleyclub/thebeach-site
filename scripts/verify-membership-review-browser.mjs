// Actual built AccountPortal, fictional intercepted BFF only. No real account,
// provider/payment operation, email or database mutation is permitted.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const { default: puppeteer } = await import(pathToFileURL(process.env.PUPPETEER_MODULE ?? '/home/henric/thebeach-app-v2/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'));
const chooser = createServer(); await new Promise(resolve => chooser.listen(0, '127.0.0.1', resolve));
const port = chooser.address().port; await new Promise(resolve => chooser.close(resolve));
const origin = `http://localhost:${port}`;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', 'localhost', '-p', String(port)], { cwd: process.cwd(), stdio: ['ignore', 'ignore', 'ignore'] });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const option = (year, available) => ({ productId: `senior-${year}`, typeName: `Senior ${year}`, category: 'senior', year, priceOre: 35000, vatBasisPoints: 600, validFrom: `${year}-01-01`, validTo: `${year}-12-31`, available, unavailableReason: available ? null : 'not_available' });
const evidence = { id: 'profixio:990000105:2026', productId: 'evidence:profixio:2026', typeName: 'Medlemskap 2026 – bekräftat via Profixio', category: 'senior', year: 2026, venueName: 'The Beach', validFrom: '2026-01-01', validTo: '2026-12-31', status: 'CONFIRMED', paid: true, active: true, current: true, readOnly: true, source: 'NATIVE', membershipEvidenceSource: 'PROFIXIO', amountOre: null, purchasedAt: null, paymentMethod: null, paymentReference: null };
const scenarios = [
  { records: [evidence], blocked: [], options: [option(2027, true)], expected: 'Din aktiva Profixio-licens bekräftar medlemskapet' },
  { records: [], blocked: [], options: [option(2026, true)], expected: 'du kan köpa ett nytt medlemskap' },
  { records: [], blocked: [2026], options: [option(2026, false), option(2027, true)], expected: 'för 2026 så att du inte betalar två gånger' },
];
let browser;
try {
  for (let attempt = 0; attempt < 60; attempt++) { try { if ((await fetch(`${origin}/konto`)).ok) break; } catch {} if (attempt === 59) throw new Error('startup'); await pause(500); }
  browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  for (const width of [320, 390, 1280]) {
    for (const [index, scenario] of scenarios.entries()) {
      const context = await browser.createBrowserContext(); const page = await context.newPage();
      await page.setViewport({ width, height: 900 }); page.setDefaultTimeout(20000);
      await page.evaluateOnNewDocument(() => localStorage.setItem('cookie_consent', 'denied'));
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.setRequestInterception(true);
      page.on('request', request => { void (async () => {
        const url = new URL(request.url());
        if (['data:', 'blob:'].includes(url.protocol)) return request.continue();
        if (url.origin !== origin) return request.abort();
        if (!url.pathname.startsWith('/api/')) return request.continue();
        assert.equal(request.method(), 'GET', 'No business mutation in browser verification');
        const answer = body => request.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
        if (url.pathname === '/api/account/session') return answer({ authenticated: true, profile: { id: 'membership-browser', canonical_player_id: 990000105, name: 'Synthetic Player', email: 'membership@example.test', first_name: 'Synthetic', last_name: 'Player', birthdate: '1980-01-01', emoji_icon: '☀️', is_public: false, profile_complete: true, identity_status: 'active', identity_onboarding_v2_enabled: true } });
        if (url.pathname === '/api/account/membership') return answer({ currentYear: 2026, activeCount: scenario.records.length, memberships: scenario.records, purchaseOptions: scenario.options, purchases: [], purchase: null, membershipCheckStatus: 'NEEDS_REVIEW', membershipReview: { status: 'NEEDS_REVIEW', blockedYears: scenario.blocked }, purchaseEligibility: { available: true, reason: null } });
        if (url.pathname === '/api/account/competition-licence') return answer({ request: null, eligibility: { eligible: false }, competition_licences: [] });
        if (url.pathname === '/api/account/family/profiles') return answer({ profiles: [] });
        if (url.pathname === '/api/account/training') return answer({ found: false, groups: [] });
        if (url.pathname === '/api/account/invoices') return answer({ invoices: [], active_count: 0 });
        if (url.pathname === '/api/booking/mine') return answer([]);
        if (url.pathname === '/api/account/profile/emails') return answer({ addresses: [] });
        if (url.pathname === '/api/account/activity') return answer({ events: [], training_groups: [] });
        if (url.pathname === '/api/courses/mine') return answer({ enrolments: [] });
        return answer({ subscriptions: [], groups: [], sessions: [] });
      })().catch(error => { errors.push(error.message); void request.abort().catch(() => {}); }); });
      await page.goto(`${origin}/konto#medlemskap`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(expected => document.body.textContent.includes(expected), {}, scenario.expected);
      const text = await page.evaluate(() => document.body.textContent);
      assert.ok(!text.includes('innan du kan betala'));
      if (scenario.records.length) {
        assert.ok(text.includes('Bekräftat genom Profixio'));
        assert.ok(!text.includes('Betalningsreferens'));
      }
      assert.ok(text.includes('Senior 2027') || scenario.options[0].year === 2026);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no horizontal overflow');
      assert.deepEqual(errors, []);
      await page.screenshot({ path: `/tmp/hq315-site-membership-${index}-${width}.png`, fullPage: true });
      await context.close();
    }
    console.log(`PASS ${width}px membership evidence/review: confirmed membership visible, unpaid-year purchase available, possible prior payment protected, no fabricated payment details, zero API writes`);
  }
} finally { if (browser) await browser.close(); server.kill('SIGTERM'); }
