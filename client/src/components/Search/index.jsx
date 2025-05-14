import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllStocks } from "../../api/stock.api";
import { useAuth } from "../../contexts/AuthContext";
import { stockTermPropTypes } from "../../propTypes/stockTerm.propTypes";
import { ChartIcon } from "../Icons";
import styles from "./Search.module.scss";

export function Search() {
  const { loading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    async function loadStocks() {
      const res = await getAllStocks();
      setStocks(res.data);
    }
    loadStocks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiar el mensaje de error antes de la búsqueda

    try {
      if (searchTerm) {
        navigate(`/stock/${searchTerm}/`);
      } else {
        setErrorMessage("Stock no encontrado");
      }
    } catch {
      setErrorMessage("Error al buscar el stock");
    }
  };

  const filteredStocks = searchTerm
    ? stocks.filter((stock) =>
        stock.symbol.toUpperCase().includes(searchTerm.toUpperCase())
      )
    : stocks;

  if (loading) {
    return <p>Loading…</p>;
  }

  return (
    <div className={styles.search__container}>
      <form onSubmit={handleSearch} className={styles.search__card}>
        <input
          type="text"
          placeholder="Escribe el stock para buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.search__input}
        />
        <button type="submit" className={styles.search__button}>
          Buscar
        </button>
      </form>
      {errorMessage && <p className={styles.search__error}>{errorMessage}</p>}
      <div className={styles.stock__container}>
        {filteredStocks.map((stock) => (
          <span className={styles.stock__card} key={stock.symbol}>
            <Link to={`/stock/${stock.symbol}`} className={styles.stock__link}>
              {stock.symbol}
            </Link>
            <Link
              to={`/historical-price/${stock.symbol}`}
              className={styles.stock__svg}
            >
              <ChartIcon width={24} height={24} className={styles.stock__svg} />
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}

Search.propTypes = stockTermPropTypes;
