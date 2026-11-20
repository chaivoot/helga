import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { journalCategories, puppyStatuses } from './data/options';

// Both collections are edited from /admin (see src/lib/admin/content.ts,
// which writes files in exactly these shapes).

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

const puppies = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/puppies' }),
  schema: ({ image }) =>
    z.object({
      status: z.enum(puppyStatuses),
      farm: z.string(),
      sex: z.string(),
      color: z.string(),
      born: z.string(),
      sire: z.string(),
      dam: z.string(),
      /** Shown only when the price mode in settings is "show". */
      price: z.string(),
      photo: image(),
      /** True while `photo` is a temporary AI image standing in for a real one. */
      tempPhoto: z.boolean().default(false),
    }),
});

export const collections = { journal, puppies };
