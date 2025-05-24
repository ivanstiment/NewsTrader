import axios from "axios";
import { API_CONFIG } from "./config/defaults";
import { getBaseUrl } from "./config/endpoints";
import {
  requestErrorInterceptor,
  requestInterceptor,
  responseErrorInterceptor,
  responseInterceptor,
} from "./interceptors";

// Configurar valores por defecto para CSRF
axios.defaults.xsrfCookieName = API_CONFIG.csrf.cookieName;
axios.defaults.xsrfHeaderName = API_CONFIG.csrf.headerName;
axios.defaults.withCredentials = API_CONFIG.withCredentials;

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  ...API_CONFIG,
});

// Configurar interceptors
apiClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor);

apiClient.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);

export default apiClient;
