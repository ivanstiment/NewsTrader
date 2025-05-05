import React, { useEffect, useState } from "react";
import { getStock } from "../api/stock.api";
import { useParams } from "react-router-dom";

export function StockPage() {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchStockDetail() {
      console.log(symbol)
      if (!symbol) return;
      try {
        const response = await getStock(symbol);
        setStock(response.data);
      } catch (error) {
        setMessage('Error al cargar los detalles del stock');
      }
    };

    fetchStockDetail();
  }, [symbol]);

  if (message) {
    return <p>{message}</p>;
  }

  return stock ? (
    <div>
      <h1>{stock.name}</h1>
      <p>Precio: {stock.price}</p>
      {/* Añade más detalles según sea necesario */}
    </div>
  ) : (
    <p>Cargando...</p>
  );
}