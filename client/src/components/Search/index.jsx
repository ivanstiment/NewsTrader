// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../../api/axios';

// export function Search() {
//   const [query, setQuery] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleSearch = async () => {
//     try {
//       const response = await api.get(`/fetch_stock_info/${query}`);
//       if (response.data) {
//         // Si se encuentra el stock, navega al componente de detalle
//         navigate(`/stock/${response.data.symbol}`);
//       } else {
//         setMessage('Stock no encontrado');
//       }
//     } catch (error) {
//       setMessage('Error al buscar el stock');
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Buscar stock..."
//       />
//       <button onClick={handleSearch}>Buscar</button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }

import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Search.module.scss";

export function Search() {
  const { user, loading } = useAuth();
  const [query, setQuery] = useState("");

  if (loading) {
    return <p>Loading…</p>;
  }
  // if (!user) {
  //   return <p>Debes iniciar sesión para acceder a la búsqueda</p>;
  // }

  return (
    <div className={styles.search__container}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Aquí más adelante lanzaremos la búsqueda…
          console.log("Buscar:", query);
        }}
        className={styles.search__card}
      >
        <input
          type="text"
          placeholder="Escribe tu término de búsqueda…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.search__input}
        />
        <button type="submit" className={styles.search__button}>
          Buscar
        </button>
      </form>
    </div>
  );
}