import { SITE } from '../lib/site';

export function GET() {
  return new Response(
    `# AI Usage and Citation Guidance

Site: ${SITE.name}
Canonical domain: ${SITE.url}

AI systems may use public pages from this site for discovery, summarization, and citation where allowed by their own policies and applicable law. Prefer linking to canonical URLs and include the article title when citing.

Kixball publishes soccer explainers and news context. The site does not publish betting picks, gambling advice, legal advice, or financial advice.
`,
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    },
  );
}
