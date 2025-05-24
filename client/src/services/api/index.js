import { default as articlesService } from "./articles.service";
import { default as authService } from "./auth.service";
import { default as csrfService } from "./csrf.service";
import { default as newsService } from "./news.service";
import { default as stocksService } from "./stocks.service";
import { default as userService } from "./user.service";

// Exportación por defecto con todos los servicios
export default {
  auth: authService,
  user: userService,
  news: newsService,
  articles: articlesService,
  stocks: stocksService,
  csrf: csrfService,
};
