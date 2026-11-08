import type { APIRoute } from 'astro';
import { pagePairs, profileUpdated } from '../data/seo';
import { talks, posts, materialPath } from '../data/materials';
export const GET: APIRoute = ({ site }) => {
  const entries = [
    ...pagePairs.flatMap(pair => pair.map(path => `<url><loc>${new URL(path, site).href}</loc><lastmod>${profileUpdated}</lastmod></url>`)),
    ...['/talks/', '/year-archive/', ...[...talks, ...posts].map(materialPath)].map(path => `<url><loc>${new URL(path, site).href}</loc></url>`),
  ].join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
