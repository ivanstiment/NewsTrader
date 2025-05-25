import articlesService from "./articles.service";
import authService from "./auth.service";
import csrfService from "./csrf.service";
import newsService from "./news.service";
import stocksService from "./stocks.service";
import userService from "./user.service";

// Exportaciones nombradas individuales
export { articlesService, authService, csrfService, newsService, stocksService, userService };

// Exportación por defecto con todos los servicios
export default {
  auth: authService,
  user: userService,
  news: newsService,
  articles: articlesService,
  stocks: stocksService,
  csrf: csrfService,
};