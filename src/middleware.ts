import { defineMiddleware } from 'astro:middleware';
import { isAuthenticated } from './lib/admin/auth';
import { AdminConfigError } from './lib/admin/store';

/** Everything under /admin needs a logged-in session, except the login page. */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  if (!isAdmin || pathname.startsWith('/admin/login')) return next();
  if (!isAuthenticated(context.cookies)) return context.redirect('/admin/login/');
  try {
    return await next();
  } catch (error) {
    // Missing environment variables: say which, instead of a blank error page.
    if (error instanceof AdminConfigError) {
      return new Response(`ระบบหลังบ้านยังตั้งค่าไม่ครบ: ${error.message}`, {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
    throw error;
  }
});
