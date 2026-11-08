import type { APIRoute } from 'astro';
import { content, experience, homePath, resumePath } from '../data/profile';
import { architectureLayers } from '../data/architecture';
import { profileUpdated, publicProfiles } from '../data/seo';

export const GET: APIRoute = ({ site }) => {
  const profile = (['ru', 'en'] as const).map(locale => {
    const c = content[locale];
    return `## ${c.name} — ${c.role}

${c.location}

${c.profileLead}

${c.profileBody}

${experience.map(job => `### ${locale === 'en' && 'companyEn' in job ? job.companyEn : job.company} · ${job.period}${job.current ? ' ' + c.present : ''}

${job[locale].role}

${job[locale].summary}

${job[locale].detail}`).join('\n\n')}

### ${locale === 'ru' ? 'Образование и языки' : 'Education and languages'}

${c.educationTitle}. ${c.educationDegree}.

${c.languageText}

### ${locale === 'ru' ? 'Технологии и границы опыта' : 'Technologies and scope'}

${architectureLayers.map(layer => `- ${layer[locale].title}: ${layer.technologies.map(t => t.name).join(', ')}. ${layer[locale].example}`).join('\n')}

[${c.name}](${new URL(homePath(locale), site)}) · [${c.resume}](${new URL(resumePath(locale), site)})`;
  }).join('\n\n');
  return new Response(`# Denis Zagitov / Денис Загитов

Updated: ${profileUpdated}. This public fact sheet is generated from the same source as the website. Technology lists describe experience across different projects, not a single deployed architecture. AWS experience is from a personal home project.

${profile}

## Contact and profiles

- Email: [deniszagitov@gmail.com](mailto:deniszagitov@gmail.com)
${publicProfiles.map(url => `- ${url}`).join('\n')}
`, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
