import { getCollection } from 'astro:content';
import { getArticleUrl, sortArticles } from '../../lib/site';

export async function GET() {
  const articles = sortArticles(await getCollection('articles', ({ data }) => !data.draft));

  return Response.json({
    articles: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      slug: article.data.slug,
      url: getArticleUrl(article),
      category: article.data.category,
      tags: article.data.tags,
      image: article.data.image,
      imageAlt: article.data.imageAlt,
      publishedAt: article.data.publishedAt.toISOString(),
      updatedAt: article.data.updatedAt.toISOString(),
      body: article.body,
      searchText: [
        article.data.title,
        article.data.description,
        article.data.category,
        article.data.tags.join(' '),
        article.body,
      ].join(' '),
    })),
  });
}
