import { useEffect, useState } from "react";
import { getAllNews } from "../../api/news.api";
import { useAuth } from "../../contexts/AuthContext";
import { searchTermPropTypes } from "../../propTypes/searchTerm.propTypes";
import { NewCard } from "../NewCard";
import styles from "./NewsList.module.scss";

export function NewsList({ searchTerm }) {
  const { loading } = useAuth();
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function loadNews() {
      const res = await getAllNews();
      setNews(res.data);
    }
    loadNews();
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

  if (loading) {
    return (
      <div className={styles["news-list__container"]}>
        <h1 className={styles["news-list__title"]}>CARGANDO...</h1>
      </div>
    );
  } else {
    return (
      <div className={styles["news-list__container"]}>
        <h1 className={styles["news-list__title"]}>Noticias de acciones</h1>
        {filteredNews.length === 0 ? (
          <p className={styles["news-list__message"]}>
            No se han encontrado noticias que coincidan con la búsqueda.
          </p>
        ) : (
          filteredNews.map((newItem) => (
            <NewCard key={newItem.uuid} newItem={newItem} />
          ))
        )}
      </div>
    );
  }
}

NewsList.propTypes = searchTermPropTypes;
