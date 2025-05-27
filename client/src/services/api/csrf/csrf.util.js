import { API_CONFIG } from "@/api/config";
export function getCookie(name) {
  const cookieStr = document.cookie;
  const cookies = cookieStr.split("; ");
  for (let cookie of cookies) {
    const [k, v] = cookie.split("=");
    if (k === name) return v;
  }
  return null;
}
export function getCsrfToken() {
  return getCookie(API_CONFIG.csrf.cookieName);
}