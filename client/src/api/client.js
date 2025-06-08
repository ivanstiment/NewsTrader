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

// Interceptor de peticiones que añade referencia a la instancia
const enhancedRequestInterceptor = (config) => {
  // Añadir referencia a la instancia para poder reintentar peticiones
  config.__axiosInstance = apiClient;
  return requestInterceptor(config);
};

// Configurar interceptors
apiClient.interceptors.request.use(
  enhancedRequestInterceptor,
  requestErrorInterceptor
);
apiClient.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);

// Inyectar el cliente en los servicios para evitar dependencias circulares
// Esto se hace después de crear la instancia
import { csrfService } from "@/services/api/csrf/csrf.service";
import { tokenRefreshManager } from "@/services/api/token/token.handler";

// Inyectar la instancia en los servicios
csrfService.setApiClient(apiClient);
tokenRefreshManager.setApiClient(apiClient);

export default apiClient;
