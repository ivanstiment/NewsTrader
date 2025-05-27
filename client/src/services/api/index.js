import tokenService from "./token/token.service";
import userService from "./user.service";
import csrfService from "./csrf/csrf.service";

// Exportaciones nombradas individuales
export {
  tokenService,
  userService,
  csrfService
};

// Exportación por defecto con todos los servicios
export default {
  user: userService,
  token: tokenService,
  csrf: csrfService
};
