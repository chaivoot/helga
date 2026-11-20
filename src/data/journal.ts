import { getCollection, type CollectionEntry } from 'astro:content';

export type JournalPost = CollectionEntry<'journal'>;

/** Newest first; posts without a date keep their file order after dated ones. */
export async function getJournalPosts(): Promise<JournalPost[]> {
  const posts = await getCollection('journal');
  return posts.sort((a, b) => {
    const da = a.data.date?.getTime();
    const db = b.data.date?.getTime();
    if (da !== undefined && db !== undefined) return db - da;
    if (da !== undefined) return -1;
    if (db !== undefined) return 1;
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  });
}

const thaiDate = new Intl.DateTimeFormat('th-TH', { dateStyle: 'long' });

export function dateLabel(date?: Date): string {
  return date ? thaiDate.format(date) : '[วันที่โพสต์]';
}

export function ageLabel(months: number | undefined, withUnit = true): string {
  if (months === undefined) return withUnit ? 'อายุ [ ] เดือน' : 'อายุ [ ]';
  return `อายุ ${months} เดือน`;
}
