import styles from "@/shared/styles";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStocks } from "@/api/stock.api";
import { useAuth } from "@/hooks/useAuth";
import { stockTermPropTypes } from "@/propTypes/stockTerm.propTypes";
import { StockCard } from "../StockCard";

export function Search() {
  const { loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // 1) Carga inicial de stocks
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getAllStocks();
        if (!cancelled) setStocks(res.data);
      } catch {
        if (!cancelled) setErrorMessage("No se pudieron obtener los stocks.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Filtrado memoizado
  const filteredStocks = useMemo(() => {
    if (!searchTerm.trim()) return stocks;
    const term = searchTerm.trim().toUpperCase();
    return stocks.filter((s) => s.symbol.toUpperCase().includes(term));
  }, [searchTerm, stocks]);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim().toUpperCase();

    if (!term) {
      setErrorMessage("Por favor, escribe un símbolo.");
      return;
    }
    const exact = stocks.find((s) => s.symbol.toUpperCase() === term);
    if (exact) {
      navigate(`/stock/${exact.symbol}/`);
    } else {
      setErrorMessage(`El stock “${searchTerm}” no se encuentra disponible.`);
    }
  };

  // Limpia el error en cuanto el usuario teclea
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  if (authLoading || loading) {
    return <p>Cargando…</p>;
  }

  return (
    <div
      className={`${styles["card__container"]} ${styles["card__container--search"]}`}
    >
      <form
        onSubmit={handleSearch}
        className={`${styles["card"]} ${styles["card--search"]}`}
      >
        <div className={styles["form-field__wrapper"]}>
          <input
            type="text"
            placeholder="Escribe el stock para buscar"
            value={searchTerm}
            onChange={handleChange}
            className={styles["form-field__input"]}
            aria-label="Buscar stock"
          />
          <span
            role="alert"
            className={`${styles["form-field__error"]} ${
              errorMessage ? styles["form-field__error--visible-no-label"] : ""
            }`}
          >
            {errorMessage || "\u00A0"}
          </span>
        </div>
        <button
          type="submit"
          className={`${styles["button"]} ${styles["button--primary"]}`}
        >
          Buscar
        </button>
      </form>

      <div className={styles["card__results"]}>
        {filteredStocks.length > 0 ? (
          filteredStocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))
        ) : (
          <p className={styles["card__results-empty"]}>
            {searchTerm
              ? `No se encontraron resultados para “${searchTerm}”.`
              : "No hay stocks disponibles."}
          </p>
        )}
      </div>
    </div>
  );
}

Search.propTypes = stockTermPropTypes;
