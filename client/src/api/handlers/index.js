import {
  handleAuthError,
  handleAuthRedirect,
  shouldRedirectToLogin,
} from "./auth.handler";
import {
  addCsrfHeader,
  getCsrfErrorMessage,
  getCsrfTokenFromCookie,
  handleCsrfError,
  hasCsrfToken,
  isCsrfError,
  requiresCsrfToken,
} from "./csrf.handler";
import {
  getErrorMessage,
  getToastType,
  handleApiError,
  handleError,
} from "./error.handler";
import { tokenRefreshManager } from "./token.handler";

export {
  addCsrfHeader,
  getCsrfErrorMessage,
  getCsrfTokenFromCookie,
  getErrorMessage,
  getToastType,
  handleApiError,
  handleAuthError,
  handleAuthRedirect,
  handleCsrfError,
  handleError,
  hasCsrfToken,
  isCsrfError,
  requiresCsrfToken,
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
  addCsrfHeader,
  getCsrfErrorMessage,
  getCsrfTokenFromCookie,
  handleCsrfError,
  hasCsrfToken,
  isCsrfError,
  requiresCsrfToken,
  handleError,
};
