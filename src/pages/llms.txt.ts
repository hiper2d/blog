import type { APIContext } from 'astro';
import { getPosts, postUrl } from '../lib/posts';

// /llms.txt - the llmstxt.org index: what this site is, plus one line per
// post with its canonical URL and summary. Full bodies live in
// /llms-full.txt. Same post list as the homepage/RSS (drafts hidden in prod).

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export async function GET(context: APIContext) {
  const site = context.site!;
  const abs = (path: string) => new URL(path, site).href;
  const posts = await getPosts();

  const lines: string[] = [
    '# Aliaksei Zelianouski',
    '',
    "> An engineer's notes on building agents and apps with AI. Filtering the hype, testing every claim firsthand.",
    '',
    'Personal blog of Aliaksei (Alex) Zelianouski, a software engineer with fifteen years of experience who builds agents and apps with AI for fun. Posts are short and firsthand: based on something actually built, measured, or argued about, not abstract opinion. Recurring subjects are AI Werewolf (a party game where LLM bots try to pass for human), Simona (a heavily customized AI pair-programming setup), Marlow (an autonomous long-loop editorial agent), AI video generation pipelines, and model behavior tested directly.',
    '',
    `The canonical version of every post lives on this site. Copies on Substack, dev.to, LinkedIn, and elsewhere point back here. Each post is also available as markdown in ${abs('/llms-full.txt')}.`,
    '',
    '## Posts',
    '',
    ...posts.map(
      (p) =>
        `- [${p.data.title}](${abs(postUrl(p))}): ${isoDate(p.data.date)}. ${p.data.summary ?? ''}`.trimEnd(),
    ),
    '',
    '## Optional',
    '',
    `- [Full text of all posts](${abs('/llms-full.txt')}): every post as markdown in one file`,
    `- [About](${abs('/about/')}): who writes this and how`,
    `- [Archive](${abs('/archive/')}): all posts by year`,
    `- [RSS](${abs('/rss.xml')}): feed of new posts`,
    '- [Substack](https://hiper2d.substack.com/): newsletter, same posts delivered by email',
    '- [dev.to](https://dev.to/hiper2d): technical cross-posts, canonical URL points back here',
    '- [YouTube](https://www.youtube.com/@hiper2d): AI Werewolf videos and AI-made short films',
    '- [LinkedIn](https://www.linkedin.com/in/aliakseizelianouski/): shorter versions of some posts',
  ];

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
