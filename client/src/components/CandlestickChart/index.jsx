import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useParams } from "react-router-dom";
import { useHistoricalPrice } from "../../hooks/useHistoricalPrice";
import styles from "./CandlestickChart.module.scss";

export function CandlestickChart() {
  const { symbol } = useParams();
  const [showVolume, setShowVolume] = useState(true);

  // candlesSeries, volumeSeries, candleOptions, volumeOptions y loading
  const {
    candlesSeries,
    volumeSeries,
    candleOptions,
    volumeOptions,
    loading
  } = useHistoricalPrice(symbol, showVolume);

  if (loading) return <p>Cargando datos de {symbol.toUpperCase()}…</p>;

  return (
    <div className={styles.candleStickChart__container}>
      {/* Gráfico de Velas + Anotaciones */}
      <div id="chart-candles">
        <ReactApexChart
          options={candleOptions}
          series={candlesSeries}
          type="candlestick"
          height={400}
        />
      </div>

      {/* Gráfico de Volumen */}
      {showVolume && (
        <div id="chart-volume" style={{ marginTop: 24 }}>
          <ReactApexChart
            options={volumeOptions}
            series={volumeSeries}
            type="bar"
            height={150}
          />
        </div>
      )}

      {/* Toggle para volumen */}
      <label style={{ marginTop: 12, color: "#fff" }}>
        <input
          type="checkbox"
          checked={showVolume}
          onChange={() => setShowVolume((v) => !v)}
        />{" "}
        Mostrar volumen
      </label>
    </div>
  );
}