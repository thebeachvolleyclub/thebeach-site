// Synthetic browser verification against the built site; all API requests are intercepted.
// SITE_CREDIT_PREVIEW=http://127.0.0.1:3982 PUPPETEER_MODULE=/path/to/puppeteer-core.js CHROME_PATH=/path/to/chrome node scripts/verify-subscription-credit-browser.mjs
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const { default: puppeteer } = await import(pathToFileURL(process.env.PUPPETEER_MODULE));
const origin = process.env.SITE_CREDIT_PREVIEW ?? 'http://127.0.0.1:3982';
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Stockholm' });
const future = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
const errors = [];
async function click(page, text) {
  await page.waitForFunction((needle) => [...document.querySelectorAll('button,summary')].some((node) => node.textContent.trim().includes(needle) && !node.disabled), {}, text).catch(async (error) => { console.error(`Missing ${text}:`, await page.evaluate(() => document.body.innerText)); await page.screenshot({ path: '/tmp/hq339-site-browser-failure.png', fullPage: true }); throw error; });
  await page.evaluate((needle) => [...document.querySelectorAll('button,summary')].find((node) => node.textContent.trim().includes(needle) && !node.disabled).click(), text);
}
async function fixture({ balance = 70200, phone = '+46701234567', failCredit = false, conflict = false, lostResponse = false, authRetry = false, recoveryState = null, uncertainResponse = null } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluateOnNewDocument(() => localStorage.setItem('cookie_consent', 'denied'));
  const calls = [], quotes = [];
  let released = false, paid = false, conflicted = false, lost = false, authExpired = false;
  const booking = { id: 'booking-1', courtName: 'Bana 1', date: today, startTime: '18:00', endTime: '19:00', priceSek: 780, status: ['pending', 'pending-new', 'awaiting-verification'].includes(recoveryState) ? 'PENDING_PAYMENT' : recoveryState === 'refunded' ? 'CANCELLED' : recoveryState ? 'EXPIRED' : 'CONFIRMED', paymentStatus: recoveryState === 'refunded' ? 'REFUNDED' : recoveryState === 'paid-expired' ? 'PAID' : 'UNPAID' };
  if (recoveryState && recoveryState !== 'pending-new') await page.evaluateOnNewDocument((date) => sessionStorage.setItem('tb-booking-attempt:synthetic-owner', JSON.stringify({ ownerId: 'synthetic-owner', courtName: 'Bana 1', bookingId: 'booking-1', body: { venueId: 'venue-1', courtId: 'court-1', date, startTime: '18:00', quoteId: 'saved-original-quote', streamRequested: false, paymentProvider: 'SWISH', useStoredValue: false, expectedStoredValueAppliedOre: 0, expectedRemainingAmountOre: 78000, clientReference: 'saved-exact-attempt' } })), today);
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('dialog', (dialog) => dialog.accept());
  await page.setRequestInterception(true);
  page.on('request', async (request) => {
    const url = new URL(request.url());
    if (url.origin !== origin) return request.respond({ status: 200, contentType: request.resourceType() === 'script' ? 'application/javascript' : 'text/html', body: request.resourceType() === 'script' ? '' : '<html><body>Mock payment provider</body></html>' });
    if (!url.pathname.startsWith('/api/')) return request.continue();
    const path = url.pathname;
    const payload = request.postData() ? JSON.parse(request.postData()) : undefined;
    if (request.method() === 'POST') calls.push({ path, payload });
    const json = (body, status = 200) => request.respond({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (path === '/api/account/session') return json({ authenticated: true, profile: { id: 'synthetic-owner', name: 'Credit Browser', first_name: 'Credit', last_name: 'Browser', birthdate: '1990-01-01', email: 'credit@example.test', swish_phone: phone, emoji_icon: '🏐', is_public: false, identity_status: 'active' } });
    if (path === '/api/account/subscriptions/credits') return failCredit ? json({ detail: 'Unavailable' }, 503) : json({ totalAvailableOre: balance, credits: [{ id: 'credit-1', venueId: 'venue-1', venueName: 'The Beach', status: 'ACTIVE', balanceOre: balance, availableOre: balance, validFrom: '2026-01-01T00:00:00', expiresAt: '2027-09-21T23:59:59' }] });
    if (path === '/api/account/subscriptions') return json({ subscriptions: [{ id: 'subscription-1', status: 'ACTIVE', termName: 'HT 2026', startsOn: '2026-08-31', endsOn: '2026-12-20', seriesName: 'Måndag', courtName: 'Bana 1', startTime: '18:00', totalPriceOre: 1248000, occurrences: [{ id: 'occurrence-1', bookingId: 'original-booking', status: released ? 'RELEASED' : 'SCHEDULED', date: future, startTime: '18:00', courtName: 'Bana 1' }] }] });
    if (path.endsWith('/occurrence-1/release')) { released = true; return json({ occurrenceId: 'occurrence-1', status: 'RELEASED' }); }
    if (path === '/api/booking/config') return json({ enabled: true, stripeEnabled: true });
    if (path === '/api/booking/venues') return json([{ id: 'venue-1' }]);
    if (path === '/api/booking/mine') return json(paid ? [booking] : []);
    if (path === '/api/booking/availability') return json({ slots: [{ courtId: 'court-1', courtName: 'Bana 1', environment: 'INDOOR', cameraEnabled: false, startTime: '18:00', endTime: '19:00', durationMin: 60, priceSek: 780, available: true }] });
    if (path === '/api/booking/quotes') {
      let used = payload.useStoredValue ? Math.min(balance, 78000) : 0;
      if (payload.paymentProvider === 'STRIPE' && 78000 - used > 0 && 78000 - used < 300) used = 77700;
      const quote = { quoteId: `quote-${quotes.length + 1}`, priceSek: 780, storedValueAppliedOre: used, remainingAmountOre: 78000 - used, expiresAt: new Date(Date.now() + 60000).toISOString() };
      quotes.push({ payload, quote }); return json(quote);
    }
    if (path === '/api/booking/checkout') {
      if (uncertainResponse) return json(uncertainResponse.body, uncertainResponse.status);
      if (lostResponse && !lost) { lost = true; paid = true; return request.abort('failed'); }
      if (authRetry && !authExpired) { authExpired = true; return json({ detail: 'Logga in igen' }, Number(authRetry) || 401); }
      if (conflict && !conflicted) { conflicted = true; balance = 60000; return json({ detail: { message: 'Tillgodohavandet har ändrats. Kontrollera beloppen igen.', code: 'SUBSCRIPTION_CREDIT_CHANGED' } }, 409); }
      paid = true;
      const quote = quotes.find((entry) => entry.quote.quoteId === payload.quoteId)?.quote;
      assert.ok(quote, 'checkout must use a displayed quote');
      if (payload.useStoredValue) {
        assert.equal(payload.expectedStoredValueAppliedOre, quote.storedValueAppliedOre);
        assert.equal(payload.expectedRemainingAmountOre, quote.remainingAmountOre);
      }
      return json({ bookingId: 'booking-1', status: quote.remainingAmountOre ? 'PENDING_PAYMENT' : 'CONFIRMED', storedValueAppliedOre: quote.storedValueAppliedOre, remainingAmountOre: quote.remainingAmountOre, checkoutUrl: payload.paymentProvider === 'STRIPE' && quote.remainingAmountOre ? 'https://checkout.stripe.com/synthetic' : undefined });
    }
    if (path === '/api/booking/booking-1') {
      if (process.env.SITE_CREDIT_DEBUG) console.log('STATUS', recoveryState, booking.status, booking.paymentStatus);
      return json({ booking, paymentStatus: ['paid-expired', 'refunded'].includes(recoveryState) ? 'PAID' : ['pending', 'pending-new'].includes(recoveryState) ? 'CREATED' : 'VERIFYING', paymentReviewRequired: recoveryState === 'review-expired', paymentVerificationPending: !!recoveryState });
    }
    if (request.method() !== 'GET') throw new Error(`Unexpected mutation ${path}`);
    return json({ invoices: [], groups: [], addresses: [], events: [], memberships: [], enrolments: [], recordings: [] });
  });
  return { page, calls, quotes, released: () => released, complete: () => { booking.status = 'CONFIRMED'; booking.paymentStatus = 'PAID'; } };
}
async function choose(page) {
  await page.goto(`${origin}/boka`, { waitUntil: 'networkidle0' });
  await click(page, '18:00–19:00');
  await click(page, 'Bana 1');
  await page.waitForFunction(() => [...document.querySelectorAll('button')].some((node) => node.textContent.includes('780')) && !document.body.innerText.includes('Kontrollerar pris och tillgodohavande…'));
}
async function useCredit(page) {
  await page.waitForSelector('input[type=checkbox]');
  await page.$eval('input[type=checkbox]', (input) => { if (!input.checked) input.click(); });
  await page.waitForFunction(() => document.querySelector('input[type=checkbox]')?.checked === true);
}
try {
  if (!process.env.SITE_CREDIT_AUTH_ONLY) {
  {
    const { page, calls, released } = await fixture();
    await page.goto(`${origin}/konto#abonnemang`, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.body.innerText.includes('702') && document.body.innerText.includes('2027-09-21'));
    await click(page, 'Visa och hantera mina tider'); await click(page, 'Frigör tiden');
    await page.waitForFunction(() => document.body.innerText.includes('Frigjord · väntar på återförsäljning'));
    assert.equal(released(), true); assert.equal(calls.filter((call) => call.path.endsWith('/release')).length, 1);
    await page.close(); console.log('PASS account balance, expiry and release');
  }
  for (const options of [{ balance: 70200 }, { balance: 78000, phone: null }, { balance: 70200, conflict: true }]) {
    const { page, calls } = await fixture(options); await choose(page); await useCredit(page);
    await click(page, options.balance === 78000 ? 'Boka med tillgodohavande' : '78 kr');
    if (options.conflict) {
      await page.waitForFunction(() => document.body.innerText.includes('Tillgodohavandet har ändrats'));
      assert.equal(calls.filter((call) => call.path.endsWith('/checkout')).length, 1);
      await click(page, '180 kr');
    }
    await page.waitForFunction(() => document.body.textContent.includes('Vi ses i sanden!'), { timeout: 10000 }).catch(async (error) => { console.error(JSON.stringify(calls)); console.error(await page.evaluate(() => document.body.innerText)); throw error; });
    const final = calls.filter((call) => call.path.endsWith('/checkout')).at(-1).payload;
    assert.equal(final.useStoredValue, true);
    assert.equal(final.expectedStoredValueAppliedOre, options.conflict ? 60000 : options.balance);
    await page.close(); console.log(`PASS ${options.conflict ? 'changed credit requires fresh confirmation' : options.phone === null ? 'full credit without Swish phone' : 'credit plus Swish remainder'}`);
  }
  for (const options of [{ failCredit: true }, { balance: 0 }]) {
    const { page, calls } = await fixture(options); await choose(page); await click(page, '780 kr');
    await page.waitForFunction(() => document.body.textContent.includes('Vi ses i sanden!'), { timeout: 10000 }).catch(async (error) => { console.error(JSON.stringify(calls)); console.error(await page.evaluate(() => document.body.innerText)); throw error; });
    assert.equal(calls.find((call) => call.path.endsWith('/checkout')).payload.useStoredValue, false);
    await page.close(); console.log('PASS ordinary Swish with no usable credit');
  }
  {
    const { page, calls } = await fixture({ balance: 77900 }); await choose(page); await useCredit(page);
    await page.waitForFunction(() => document.body.innerText.includes('debiteras minst 3 kr'));
    await click(page, 'Övriga betalningsmetoder'); await click(page, 'Kort, Apple Pay eller Google Pay');
    await page.waitForFunction(() => location.hostname === 'checkout.stripe.com');
    const final = calls.find((call) => call.path.endsWith('/checkout')).payload;
    assert.equal(final.paymentProvider, 'STRIPE'); assert.equal(final.expectedStoredValueAppliedOre, 77700); assert.equal(final.expectedRemainingAmountOre, 300);
    await page.close(); console.log('PASS Stripe remainder and minimum charge quote');
  }
  }
  for (const authRetry of process.env.SITE_CREDIT_AUTH_ONLY ? [401, 403] : [false, 401, 403]) {
    const { page, calls } = await fixture({ lostResponse: true, authRetry }); await choose(page); await useCredit(page); await click(page, '78 kr');
    const original = calls.find((call) => call.path.endsWith('/checkout')).payload;
    if (authRetry) {
      await page.waitForFunction(() => document.body.textContent.includes('Logga in igen för att kontrollera'));
      assert.equal(await page.evaluate(() => !!sessionStorage.getItem('tb-booking-attempt:synthetic-owner')), true);
      // A new authenticated session automatically resumes the same attempt.
      await page.reload({ waitUntil: 'networkidle0' });
    }
    await page.waitForFunction(() => document.body.textContent.includes('Vi ses i sanden!'));
    const attempts = calls.filter((call) => call.path.endsWith('/checkout'));
    assert.equal(attempts.length, authRetry ? 3 : 2); for (const attempt of attempts) assert.deepEqual(attempt.payload, original);
    await page.close(); console.log(authRetry ? `PASS ${authRetry} auth preserves original attempt for sign-in recovery` : 'PASS lost response automatically retries exact original attempt');
  }
  {
    const { page, calls, complete } = await fixture({ recoveryState: 'pending-new' });
    await choose(page); await click(page, '780 kr');
    await page.waitForFunction(() => document.body.innerText.includes('Öppna Swish-appen på din telefon'));
    assert.equal(calls.filter((call) => call.path.endsWith('/checkout')).length, 1);
    complete(); await page.waitForFunction(() => document.body.textContent.includes('Vi ses i sanden!')).catch(async (error) => { console.error(await page.evaluate(() => document.body.innerText)); throw error; });
    await page.close(); console.log('PASS normal Swish asks to approve existing request and confirms automatically');
  }
  for (const recoveryState of ['pending', 'awaiting-verification', 'review-expired', 'paid-expired', 'refunded']) {
    const { page, calls } = await fixture({ recoveryState });
    await page.goto(`${origin}/boka`, { waitUntil: 'networkidle0' });
    const expected = recoveryState === 'review-expired' ? 'måste kontrolleras av receptionen' : recoveryState === 'paid-expired' ? 'kommit in men bokningen är inte bekräftad' : recoveryState === 'refunded' ? 'har återbetalats' : 'uppdateras automatiskt';
    await page.waitForFunction((text) => document.body.innerText.includes(text), {}, expected);
    if (recoveryState !== 'refunded') assert.equal(await page.$eval('section[role=status]', (panel) => getComputedStyle(panel).color), 'rgb(20, 22, 15)', 'recovery text must contrast its white background');
    if (recoveryState === 'paid-expired') assert.equal(await page.evaluate(() => document.querySelector('section[role=status]').textContent.includes('Kvar att betala')), false, 'received payment must not be described as outstanding');
    assert.equal(await page.evaluate(() => document.body.innerText.includes('Öppna Swish-appen på din telefon')), recoveryState === 'pending');
    assert.equal(calls.filter((call) => call.path.endsWith('/checkout')).length, 0, 'Known booking must read status, never replay checkout');
    assert.equal(await page.evaluate(() => !!sessionStorage.getItem('tb-booking-attempt:synthetic-owner')), recoveryState !== 'refunded');
    if (recoveryState !== 'refunded') {
      await click(page, 'Uppdatera status');
      assert.equal(calls.filter((call) => call.path.endsWith('/checkout')).length, 0);
    }
    await page.screenshot({ path: `/tmp/hq339-site-${recoveryState}.png`, fullPage: true });
    await page.close(); console.log(`PASS known ${recoveryState} status recovery without another checkout`);
  }
  for (const uncertainResponse of [{ status: 429, body: { detail: 'Slow down' } }, { status: 409, body: { detail: 'Payment outcome not yet known' } }, { status: 200, body: {} }, { status: 200, body: { bookingId: '' } }]) {
    const { page, calls } = await fixture({ uncertainResponse });
    await choose(page); await click(page, '780 kr');
    await page.waitForFunction(() => document.body.innerText.includes('Vi kan inte hämta besked just nu'), { timeout: 30000 });
    const attempts = calls.filter((call) => call.path.endsWith('/checkout'));
    assert.equal(attempts.length, 6, 'one authorized submit plus five bounded exact retries');
    for (const attempt of attempts) assert.deepEqual(attempt.payload, attempts[0].payload);
    assert.equal(new Set(attempts.map((attempt) => attempt.payload.clientReference)).size, 1, 'no second allocation key');
    assert.equal(await page.evaluate(() => !!sessionStorage.getItem('tb-booking-attempt:synthetic-owner')), true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    assert.equal(calls.filter((call) => call.path.endsWith('/checkout')).length, 6, 'malformed success cannot reset the retry budget');
    await page.close(); console.log(`PASS uncertain ${uncertainResponse.status}/${JSON.stringify(uncertainResponse.body)} keeps same attempt with bounded retries`);
  }
  {
    const { page, calls } = await fixture({ recoveryState: 'review-expired' });
    await page.goto(`${origin}/en/book`, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.body.innerText.includes('Reception must check the payment. Do not start another payment.'));
    await click(page, 'Refresh status');
    assert.equal(calls.filter((call) => call.path.endsWith('/checkout')).length, 0);
    await page.close(); console.log('PASS English financial-review copy and optional refresh');
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
