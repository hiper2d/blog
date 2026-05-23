import rss from '@astrojs/rss';
import { getPosts, postUrl } from '../lib/posts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'Alex Zelenovsky',
    description:
      'Notes from a working defender on AI, cybersecurity, and the boundary between them.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary ?? '',
      link: postUrl(post),
    })),
  });
}
