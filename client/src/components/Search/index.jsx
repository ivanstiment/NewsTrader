import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Search.module.scss";

export function Search({ searchStock, setSearchStock }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading…</p>;
  }

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
          placeholder="Escribe el stock para buscar"
          value={searchStock}
          onChange={(e) => setSearchStock(e.target.value)}
          className={styles.search__input}
        />
        
        <button type="submit" className={styles.search__button}>
          Buscar
        </button>
      </form>
    </div>
  );
}