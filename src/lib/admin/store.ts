/**
 * Where /admin reads and writes content files.
 *
 * In production the files live in the GitHub repository: saving makes one
 * commit, and the host (Vercel) rebuilds the site from it. In `astro dev`
 * without a token, files are edited on local disk instead.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { getSecret } from 'astro:env/server';

export interface Change {
  /** Repository-relative path, e.g. "src/content/journal/2026-01-01.md". */
  path: string;
  /** New file content, or null to delete the file. */
  content: string | Uint8Array | null;
}

export interface Store {
  /** File names directly inside a directory (empty if it does not exist). */
  list(dir: string): Promise<string[]>;
  read(file: string): Promise<Uint8Array | null>;
  /** Apply all changes together. */
  commit(changes: Change[], message: string): Promise<void>;
}

export class AdminConfigError extends Error {}

function githubStore(token: string, repo: string, branch: string): Store {
  const api = `https://api.github.com/repos/${repo}`;

  async function request(url: string, init: RequestInit = {}, accept = 'application/vnd.github+json') {
    const response = await fetch(url, {
      ...init,
      headers: {
        Accept: accept,
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'site-admin',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      },
    });
    return response;
  }

  async function json<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await request(url, init);
    if (!response.ok) {
      throw new Error(`GitHub ${init?.method ?? 'GET'} ${url} failed with ${response.status}`);
    }
    return (await response.json()) as T;
  }

  const contentsUrl = (file: string) =>
    `${api}/contents/${file.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(branch)}`;

  return {
    async list(dir) {
      const response = await request(contentsUrl(dir));
      if (response.status === 404) return [];
      if (!response.ok) throw new Error(`GitHub list ${dir} failed with ${response.status}`);
      const entries = (await response.json()) as { name: string; type: string }[];
      return entries.filter((entry) => entry.type === 'file').map((entry) => entry.name);
    },

    async read(file) {
      const response = await request(contentsUrl(file), {}, 'application/vnd.github.raw+json');
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`GitHub read ${file} failed with ${response.status}`);
      return new Uint8Array(await response.arrayBuffer());
    },

    // One commit for the whole save, so the site rebuilds once.
    async commit(changes, message) {
      const ref = await json<{ object: { sha: string } }>(`${api}/git/ref/heads/${branch}`);
      const parent = ref.object.sha;
      const parentCommit = await json<{ tree: { sha: string } }>(`${api}/git/commits/${parent}`);

      const tree = await Promise.all(
        changes.map(async (change) => {
          if (change.content === null) {
            return { path: change.path, mode: '100644', type: 'blob', sha: null };
          }
          const bytes =
            typeof change.content === 'string' ? Buffer.from(change.content, 'utf8') : Buffer.from(change.content);
          const blob = await json<{ sha: string }>(`${api}/git/blobs`, {
            method: 'POST',
            body: JSON.stringify({ content: bytes.toString('base64'), encoding: 'base64' }),
          });
          return { path: change.path, mode: '100644', type: 'blob', sha: blob.sha };
        }),
      );

      const newTree = await json<{ sha: string }>(`${api}/git/trees`, {
        method: 'POST',
        body: JSON.stringify({ base_tree: parentCommit.tree.sha, tree }),
      });
      const commit = await json<{ sha: string }>(`${api}/git/commits`, {
        method: 'POST',
        body: JSON.stringify({ message, tree: newTree.sha, parents: [parent] }),
      });
      await json(`${api}/git/refs/heads/${branch}`, {
        method: 'PATCH',
        body: JSON.stringify({ sha: commit.sha }),
      });
    },
  };
}

function localStore(root: string): Store {
  const resolve = (file: string) => path.join(root, file);
  return {
    async list(dir) {
      try {
        const entries = await fs.readdir(resolve(dir), { withFileTypes: true });
        return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
      } catch {
        return [];
      }
    },
    async read(file) {
      try {
        return new Uint8Array(await fs.readFile(resolve(file)));
      } catch {
        return null;
      }
    },
    async commit(changes) {
      for (const change of changes) {
        if (change.content === null) {
          await fs.rm(resolve(change.path), { force: true });
        } else {
          await fs.mkdir(path.dirname(resolve(change.path)), { recursive: true });
          await fs.writeFile(resolve(change.path), change.content);
        }
      }
    },
  };
}

export function getStore(): Store {
  const token = getSecret('GITHUB_TOKEN');
  if (token) {
    const owner = getSecret('VERCEL_GIT_REPO_OWNER');
    const slug = getSecret('VERCEL_GIT_REPO_SLUG');
    const repo = getSecret('GITHUB_REPO') ?? (owner && slug ? `${owner}/${slug}` : undefined);
    const branch = getSecret('GITHUB_BRANCH') ?? getSecret('VERCEL_GIT_COMMIT_REF');
    if (!repo || !branch) {
      throw new AdminConfigError('ยังไม่ได้ตั้งค่า GITHUB_REPO และ GITHUB_BRANCH');
    }
    return githubStore(token, repo, branch);
  }
  if (import.meta.env.DEV) return localStore(process.cwd());
  throw new AdminConfigError('ยังไม่ได้ตั้งค่า GITHUB_TOKEN ระบบหลังบ้านจึงยังบันทึกไม่ได้');
}

export const decode = (bytes: Uint8Array) => new TextDecoder().decode(bytes);
