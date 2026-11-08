import './sync-archive.mjs';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
await mkdir(`${root}public/media`, { recursive: true });
await sharp(`${root}images/profile.png`).webp({ quality: 88 }).toFile(`${root}public/media/denis-zagitov.webp`);
const social = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#041f18"/><path d="M70 90h1060M70 540h1060" stroke="#78673e"/><text x="70" y="165" fill="#dfc483" font-family="sans-serif" font-size="21" letter-spacing="4">DATA &amp; AI ARCHITECT</text><text x="65" y="310" fill="#f3f1e5" font-family="sans-serif" font-size="96">Denis Zagitov</text><text x="70" y="390" fill="#b5c5b8" font-family="sans-serif" font-size="29">Data. Architecture. A considered approach.</text><text x="70" y="505" fill="#dfc483" font-family="sans-serif" font-size="22">deniszagitov.github.io</text></svg>`;
await sharp(Buffer.from(social)).png().toFile(`${root}public/media/social.png`);
console.log('Portrait, social image, and diploma archive prepared.');
