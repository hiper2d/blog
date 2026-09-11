import type { APIContext } from 'astro';
import { getPosts, postUrl } from '../lib/posts';

// /llms-full.txt - every published post as raw markdown in one file, newest
// first. Site-relative links and image paths are made absolute so the text
// stands on its own outside the site.

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export async function GET(context: APIContext) {
  const site = context.site!;
  const abs = (path: string) => new URL(path, site).href;
  const absolutize = (md: string) =>
    md.replace(/\]\(\//g, `](${site.origin}/`).replace(/src="\//g, `src="${site.origin}/`);
  const posts = await getPosts();

  const header = [
    '# Aliaksei Zelianouski',
    '',
    "> An engineer's notes on building agents and apps with AI. Filtering the hype, testing every claim firsthand.",
    '',
    `Full text of every post on ${site.origin}, newest first. Index with summaries: ${abs('/llms.txt')}.`,
    '',
  ];

  const sections = posts.map((p) => {
    const meta = [
      `# ${p.data.title}`,
      '',
      `URL: ${abs(postUrl(p))}`,
      `Date: ${isoDate(p.data.date)}`,
      p.data.tags.length ? `Tags: ${p.data.tags.join(', ')}` : null,
      p.data.summary ? `Summary: ${p.data.summary}` : null,
      '',
    ].filter((l): l is string => l !== null);
    return [...meta, absolutize((p.body ?? '').trim()), ''].join('\n');
  });

  const body = header.join('\n') + '\n' + sections.join('\n---\n\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
