/**
 * /api/dopyt — príjem dopytového formulára
 *
 * Vercel Serverless Function, Node runtime.
 *
 * ══════════════════════════════════════════════════════════════════
 *  PREČO TAKTO
 *
 *  Formulár neposiela dáta priamo tretej strane. Ide cez našu funkciu,
 *  takže validácia, antispam aj tvar e-mailu zostávajú pod kontrolou
 *  a dajú sa zmeniť bez zásahu do frontendu.
 *
 *  Resend sa volá cez REST cez fetch — projekt tak zostáva bez jedinej
 *  npm závislosti, rovnako ako samotný build.
 *
 *  Funkcia NIKDY nepredstiera úspech. Ak nie je nastavený kľúč alebo
 *  odoslanie zlyhá, vráti chybu a frontend to používateľovi povie.
 * ══════════════════════════════════════════════════════════════════
 *
 *  Premenné prostredia (Vercel → Settings → Environment Variables).
 *  VŠETKY TRI SÚ POVINNÉ. Žiadna nemá fallback — pri chýbajúcej vráti
 *  funkcia 503 a napíše do logu, ktorá chýba.
 *
 *    RESEND_API_KEY   kľúč z resend.com
 *    INQUIRY_TO       kam chodia dopyty, napr. elevator@elevatorservis.sk
 *    INQUIRY_FROM     odosielateľ; musí byť na doméne overenej v Resende,
 *                     napr. "ELEVÁTOR SERVIS <web@elevatorservis.sk>"
 *
 *  Produkčnú hodnotu INQUIRY_FROM určuje klient. Nie je nikde v kóde.
 */

import { company } from '../data/company.js';
import { inquiryTypes, objectTypes } from '../data/services.js';
import { forms } from '../data/forms.js';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/**
 * Konfigurácia sa číta pri každej požiadavke a NEMÁ žiadny fallback.
 *
 * Skorší variant dosadzoval za chýbajúci INQUIRY_FROM a INQUIRY_TO
 * e-mail z dátovej vrstvy. Znamenalo to, že zle nakonfigurované
 * nasadenie odosielalo z adresy, ktorú nikto vedome nenastavil —
 * a nikto sa to nedozvedel. Radšej čestne zlyhať.
 */
function readConfig() {
  const cfg = {
    apiKey: (process.env.RESEND_API_KEY || '').trim(),
    to: (process.env.INQUIRY_TO || '').trim(),
    from: (process.env.INQUIRY_FROM || '').trim(),
  };
  const missing = [];
  if (!cfg.apiKey) missing.push('RESEND_API_KEY');
  if (!cfg.to) missing.push('INQUIRY_TO');
  if (!cfg.from) missing.push('INQUIRY_FROM');
  return { ...cfg, missing };
}

/** Z „Meno <adresa@doména>" vytiahne samotnú adresu. */
function bareAddress(value) {
  const match = String(value).match(/<([^>]+)>/);
  return (match ? match[1] : String(value)).trim().toLowerCase();
}

const LIMITS = {
  meno: 120,
  firma: 160,
  telefon: 40,
  email: 160,
  mesto: 120,
  typObjektu: 40,
  pocetVytahov: 6,
  typPoziadavky: 40,
  sprava: 4000,
};

/**
 * Limity príloh.
 *
 * Vercel obmedzuje telo požiadavky na ~4,5 MB. Súbory idú v base64,
 * čo objem nafúkne asi o tretinu, preto je strop zámerne nižší.
 */
const ATTACH = {
  maxFiles: forms.attachments.maxFiles,
  maxFileBytes: forms.attachments.maxSizeMb * 1024 * 1024,
  maxTotalBytes: 3 * 1024 * 1024,
  allowed: new Set(forms.attachments.accept.split(',').map((t) => t.trim())),
};

/**
 * Typ súboru sa určuje z obsahu, nie z prípony ani z toho, čo tvrdí
 * prehliadač. Oboje si útočník nastaví ľubovoľne.
 */
