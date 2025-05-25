import articlesService from "./articles.service";
import authService from "./auth.service";
import csrfService from "./csrf.service";
import stocksService from "./stocks.service";
import tokenService from "./token.service";
import userService from "./user.service";

// Exportaciones nombradas individuales
export {
  articlesService,
  authService,
  csrfService,
  stocksService,
  tokenService,
  userService
};

// Exportación por defecto con todos los servicios
export default {
  auth: authService,
  user: userService,
  articles: articlesService,
  stocks: stocksService,
  csrf: csrfService,
  token: tokenService,
};
