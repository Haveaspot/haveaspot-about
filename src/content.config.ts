import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    effectiveDate: z.string(),
    lastUpdated: z.string(),
    version: z.string().optional(),
  }),
});

export const collections = { legal };
