import React, { useEffect, useState } from "react";
import { getAllNews } from "../../api/news.api";
import { NewCard } from "../NewCard";
import styles from "./NewsList.module.scss";

export function NewsList() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function loadNews() {
      const res = await getAllNews();
      setNews(res.data);
    }
    loadNews();
  }, []);

  return (
    <div className={styles.newsList__container}>
      <h1 className={styles.newsList__title}>Noticias de acciones</h1>
      {news.map((newItem) => (
        <NewCard key={newItem.uuid} newItem={newItem} />
      ))}
    </div>
  );
}
