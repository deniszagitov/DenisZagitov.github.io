import type { MarkdownInstance } from 'astro';

export interface MaterialFrontmatter {
  title: string; date: Date | string; permalink: string; venue?: string; location?: string;
}
export type Material = MarkdownInstance<MaterialFrontmatter>;
// Retain original writing and talks; template publications are not imported.
export const talks = Object.values(import.meta.glob<Material>('../../_talks/*.md', { eager: true }));
export const posts = Object.values(import.meta.glob<Material>('../../_posts/*.md', { eager: true }));
export const presentations: Record<string, string> = {
  '/talks/2017-05-25': '/files/BIT-2017.pptx',
  '/talks/2022-01-20': '/files/Ситуационные центры.pptx',
};
export const materialPath = (material: Material) => material.frontmatter.permalink.replace(/\/?$/, '/');
