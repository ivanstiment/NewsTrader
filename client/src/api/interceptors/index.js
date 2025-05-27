import {
  requestErrorInterceptor,
  requestInterceptor,
} from "./request.interceptor.js";
import {
  responseErrorInterceptor,
  responseInterceptor,
} from "./response.interceptor.js";

export {
  requestErrorInterceptor,
  requestInterceptor,
  responseErrorInterceptor,
  responseInterceptor
};

// Exportación por defecto con todos los interceptores
export default {
  requestInterceptor,
  requestErrorInterceptor,
  responseInterceptor,
  responseErrorInterceptor,
};
