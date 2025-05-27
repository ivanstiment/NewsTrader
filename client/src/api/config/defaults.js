export const API_CONFIG = {
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  // Configuración CSRF
  csrf: {
    cookieName: "csrftoken",
    headerName: "X-CSRFToken",
  },
};

export const REFRESH_CONFIG = {
  maxRetries: 1,
  retryDelay: 1000,
};
