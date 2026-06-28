import { getCollection } from 'astro:content';
import { SITE, getArticleUrl, sortArticles } from '../lib/site';

export async function GET() {
  const articles = sortArticles(await getCollection('articles', ({ data }) => !data.draft)).slice(0, 1000);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${articles
  .map(
    (article) => `<url>
  <loc>${new URL(getArticleUrl(article), SITE.url).toString()}</loc>
  <news:news>
    <news:publication>
      <news:name>${SITE.name}</news:name>
      <news:language>en</news:language>
    </news:publication>
    <news:publication_date>${article.data.publishedAt.toISOString()}</news:publication_date>
    <news:title>${escapeXml(article.data.title)}</news:title>
  </news:news>
</url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