const SIGNATURES = [
  { mime: 'image/jpeg', ext: 'jpg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    mime: 'image/png',
    ext: 'png',
    test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  {
    mime: 'image/webp',
    ext: 'webp',
    test: (b) =>
      b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  },
  {
    mime: 'application/pdf',
    ext: 'pdf',
    test: (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46,
  },
];

function sniffType(base64) {
  let head;
  try {
    head = Buffer.from(base64.slice(0, 64), 'base64');
  } catch {
    return null;
  }
  if (head.length < 12) return null;
  return SIGNATURES.find((s) => s.test(head)) || null;
}

/**
 * Názov súboru zbavený všetkého, čo do neho nepatrí.
 *
 * Namiesto zoznamu zakázaných znakov je tu zoznam POVOLENÝCH — písmená,
 * číslice, medzera, bodka, pomlčka a podčiarkovník. Cesty ani riadiace
 * znaky sa cez to nedostanú a nezávisí to na tom, či sa v zdrojáku
 * správne zapísali únikové sekvencie.
 *
 * Prípona sa NEPREBERÁ zo vstupu — dosadí sa podľa zisteného typu,
 * takže „faktura.pdf.exe“ skončí ako „faktura.pdf“.
 */
function safeFilename(name, ext) {
  const base =
    String(name)
      .replace(/[^\p{L}\p{N} ._-]+/gu, ' ')
      .replace(/\.[a-z0-9]{1,8}$/i, '')
      .replace(/[.\s]+/g, ' ')
      .trim()
      .slice(0, 80) || 'priloha';
  return `${base}.${ext}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^\+?[\d\s()/-]{9,20}$/;

/**
 * Rate limit — BEST-EFFORT, NIE DISTRIBUOVANÝ.
 *
 * Počítadlo žije v pamäti JEDNEJ serverless inštancie. Vercel spúšťa
 * inštancií viac naraz a po čase ich recykluje, takže:
 *
 *   – útočník, ktorého požiadavky padnú na rôzne inštancie, dostane
 *     až N × MAX_PER_WINDOW pokusov namiesto MAX_PER_WINDOW,
 *   – po studenom štarte je počítadlo prázdne,
 *   – limit sa NEDÁ použiť ako bezpečnostná záruka a nesmie sa tak
 *     ani opisovať v dokumentácii.
 *
 * Je to lacná brzda proti primitívnemu zaplaveniu z jednej IP, nič viac.
 * Skutočnú ochranu formulára robia dve iné veci, ktoré od stavu
 * inštancie nezávisia:
 *
 *   1. honeypot (skryté pole „website“), ktoré vyplní len robot,
 *   2. minimálny čas vyplnenia (forms.antispam.minFillSeconds).
 *
 * Ak by spam prerástol, riešením je perzistentné počítadlo (KV / Redis)
 * alebo Vercel BotID. Oboje je zmena rozsahu a platená služba — bez
 * odsúhlasenia klientom sa nezavádza. Viac: docs/DEPLOYMENT.md.
 */
const seen = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip) {
  const now = Date.now();
  const hits = (seen.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  seen.set(ip, hits);

  if (seen.size > 500) {
    for (const [key, times] of seen) {
      if (!times.some((t) => now - t < WINDOW_MS)) seen.delete(key);
    }
  }
  return hits.length > MAX_PER_WINDOW;
}

const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max);

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function labelOf(list, value) {
  const found = list.find((o) => o.value === value);
  return found ? found.label : value;
}

/**
 * Validácia na serveri.
 *
 * Zrkadlí pravidlá z static/js/form.js — klientskej validácii sa nedá
 * veriť, dá sa obísť. Je kontextovo citlivá: kariérny formulár
 * nevykresľuje mesto ani typ požiadavky, takže ich nesmie vyžadovať.
 */
function validate(d, isCareer) {
  const errors = [];

  if (!d.meno) errors.push('meno');
  if (!d.sprava || d.sprava.length < 10) errors.push('sprava');
  if (d.suhlas !== true) errors.push('suhlas');

  if (!isCareer) {
    if (!d.mesto) errors.push('mesto');
    if (!d.typPoziadavky) errors.push('typPoziadavky');
  }

  if (!d.telefon && !d.email) errors.push('kontakt');
  if (d.email && !EMAIL_RE.test(d.email)) errors.push('email');
  if (d.telefon && !PHONE_RE.test(d.telefon)) errors.push('telefon');
  if (d.pocetVytahov && !(Number(d.pocetVytahov) > 0)) errors.push('pocetVytahov');

  return errors;
}

/**
 * Prílohy: fotografia výťahu a výrobného štítku.
 * Prichádzajú ako base64 v JSON tele. Kontroluje sa počet, typ aj objem.
 */
function normaliseAttachments(raw) {
  if (!forms.attachments.enabled || !Array.isArray(raw) || raw.length === 0) {
    return { files: [], error: null };
  }
  if (raw.length > ATTACH.maxFiles) {
    return { files: [], error: 'too_many_files' };
  }

  const files = [];
  let total = 0;

  for (const f of raw) {
    const name = clean(f && f.name, 160);
    const content = typeof (f && f.content) === 'string' ? f.content.replace(/\s/g, '') : '';

    if (!name || !content || !/^[A-Za-z0-9+/]+={0,2}$/.test(content.slice(0, 256))) {
      return { files: [], error: 'invalid_attachment' };
    }

    // Dĺžka base64 → približná veľkosť v bajtoch. Kontroluje sa PRED
    // dekódovaním, aby veľký vstup nič nealokoval.
    const bytes = Math.floor((content.length * 3) / 4);
    if (bytes > ATTACH.maxFileBytes) return { files: [], error: 'attachment_too_large' };

    total += bytes;
    if (total > ATTACH.maxTotalBytes) return { files: [], error: 'attachments_too_large' };

    // Typ z obsahu, nie z prípony ani z hlavičky prehliadača.
    const sig = sniffType(content);
    if (!sig || !ATTACH.allowed.has(sig.mime)) {
      return { files: [], error: 'attachment_type' };
    }

    files.push({ filename: safeFilename(name, sig.ext), content });
  }

  return { files, error: null };
}

function buildEmail(d, attachmentCount) {
  const rows = [
    ['Meno', d.meno],
    ['Firma / SVB / správca', d.firma],
    ['Telefón', d.telefon],
    ['E-mail', d.email],
    ['Mesto', d.mesto],
    ['Typ objektu', d.typObjektu ? labelOf(objectTypes, d.typObjektu) : ''],
    ['Počet výťahov', d.pocetVytahov],
    ['Typ požiadavky', d.typPoziadavky ? labelOf(inquiryTypes, d.typPoziadavky) : ''],
  ].filter(([, v]) => v);

  if (attachmentCount) rows.push(['Prílohy', `${attachmentCount} súbor(y) v prílohe`]);

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
    `\n\nPopis požiadavky:\n${d.sprava}\n\n---\nOdoslané z ${d._stranka || '/kontakt/'} dňa ${new Date().toLocaleString('sk-SK')}`;

  const html = `<!DOCTYPE html><html lang="sk"><body style="margin:0;background:#f3f1ec;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#23292f">
<div style="max-width:640px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden">
  <div style="background:#12161c;padding:20px 24px">
    <div style="height:3px;width:48px;background:#ffc61a;margin-bottom:12px"></div>
    <div style="color:#fff;font-size:18px;font-weight:bold">Nový dopyt z webu</div>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    ${rows
      .map(
        ([k, v]) => `<tr>
      <td style="padding:10px 24px;border-bottom:1px solid #e6e2da;color:#5b6670;width:180px">${escapeHtml(k)}</td>
      <td style="padding:10px 24px;border-bottom:1px solid #e6e2da;font-weight:bold">${escapeHtml(v)}</td>
    </tr>`
      )
      .join('')}
  </table>
  <div style="padding:18px 24px">
    <div style="color:#5b6670;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Popis požiadavky</div>
    <div style="font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(d.sprava)}</div>
  </div>
  <div style="padding:14px 24px;background:#f3f1ec;color:#5b6670;font-size:12px">
    Odoslané z ${escapeHtml(d._stranka || '/kontakt/')} · ${escapeHtml(new Date().toLocaleString('sk-SK'))}
  </div>
</div>
</body></html>`;

  const subject = `Dopyt z webu — ${d.mesto || 'neuvedené'}${
    d.typPoziadavky ? ' · ' + labelOf(inquiryTypes, d.typPoziadavky) : ''
  }`;

  return { subject, text, html };
}

/**
 * Automatická odpoveď zákazníkovi.
 *
 * Zámerne NESĽUBUJE čas odpovede — taký záväzok klient pre bežné dopyty
 * nepotvrdil. Potvrdzuje prijatie a odlišuje bežný dopyt od havárie.
 *
 * Havarijné číslo sa berie výhradne z data/company.js. Ak by ho klient
 * nemal potvrdené (`emergency.enabled === false` alebo prázdne číslo),
 * odstavec o havárii sa vykreslí bez čísla — číslo sa nevymýšľa.
 *
 * E-mail zámerne neobsahuje žiadny údaj od zákazníka. Nie je čo escapovať
 * a potvrdenie sa nedá zneužiť na odraz cudzieho obsahu.
 */
function emergencyLine() {
  const enabled = company.emergency && company.emergency.enabled;
  const phone = enabled ? String(company.contact.emergencyPhone || '').trim() : '';
  return phone || null;
}

function buildConfirmation() {
  const phone = emergencyLine();
  const domain = String(company.siteUrl || '').replace(/^https?:\/\//, '').replace(/\/$/, '');

  const emergencyText = phone
    ? `V prípade havarijnej situácie alebo ak vo výťahu uviazla osoba, nepoužívajte webový formulár a volajte priamo havarijnú linku ${phone}.`
    : 'V prípade havarijnej situácie alebo ak vo výťahu uviazla osoba, nepoužívajte webový formulár a kontaktujte nás telefonicky.';

  const text = `Dobrý deň,

ďakujeme za váš dopyt.

Vaša správa bola úspešne doručená spoločnosti ${company.legalName} a budeme sa jej venovať čo najskôr.

Ak ste nám poslali informácie o konkrétnom výťahu, poruche alebo požiadavke na servis, ozveme sa vám po ich preverení prostredníctvom kontaktných údajov, ktoré ste uviedli vo formulári.

${emergencyText}

Ďakujeme za dôveru.

${company.legalName}
${domain}

Toto je automatická potvrdzovacia správa. Na túto správu nie je potrebné odpovedať.`;

  const html = `<!DOCTYPE html>
<html lang="sk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ďakujeme za váš dopyt</title>
</head>
<body style="margin:0;padding:0;background:#f3f1ec;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f1ec;">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:100%;max-width:560px;background:#ffffff;border:1px solid #e4e0d8;border-radius:8px;">
        <tr>
          <td style="padding:28px 28px 0 28px;">
            <div style="height:4px;width:56px;background:#ffc61a;border-radius:2px;"></div>
            <h1 style="margin:18px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:20px;line-height:1.3;color:#12161c;font-weight:bold;">
              Ďakujeme za váš dopyt
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 28px 4px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#262e37;">
            <p style="margin:0 0 14px 0;">Dobrý deň,</p>
            <p style="margin:0 0 14px 0;">ďakujeme za váš dopyt.</p>
            <p style="margin:0 0 14px 0;">
              Vaša správa bola úspešne doručená spoločnosti
              <strong style="color:#12161c;">${company.legalName}</strong>
              a budeme sa jej venovať čo najskôr.
            </p>
            <p style="margin:0 0 20px 0;">
              Ak ste nám poslali informácie o konkrétnom výťahu, poruche alebo požiadavke
              na servis, ozveme sa vám po ich preverení prostredníctvom kontaktných údajov,
              ktoré ste uviedli vo formulári.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fff6df;border-left:4px solid #ffc61a;border-radius:0 6px 6px 0;">
              <tr>
                <td style="padding:14px 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#262e37;">
                  <strong style="color:#12161c;">Havarijná situácia</strong><br>
                  Ak vo výťahu uviazla osoba alebo ide o haváriu, nečakajte na odpoveď
                  na tento formulár${
                    phone
                      ? ` a volajte priamo havarijnú linku
                  <a href="tel:${phone.replace(/\s+/g, '')}" style="color:#12161c;font-weight:bold;text-decoration:underline;">${phone}</a>.`
                      : ' a kontaktujte nás telefonicky.'
                  }
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 28px 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#262e37;">
            <p style="margin:0;">Ďakujeme za dôveru.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 28px 24px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="border-top:1px solid #e4e0d8;padding-top:16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#12161c;">
                  <strong>${company.legalName}</strong><br>
                  <a href="${company.siteUrl}" style="color:#5b6670;text-decoration:none;">${domain}</a>
                </td>
              </tr>
              <tr>
                <td style="padding-top:14px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#5b6670;">
                  Toto je automatická potvrdzovacia správa.
                  Na túto správu nie je potrebné odpovedať.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  return { subject: `Ďakujeme za váš dopyt – ${company.name}`, text, html };
}

async function sendViaResend(apiKey, payload) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend ${response.status}: ${detail}`);
  }
  return response;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};

  /* Honeypot sa vyhodnocuje ako prvý — pred kontrolou konfigurácie aj
     pred rate limitom. Bot tak nikdy nezistí, v akom stave server je.
     Odpovedáme 200, aby si myslel, že uspel. */
  if (clean(body.website, 200)) {
    return res.status(200).json({ ok: true });
  }

  /* Konfigurácia. Chýbajúca premenná = čestné zlyhanie, nie tichá
     náhrada. Názov chýbajúcej premennej vraciame zámerne — nie je to
     tajomstvo a bez neho sa chyba ladí naslepo. */
  const cfg = readConfig();
  if (cfg.missing.length) {
    console.error('[dopyt] chýba konfigurácia:', cfg.missing.join(', '), '— dopyt sa neodoslal.');
    return res
      .status(503)
      .json({ ok: false, error: 'not_configured', missing: cfg.missing });
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  const isCareer = clean(body._kontext, 20) === 'kariera';

  const data = {
    meno: clean(body.meno, LIMITS.meno),
    firma: clean(body.firma, LIMITS.firma),
    telefon: clean(body.telefon, LIMITS.telefon),
    email: clean(body.email, LIMITS.email),
    mesto: clean(body.mesto, LIMITS.mesto),
    typObjektu: clean(body.typObjektu, LIMITS.typObjektu),
    pocetVytahov: clean(body.pocetVytahov, LIMITS.pocetVytahov),
    typPoziadavky: clean(body.typPoziadavky, LIMITS.typPoziadavky),
    sprava: clean(body.sprava, LIMITS.sprava),
    suhlas: body.suhlas === true || body.suhlas === 'true',
    _stranka: clean(body._stranka, 200),
  };

  const errors = validate(data, isCareer);
  if (errors.length) {
    return res.status(400).json({ ok: false, error: 'validation_failed', fields: errors });
  }

  const { files, error: attachError } = normaliseAttachments(body.prilohy);
  if (attachError) {
    return res.status(400).json({ ok: false, error: attachError });
  }

  const mail = buildEmail(data, files.length);

  try {
    await sendViaResend(cfg.apiKey, {
      from: cfg.from,
      to: [cfg.to],
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      reply_to: data.email || undefined,
      attachments: files.length ? files : undefined,
    });
  } catch (err) {
    console.error('[dopyt] odoslanie do firmy zlyhalo:', err.message);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }

  /* Automatické potvrdenie zákazníkovi.
     Dve poistky:
     1. Zlyhanie tu NESMIE zhodiť požiadavku — dopyt už firma dostala,
        takže z pohľadu odosielateľa je odoslanie úspešné. Iba sa zaloguje.
     2. Ak zadal adresu, ktorá je zároveň naša schránka alebo odosielateľ,
        potvrdenie sa neposiela — inak by sme písali sami sebe a pri
        zapnutej automatickej odpovedi by vznikla slučka. */
  const customer = data.email.toLowerCase();
  const ours = new Set([bareAddress(cfg.to), bareAddress(cfg.from)]);

  if (data.email && !ours.has(customer)) {
    try {
      const confirm = buildConfirmation(data);
      await sendViaResend(cfg.apiKey, {
        from: cfg.from,
        to: [data.email],
        subject: confirm.subject,
        text: confirm.text,
        html: confirm.html,
        reply_to: cfg.to,
      });
    } catch (err) {
      console.error(
        '[dopyt] dopyt DORUČENÝ firme, ale potvrdenie zákazníkovi zlyhalo:',
        err.message
      );
    }
  } else if (data.email) {
    console.warn('[dopyt] potvrdenie preskočené — adresa zákazníka je naša vlastná.');
  }

  return res.status(200).json({ ok: true });
}

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
