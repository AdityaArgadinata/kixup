import { SITE } from '../lib/site';
import { xmlResponse } from '../lib/xml';

const sitemapEntries = [
  '/sitemap-index.xml',
  '/news-sitemap.xml',
] as const;

export function GET() {
  const lastmod = new Date().toISOString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (path) => `  <sitemap>
    <loc>${new URL(path, SITE.url).toString()}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`,
  )
  .join('\n')}
</sitemapindex>`;

  return xmlResponse(body);
}
