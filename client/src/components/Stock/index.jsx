import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getStock } from "../../api/stock.api";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Stock.module.scss";
import { AddressLink } from "@/shared/components/AddressLink/index";

export function Stock() {
  const { loading: authLoading } = useAuth();
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStock() {
      setError("");
      try {
        const { data } = await getStock(symbol);
        setStock(data);
      } catch {
        setError("No se pudo cargar la información del stock.");
      }
    }
    if (symbol) fetchStock();
  }, [symbol]);

  if (authLoading || (!stock && !error)) {
    return (
      <div className={styles["stock-page__container"]}>
        <p className={styles["stock-page__loading"]}>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["stock-page__container"]}>
        <p className={styles["stock-page__error"]}>{error}</p>
      </div>
    );
  }

  // Desestructuramos solo los campos que usamos
  const {
    symbol: sym,
    longName,
    sector,
    industry,
    fullTimeEmployees,
    address1,
    city,
    country,
    marketCap,
    floatShares,
    regularMarketPrice,
    fiftyTwoWeekLow,
    fiftyTwoWeekHigh,
    volume,
    averageVolume,
    website,
  } = stock;

  return (
    <div className={styles["stock-page__container"]}>
      <header className={styles["stock-page__general"]}>
        <h1 className={styles["stock-page__title"]}>
          <span className={styles["stock-page__symbol"]}>{sym}</span>
          <Link
            to={website}
            className={`${styles["stock-page__link"]} ${styles["stock-page__link--small"]}`}
          >
            {longName}
          </Link>
        </h1>
        <div className={styles["stock-page__header-infos"]}>
          <div className={styles["stock-page__header-pair"]}>
            <p className={styles["stock-page__header-info"]}>Sector</p>
            <p className={styles["stock-page__badge"]}>{sector}</p>
          </div>
          <div className={styles["stock-page__header-pair"]}>
            <p className={styles["stock-page__header-info"]}>Industria</p>
            <p className={styles["stock-page__badge"]}>{industry}</p>
          </div>
          <div className={styles["stock-page__header-pair"]}>
            <p className={styles["stock-page__header-info"]}>Empleados</p>
            <p className={styles["stock-page__badge"]}>
              {fullTimeEmployees ?? "N/D"}
            </p>
          </div>
          <div>
            <p className={styles["stock-page__header-info"]}>Ubicación</p>
            <AddressLink
              address1={address1}
              city={city}
              country={country}
              size="normal"
            />
          </div>
        </div>
      </header>
      <section className={styles["stock-page__stats"]}>
        <div className={styles["stock-page__stat"]}>
          <span className={styles["stock-page__stat-label"]}>
            Precio Actual
          </span>
          <span className={styles["stock-page__stat-value"]}>
            {regularMarketPrice != null ? regularMarketPrice.toFixed(2) : "N/D"}
          </span>
        </div>
        <div className={styles["stock-page__stat"]}>
          <span className={styles["stock-page__stat-label"]}>Market Cap</span>
          <span className={styles["stock-page__stat-value"]}>
            {marketCap != null ? (marketCap / 1e6).toFixed(2) + " M" : "N/D"}
          </span>
        </div>
        <div className={styles["stock-page__stat"]}>
          <span className={styles["stock-page__stat-label"]}>Float</span>
          <span className={styles["stock-page__stat-value"]}>
            {floatShares != null
              ? (floatShares / 1e6).toFixed(2) + " M"
              : "N/D"}
          </span>
        </div>
        <div className={styles["stock-page__stat"]}>
          <span className={styles["stock-page__stat-label"]}>Volumen Hoy</span>
          <span className={styles["stock-page__stat-value"]}>
            {volume != null ? volume.toLocaleString() : "N/D"}
          </span>
        </div>
        <div className={styles["stock-page__stat"]}>
          <span className={styles["stock-page__stat-label"]}>
            Volumen Promedio
          </span>
          <span className={styles["stock-page__stat-value"]}>
            {averageVolume != null ? averageVolume.toLocaleString() : "N/D"}
          </span>
        </div>
        <div className={styles["stock-page__stat"]}>
          <span className={styles["stock-page__stat-label"]}>
            52W Low / High
          </span>
          <span className={styles["stock-page__stat-value"]}>
            {fiftyTwoWeekLow != null && fiftyTwoWeekHigh != null
              ? `${fiftyTwoWeekLow.toFixed(2)} / ${fiftyTwoWeekHigh.toFixed(2)}`
              : "N/D"}
          </span>
        </div>
      </section>
      <section className={styles["stock-page__metrics-table"]}>
        <table>
          <thead>
            <tr>
              <th>Métrica</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Market Cap", value: stock.marketCap },
              { label: "Shares Outstanding", value: stock.sharesOutstanding },
              { label: "Float", value: stock.floatShares },
              { label: "Current Price", value: stock.currentPrice },
              { label: "52w High", value: stock.fiftyTwoWeekHigh },
              { label: "52w Low", value: stock.fiftyTwoWeekLow },
            ].map(({ label, value }) => (
              <tr key={label}>
                <td>{label}</td>
                <td
                  className={
                    value >= 0
                      ? styles["stock-page__metric--positive"]
                      : styles["stock-page__metric--negative"]
                  }
                >
                  {typeof value === "number"
                    ? value.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                    : "N/D"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
