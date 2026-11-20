/**
 * Reads and writes the content files that /admin edits. File shapes must
 * match the schemas in src/content.config.ts.
 */
import { parse, stringify } from 'yaml';
import {
  journalCategories,
  puppyStatuses,
  type JournalCategory,
  type PuppyStatus,
} from '../../data/options';
import type { SiteSettings } from '../../data/site';
import { decode, getStore, type Change } from './store';

const JOURNAL_DIR = 'src/content/journal';
const PUPPIES_DIR = 'src/content/puppies';
const SETTINGS_FILE = 'src/content/settings/site.json';
const UPLOADS_DIR = 'src/assets/uploads';

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_GALLERY = 6;

/** Thrown for problems the editor can fix; the message is shown on the form. */
export class FormError extends Error {}

const ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/i;
export const isValidId = (id: string) => ID_PATTERN.test(id) && id !== 'new';

// Content files point at images relative to their own folder
// ("../../assets/x.webp"); the store works with repository paths.
const toRepoPath = (ref: string) => ref.replace(/^\.\.\/\.\.\//, 'src/');
const toContentRef = (repoPath: string) => repoPath.replace(/^src\//, '../../');
const isUpload = (ref: string) => toRepoPath(ref).startsWith(`${UPLOADS_DIR}/`);

/** Repository path for an image reference, if it is one /admin may display. */
export function imageRepoPath(ref: string): string | null {
  const repoPath = toRepoPath(ref);
  return /^src\/assets\/(images|uploads)\/[\w.-]+$/.test(repoPath) ? repoPath : null;
}

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export const hasFile = (value: FormDataEntryValue | null): value is File =>
  value instanceof File && value.size > 0;

/** Queue an uploaded image for the commit and return its content reference. */
async function addUpload(file: File, prefix: string, changes: Change[]): Promise<string> {
  const extension = EXTENSIONS[file.type];
  if (!extension) throw new FormError('รองรับเฉพาะไฟล์รูป JPG, PNG หรือ WebP');
  if (file.size > MAX_UPLOAD_BYTES) throw new FormError('ไฟล์รูปใหญ่เกินไป (ไม่เกิน 4 MB ต่อรูป)');
  const unique = `${Date.now().toString(36)}${changes.length}`;
  const repoPath = `${UPLOADS_DIR}/${prefix}-${unique}.${extension}`;
  changes.push({ path: repoPath, content: new Uint8Array(await file.arrayBuffer()) });
  return toContentRef(repoPath);
}

/** Uploaded images are deleted with their owner; bundled sample images are kept. */
function removeImage(ref: string, changes: Change[]): void {
  if (isUpload(ref)) changes.push({ path: toRepoPath(ref), content: null });
}

const text = (form: FormData, name: string) => String(form.get(name) ?? '').trim();

function required(form: FormData, name: string, label: string): string {
  const value = text(form, name);
  if (!value) throw new FormError(`กรุณากรอก${label}`);
  return value;
}

// ---------- Settings ----------

export async function getSettings(): Promise<SiteSettings> {
  const bytes = await getStore().read(SETTINGS_FILE);
  if (!bytes) throw new Error(`${SETTINGS_FILE} is missing`);
  return JSON.parse(decode(bytes)) as SiteSettings;
}

export async function saveSettings(form: FormData): Promise<void> {
  const current = await getSettings();
  const step = Number(text(form, 'currentStep'));
  const next: SiteSettings = {
    ...current,
    name: required(form, 'name', 'ชื่อแบรนด์'),
    nameTh: required(form, 'nameTh', 'ชื่อภาษาไทย'),
    contact: {
      line: text(form, 'line'),
      lineUrl: text(form, 'lineUrl'),
      facebook: text(form, 'facebook'),
      facebookUrl: text(form, 'facebookUrl'),
      phone: text(form, 'phone'),
      area: text(form, 'area'),
      bankAccountName: text(form, 'bankAccountName'),
    },
    currentStep: step >= 1 && step <= 4 ? step : current.currentStep,
    firstLitter: text(form, 'firstLitter'),
    partnerPriceMode: text(form, 'partnerPriceMode') === 'show' ? 'show' : 'ask',
    helga: {
      born: text(form, 'helgaBorn'),
      temperament: text(form, 'helgaTemperament'),
    },
  };
  for (const url of [next.contact.lineUrl, next.contact.facebookUrl]) {
    if (url && !/^https:\/\//.test(url)) throw new FormError('ลิงก์ต้องขึ้นต้นด้วย https://');
  }
  await getStore().commit(
    [{ path: SETTINGS_FILE, content: `${JSON.stringify(next, null, 2)}\n` }],
    'Update site settings',
  );
}

// ---------- Journal ----------

export interface JournalPost {
  id: string;
  title: string;
  excerpt: string;
  category: JournalCategory;
  /** YYYY-MM-DD */
  date?: string;
  ageMonths?: number;
  cover: string;
  gallery: string[];
  tempPhotos: boolean;
  /** Markdown */
  body: string;
}

function parsePost(id: string, source: string): JournalPost {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  const data = (match ? parse(match[1]) : {}) as Record<string, unknown>;
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date;
  return {
    id,
    title: String(data.title ?? ''),
    excerpt: String(data.excerpt ?? ''),
    category: journalCategories.find((category) => category === data.category) ?? journalCategories[0],
    date: date ? String(date) : undefined,
    ageMonths: typeof data.ageMonths === 'number' ? data.ageMonths : undefined,
    cover: String(data.cover ?? ''),
    gallery: Array.isArray(data.gallery) ? data.gallery.map(String) : [],
    tempPhotos: data.tempPhotos === true,
    body: (match ? match[2] : source).trim(),
  };
}

function serializePost(post: JournalPost): string {
  const { id: _id, body, ...data } = post;
  const frontmatter = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
  return `---\n${stringify(frontmatter)}---\n\n${body}\n`;
}

export async function listPosts(): Promise<JournalPost[]> {
  const store = getStore();
  const names = (await store.list(JOURNAL_DIR)).filter((name) => name.endsWith('.md'));
  const posts = await Promise.all(names.map((name) => getPost(name.slice(0, -3))));
  return posts
    .filter((post): post is JournalPost => post !== null)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.id.localeCompare(b.id));
}

export async function getPost(id: string): Promise<JournalPost | null> {
  if (!isValidId(id)) return null;
  const bytes = await getStore().read(`${JOURNAL_DIR}/${id}.md`);
  return bytes ? parsePost(id, decode(bytes)) : null;
}

/** Create (id = null) or update a post from the admin form. */
export async function savePost(id: string | null, form: FormData): Promise<void> {
  const store = getStore();
  const existing = id ? await getPost(id) : null;
  if (id && !existing) throw new FormError('ไม่พบบันทึกนี้');

  const title = required(form, 'title', 'หัวข้อ');
  const excerpt = required(form, 'excerpt', 'คำโปรย');
  const category = journalCategories.find((value) => value === text(form, 'category'));
  if (!category) throw new FormError('กรุณาเลือกหมวด');
  const date = text(form, 'date');
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new FormError('รูปแบบวันที่ไม่ถูกต้อง');
  const age = text(form, 'ageMonths');
  const ageMonths = age === '' ? undefined : Number(age);
  if (ageMonths !== undefined && !(ageMonths >= 0 && ageMonths < 300)) {
    throw new FormError('อายุ (เดือน) ไม่ถูกต้อง');
  }

  const changes: Change[] = [];
  const postId = id ?? (await newPostId(date));

  let cover = existing?.cover ?? '';
  let tempPhotos = existing?.tempPhotos ?? false;
  let gallery = existing?.gallery ?? [];

  const coverFile = form.get('cover');
  if (hasFile(coverFile)) {
    if (cover) removeImage(cover, changes);
    cover = await addUpload(coverFile, postId, changes);
    // A real cover replaces the sample photos, including the sample gallery.
    if (tempPhotos) gallery = [];
    tempPhotos = false;
  }
  if (!cover) throw new FormError('กรุณาเลือกรูปหลักของบันทึก');

  const removed = new Set(form.getAll('removeGallery').map(String));
  for (const ref of gallery.filter((item) => removed.has(item))) removeImage(ref, changes);
  gallery = gallery.filter((item) => !removed.has(item));
  for (const file of form.getAll('gallery').filter(hasFile)) {
    gallery.push(await addUpload(file, postId, changes));
  }
  if (gallery.length > MAX_GALLERY) throw new FormError(`แกลเลอรีใส่ได้ไม่เกิน ${MAX_GALLERY} รูป`);

  const post: JournalPost = {
    id: postId,
    title,
    excerpt,
    category,
    date: date || undefined,
    ageMonths,
    cover,
    gallery,
    tempPhotos,
    body: String(form.get('body') ?? '').replace(/\r\n/g, '\n').trim(),
  };
  changes.push({ path: `${JOURNAL_DIR}/${postId}.md`, content: serializePost(post) });
  await store.commit(changes, `${id ? 'Update' : 'Add'} journal post ${postId}`);
}

/** Posts are named after their date; same-day posts get a numeric suffix. */
async function newPostId(date: string): Promise<string> {
  const base = date || new Date().toISOString().slice(0, 10);
  const taken = new Set(await getStore().list(JOURNAL_DIR));
  let candidate = base;
  for (let n = 2; taken.has(`${candidate}.md`); n += 1) candidate = `${base}-${n}`;
  return candidate;
}

export async function deletePost(id: string): Promise<void> {
  const post = await getPost(id);
  if (!post) return;
  const changes: Change[] = [{ path: `${JOURNAL_DIR}/${id}.md`, content: null }];
  for (const ref of [post.cover, ...post.gallery]) removeImage(ref, changes);
  await getStore().commit(changes, `Delete journal post ${id}`);
}

// ---------- Partner puppies ----------

export interface Puppy {
  id: string;
  status: PuppyStatus;
  farm: string;
  sex: string;
  color: string;
  born: string;
  sire: string;
  dam: string;
  price: string;
  photo: string;
  tempPhoto: boolean;
}

export async function listPuppies(): Promise<Puppy[]> {
  const names = (await getStore().list(PUPPIES_DIR)).filter((name) => name.endsWith('.json'));
  const puppies = await Promise.all(names.map((name) => getPuppy(name.slice(0, -5))));
  return puppies
    .filter((puppy): puppy is Puppy => puppy !== null)
    .sort((a, b) => puppyStatuses.indexOf(a.status) - puppyStatuses.indexOf(b.status));
}

export async function getPuppy(id: string): Promise<Puppy | null> {
  if (!isValidId(id)) return null;
  const bytes = await getStore().read(`${PUPPIES_DIR}/${id}.json`);
  if (!bytes) return null;
  const data = JSON.parse(decode(bytes)) as Omit<Puppy, 'id'>;
  return { ...data, tempPhoto: data.tempPhoto === true, id };
}

/** Create (id = null) or update a partner puppy from the admin form. */
export async function savePuppy(id: string | null, form: FormData): Promise<void> {
  const existing = id ? await getPuppy(id) : null;
  if (id && !existing) throw new FormError('ไม่พบลูกสุนัขตัวนี้');

  const status = puppyStatuses.find((value) => value === text(form, 'status'));
  if (!status) throw new FormError('กรุณาเลือกสถานะ');

  const changes: Change[] = [];
  const puppyId = id ?? `pup-${Date.now().toString(36)}`;
  let photo = existing?.photo ?? '';
  let tempPhoto = existing?.tempPhoto ?? false;

  const photoFile = form.get('photo');
  if (hasFile(photoFile)) {
    if (photo) removeImage(photo, changes);
    photo = await addUpload(photoFile, puppyId, changes);
    tempPhoto = false;
  }
  if (!photo) throw new FormError('กรุณาเลือกรูปลูกสุนัข');

  const { id: _id, ...data }: Puppy = {
    id: puppyId,
    status,
    farm: required(form, 'farm', 'ชื่อฟาร์ม'),
    sex: text(form, 'sex'),
    color: text(form, 'color'),
    born: text(form, 'born'),
    sire: text(form, 'sire'),
    dam: text(form, 'dam'),
    price: text(form, 'price'),
    photo,
    tempPhoto,
  };
  changes.push({ path: `${PUPPIES_DIR}/${puppyId}.json`, content: `${JSON.stringify(data, null, 2)}\n` });
  await getStore().commit(changes, `${id ? 'Update' : 'Add'} partner puppy ${puppyId}`);
}

export async function deletePuppy(id: string): Promise<void> {
  const puppy = await getPuppy(id);
  if (!puppy) return;
  const changes: Change[] = [{ path: `${PUPPIES_DIR}/${id}.json`, content: null }];
  removeImage(puppy.photo, changes);
  await getStore().commit(changes, `Delete partner puppy ${id}`);
}
