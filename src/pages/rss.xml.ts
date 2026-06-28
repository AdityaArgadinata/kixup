import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, getArticleUrl, sortArticles } from '../lib/site';

export async function GET() {
  const articles = sortArticles(await getCollection('articles', ({ data }) => !data.draft));

  return rss({
    title: SITE.name,
    description: SITE.defaultDescription,
    site: SITE.url,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.publishedAt,
      link: getArticleUrl(article),
      author: article.data.author,
      categories: [article.data.category, ...article.data.tags],
    })),
  });
}
