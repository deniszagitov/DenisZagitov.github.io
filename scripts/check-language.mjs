import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('dist/index.html', root), 'utf8');
const code = html.match(/<script data-language-preference>([\s\S]*?)<\/script>/)?.[1];
assert(code, 'Language negotiation must be present in the built homepage head');
assert(html.indexOf(code) < html.indexOf('<body'), 'Language negotiation must run before page content');

function visit({ path = '/', languages = ['en-US'], language = languages?.[0], stored = null, blocked = false } = {}) {
  const url = new URL(path, 'https://local.test');
  const changes = { redirected: null, cleaned: null, saved: stored };
  const pairs = {
    ru: path.startsWith('/en/cv/') || path.startsWith('/cv/') ? '/cv/' : path.startsWith('/en/portfolio/') || path.startsWith('/portfolio/') ? '/portfolio/' : '/',
    en: path.startsWith('/en/cv/') || path.startsWith('/cv/') ? '/en/cv/' : path.startsWith('/en/portfolio/') || path.startsWith('/portfolio/') ? '/en/portfolio/' : '/en/',
  };
  runInNewContext(code, {
    URL,
    location: { href: url.href, pathname: url.pathname, replace: value => { changes.redirected = value; } },
    navigator: { languages, language },
    localStorage: {
      getItem: key => { assert.equal(key, 'dz-language'); if (blocked) throw Error('Storage blocked'); return stored; },
      setItem: (key, value) => { assert.equal(key, 'dz-language'); if (blocked) throw Error('Storage blocked'); changes.saved = value; },
    },
    history: { state: null, replaceState: (_state, _title, value) => { changes.cleaned = value; } },
    document: { querySelector: selector => ({ href: 'https://deniszagitov.github.io' + pairs[selector.includes('"ru"') ? 'ru' : 'en'] }) },
  });
  return changes;
}

assert.equal(visit({ languages: ['ru-RU', 'en'] }).redirected, null);
assert.equal(visit({ languages: ['en-GB', 'ru'] }).redirected, 'https://local.test/en/');
assert.equal(visit({ languages: ['fr-FR', 'ru-RU', 'en'] }).redirected, null);
assert.equal(visit({ languages: ['fr-FR', 'de-DE'] }).redirected, 'https://local.test/en/');
assert.equal(visit({ languages: [], language: 'ru-RU' }).redirected, null);
assert.equal(visit({ stored: 'ru' }).redirected, null);
assert.equal(visit({ stored: 'en', languages: ['ru-RU'] }).redirected, 'https://local.test/en/');
assert.equal(visit({ stored: 'invalid', languages: ['ru-RU'] }).redirected, null);
assert.equal(visit().saved, null, 'An automatic choice must not become a permanent manual preference');
assert.equal(visit({ path: '/?utm_source=profile#experience' }).redirected, 'https://local.test/en/?utm_source=profile#experience');
for (const path of ['/en/', '/cv/', '/en/cv/', '/portfolio/', '/en/portfolio/']) {
  assert.equal(visit({ path, stored: 'ru' }).redirected, null, `Explicit/deep URL must remain accessible: ${path}`);
}
const russian = visit({ path: '/?lang=ru&utm_source=profile#experience' });
assert.equal(russian.saved, 'ru');
assert.equal(russian.redirected, null);
assert.equal(russian.cleaned, 'https://local.test/?utm_source=profile#experience');
const english = visit({ path: '/en/?lang=en', languages: ['ru-RU'] });
assert.equal(english.saved, 'en');
assert.equal(english.cleaned, 'https://local.test/en/');
assert.equal(visit({ path: '/en/cv/?lang=ru#main' }).redirected, 'https://local.test/cv/#main');
const blocked = visit({ path: '/?lang=ru', blocked: true });
assert.equal(blocked.redirected, null);
assert.equal(blocked.cleaned, null, 'Keep the explicit choice in the URL when it cannot be saved');
assert.equal(visit({ blocked: true }).redirected, 'https://local.test/en/');
assert.equal(visit({ path: '/en/', blocked: true }).redirected, null, 'No redirect loop without storage');
for (const path of ['dist/index.html', 'dist/en/index.html', 'dist/cv/index.html', 'dist/en/cv/index.html', 'dist/portfolio/index.html', 'dist/en/portfolio/index.html']) {
  const page = await readFile(new URL(path, root), 'utf8');
  assert(page.includes('data-language-preference'), `Missing negotiation in ${path}`);
  assert(page.includes('?lang=ru') || page.includes('?lang=en'), `Manual switch needs an explicit choice in ${path}`);
}
const article = await readFile(new URL('dist/posts/2012/08/language/index.html', root), 'utf8');
assert(!article.includes('data-language-preference'), 'Untranslated articles must not be redirected');
console.log('Verified browser language priority, manual preference, explicit language links, query/hash preservation, blocked storage, stable deep links, and static-page integration.');
