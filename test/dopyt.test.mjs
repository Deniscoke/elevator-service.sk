/**
 * Test dopytového endpointu bez siete a bez závislostí.
 *
 *   node test/dopyt.test.mjs
 *
 * Resend sa podvrhne cez globalThis.fetch, takže sa nič neodosiela.
 * Testuje sa presne to, čo sa nedá overiť z prehliadača: správanie
 * servera pri zlej konfigurácii, podvrhnutých prílohách a zlyhaní API.
 */

const results = [];
let sent = [];
let failNext = null;

/** Podvrhnutý Resend. */
globalThis.fetch = async (url, opts) => {
  const payload = JSON.parse(opts.body);
  sent.push(payload);
  if (failNext === 'all' || (failNext === 'confirm' && sent.length === 2)) {
    return { ok: false, status: 422, text: async () => 'simulovane zlyhanie' };
  }
  return { ok: true, status: 200, text: async () => '{}' };
};

function mockRes() {
  const res = {
    statusCode: null,
    body: null,
    headers: {},
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

const b64 = (bytes) => Buffer.from(bytes).toString('base64');
const PNG = b64([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, ...Array(64).fill(0)]);
const JPG = b64([0xff, 0xd8, 0xff, 0xe0, ...Array(64).fill(0)]);
const EXE = b64([0x4d, 0x5a, 0x90, 0x00, ...Array(64).fill(0)]);
/** Platný JPEG s veľkosťou 2,5 MB — prekračuje limit, ale je to korektný base64. */
const BIG_JPG = (() => {
  const buf = Buffer.alloc(2_500_000);
  buf.set([0xff, 0xd8, 0xff, 0xe0], 0);
  return buf.toString('base64');
})();

const VALID = {
  meno: 'Ján Novák',
  email: 'jan@example.sk',
  mesto: 'Zvolen',
  typPoziadavky: 'oprava',
  sprava: 'Výťah zastavuje mimo roviny podlažia.',
  suhlas: true,
};

function check(name, condition, detail = '') {
  results.push({ name, pass: !!condition, detail });
}

async function call(body, { method = 'POST', env = {}, ip = '1.2.3.4' } = {}) {
  const previous = {};
  for (const [k, v] of Object.entries(env)) {
    previous[k] = process.env[k];
    if (v === null) delete process.env[k];
    else process.env[k] = v;
  }
  // Modul číta env pri každej požiadavke, takže stačí jeden import.
  const { default: handler } = await import('../api/dopyt.js');
  const res = mockRes();
  await handler(
    { method, body, headers: { 'x-forwarded-for': ip }, socket: {} },
    res
  );
  for (const [k, v] of Object.entries(previous)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  return res;
}

const FULL_ENV = {
  RESEND_API_KEY: 're_test_key',
  INQUIRY_TO: 'elevator@elevatorservis.sk',
  INQUIRY_FROM: 'ELEVÁTOR SERVIS <web@elevatorservis.sk>',
};

async function run() {
  // 1. GET
  let r = await call({}, { method: 'GET', env: FULL_ENV });
  check('GET vráti 405', r.statusCode === 405 && r.headers.Allow === 'POST');

  // 2. chýbajúca konfigurácia — každá premenná zvlášť
  r = await call(VALID, { env: { ...FULL_ENV, RESEND_API_KEY: null } });
  check(
    'chýbajúci RESEND_API_KEY → 503 + názov premennej',
    r.statusCode === 503 && r.body.missing?.includes('RESEND_API_KEY'),
    JSON.stringify(r.body)
  );

  r = await call(VALID, { env: { ...FULL_ENV, INQUIRY_TO: null } });
  check(
    'chýbajúci INQUIRY_TO → 503 + názov premennej',
    r.statusCode === 503 && r.body.missing?.includes('INQUIRY_TO'),
    JSON.stringify(r.body)
  );

  r = await call(VALID, { env: { ...FULL_ENV, INQUIRY_FROM: null } });
  check(
    'chýbajúci INQUIRY_FROM → 503, žiadna náhrada',
    r.statusCode === 503 && r.body.missing?.includes('INQUIRY_FROM'),
    JSON.stringify(r.body)
  );

  // 3. honeypot — pred kontrolou konfigurácie, aby bot nezistil stav
  r = await call({ ...VALID, website: 'spam' }, { env: { RESEND_API_KEY: null } });
  check('honeypot → 200 aj bez konfigurácie', r.statusCode === 200 && r.body.ok === true);

  // 4. validácia
  r = await call({ meno: '', sprava: 'x' }, { env: FULL_ENV, ip: '9.9.9.1' });
  check(
    'nevalidné polia → 400 so zoznamom',
    r.statusCode === 400 && r.body.error === 'validation_failed' && r.body.fields.length >= 3,
    JSON.stringify(r.body.fields)
  );

  r = await call({ ...VALID, email: '', telefon: '' }, { env: FULL_ENV, ip: '9.9.9.2' });
  check('bez kontaktu → 400', r.statusCode === 400 && r.body.fields.includes('kontakt'));

  // 5. telefón bez e-mailu prejde
  sent = [];
  r = await call(
    { ...VALID, email: '', telefon: '+421 905 111 222' },
    { env: FULL_ENV, ip: '9.9.9.3' }
  );
  check('telefón bez e-mailu → 200', r.statusCode === 200);
  check('bez e-mailu sa neposiela potvrdenie', sent.length === 1, `odoslaných: ${sent.length}`);

  // 6. štandardný dopyt
  sent = [];
  r = await call(VALID, { env: FULL_ENV, ip: '9.9.9.4' });
  check('štandardný dopyt → 200', r.statusCode === 200);
  check('odošlú sa dva e-maily', sent.length === 2, `odoslaných: ${sent.length}`);
  check('notifikácia ide na INQUIRY_TO', sent[0]?.to?.[0] === FULL_ENV.INQUIRY_TO);
  check('notifikácia má from = INQUIRY_FROM', sent[0]?.from === FULL_ENV.INQUIRY_FROM);
  check('Reply-To notifikácie je zákazník', sent[0]?.reply_to === VALID.email);
  check('potvrdenie ide zákazníkovi', sent[1]?.to?.[0] === VALID.email);
  check('Reply-To potvrdenia je firma', sent[1]?.reply_to === FULL_ENV.INQUIRY_TO);

  // 7. ochrana proti slučke
  sent = [];
  await call({ ...VALID, email: FULL_ENV.INQUIRY_TO }, { env: FULL_ENV, ip: '9.9.9.5' });
  check('zákazník = naša schránka → potvrdenie sa neposiela', sent.length === 1);

  // 8. prílohy
  sent = [];
  r = await call(
    { ...VALID, prilohy: [{ name: '../../evil.exe', type: 'application/pdf', content: PNG }] },
    { env: FULL_ENV, ip: '9.9.9.6' }
  );
  check('príloha sa prijme podľa OBSAHU, nie podľa typu z prehliadača', r.statusCode === 200);
  check(
    'názov je očistený a prípona vynútená z obsahu',
    sent[0]?.attachments?.[0]?.filename === 'evil.png',
    sent[0]?.attachments?.[0]?.filename
  );

  r = await call(
    { ...VALID, prilohy: [{ name: 'foto.png', type: 'image/png', content: EXE }] },
    { env: FULL_ENV, ip: '9.9.9.7' }
  );
  check(
    'spustiteľný súbor vydávaný za PNG → 400',
    r.statusCode === 400 && r.body.error === 'attachment_type',
    JSON.stringify(r.body)
  );

  r = await call(
    { ...VALID, prilohy: [{ name: 'velky.jpg', content: BIG_JPG }] },
    { env: FULL_ENV, ip: '9.9.9.8' }
  );
  check(
    'príloha nad 2 MB → 400',
    r.statusCode === 400 && r.body.error === 'attachment_too_large',
    JSON.stringify(r.body)
  );

  r = await call(
    {
      ...VALID,
      prilohy: [
        { name: 'a.png', content: PNG },
        { name: 'b.png', content: PNG },
        { name: 'c.png', content: PNG },
        { name: 'd.png', content: PNG },
      ],
    },
    { env: FULL_ENV, ip: '9.9.9.9' }
  );
  check('viac než 3 súbory → 400', r.statusCode === 400 && r.body.error === 'too_many_files');

  // Súčet príloh nad 3 MB, aj keď každá jednotlivo limit spĺňa.
  const MID_JPG = (() => {
    const buf = Buffer.alloc(1_600_000);
    buf.set([0xff, 0xd8, 0xff, 0xe0], 0);
    return buf.toString('base64');
  })();
  r = await call(
    {
      ...VALID,
      prilohy: [
        { name: 'a.jpg', content: MID_JPG },
        { name: 'b.jpg', content: MID_JPG },
      ],
    },
    { env: FULL_ENV, ip: '9.9.9.10' }
  );
  check(
    'súčet príloh nad 3 MB → 400',
    r.statusCode === 400 && r.body.error === 'attachments_too_large',
    JSON.stringify(r.body)
  );

  // 9. kariérny kontext nevyžaduje mesto ani typ požiadavky
  r = await call(
    { meno: 'Test', email: 't@e.sk', sprava: 'Mám záujem o prácu technika.', suhlas: true, _kontext: 'kariera' },
    { env: FULL_ENV, ip: '9.9.10.1' }
  );
  check('kariérny formulár nevyžaduje mesto → 200', r.statusCode === 200, JSON.stringify(r.body));

  // 10. zlyhanie Resendu
  sent = [];
  failNext = 'all';
  r = await call(VALID, { env: FULL_ENV, ip: '9.9.10.2' });
  check('zlyhanie notifikácie → 502, žiadny falošný úspech', r.statusCode === 502 && r.body.ok === false);
  failNext = null;

  sent = [];
  failNext = 'confirm';
  r = await call(VALID, { env: FULL_ENV, ip: '9.9.10.3' });
  check('zlyhanie potvrdenia nezmaže prijatý dopyt → 200', r.statusCode === 200 && r.body.ok === true);
  failNext = null;

  // 11. rate limit
  let limited = false;
  for (let i = 0; i < 7; i++) {
    const rr = await call(VALID, { env: FULL_ENV, ip: '7.7.7.7' });
    if (rr.statusCode === 429) limited = true;
  }
  check('7 rýchlych požiadaviek z jednej IP → 429', limited);

  // výpis
  const failed = results.filter((r) => !r.pass);
  for (const r of results) {
    console.log(`${r.pass ? '  OK  ' : ' FAIL '} ${r.name}${r.detail ? '  — ' + r.detail : ''}`);
  }
  console.log(`\n${results.length - failed.length}/${results.length} prešlo.`);
  process.exit(failed.length ? 1 : 0);
}

run();
