import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const catalogue = JSON.parse(await readFile(join(root, 'src/data/diplomas.json'), 'utf8'));
const hash = buffer => createHash('sha256').update(buffer).digest('hex');
async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? filesIn(join(directory, entry.name)) : [join(directory, entry.name)]))).flat();
}
const originals = (await filesIn(join(root, 'assets/images/portfolio'))).filter(path => !path.endsWith('.DS_Store'));
assert.equal(catalogue.length, originals.length, 'Every original must be in the archive catalogue');
assert.equal(new Set(catalogue.map(record => record.src)).size, originals.length, 'No duplicate archive entries');
for (const record of catalogue) {
  const path = decodeURIComponent(record.src).replace(/^\//, '');
  const [original, published] = await Promise.all([readFile(join(root, path)), readFile(join(dist, path))]);
  assert.equal(hash(published), hash(original), `Original changed: ${path}`);
  if (record.thumbnail) await access(join(dist, record.thumbnail));
  if (record.legacyPath) await access(join(dist, record.legacyPath, 'index.html'));
}
const pages = (await filesIn(dist)).filter(path => path.endsWith('.html'));
let internalLinks = 0;
for (const path of pages) {
  const html = await readFile(path, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `Duplicate IDs in ${path}`);
  assert(!html.includes('Paper Title Number'), `Template content in ${path}`);
  for (const match of html.matchAll(/\b(?:href|src)="(\/[^"<>]*)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), 'https://local.test');
    if (url.hostname !== 'local.test') continue;
    const local = decodeURIComponent(url.pathname);
    let target = join(dist, local);
    if (local.endsWith('/')) target = join(target, 'index.html');
    assert(resolve(target).startsWith(resolve(dist)), 'Link escapes build directory');
    await access(target).catch(() => assert.fail(`Missing target ${match[1]} in ${relative(dist, path)}`));
    if (url.hash && target.endsWith('.html')) {
      const targetHtml = target === path ? html : await readFile(target, 'utf8');
      assert(targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing anchor ${match[1]} in ${relative(dist, path)}`);
    }
    internalLinks++;
  }
}
for (const [path, locale] of [['/', 'ru'], ['/en/', 'en'], ['/portfolio/', 'ru'], ['/en/portfolio/', 'en'], ['/cv/', 'ru'], ['/en/cv/', 'en']]) {
  const html = await readFile(join(dist, path, 'index.html'), 'utf8');
  assert(html.includes(`lang="${locale}"`), `Wrong language at ${path}`);
  assert(html.includes('data-theme-choice="dark"') && html.includes('data-theme-choice="light"'), `Missing themes at ${path}`);
  assert(html.includes('hreflang="ru"') && html.includes('hreflang="en"'), `Missing language alternatives at ${path}`);
}
for (const path of ['/portfolio/', '/en/portfolio/']) {
  const html = await readFile(join(dist, path, 'index.html'), 'utf8');
  for (const record of catalogue) assert(html.includes(`id="diploma-${record.id}"`), `Missing diploma ${record.id} at ${path}`);
}
console.log(`Verified ${pages.length} HTML pages and ${internalLinks} internal links; both languages, theme controls, ${catalogue.length} byte-identical originals, and every legacy diploma route.`);
