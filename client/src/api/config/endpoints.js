const isDevelopment = import.meta.env.MODE === "development";

export const BASE_URLS = {
  development:
    import.meta.env.VITE_API_BASE_URL_LOCAL || "http://localhost:8000/api",
  production: import.meta.env.VITE_API_BASE_URL_PROD || "",
};

export const getBaseUrl = () => {
  return isDevelopment ? BASE_URLS.development : BASE_URLS.production;
};

export const getRefreshUrl = () => {
  const base = isDevelopment ? BASE_URLS.development : "";
  return `${base}/token/refresh/`;
};

export const ENDPOINTS = {
  // Autenticación y tokens
  AUTH: {
    LOGIN: "/token/",
    LOGOUT: "/logout/",
    REGISTER: "/register/",
    REFRESH: "/token/refresh/",
    VERIFY: "/auth/verify/"
  },

  // CSRF
  CSRF: "/csrf/",

  // Usuarios
  USER: {
    PROFILE: "/user/profile/",
    LIST: "/user/",
  },

  // Noticias
  NEWS: {
    LIST: "/news/",
    CREATE: "/news/",
    DETAIL: (id) => `/news/${id}/`,
    UPDATE: (id) => `/news/${id}/`,
    DELETE: (id) => `/news/${id}/`,
    FETCH_BY_SYMBOL: '/news/fetch-by-symbol/',
    BY_SYMBOL: (symbol) => `/news/by-symbol/${symbol}/`,
  },

  // Artículos
  ARTICLES: {
    LIST: "/articles/",
    CREATE: "/articles/",
    DETAIL: (id) => `/articles/${id}/`,
    ANALYZE: (id) => `/articles/${id}/analyze/`,
  },

  // Stocks
  STOCKS: {
    SEARCH: "/stocks/search/",
    DETAIL: (symbol) => `/stocks/${symbol}/`,
    HISTORICAL: (symbol) => `/stocks/${symbol}/historical/`,
  },
};
