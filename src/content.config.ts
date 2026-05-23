import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts: markdown files in posts/. `status: draft` posts are excluded
// in production builds via the helper in src/lib/posts.ts. Drafts still
// render in `astro dev` so Alex can preview before publishing.
const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './posts',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    date: z.coerce.date(),
    status: z.enum(['draft', 'published']).default('published'),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    header_image: z.string().optional(),
    canonical_url: z.string().url().optional(),
  }),
});

export const collections = { posts };
