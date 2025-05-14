import { useEffect, useState } from "react";
import { getHistoricalPrice } from "../api/historical-price.api";
import { getCandlestickOptions, getVolumeOptions } from "./getChartOptions";
import { useNewsByDate } from "./useNewsByDate";

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

        // 1) Series de velas
        const candles = hist.map((item) => ({
          x: new Date(item.date).getTime(),
          y: [
            +item.open.toFixed(4),
            +item.high.toFixed(4),
            +item.low.toFixed(4),
            +item.close.toFixed(4),
          ],
        }));
        setCandlesSeries([{ name: symbol.toUpperCase(), data: candles }]);

        // 2) Series de volumen (si corresponde)
        const vols = hist.map((item) => ({
          x: new Date(item.date).getTime(),
          y: item.volume,
        }));
        setVolumeSeries(showVolume ? [{ name: "Volumen", data: vols }] : []);
        // Generamos los puntos de anotación
        const annotationPoints = hist.flatMap((item) => {
          const day = item.date; // "YYYY-MM-DD"
          return (newsByDate[day] || []).map(() => ({
            x: new Date(day).getTime(),
            y: 0,
            marker: {
              size: 6,
              fillColor: "#ffb300",
              // strokeColor: "#fff",
              strokeColor: "#ff8800",
              strokeWidth: 2,
            },
            label: { show: false },
          }));
        });

        // 3) Opciones separadas
        setCandleOptions(
          getCandlestickOptions({
            symbol,
            annotationPoints,
            newsByDate,
            showVolume,
            volumeData: vols,
          })
        );

        setVolumeOptions(getVolumeOptions());
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [symbol, showVolume, JSON.stringify(newsByDate)]);

  return {
    candlesSeries,
    volumeSeries,
    candleOptions,
    volumeOptions,
    loading,
  };
}
