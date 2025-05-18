import { useEffect, useState } from "react";
import { getAllNews } from "@/api/news.api";
import { useAuth } from "@/hooks/useAuth";
import { searchTermPropTypes } from "@/propTypes/searchTerm.propTypes";
import { NewCard } from "../NewCard";
import styles from "./NewsList.module.scss";

export function NewsList({ searchTerm, initialPageSize = 15 }) {
  const { loading: authLoading } = useAuth();
  const [news, setNews] = useState([]);
  // Estado para término de búsqueda, página actual y tamaño de página
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialPageSize);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Cuando cambie searchTerm o itemsPerPage, reiniciar página
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getAllNews();
        if (!cancelled) setNews(res.data);
      } catch {
        if (!cancelled) setErrorMessage("No se pudieron obtener las noticias.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredNews = searchTerm
    ? news.filter((newItem) => {
        const term = searchTerm.toUpperCase();
        // ¿Coincide en el título?
        const inTitle = newItem.title.toUpperCase().includes(term);
        // ¿Coincide en related_tickers?
        const inTickers =
          Array.isArray(newItem.related_tickers) &&
          newItem.related_tickers.some((t) => t.toUpperCase().includes(term));
        return inTitle || inTickers;
      })
    : news;

  const totalItems = filteredNews.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Obtener los ítems de la página actual
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentNews = filteredNews.slice(startIdx, startIdx + itemsPerPage);

  const goToPage = (page) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
  };

  const handlePageSizeChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // reiniciar a la primera página al cambiar tamaño
  };

  if (authLoading || loading) {
    return (
      <div className={styles["news-list__container"]}>
        <h1 className={styles["news-list__title"]}>CARGANDO...</h1>
      </div>
    );
  } else {
    return (
      <div className={styles["news-list__container"]}>
        <header>
          <h1 className={styles["news-list__title"]}>Noticias de acciones</h1>
        </header>

        {currentNews.length === 0 ? (
          <div>
            <p role="alert" className={styles["news-list__message"]}>
              No se han encontrado noticias que coincidan con la búsqueda.
            </p>
            {errorMessage && (
              <p role="alert" className={styles["news-list__message"]}>
                {" "}
                {errorMessage}
              </p>
            )}
          </div>
        ) : (
          currentNews.map((item) => <NewCard newItem={item} key={item.uuid} />)
        )}

        <nav
          aria-label="Paginación"
          className={styles["news-list__pagination"]}
        >
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className={`${styles["news-list__pagination-button"]} ${
              currentPage === 1
                ? styles["news-list__pagination-button--disabled"]
                : ""
            }`}
            aria-label="Primera página"
          >
            ««
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${styles["news-list__pagination-button"]} ${
              currentPage === 1
                ? styles["news-list__pagination-button--disabled"]
                : ""
            }`}
            aria-label="Página anterior"
          >
            «
          </button>

          <span className={styles["news-list__pagination-info"]}>
            Página {currentPage} de {totalPages || 1}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`${styles["news-list__pagination-button"]} ${
              currentPage === totalPages || totalPages === 0
                ? styles["news-list__pagination-button--disabled"]
                : ""
            }`}
            aria-label="Página siguiente"
          >
            »
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`${styles["news-list__pagination-button"]} ${
              currentPage === totalPages || totalPages === 0
                ? styles["news-list__pagination-button--disabled"]
                : ""
            }`}
            aria-label="Última página"
          >
            »»
          </button>

          <label
            htmlFor="pageSizeSelect"
            className={styles["news-list__page-size"]}
          >
            Mostrar
            <select
              id="pageSizeSelect"
              value={itemsPerPage}
              onChange={handlePageSizeChange}
              className={styles["news-list__page-size-select"]}
              aria-label="Resultados por página"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            por página
          </label>
        </nav>
      </div>
    );
  }
}

NewsList.propTypes = searchTermPropTypes;
