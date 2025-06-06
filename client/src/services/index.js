/**
 * @fileoverview Exportación centralizada de servicios
 * @module services
 */
import tokenService from "./api/token/token.service";
import tokenRefreshManager from "./api/token/token.handler";
import userService from "./api/user.service";
import csrfService from "./api/csrf/csrf.service";
import csrfManager from "./api/csrf/csrf.manager";
import CsrfProvider from "./api/csrf/CsrfContext";
import toastService from "./toast/toast.service";

// Exportaciones nombradas individuales
export {
  tokenService,
  userService,
  csrfManager,
  csrfService,
  toastService,
  tokenRefreshManager,
  CsrfProvider
};

// Exportación por defecto con todos los servicios
export default {
  user: userService,
  token: tokenService,
  tokenRefreshMan: tokenRefreshManager,
  csrf: csrfService,
  csrfMan: csrfManager,
  csrfProv: CsrfProvider,
  toast: toastService
};
