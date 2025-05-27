import { api, API_CONFIG } from "@/api";
import { getCookie } from "./csrf.util";

// Añade el token CSRF a cada request mutante (POST, PUT, PATCH, DELETE)
api.interceptors.request.use((config) => {
  if (
    ["post", "put", "patch", "delete"].includes(
      config.method && config.method.toLowerCase()
    )
  ) {
    const token = getCookie();
    if (token) {
      config.headers[API_CONFIG.csrf.headerName] = token;
    }
  }
  return config;
});