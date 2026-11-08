import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://deniszagitov.github.io',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  i18n: { defaultLocale: 'ru', locales: ['ru', 'en'], routing: { prefixDefaultLocale: false } },
});
