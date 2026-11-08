// Runs in the head before the homepage is painted. Language URLs remain static.
(() => {
  const key = 'dz-language';
  const isLocale = value => value === 'ru' || value === 'en';
  const url = new URL(location.href);
  const requested = url.searchParams.get('lang');

  // The switch uses an explicit request so Russian can always be opened,
  // including via a new tab or when browser storage is unavailable.
  if (isLocale(requested)) {
    const target = document.querySelector(`link[rel="alternate"][hreflang="${requested}"]`);
    if (!target) return;
    let saved = false;
    try { localStorage.setItem(key, requested); saved = true; } catch {}
    const next = new URL(target.href);
    // Only use the translated path; localhost previews must stay on localhost.
    url.pathname = next.pathname;
    if (saved) url.searchParams.delete('lang');
    if (url.pathname !== location.pathname) location.replace(url.href);
    else if (saved) history.replaceState(history.state, '', url.href);
    return;
  }

  // Negotiate only the general entry point. Explicit language URLs and deep
  // links keep their contents, and a visit to /en/ can never bounce back to /.
  if (url.pathname !== '/') return;
  let preferred;
  try { preferred = localStorage.getItem(key); } catch {}
  if (!isLocale(preferred)) {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
    preferred = languages.map(language => language.toLowerCase().split(/[-_]/)[0]).find(isLocale) || 'en';
  }
  if (preferred === 'en') {
    url.pathname = '/en/';
    location.replace(url.href);
  }
})();
