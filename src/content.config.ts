import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const journalCategories = ['การกิน', 'การฝึก', 'สุขภาพ', 'ขน', 'ชีวิตประจำวัน'] as const;

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      category: z.enum(journalCategories),
      /** Leave out until known: the page shows a [placeholder] instead. */
      date: z.coerce.date().optional(),
      ageMonths: z.number().optional(),
      cover: image(),
      gallery: z.array(image()).default([]),
      /** True while cover/gallery are temporary AI images, not real photos. */
      tempPhotos: z.boolean().default(false),
    }),
});

export const collections = { journal };
