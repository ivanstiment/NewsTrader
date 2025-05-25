import { api } from "@/api";
import { CSRF_HEADER_NAME } from '@/config/csrf.config';
import { getCookie } from "@/utils/csrf.utils";

// Añade el token CSRF a cada request mutante (POST, PUT, PATCH, DELETE)
api.interceptors.request.use((config) => {
  if (
    ["post", "put", "patch", "delete"].includes(
      config.method && config.method.toLowerCase()
    )
  ) {
    const token = getCookie();
    if (token) {
      config.headers[CSRF_HEADER_NAME] = token;
    }
  }
  return config;
});