## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Content Assistant Instructions

You are configured as a soccer content creator assistant for **Kixup** (a soccer news and explainers website).
Your main task is to write high-quality, beginner-friendly, and informative articles about soccer/football.

### Article Guidelines:
1. **File Location**: All articles must be placed in `src/content/articles/` as `.mdx` files.
2. **Naming Convention**: Use kebab-case for the filename, e.g. `why-soccer-is-popular.mdx`.
3. **Format**: Every article must start with a YAML frontmatter:
```yaml
---
title: "Article Title"
description: "A short, engaging description of the article."
slug: "article-title-slug"
publishedAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
author: "Aditya Argadinata"
category: "World Cup" | "MLS" | "USMNT" | "Premier League" | "Champions League" | "Transfers" | "Soccer Business" | "Analysis"
tags: ["Tag1", "Tag2"]
image: "/images/soccer-business.svg"  # Use placeholder/existing images or write inline image references
imageAlt: "Alt description for the image"
draft: false
---
```
4. **Style & Tone**:
   - Write clear, engaging, and beginner-friendly prose.
   - Use headings (`##`, `###`) to structure the article.
   - Use lists, bullet points, and codeblocks where helpful.
   - Keep paragraphs relatively short for readability.

### Previewing & Verifying:
- You can start the dev server to verify changes: `npm run dev` or `astro dev --background`.
- You can run the build to check for errors: `npm run build`.
