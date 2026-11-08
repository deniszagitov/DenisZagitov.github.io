import { content, experience, homePath, type Locale } from './profile';

// Change this date only when the public profile content changes, not on each build.
export const profileUpdated = '2026-11-08';
export const pagePairs = [['/', '/en/'], ['/cv/', '/en/cv/'], ['/portfolio/', '/en/portfolio/']] as const;
export const publicProfiles = [
  'https://www.linkedin.com/in/deniszagitov/',
  'https://github.com/DenisZagitov',
  'https://t.me/deniszagitov',
];

export function pageSchema({ locale, site, path, title, description, section }: {
  locale: Locale; site: URL; path: string; title: string; description: string;
  section: 'home' | 'archive' | 'cv';
}) {
  const absolute = (value: string) => new URL(value, site).href;
  const personId = absolute('/#person');
  const websiteId = absolute('/#website');
  const url = absolute(path);
  const isProfile = path === homePath(locale) || path === (locale === 'ru' ? '/cv/' : '/en/cv/');
  const isArchive = path === (locale === 'ru' ? '/portfolio/' : '/en/portfolio/');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite', '@id': websiteId, url: absolute('/'),
        name: 'Denis Zagitov / Денис Загитов', inLanguage: ['ru', 'en'],
        publisher: { '@id': personId },
      },
      {
        '@type': 'Person', '@id': personId, name: content[locale].name,
        alternateName: [content[locale === 'ru' ? 'en' : 'ru'].name, 'deniszagitov'],
        url: absolute('/'), image: absolute('/media/denis-zagitov.webp'),
        jobTitle: content[locale].role, email: 'mailto:deniszagitov@gmail.com',
        sameAs: publicProfiles,
        ...(isProfile ? {
          description: content[locale].profileLead,
          knowsAbout: [...new Set(experience.flatMap(job => [...job.tags]))],
          worksFor: { '@type': 'Organization', name: 'ADVIVA' },
          workLocation: { '@type': 'Place', name: content[locale].location },
        } : {}),
      },
      {
        '@type': isProfile ? 'ProfilePage' : isArchive ? 'CollectionPage' : 'WebPage',
        '@id': url + '#webpage', url, name: title, description, inLanguage: locale,
        isPartOf: { '@id': websiteId },
        ...(isProfile ? { mainEntity: { '@id': personId } } : { about: { '@id': personId } }),
        ...(section !== 'home' ? { breadcrumb: {
          '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: content[locale].name, item: absolute(homePath(locale)) },
            { '@type': 'ListItem', position: 2, name: title, item: url },
          ],
        } } : {}),
      },
    ],
  };
}
