/**
 * Helpers for the editable page content in src/content/pages/*.json
 * (edited from /admin/pages).
 */
import type { ImageMetadata } from 'astro';
import { site } from './site';

/** How an image is stored in page content. */
export interface PageImage {
  /** Path relative to the content file, e.g. "../../assets/uploads/x.jpg". */
  src: string;
  alt: string;
  /** CSS object-position tuned for the bundled sample image. */
  position?: string;
  /** True while this is a temporary AI stand-in for a real photo. */
  temp?: boolean;
}

const imageFiles = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/{images,uploads}/*.{webp,jpg,png}',
  { eager: true },
);

/** Props for <Photo> from a stored image. */
export function photo(image: PageImage) {
  const file = imageFiles[image.src.replace('../../', '../')];
  if (!file) throw new Error(`Page content points at a missing image: ${image.src}`);
  return {
    src: file.default,
    alt: image.alt,
    position: image.position,
    temp: image.temp === true,
  };
}

/** Fill in "{name}" (the brand name) throughout a page's content. */
export function page<T>(content: T): T {
  if (typeof content === 'string') return content.replaceAll('{name}', site.name) as T;
  if (Array.isArray(content)) return content.map(page) as T;
  if (content && typeof content === 'object') {
    return Object.fromEntries(Object.entries(content).map(([key, value]) => [key, page(value)])) as T;
  }
  return content;
}

/** Split a text area value into paragraphs (blank line = new paragraph). */
export const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

const escapeHtml = (text: string) =>
  text.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]!);

const SCHOOL_URL = 'https://dogsanook.com';

/**
 * Text as HTML for `set:html`: escaped, with every mention of the training
 * school turned into a link that looks like the surrounding text.
 */
export const rich = (text: string) =>
  escapeHtml(text).replace(
    /(?:โรงเรียน)?หมาสนุก/g,
    (name) => `<a class="quiet-link" href="${SCHOOL_URL}" target="_blank" rel="noopener">${name}</a>`,
  );
