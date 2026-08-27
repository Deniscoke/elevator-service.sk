/**
 * serve.mjs — minimálny statický server na lokálny náhľad.
 *
 * Existuje len preto, aby sa dal web pozrieť tak, ako bude fungovať
 * v produkcii (pekné URL bez .html, správna 404). Na deployment nie je
 * potrebný — dist/ je obyčajný statický priečinok.
 *
 *   npm run dev     build + server
 *   npm run serve   len server
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

async function resolveFile(urlPath) {
  // Ochrana proti path traversal — normalizujeme a držíme sa v dist/.
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const clean = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  let target = path.join(ROOT, clean);

  if (!target.startsWith(ROOT)) return null;

  try {
    const info = await stat(target);
    if (info.isDirectory()) target = path.join(target, 'index.html');
    else return target;
  } catch {
    // Skúsime adresárový variant: /kontakt → /kontakt/index.html
    target = path.join(ROOT, clean, 'index.html');
  }

  try {
    await stat(target);
    return target;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const file = await resolveFile(req.url || '/');

  if (!file) {
    try {
      const notFound = await readFile(path.join(ROOT, '404.html'));
      res.writeHead(404, { 'Content-Type': TYPES['.html'] });
      res.end(notFound);
    } catch {
      res.writeHead(404, { 'Content-Type': TYPES['.txt'] });
      res.end('404');
    }
    return;
  }

  const body = await readFile(file);
  res.writeHead(200, {
    'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  res.end(body);
});

server.listen(PORT, () => {
  console.log(`\n  Náhľad beží na http://localhost:${PORT}\n`);
});
