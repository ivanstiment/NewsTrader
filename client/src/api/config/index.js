import { API_CONFIG, POLL_CONFIG, REFRESH_CONFIG } from "./defaults.js";
import {
  BASE_URLS,
  ENDPOINTS,
  getBaseUrl,
  getRefreshUrl,
} from "./endpoints.js";

export {
  API_CONFIG, BASE_URLS,
  ENDPOINTS,
  getBaseUrl,
  getRefreshUrl, POLL_CONFIG, REFRESH_CONFIG
};

// Exportación por defecto con todas las configuraciones
export default {
  BASE_URLS,
  ENDPOINTS,
  getBaseUrl,
  getRefreshUrl,
  API_CONFIG,
  REFRESH_CONFIG,
  POLL_CONFIG,
};
