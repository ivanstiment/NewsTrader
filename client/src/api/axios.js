import axios from "axios";
import {
  getAccessToken as readToken,
  setAccessToken as writeToken,
} from "@/services/tokenService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});


let isRefreshing = false;
let refreshSubscribers = [];

// Función para añadir subscribers
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

// Al tener nuevo token, ejecutar subs
function onRefreshed(newToken) {
  refreshSubscribers.forEach(cb => cb(newToken));
  refreshSubscribers = [];
}

api.interceptors.request.use((config) => {
  const token = readToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const { config, response } = err;
    if (response?.status === 401 && !config._retry) {
      // Marcar esta petición para no reintentar múltiples veces
      config._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await axios.post(
            "http://localhost:8000/token/refresh/",
            {},
            { withCredentials: true }
          );
          writeToken(data.access);
          isRefreshing = false;
          onRefreshed(data.access);
        } catch (refreshError) {
          isRefreshing = false;
          // forzar logout o redirección
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      // Devolver una promesa que espere al nuevo token
      return new Promise(resolve => {
        subscribeTokenRefresh(newToken => {
          // Obtenido el token, reconfigurar y reintentar
          config.headers.Authorization = `Bearer ${newToken}`;
          resolve(axios.request(config));
        });
      });
    }
    return Promise.reject(err);
  }
);

export default api;
