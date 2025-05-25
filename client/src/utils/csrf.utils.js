import { CSRF_COOKIE_NAME } from '@/config/csrf.config';
export function getCookie(name) {
  const cookie = `; ${document.cookie}`;
  const parts = cookie.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(';').shift() : null;
}
export function getCsrfToken() {
  return getCookie(CSRF_COOKIE_NAME);
}