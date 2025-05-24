import axios from "axios";
import {
  getAccessToken as readToken,
  setAccessToken as writeToken,
  getRefreshToken,
  clearAllTokens
} from "@/services/tokenService";

// Configurar defaults
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

// Determinar URLs base
const isDevelopment = import.meta.env.MODE === "development";
const baseUrl = isDevelopment
  ? import.meta.env.VITE_API_BASE_URL_LOCAL || "http://localhost:8000/api"
  : import.meta.env.VITE_API_BASE_URL_PROD || "/api";

const refreshUrl = isDevelopment
  ? (import.meta.env.VITE_API_BASE_URL_LOCAL || "http://localhost:8000") + "/token/refresh/"
  : "/token/refresh/";

console.log('API Configuration:', { isDevelopment, baseUrl, refreshUrl });

// Crear instancia de axios
const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 10000, // 10 segundos timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Variables para manejar refresh de tokens
let isRefreshing = false;
let refreshSubscribers = [];

// Función para añadir subscribers
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

// Al tener nuevo token, ejecutar subscribers
function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

// Interceptor de request
api.interceptors.request.use(
  (config) => {
    const token = readToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    
    // Log para debugging
    if (response) {
      console.error(`API Error: ${response.status} - ${response.statusText}`, {
        url: config?.url,
        method: config?.method,
        data: response.data
      });
    }

    // Si es error 401 y no es una petición de retry
    if (response?.status === 401 && !config._retry) {
      config._retry = true;

      // Si ya estamos refrescando, añadir a la cola
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(axios.request(config));
          });
        });
      }

      // Intentar refrescar token
      isRefreshing = true;
      
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const { data } = await axios.post(
          refreshUrl,
          { refresh: refreshToken },
          { withCredentials: true }
        );
        
        writeToken(data.access);
        isRefreshing = false;
        onRefreshed(data.access);
        
        // Reintentar la petición original
        config.headers.Authorization = `Bearer ${data.access}`;
        return axios.request(config);
        
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        isRefreshing = false;
        
        // Limpiar tokens y redirigir
        clearAllTokens();
        
        // Evitar bucle infinito en rutas de auth
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register') &&
            !window.location.pathname.includes('/home')) {
          window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Para otros errores, rechazar directamente
    return Promise.reject(error);
  }
);

export default api;