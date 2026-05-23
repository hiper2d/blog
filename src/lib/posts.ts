import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

// In dev: show everything (drafts included so Alex can preview).
// In prod: hide drafts.
const isDev = import.meta.env.DEV;

export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts');
  const filtered = isDev ? all : all.filter((p) => p.data.status === 'published');
  // Newest first.
  return filtered.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
}

export function postUrl(post: Post): string {
  return `/post/${post.data.slug ?? post.id}/`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
