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
 *    INQUIRY_FROM     nepovinné — odosielateľ, musí byť na overenej doméne
 */

import { company } from '../data/company.js';
import { inquiryTypes, objectTypes } from '../data/services.js';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

const TO = process.env.INQUIRY_TO || company.contact.email;
const FROM = process.env.INQUIRY_FROM || 'Web ELEVÁTOR SERVIS <web@elevatorservis.sk>';

/** Limity dĺžky. Nie sú to len ochranné zábrany — bránia aj zneužitiu na spam. */
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

  // Mapa nesmie rásť donekonečna.
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

/** Preklad hodnôt zo selectu na čitateľné popisky do e-mailu. */
function labelOf(list, value) {
  const found = list.find((o) => o.value === value);
  return found ? found.label : value;
}

/**
 * Validácia na serveri.
 * Zámerne zrkadlí pravidlá z static/js/form.js — klientskej validácii
 * sa nedá veriť, dá sa obísť.
 */
function validate(d) {
  const errors = [];

  if (!d.meno) errors.push('meno');
  if (!d.mesto) errors.push('mesto');
  if (!d.typPoziadavky) errors.push('typPoziadavky');
  if (!d.sprava || d.sprava.length < 10) errors.push('sprava');
  if (d.suhlas !== true) errors.push('suhlas');

  if (!d.telefon && !d.email) errors.push('kontakt');
  if (d.email && !EMAIL_RE.test(d.email)) errors.push('email');
  if (d.telefon && !PHONE_RE.test(d.telefon)) errors.push('telefon');
  if (d.pocetVytahov && !(Number(d.pocetVytahov) > 0)) errors.push('pocetVytahov');

  return errors;
}

function buildEmail(d) {
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  if (!process.env.RESEND_API_KEY) {
    // Radšej čestná chyba než tiché zahodenie dopytu.
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

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};

  // Honeypot: pole je pre ľudí skryté, boty ho vyplnia.
  // Odpovedáme 200, aby bot nevedel, že bol odhalený.
  if (clean(body.website, 200)) {
    console.warn('[dopyt] honeypot zachytil odoslanie z', ip);
    return res.status(200).json({ ok: true });
  }

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

  const errors = validate(data);
  if (errors.length) {
    return res.status(400).json({ ok: false, error: 'validation_failed', fields: errors });
  }

  const { subject, text, html } = buildEmail(data);

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        subject,
        text,
        html,
        // Odpovedať sa dá priamo z inboxu.
        reply_to: data.email || undefined,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('[dopyt] Resend odmietol odoslanie:', response.status, detail);
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[dopyt] chyba pri odosielaní:', err);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
}

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
