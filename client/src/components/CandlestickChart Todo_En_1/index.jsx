import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { getHistoricalPrice } from "../../api/historical-price.api";
import { getAllNews } from "../../api/news.api";
import styles from "./CandlestickChart.module.scss";

export function CandlestickChart() {
  const { symbol } = useParams();
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState([]);
  const [showVolume, setShowVolume] = useState(true);
  const [annotations, setAnnotations] = useState({ points: [] });
  const [newsByDate, setNewsByDate] = useState({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [histRes, newsRes] = await Promise.all([
          getHistoricalPrice(symbol),
          getAllNews(),
        ]);

        const hist = histRes.data;
        const allNews = newsRes.data;

        // Candle data
        const candles = hist.map(item => ({
          x: new Date(item.date).getTime(),
          y: [
            +item.open.toFixed(4),
            +item.high.toFixed(4),
            +item.low.toFixed(4),
            +item.close.toFixed(4),
          ],
        }));

        // Volume data
        const vols = hist.map(item => ({
          x: new Date(item.date).getTime(),
          y: item.volume,
        }));

        // Series
        const mixedSeries = [
          {
            name: symbol.toUpperCase(),
            type: "candlestick",
            data: candles,
          },
          ...(showVolume
            ? [
                {
                  name: "Volumen",
                  type: "bar",
                  data: vols,
                },
              ]
            : []),
        ];
        setSeries(mixedSeries);

        // News agrupadas por fecha
        const symbolNews = allNews.filter(n =>
          (n.related_tickers || []).includes(symbol.toUpperCase())
        );
        const groupedNews = {};
        symbolNews.forEach(n => {
          const day = new Date(n.provider_publish_time * 1000)
            .toISOString()
            .slice(0, 10);
          if (!groupedNews[day]) groupedNews[day] = [];
          groupedNews[day].push(n.title);
        });
        setNewsByDate(groupedNews);

        // Annotations
        const points = hist.flatMap(item => {
          const day = item.date;
          return (groupedNews[day] || []).map(() => ({
            x: new Date(day).getTime(),
            y: +item.close.toFixed(4) * 1.02,
            marker: {
              size: 6,
              fillColor: "#ffb300",
              strokeColor: "#fff",
              strokeWidth: 2,
            },
            label: {
              show: false,
            },
          }));
        });
        setAnnotations({ points });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (symbol) fetchData();
  }, [symbol, showVolume]); // ✅ solo dependencias necesarias

  // 🧠 Memoized options (recalcula solo si deps cambian)
  const options = useMemo(() => ({
    chart: {
      id: "combo-chart",
      stacked: false,
      height: 550,
      toolbar: { autoSelected: "pan", show: true },
      zoom: { enabled: true },
    },
    title: {
      text: `Histórico de ${symbol?.toUpperCase()}`,
      align: "left",
    },
    annotations,
    plotOptions: {
      candlestick: {
        colors: { upward: "#26a69a", downward: "#ef5350" },
      },
      bar: {
        columnWidth: "80%",
      },
    },
    stroke: {
      width: [1, 0],
    },
    xaxis: { type: "datetime" },
    yaxis: [
      {
        seriesName: symbol?.toUpperCase(),
        title: { text: "Precio" },
        labels: { formatter: v => parseFloat(v).toFixed(4) },
        tooltip: { enabled: true },
      },
      {
        opposite: true,
        seriesName: "Volumen",
        title: { text: "Volumen" },
        labels: { formatter: v => `${(v / 1000).toFixed(0)}K` },
      },
    ],
    tooltip: {
      shared: true,
      custom: ({ w, dataPointIndex }) => {
        const ts = w.globals.seriesX[0][dataPointIndex];
        const isoDay = new Date(ts).toISOString().slice(0, 10);

        const ohlc = w.config.series.find(s => s.type === "candlestick")
          .data[dataPointIndex].y;
        let html = `
          <div style="padding:6px;">
            <b>${new Date(ts).toLocaleDateString()}</b><br/>
            Open: <b>${ohlc[0].toFixed(4)}</b><br/>
            High: <b>${ohlc[1].toFixed(4)}</b><br/>
            Low: <b>${ohlc[2].toFixed(4)}</b><br/>
            Close: <b>${ohlc[3].toFixed(4)}</b><br/>`;

        if (showVolume) {
          const volSeries = w.config.series.find(s => s.type === "bar");
          if (volSeries) {
            const vol = volSeries.data[dataPointIndex].y;
            html += `Volumen: <b>${vol.toLocaleString()}</b><br/>`;
          }
        }

        const titles = newsByDate[isoDay] || [];
        if (titles.length) {
          html += `<hr style="margin:4px 0;" />`;
          titles.forEach(t => {
            html += `
              <div style="
                font-style: italic;
                font-size: 0.85em;
                max-width: 100px;
                white-space: normal;
                overflow-wrap: break-word;
                word-break: break-word;
                margin-bottom: 4px;
              ">
                “${t}”
              </div>`;
          });
        }

        html += `</div>`;
        return html;
      },
    },
    legend: { show: true },
  }), [annotations, newsByDate, showVolume, symbol]);

  if (loading) return <p>Cargando datos de {symbol?.toUpperCase()}…</p>;

  return (
    <div className={styles.candleStickChart__container}>
      <ReactApexChart
        options={options}
        series={series}
        type="candlestick"
        height={550}
      />

      <label style={{ marginBottom: 10, display: "block", color: "white" }}>
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