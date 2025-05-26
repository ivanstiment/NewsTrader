import { useEffect, useState } from "react";
import { getHistoricalPrice } from "../historical-price.api";
import styles from "../styles/tooltip.module.scss";
import {
  getCandlestickOptions,
  getVolumeOptions,
} from "../utils/stock-chart-options.util";
import { useNewsByDate } from "./news-by-date.hook";

const tooltipClasses = {
  tooltipClass: styles["chart-tooltip"],
  tooltipDateClass: styles["chart-tooltip__date"],
  tooltipDataClass: styles["chart-tooltip__data"],
  tooltipSeparationLineClass: styles["chart-tooltip__hr"],
  tooltipNewTitleClass: styles["chart-tooltip__new-title"],
  tooltipTextBoldClass: styles["chart-tooltip__text--bold"],
};

function buildAnnotationPoints(hist, newsByDate) {
  const points = [];
  for (const item of hist) {
    const day = item.date; // ISO “YYYY-MM-DD”
    const titles = newsByDate[day] || [];
    // titles.forEach: no unused vars, just repeat once per title
    titles.forEach(() => {
      points.push({
        x: new Date(day).getTime(),
        y: 0,
        marker: {
          size: 6,
          fillColor: "#ffb300",
          strokeColor: "#ff8800",
          strokeWidth: 2,
        },
        label: { show: false },
      });
    });
  }
  return points;
}

export function useHistoricalPrice(symbol, showVolume) {
  const [candlesSeries, setCandlesSeries] = useState([]);
  const [volumeSeries, setVolumeSeries] = useState([]);
  const [candleOptions, setCandleOptions] = useState({});
  const [volumeOptions, setVolumeOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const newsByDate = useNewsByDate(symbol);

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const { data: hist } = await getHistoricalPrice(symbol);

        // Construir candles & vols a partir de hist
        const candles = hist.map((item) => ({
          x: new Date(item.date).getTime(),
          y: [
            +item.open.toFixed(4),
            +item.high.toFixed(4),
            +item.low.toFixed(4),
            +item.close.toFixed(4),
          ],
        }));
        const vols = hist.map((item) => ({
          x: new Date(item.date).getTime(),
          y: item.volume,
        }));
        // 2) Actualizar estado
        if (!cancelled) {
          setCandlesSeries([{ name: symbol.toUpperCase(), data: candles }]);
          setVolumeSeries(showVolume ? [{ name: "Volumen", data: vols }] : []);
        }

        // Generar puntos de anotación
        const annotationPoints = buildAnnotationPoints(hist, newsByDate);

        // Crear opciones de velas pasando la variable local `candles` en vez de `candlesSeries`
        const opts = getCandlestickOptions({
          symbol,
          candlesSeries: [{ name: symbol.toUpperCase(), data: candles }],
          annotationPoints,
          newsByDate,
          showVolume,
          volumeData: vols,
          tooltipClasses,
        });
        if (!cancelled) setCandleOptions(opts);

        // Crear opciones de volumen
        if (!cancelled) setVolumeOptions(getVolumeOptions({ tooltipClasses }));
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // }, [symbol, showVolume, JSON.stringify(newsByDate)]);
  }, [symbol, showVolume, newsByDate]);

  return {
    candlesSeries,
    volumeSeries,
    candleOptions,
    volumeOptions,
    loading,
  };
}
