import rss from '@astrojs/rss';
import { getPosts, postUrl } from '../lib/posts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'Aliaksei Zelianouski',
    description:
      "An engineer's notes on building agents and apps with AI. Filtering the hype, testing every claim firsthand.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary ?? '',
      link: postUrl(post),
    })),
  });
}
