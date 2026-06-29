import { getCollection } from 'astro:content';
import { SITE, categories, getArticleUrl, sortArticles } from '../lib/site';
import { escapeXml, xmlResponse } from '../lib/xml';

const staticPaths = [
  '/',
  '/about/',
  '/ai-usage-policy/',
  '/analysis/',
  '/authors/aditya-argadinata/',
  '/champions-league/',
  '/contact/',
  '/corrections-policy/',
  '/disclaimer/',
  '/editorial-policy/',
  '/mls/',
  '/news/',
  '/premier-league/',
  '/privacy-policy/',
  '/schedule/',
  '/scores/',
  '/soccer-business/',
  '/soccer-explainers/',
  '/terms/',
  '/transfers/',
  '/usmnt/',
  '/world-cup/',
] as const;

export async function GET() {
  const articles = sortArticles(await getCollection('articles', ({ data }) => !data.draft));
  const latestArticleDate = articles[0]?.data.updatedAt ?? new Date();
  const articleTags = Array.from(new Set(articles.flatMap((article) => article.data.tags)))
    .sort((a, b) => a.localeCompare(b));

  const urls = [
    ...staticPaths.map((path) => ({
      loc: new URL(path, SITE.url).toString(),
      lastmod: latestArticleDate,
      priority: path === '/' ? '1.0' : '0.7',
    })),
    ...categories.map((category) => ({
      loc: new URL(`/${category.slug}/`, SITE.url).toString(),
      lastmod: latestArticleDate,
      priority: '0.8',
    })),
    ...articleTags.map((tag) => ({
      loc: new URL(`/tags/${slugifyTag(tag)}/`, SITE.url).toString(),
      lastmod: latestArticleDate,
      priority: '0.5',
    })),
    ...articles.map((article) => ({
      loc: new URL(getArticleUrl(article), SITE.url).toString(),
      lastmod: article.data.updatedAt,
      priority: '0.9',
    })),
  ];

  const uniqueUrls = Array.from(new Map(urls.map((url) => [url.loc, url])).values());

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod.toISOString()}</lastmod>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return xmlResponse(body);
}

function slugifyTag(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
