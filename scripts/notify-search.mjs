import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const origin = new URL('https://deniszagitov.github.io');
const key = (await readFile(new URL('../public/indexnow-key.txt', import.meta.url), 'utf8')).trim();
assert(/^[a-zA-Z0-9-]{8,128}$/.test(key), 'Invalid IndexNow verification key');
const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert(urlList.length > 0 && urlList.length <= 10000, 'Invalid sitemap size');
assert(urlList.every(url => new URL(url).origin === origin.origin), 'Only this website can be submitted');
const keyLocation = new URL('/indexnow-key.txt', origin).href;
const proof = await fetch(keyLocation, { signal: AbortSignal.timeout(20000) });
assert(proof.ok && (await proof.text()).trim() === key, 'Deploy the verification file before submitting URLs');

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: origin.host, key, keyLocation, urlList }),
  signal: AbortSignal.timeout(30000),
});
assert(response.status === 200 || response.status === 202, `IndexNow submission failed: HTTP ${response.status}`);
console.log(`IndexNow received ${urlList.length} public URLs (HTTP ${response.status}). ${response.status === 202 ? 'Key validation is pending. ' : ''}Receipt is not proof of indexing or ranking.`);
