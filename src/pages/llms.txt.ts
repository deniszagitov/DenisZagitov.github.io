import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site }) => new Response(`# Denis Zagitov / Денис Загитов

> Personal website of a Data & AI Architect based in Limassol, Cyprus. Russian is the primary language; an English version is available.

## Profile and experience

- [Profile facts in Markdown](${new URL('/profile.md', site)}): Career history, scope of experience, and public contact links; generated from the same content as the website.
- [Главная — русский](${new URL('/', site)}): Professional profile and interactive data-to-AI architecture.
- [Homepage — English](${new URL('/en/', site)}): English professional profile.
- [Резюме](${new URL('/cv/', site)}): Detailed Russian résumé.
- [Résumé](${new URL('/en/cv/', site)}): Detailed English résumé.
- [Дипломы по годам](${new URL('/portfolio/', site)}): Preserved original diplomas, awards, and certificates.
- [Выступления и материалы](${new URL('/talks/', site)}): Talks and writing in Russian.
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
