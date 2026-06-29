import { SITE } from '../lib/site';

export function GET() {
  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap.xml', SITE.url).toString()}
Sitemap: ${new URL('/sitemap-index.xml', SITE.url).toString()}
Sitemap: ${new URL('/news-sitemap.xml', SITE.url).toString()}

RSS: ${new URL('/rss.xml', SITE.url).toString()}
LLMS: ${new URL('/llms.txt', SITE.url).toString()}
`,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    },
  );
}
