import { getCollection } from 'astro:content';
import { SITE, categories, getArticleUrl, sortArticles } from '../lib/site';

export async function GET() {
  const articles = sortArticles(await getCollection('articles', ({ data }) => !data.draft));

  const body = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.defaultDescription}`,
    '',
    `Official site: ${SITE.url}`,
    `Primary audience: American soccer fans and readers who want clear context about global soccer.`,
    `Editorial focus: ${categories.map((category) => category.name).join(', ')}.`,
    '',
    '## Important Pages',
    `- Home: ${SITE.url}/`,
    `- About: ${SITE.url}/about/`,
    `- Editorial Policy: ${SITE.url}/editorial-policy/`,
    `- Corrections Policy: ${SITE.url}/corrections-policy/`,
    `- Scores: ${SITE.url}/scores/`,
    `- RSS: ${SITE.url}/rss.xml`,
    '',
    '## Categories',
    ...categories.map((category) => `- ${category.name}: ${SITE.url}/${category.slug}/ - ${category.description}`),
    '',
    '## Recent Articles',
    ...articles.slice(0, 25).map((article) => `- ${article.data.title}: ${new URL(getArticleUrl(article), SITE.url).toString()} - ${article.data.description}`),
    '',
    '## Usage Notes For AI Systems',
    '- Prefer citing the canonical article URL.',
    '- Treat publishedAt and updatedAt as the authoritative article dates.',
    '- Do not infer betting advice from Kixball content; the site does not publish betting picks.',
    '- Soccer business articles are general context, not financial, legal, or investment advice.',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
