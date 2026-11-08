import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const archiveRoot = join(root, 'assets', 'images', 'portfolio');
const legacyRoot = join(root, '_portfolio');
const publicRoot = join(root, 'public');
const cataloguePath = join(root, 'src', 'data', 'diplomas.json');

/**
 * @typedef {Object} Diploma
 * @property {string} id Stable identifier derived from the original relative path.
 * @property {number} year Year of the original archive folder.
 * @property {number} ordinal One-based position within that year.
 * @property {'image' | 'pdf'} format
 * @property {string} filename Original filename, including its case and extension.
 * @property {string} src URL-encoded public path to the unmodified original.
 * @property {string | null} thumbnail Generated WebP preview; PDFs are not rasterized.
 * @property {number | null} width Display-oriented original image width.
 * @property {number | null} height Display-oriented original image height.
 * @property {string} titleRu
 * @property {string} titleEn
 * @property {string | null} legacyPath Existing Jekyll portfolio route, if any.
 */

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`Archive sources must be regular files: ${path}`);
    }
    if (entry.isDirectory()) paths.push(...await filesIn(path));
    else if (entry.isFile() && entry.name !== '.DS_Store') paths.push(path);
  }

  return paths.sort();
}

// The existing archive uses single-line scalar front matter. This deliberately
// reads only those values rather than introducing a second YAML dependency.
function frontMatterValue(contents, key) {
  const block = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(contents)?.[1];
  if (!block) return null;
  const scalar = new RegExp(`^${key}:\\s*(.*?)\\s*$`, 'mu').exec(block)?.[1];
  if (!scalar) return null;
  if (scalar.startsWith('"') && scalar.endsWith('"')) return JSON.parse(scalar);
  if (scalar.startsWith("'") && scalar.endsWith("'")) {
    return scalar.slice(1, -1).replaceAll("''", "'");
  }
  return scalar;
}

function toPosix(path) {
  return path.split(sep).join('/');
}

function encodePath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

async function legacyRoutes() {
  const routes = new Map();

  for (const path of await filesIn(legacyRoot)) {
    if (extname(path).toLowerCase() !== '.md') continue;
    const contents = await readFile(path, 'utf8');
    const teaser = frontMatterValue(contents, 'teaser');
    if (!teaser) throw new Error(`Missing teaser in ${path}`);
    const source = decodeURIComponent(teaser);
    if (!source.startsWith('/assets/images/portfolio/')) {
      throw new Error(`Unexpected archive teaser in ${path}: ${teaser}`);
    }
    if (routes.has(source)) throw new Error(`Duplicate archive teaser: ${teaser}`);

    // The old collection uses /:collection/:path/. Preserve spaces and
    // underscores in its filenames instead of applying a new slug algorithm.
    const legacyName = toPosix(relative(legacyRoot, path)).replace(/\.md$/iu, '').toLowerCase();
    routes.set(source, frontMatterValue(contents, 'permalink') ?? `/portfolio/${legacyName}/`);
  }

  return routes;
}

async function writeCatalogue(records) {
  const contents = `${JSON.stringify(records, null, 2)}\n`;
  let current;
  try {
    current = await readFile(cataloguePath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (current === contents) return;
  await mkdir(dirname(cataloguePath), { recursive: true });
  await writeFile(cataloguePath, contents);
}

const [sources, routes] = await Promise.all([filesIn(archiveRoot), legacyRoutes()]);
const sourceUrls = new Set(sources.map(path => `/assets/images/portfolio/${toPosix(relative(archiveRoot, path))}`));
for (const source of routes.keys()) {
  if (!sourceUrls.has(source)) throw new Error(`Legacy teaser has no original: ${source}`);
}

/** @type {Diploma[]} */
const catalogue = [];
const ordinals = new Map();
const ids = new Set();
await mkdir(join(publicRoot, 'media', 'diplomas'), { recursive: true });

for (const sourcePath of sources) {
  const archivePath = toPosix(relative(archiveRoot, sourcePath));
  const yearFolder = archivePath.split('/')[0];
  if (!/^\d{4}$/u.test(yearFolder)) {
    throw new Error(`Archive original must be inside a year folder: ${archivePath}`);
  }
  const year = Number(yearFolder);
  const ordinal = (ordinals.get(year) ?? 0) + 1;
  ordinals.set(year, ordinal);
  const id = `${year}-${createHash('sha256').update(archivePath).digest('hex').slice(0, 12)}`;
  if (ids.has(id)) throw new Error(`Duplicate archive identifier: ${id}`);
  ids.add(id);

  const originalUrl = `/assets/images/portfolio/${archivePath}`;
  const destination = join(publicRoot, 'assets', 'images', 'portfolio', ...archivePath.split('/'));
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(sourcePath, destination);

  const isPdf = extname(sourcePath).toLowerCase() === '.pdf';
  let thumbnail = null;
  let width = null;
  let height = null;

  if (!isPdf) {
    const metadata = await sharp(sourcePath).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error(`Cannot determine image dimensions: ${archivePath}`);
    }
    const swapsAxes = metadata.orientation >= 5 && metadata.orientation <= 8;
    width = swapsAxes ? metadata.height : metadata.width;
    height = swapsAxes ? metadata.width : metadata.height;
    thumbnail = `/media/diplomas/${id}.webp`;

    await sharp(sourcePath)
      .rotate()
      .resize({ width: 720, height: 960, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 76, effort: 4 })
      .toFile(join(publicRoot, 'media', 'diplomas', `${id}.webp`));
  }

  catalogue.push({
    id,
    year,
    ordinal,
    format: isPdf ? 'pdf' : 'image',
    filename: basename(sourcePath),
    src: encodePath(originalUrl),
    thumbnail,
    width,
    height,
    titleRu: `${isPdf ? 'Документ' : 'Диплом'} · ${year}`,
    titleEn: `${isPdf ? 'Document' : 'Diploma'} · ${year}`,
    legacyPath: routes.get(originalUrl) ?? null,
  });
}

await writeCatalogue(catalogue);
const imageCount = catalogue.filter(record => record.format === 'image').length;
console.log(`Archive prepared: ${catalogue.length} originals, ${imageCount} image previews, ${catalogue.length - imageCount} PDF documents, ${routes.size} legacy routes.`);
