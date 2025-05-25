import {
  handleAuthError,
  handleAuthRedirect,
  shouldRedirectToLogin,
} from "./auth.handler";
import {
  getErrorMessage,
  getToastType,
  handleApiError,
  handleError,
} from "./error.handler";
import { tokenRefreshManager } from "./token.handler";

export {
  getErrorMessage,
  getToastType,
  handleApiError,
  handleAuthError,
  handleAuthRedirect,
  handleError,
  shouldRedirectToLogin,
  tokenRefreshManager,
};

// Exportación por defecto con todos los handlers
export default {
  shouldRedirectToLogin,
  handleAuthRedirect,
  handleAuthError,
  getErrorMessage,
  getToastType,
  handleApiError,
  tokenRefreshManager,
  handleError,
};
