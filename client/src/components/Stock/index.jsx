import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStock } from "../../api/stock.api";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Stock.module.scss";

export function Stock() {
  const { loading } = useAuth();
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchStockDetail() {
      if (!symbol) return;
      try {
        const response = await getStock(symbol);
        setStock(response.data);
      } catch {
        setMessage("Error al cargar los detalles del stock");
      }
    }

    fetchStockDetail();
  }, [symbol]);

  if (message) {
    return <p>{message}</p>;
  }

  if (loading) {
    return (
      <div className={styles.newsList__container}>
        <h1 className={styles.newsList__title}>CARGANDO</h1>
      </div>
    );
  } else {
    return (
      <div>
        <h1>{stock?.symbol}</h1>
        <p>Volumen: {stock?.volume}</p>
      </div>
    );
  }
}
