import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    author: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    image: z.string(),
    imageAlt: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
