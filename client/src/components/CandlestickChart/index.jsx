import { useState } from "react";
import { useParams } from "react-router-dom";
import { useHistoricalPrice } from "@/hooks/useHistoricalPrice";
import { ChartWrapper } from "../ChartWrapper";
import styles from "./CandlestickChart.module.scss";

export function CandlestickChart() {
  const { symbol } = useParams();
  const [showVolume, setShowVolume] = useState(true);

  // candlesSeries, volumeSeries, candleOptions, volumeOptions y loading
  const { candlesSeries, volumeSeries, candleOptions, volumeOptions, loading } =
    useHistoricalPrice(symbol, showVolume);

  if (loading) {
    return <p>Cargando datos de {symbol.toUpperCase()}…</p>;
  } else {
    return (
      <div className={styles["chart__container"]}>
        {/* Gráfico de Velas + Anotaciones */}
        <div id="chart-candles">
          <ChartWrapper
            id="candles"
            options={candleOptions}
            series={candlesSeries}
            type="candlestick"
            height={400}
          />
        </div>

        {/* Gráfico de Volumen */}
        <div
          id="chart-volume"
          style={{
            marginTop: 24,
            height: showVolume ? 150 : 0,
            overflow: "hidden",
            transition: "height 0.3s ease",
          }}
        >
          <ChartWrapper
            id="volume"
            options={volumeOptions}
            series={volumeSeries}
            type="bar"
            height={150}
          />
        </div>

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
}
