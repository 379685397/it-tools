import { promises as fs } from 'node:fs';
import path from 'node:path';

const SITE_ORIGIN = process.env.SITE_ORIGIN ?? 'https://tools.hongqiangnet.com';

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

async function getToolPaths({ toolsDir }) {
  const entries = await fs.readdir(toolsDir, { withFileTypes: true });
  const paths = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const indexPath = path.join(toolsDir, entry.name, 'index.ts');
    let source;
    try {
      source = await fs.readFile(indexPath, 'utf8');
    }
    catch {
      continue;
    }

    const match = source.match(/\bpath\s*:\s*['"](?<path>\/[^'"]+)['"]/);
    const toolPath = match?.groups?.path;
    if (toolPath) {
      paths.push(toolPath);
    }
  }

  return paths;
}

function toAbsoluteUrl(routePath) {
  return new URL(routePath, SITE_ORIGIN).toString();
}

function buildSitemapXml(urls) {
  const body = urls
    .map(url => `  <url><loc>${escapeXml(url)}</loc></url>`)
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    '</urlset>',
    '',
  ].join('\n');
}

async function main() {
  const projectRoot = process.cwd();
  const toolsDir = path.join(projectRoot, 'src', 'tools');
  const publicDir = path.join(projectRoot, 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');

  const toolPaths = await getToolPaths({ toolsDir });
  const uniqueToolPaths = Array.from(new Set(toolPaths)).sort((a, b) => a.localeCompare(b));

  const urls = [
    toAbsoluteUrl('/'),
    toAbsoluteUrl('/about'),
    ...uniqueToolPaths.map(toAbsoluteUrl),
  ];

  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(sitemapPath, buildSitemapXml(urls), 'utf8');

  // eslint-disable-next-line no-console
  console.log(`Generated sitemap: ${sitemapPath} (${urls.length} urls)`);
}

await main();

