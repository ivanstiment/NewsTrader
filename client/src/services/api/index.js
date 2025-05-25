import articlesService from "./articles.service";
import authService from "./auth.service";
import stocksService from "./stocks.service";
import tokenService from "./token.service";
import userService from "./user.service";
import csrfService from "./csrf.service";

// Exportaciones nombradas individuales
export {
  articlesService,
  authService,
  stocksService,
  tokenService,
  userService,
  csrfService
};

// Exportación por defecto con todos los servicios
export default {
  auth: authService,
  user: userService,
  articles: articlesService,
  stocks: stocksService,
  token: tokenService,
  csrf: csrfService
};
