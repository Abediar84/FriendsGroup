import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSeoConfig, getStructuredData } from '../src/seo/siteSeo.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');

const escapeAttribute = value => value
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;');

const replaceMeta = (html, type, key, content) => {
  const escaped = escapeAttribute(content);
  const expression = new RegExp(`<meta\\s+${type}=["']${key}["'][^>]*>`, 'i');
  const tag = `<meta ${type}="${key}" content="${escaped}" />`;
  return expression.test(html) ? html.replace(expression, tag) : html.replace('</head>', `  ${tag}\n</head>`);
};

const renderHead = (pathname, language = 'en') => {
  const seo = getSeoConfig(pathname, language);
  const schema = JSON.stringify(getStructuredData(pathname, language)).replace(/</g, '\\u003c');
  let html = template
    .replace(/<html[^>]*>/i, `<html lang="${language}">`)
    .replace(/<title>.*?<\/title>/is, `<title>${escapeAttribute(seo.title)}</title>`)
    .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${seo.canonical}" />`);

  html = replaceMeta(html, 'name', 'description', seo.description);
  html = replaceMeta(html, 'name', 'robots', seo.robots);
  html = replaceMeta(html, 'property', 'og:title', seo.title);
  html = replaceMeta(html, 'property', 'og:description', seo.description);
  html = replaceMeta(html, 'property', 'og:url', seo.canonical);
  html = replaceMeta(html, 'property', 'og:image', seo.image);
  html = replaceMeta(html, 'name', 'twitter:title', seo.title);
  html = replaceMeta(html, 'name', 'twitter:description', seo.description);
  html = replaceMeta(html, 'name', 'twitter:image', seo.image);
  html = html.replace(/\s*<script id="route-structured-data"[^>]*>[\s\S]*?<\/script>/i, '');
  return html.replace('</head>', `  <script id="route-structured-data" type="application/ld+json">${schema}</script>\n</head>`);
};

const routes = [
  ['/', ''],
  ['/menu', 'menu'],
  ['/promotions', 'promotions'],
  ['/roadmap', 'roadmap']
];

for (const [route, directory] of routes) {
  const outputDirectory = path.join(dist, directory);
  await fs.mkdir(outputDirectory, { recursive: true });
  await fs.writeFile(path.join(outputDirectory, 'index.html'), renderHead(route), 'utf8');
}

console.log('Generated route-specific SEO HTML for 4 routes.');
