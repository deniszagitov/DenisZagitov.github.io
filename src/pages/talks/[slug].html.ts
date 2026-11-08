import type { APIRoute } from 'astro';
import { talks, materialPath } from '../../data/materials';
export function getStaticPaths() {
  return talks.map(material => ({ params: { slug: material.frontmatter.permalink.split('/').at(-1) }, props: { path: materialPath(material) } }));
}
// GitHub Pages has no configurable HTTP redirects; preserve the original .html URLs.
export const GET: APIRoute = ({ props, site }) => new Response(`<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Материал переехал</title><meta http-equiv="refresh" content="0;url=${props.path}"><link rel="canonical" href="${new URL(props.path, site)}"></head><body><a href="${props.path}">Открыть материал</a></body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
