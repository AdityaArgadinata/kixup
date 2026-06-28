import type { CollectionEntry } from 'astro:content';

export const SITE = {
  name: 'Kixup News',
  tagline: 'Soccer explained for American fans.',
  url: 'https://kixup.online',
  defaultDescription:
    'Soccer explainers and news context for American fans, covering MLS, USMNT, Premier League, Champions League, transfers, and soccer business.',
  author: 'Aditya Argadinata',
  locale: 'en_US',
  language: 'en',
  contactEmail: 'hello@kixup.online',
  foundingDate: '2026-06-28',
  sameAs: [] as string[],
};

export const categories = [
  { name: 'World Cup', slug: 'world-cup', description: 'World Cup news, match context, tournament explainers, and team storylines.' },
  { name: 'MLS', slug: 'mls', description: 'Major League Soccer explainers, rules, roster context, and league business.' },
  { name: 'USMNT', slug: 'usmnt', description: 'Context and explainers around the United States men’s national team.' },
  { name: 'Premier League', slug: 'premier-league', description: 'Premier League guides, club business, popularity, and US viewing context.' },
  { name: 'Champions League', slug: 'champions-league', description: 'UEFA Champions League format, history, and match context for American fans.' },
  { name: 'Transfers', slug: 'transfers', description: 'How soccer transfers, fees, loans, release clauses, and windows work.' },
  { name: 'Soccer Business', slug: 'soccer-business', description: 'Money, media rights, club revenue, salary rules, and financial regulation in soccer.' },
  { name: 'Analysis', slug: 'analysis', description: 'Tactical analysis, rules context, features, and deeper soccer explainers.' },
] as const;

export const primaryNav = [
  { name: 'Soccer', href: '/' },
  { name: 'World Cup', href: '/world-cup/' },
  { name: 'News', href: '/news/' },
  { name: 'Scores', href: '/scores/' },
  { name: 'Schedule', href: '/schedule/' },
  { name: 'Premier League', href: '/premier-league/' },
] as const;

export type Article = CollectionEntry<'articles'>;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getCategory(slugOrName: string) {
  const slug = slugify(slugOrName);
  return categories.find((category) => category.slug === slug || slugify(category.name) === slug);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getArticleUrl(article: Article) {
  return `/${article.data.slug}/`;
}

export function getReadingTime(body = '') {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

export function sortArticles(articles: Article[]) {
  return [...articles].sort((a, b) => {
    const publishedDiff = b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
    if (publishedDiff !== 0) return publishedDiff;

    const updatedDiff = b.data.updatedAt.getTime() - a.data.updatedAt.getTime();
    if (updatedDiff !== 0) return updatedDiff;

    return a.data.title.localeCompare(b.data.title);
  });
}

export function getRelatedArticles(current: Article, articles: Article[], limit = 3) {
  return sortArticles(articles)
    .filter((article) => article.id !== current.id)
    .map((article) => ({
      article,
      score:
        (article.data.category === current.data.category ? 4 : 0) +
        article.data.tags.filter((tag) => current.data.tags.includes(tag)).length,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.article);
}
