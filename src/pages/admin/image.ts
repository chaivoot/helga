import type { APIRoute } from 'astro';
import { imageRepoPath } from '../../lib/admin/content';
import { getStore } from '../../lib/admin/store';

export const prerender = false;

const TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

/** Serves a content image straight from the store, for previews in /admin. */
export const GET: APIRoute = async ({ url }) => {
  const repoPath = imageRepoPath(url.searchParams.get('ref') ?? '');
  const type = repoPath && TYPES[repoPath.split('.').pop() ?? ''];
  if (!repoPath || !type) return new Response('Not found', { status: 404 });
  const bytes = await getStore().read(repoPath);
  if (!bytes) return new Response('Not found', { status: 404 });
  return new Response(new Blob([new Uint8Array(bytes)]), {
    headers: { 'Content-Type': type, 'Cache-Control': 'private, max-age=3600' },
  });
};
