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
  // Require attribute whitespace so data-node-id is not mistaken for an id.
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
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
const descriptions = new Set();
for (const [path, locale, translation] of [['/', 'ru', '/en/'], ['/en/', 'en', '/'], ['/portfolio/', 'ru', '/en/portfolio/'], ['/en/portfolio/', 'en', '/portfolio/'], ['/cv/', 'ru', '/en/cv/'], ['/en/cv/', 'en', '/cv/']]) {
  const html = await readFile(join(dist, path, 'index.html'), 'utf8');
  assert(html.includes(`lang="${locale}"`), `Wrong language at ${path}`);
  assert(html.includes('data-theme-choice="dark"') && html.includes('data-theme-choice="light"'), `Missing themes at ${path}`);
  assert(html.includes('hreflang="ru"') && html.includes('hreflang="en"'), `Missing language alternatives at ${path}`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `Expected one page heading at ${path}`);
  assert(html.includes(`rel="canonical" href="https://deniszagitov.github.io${path}"`), `Wrong canonical at ${path}`);
  const otherLocale = locale === 'ru' ? 'en' : 'ru';
  assert(html.includes(`hreflang="${otherLocale}" href="https://deniszagitov.github.io${translation}"`), `Wrong translation at ${path}`);
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert(description && !descriptions.has(description), `Missing or duplicate description at ${path}`);
  descriptions.add(description);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1] ?? 'null');
  const person = schema?.['@graph']?.find(node => node['@type'] === 'Person');
  const page = schema?.['@graph']?.find(node => node['@id'] === `https://deniszagitov.github.io${path}#webpage`);
  assert.equal(person?.['@id'], 'https://deniszagitov.github.io/#person', `Inconsistent profile identity at ${path}`);
  assert.equal(page?.['@type'], path.includes('/portfolio/') ? 'CollectionPage' : 'ProfilePage', `Wrong page schema at ${path}`);
  assert(!html.includes('noindex'), `Profile accidentally excluded from search at ${path}`);
  assert(!/\bJava\b/.test(html), `Java presented as a personal skill at ${path}`);
}
for (const path of ['/portfolio/', '/en/portfolio/']) {
  const html = await readFile(join(dist, path, 'index.html'), 'utf8');
  for (const record of catalogue) assert(html.includes(`id="diploma-${record.id}"`), `Missing diploma ${record.id} at ${path}`);
}
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
for (const [, loc] of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
  const url = new URL(loc);
  assert.equal(url.origin, 'https://deniszagitov.github.io', 'Sitemap must use the public domain');
  const html = await readFile(join(dist, decodeURIComponent(url.pathname), 'index.html'), 'utf8');
  assert(!html.includes('noindex'), `Noindex page in sitemap: ${loc}`);
}
for (const name of ['BIT-2017.pptx', 'Ситуационные центры.pptx']) {
  assert.equal(hash(await readFile(join(root, 'files', name))), hash(await readFile(join(dist, 'files', name))), `Original presentation changed: ${name}`);
}
for (const date of ['2017-05-25', '2022-01-20']) {
  const redirect = await readFile(join(dist, 'talks', date + '.html'), 'utf8');
  assert(redirect.includes(`0;url=/talks/${date}/`), `Missing legacy talk redirect: ${date}`);
}
await access(join(dist, 'posts/2012/08/language/index.html'));
const facts = await readFile(join(dist, 'profile.md'), 'utf8');
assert(facts.includes('AWS experience is from a personal home project.'), 'Missing AWS scope in the public fact sheet');
assert((await readFile(join(dist, 'llms.txt'), 'utf8')).includes('https://deniszagitov.github.io/profile.md'), 'Missing fact sheet discovery link');
assert((await readFile(join(dist, 'robots.txt'), 'utf8')).includes('Allow: /'), 'Public profile must be crawlable');
await access(join(dist, 'media/social.png'));
assert.equal(await readFile(join(dist, 'indexnow-key.txt'), 'utf8'), await readFile(join(root, 'public/indexnow-key.txt'), 'utf8'), 'Published IndexNow proof must match its source');
console.log(`Verified ${pages.length} HTML pages and ${internalLinks} internal links; RU/EN SEO metadata and structured identity, crawlable sitemap and fact sheet, themes, ${catalogue.length} byte-identical diploma originals, original presentations, and legacy content routes.`);
