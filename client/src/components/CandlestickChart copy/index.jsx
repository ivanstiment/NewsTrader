import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { useHistoricalPrice } from "../../hooks/useHistoricalPrice";
import { useNewsByDate }      from "../../hooks/useNewsByDate";
import { useCandlestickOptions } from "../../hooks/useCandlestickOptions";
import styles from "./CandlestickChart.module.scss";

export function CandlestickChart() {
  const { symbol } = useParams();
  const [showVolume, setShowVolume] = useState(true);

  const newsByDate = useNewsByDate(symbol);
  const {
    series,
    annotations,
    loading
  } = useHistoricalPrice(symbol, showVolume);

  const options = useCandlestickOptions({
    symbol,
    showVolume,
    annotations,
    newsByDate
  });

  if (loading) {
    return <p>Cargando datos de {symbol.toUpperCase()}…</p>;
  }

  return (
    <div className={styles.candleStickChart__container}>
      <ReactApexChart
        options={options}
        series={series}
        type="candlestick"
        height={550}
      />
      <label style={{ marginTop: 12, color: "#fff" }}>
        <input
          type="checkbox"
          checked={showVolume}
          onChange={() => setShowVolume(v => !v)}
        />{" "}
        Mostrar volumen
      </label>
    </div>
  );
}