/**
 * Single shared password for /admin (ADMIN_PASSWORD). A successful login sets
 * a signed, HTTP-only cookie; there are no user accounts.
 */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { getSecret } from 'astro:env/server';

const COOKIE = 'admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const digest = (value: string) => createHash('sha256').update(value).digest();

/** Signing key derived from the password: changing it logs everyone out. */
function signingKey(): Buffer | null {
  const password = getSecret('ADMIN_PASSWORD');
  return password ? digest(`session:${password}`) : null;
}

const sign = (payload: string, key: Buffer) => createHmac('sha256', key).update(payload).digest('hex');

export const isConfigured = () => Boolean(getSecret('ADMIN_PASSWORD'));

export function checkPassword(attempt: string): boolean {
  const password = getSecret('ADMIN_PASSWORD');
  if (!password) return false;
  // Hash both sides so the comparison is constant-time and length-independent.
  return timingSafeEqual(digest(attempt), digest(password));
}

export function startSession(cookies: AstroCookies): void {
  const key = signingKey();
  if (!key) return;
  const expires = String(Date.now() + MAX_AGE_SECONDS * 1000);
  cookies.set(COOKIE, `${expires}.${sign(expires, key)}`, {
    path: '/admin',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: MAX_AGE_SECONDS,
  });
}

export function endSession(cookies: AstroCookies): void {
  cookies.delete(COOKIE, { path: '/admin' });
}

export function isAuthenticated(cookies: AstroCookies): boolean {
  const key = signingKey();
  const value = cookies.get(COOKIE)?.value;
  if (!key || !value) return false;
  const [expires, signature] = value.split('.');
  if (!expires || !signature) return false;
  const expected = sign(expires, key);
  if (signature.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  return Number(expires) > Date.now();
}
