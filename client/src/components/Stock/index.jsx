import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';

export function Stock() {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStockDetail = async () => {
      try {
        const response = await api.get(`/stock/${symbol}`);
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