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
 *  Premenné prostredia (Vercel → Settings → Environment Variables):
 *    RESEND_API_KEY   povinné — kľúč z resend.com
 *    INQUIRY_TO       nepovinné — kam chodia dopyty
 *    INQUIRY_FROM     nepovinné — odosielateľ na doméne overenej v Resende
 */

import { company } from '../data/company.js';
import { inquiryTypes, objectTypes } from '../data/services.js';
import { forms } from '../data/forms.js';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

const TO = process.env.INQUIRY_TO || company.contact.email;

/**
 * Odosielateľ.
 *
 * Žiadna vymyslená adresa — bez nastavenej premennej sa použije jediný
 * potvrdený firemný e-mail z dátovej vrstvy. Ten musí byť v Resende
 * na overenej doméne, inak Resend odoslanie odmietne a funkcia vráti 502.
 */
const FROM = process.env.INQUIRY_FROM || `${company.legalName} <${company.contact.email}>`;

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^\+?[\d\s()/-]{9,20}$/;

/**
 * Najjednoduchší možný rate limit.
 *
 * Serverless inštancie sú krátkodobé a je ich viac, takže toto nie je
 * spoľahlivá obrana — je to lacná brzda proti jednoduchému zaplaveniu
 * z jednej IP. Skutočnú ochranu robí honeypot a validácia.
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
    const type = clean(f && f.type, 80);
    const content = typeof (f && f.content) === 'string' ? f.content : '';

    if (!name || !content) return { files: [], error: 'invalid_attachment' };
    if (!ATTACH.allowed.has(type)) return { files: [], error: 'attachment_type' };

    // Dĺžka base64 → približná veľkosť v bajtoch.
    const bytes = Math.floor((content.length * 3) / 4);
    if (bytes > ATTACH.maxFileBytes) return { files: [], error: 'attachment_too_large' };

    total += bytes;
    if (total > ATTACH.maxTotalBytes) return { files: [], error: 'attachments_too_large' };

    files.push({ filename: name, content });
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
 * Zámerne nesľubuje čas odpovede — taký záväzok klient pre bežné dopyty
 * nepotvrdil. Potvrdzuje len prijatie a zhrnie, čo odoslal.
 */
function buildConfirmation(d) {
  const summary = [
    d.mesto ? `Mesto: ${d.mesto}` : '',
    d.typPoziadavky ? `Typ požiadavky: ${labelOf(inquiryTypes, d.typPoziadavky)}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const text = `Dobrý deň,

váš dopyt sme prijali a ozveme sa na kontakt, ktorý ste uviedli.

${summary}

Vaša správa:
${d.sprava}

Toto je automatické potvrdenie prijatia — netreba naň odpovedať.

${company.legalName}
${company.contact.phone}
${company.siteUrl}`;

  const html = `<!DOCTYPE html><html lang="sk"><body style="margin:0;background:#f3f1ec;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#23292f">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden">
  <div style="background:#12161c;padding:22px 24px">
    <div style="height:3px;width:48px;background:#ffc61a;margin-bottom:12px"></div>
    <div style="color:#fff;font-size:18px;font-weight:bold">Váš dopyt sme prijali</div>
  </div>
  <div style="padding:22px 24px;font-size:14px;line-height:1.65">
    <p style="margin:0 0 14px">Dobrý deň,</p>
    <p style="margin:0 0 18px">váš dopyt sme prijali a ozveme sa na kontakt, ktorý ste uviedli.</p>
    ${
      summary
        ? `<div style="background:#f3f1ec;border-radius:6px;padding:12px 16px;margin-bottom:18px;font-size:13px;white-space:pre-line">${escapeHtml(summary)}</div>`
        : ''
    }
    <div style="color:#5b6670;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Vaša správa</div>
    <div style="white-space:pre-wrap;margin-bottom:20px">${escapeHtml(d.sprava)}</div>
    <p style="margin:0;color:#5b6670;font-size:12px">
      Toto je automatické potvrdenie prijatia — netreba naň odpovedať.
    </p>
  </div>
  <div style="padding:16px 24px;background:#12161c;color:#a8b0b8;font-size:12px">
    <strong style="color:#fff">${escapeHtml(company.legalName)}</strong><br>
    ${escapeHtml(company.contact.phone)} · ${escapeHtml(company.siteUrl)}
  </div>
</div>
</body></html>`;

  return { subject: 'Prijali sme váš dopyt — ' + company.name, text, html };
}

async function sendViaResend(payload) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
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

  if (!process.env.RESEND_API_KEY) {
    console.error('[dopyt] RESEND_API_KEY nie je nastavený — dopyt sa neodoslal.');
    return res.status(503).json({ ok: false, error: 'not_configured' });
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
    await sendViaResend({
      from: FROM,
      to: [TO],
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
     Zlyhanie tu NESMIE zhodiť celú požiadavku — dopyt už firma dostala,
     takže z pohľadu používateľa je odoslanie úspešné. */
  if (data.email) {
    try {
      const confirm = buildConfirmation(data);
      await sendViaResend({
        from: FROM,
        to: [data.email],
        subject: confirm.subject,
        text: confirm.text,
        html: confirm.html,
        reply_to: TO,
      });
    } catch (err) {
      console.error('[dopyt] potvrdenie zákazníkovi zlyhalo:', err.message);
    }
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
