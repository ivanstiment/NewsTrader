import { useEffect, useState } from "react";
import { newsApi } from "@/features/news/news.api";

export function useNewsByDate(symbol) {
  const [newsByDate, setNewsByDate] = useState({});

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;

    async function fetchNews() {
      try {
        const res = await newsApi.getNews();
        if (cancelled) return;
        const grouped = {};
        res.data
          .filter((n) =>
            (n.related_tickers || []).includes(symbol.toUpperCase())
          )
          .forEach((n) => {
            const day = new Date(n.provider_publish_time * 1000)
              .toISOString()
              .slice(0, 10);
            grouped[day] = grouped[day] || [];
            grouped[day].push(n.title);
          });
        setNewsByDate(grouped);
      } catch (err) {
        console.error("useNewsByDate:", err);
      }
    }

    fetchNews();
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return newsByDate;
}
