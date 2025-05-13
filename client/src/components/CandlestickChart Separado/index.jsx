import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { getHistoricalPrice } from "../../api/historical-price.api";
import { getAllNews } from "../../api/news.api";
import styles from "./CandlestickChart.module.scss";

export function CandlestickChart() {
  const { symbol } = useParams();
  const [ohlcSeries, setOhlcSeries] = useState([]);
  const [volumeSeries, setVolumeSeries] = useState([]);
  const [series, setSeries] = useState([]);
  const [annotations, setAnnotations] = useState({ points: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoth = async () => {
      setLoading(true);
      try {
        // 1) Traer históricos y noticias
        const [histRes, newsRes] = await Promise.all([
          getHistoricalPrice(symbol),
          getAllNews(),
        ]);
        const hist = histRes.data; // [{date, open, high, low, close, volume}, ...]
        const allNews = newsRes.data; // [{related_tickers, provider_publish_time, title}, ...]

        // 2) Construir series de velas y volumen
        const ohlcData = hist.map((item) => ({
          x: new Date(item.date).getTime(),
          y: [
            +item.open.toFixed(4),
            +item.high.toFixed(4),
            +item.low.toFixed(4),
            +item.close.toFixed(4),
          ],
        }));
        const volData = hist.map((item) => ({
          x: new Date(item.date).getTime(),
          y: item.volume,
        }));
        setSeries([
          { name: symbol.toUpperCase(), data: ohlcData },
          { name: "Volumen", data: volData, type: "bar" }
        ]);
        // setOhlcSeries([{ name: symbol.toUpperCase(), data: ohlcData }]);
        setVolumeSeries([{ name: "Volumen", data: volData, type: "bar" }]);

        // 3) Filtrar noticias relevantes al símbolo y agrupar por fecha ISO
        const symbolNews = allNews.filter((n) =>
          (n.related_tickers || []).includes(symbol.toUpperCase())
        );
        const newsByDate = {};
        symbolNews.forEach((n) => {
          const dateKey = new Date(n.provider_publish_time * 1000)
            .toISOString()
            .slice(0, 10);
          if (!newsByDate[dateKey]) newsByDate[dateKey] = [];
          newsByDate[dateKey].push(n.title);
        });

        // 3) Construir annotations.points
        const points = hist.flatMap(item => {
          const day = item.date; // ISO YYYY-MM-DD
          const titles = newsByDate[day] || [];
          return titles.map(title => {
            // colocamos el pin un poco por encima del cierre
            const yVal = +item.close.toFixed(4);
            return {
              x: new Date(day).getTime(),
              y: yVal,
              marker: {
                size: 6,
                fillColor: "#ffb300",
                strokeColor: "#fff",
                strokeWidth: 2
              },
              label: {                
                borderColor: "#FF4560",
                offsetY: 0,
                style: {
                  color: "#fff",
                  background: "#FF4560"
                },
                text: title
              },
              customHTML: () => `
                <div class="news-tooltip">
                  <strong>${day}</strong><br/>
                  ${title}
                </div>
              `
            };
          });
        });
        setAnnotations({ points });
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoth();
  }, [symbol]);

  if (loading) return <p>Cargando datos de {symbol.toUpperCase()}...</p>;

  const options = {
    chart: {
      id: "candles",
      type: "candlestick",
      height: 400,
      toolbar: { autoSelected: "pan", show: true },
      zoom: { enabled: true },
    },
    title: {
      text: `Histórico de ${symbol.toUpperCase()}`,
      align: "left",
    },
    annotations, // utilizamos annotations.points
    plotOptions: {
      candlestick: {
        colors: { upward: "#26a69a", downward: "#ef5350" },
      },
    },
    xaxis: { type: "datetime" },
    yaxis: [
      {
        tooltip: { enabled: true },
        labels: { formatter: (v) => parseFloat(v).toFixed(4) },
        title: { text: "Precio" },
      },
      {
        opposite: true,
        labels: { formatter: (v) => `${(v / 1000).toFixed(0)}K` },
        title: { text: "Volumen" },
      },
    ],
    tooltip: {
      shared: true,
      custom: ({ w, dataPointIndex }) => {
        const o = w.config.series[0].data[dataPointIndex].y;
        return `
          <div style="padding:6px;">
            <b>${w.globals.labels[dataPointIndex]}</b><br/>
            Open: ${o[0].toFixed(4)}<br/>
            High: ${o[1].toFixed(4)}<br/>
            Low: ${o[2].toFixed(4)}<br/>
            Close: ${o[3].toFixed(4)}
          </div>
        `;
      }
    },
  };

  return (
    <div className={styles.candleStickChart__container}>
      <div id="chart-candlestick">
        <ReactApexChart
          options={options}
          // series={ohlcSeries}
          series={series}
          type="candlestick"
          height={550}
        />
      </div>

      <div id="chart-bar">
        <ReactApexChart
          options={{
            chart: {
              id: "volume",
              height: 160,
              type: "bar",
              brush: {
                target: "candles",
                enabled: true,
              },
              selection: {
                enabled: true,
                xaxis: {
                  min: new Date().getTime() - 1000 * 60 * 60 * 24 * 5, // 5 días antes
                  max: new Date().getTime(),
                },
                fill: {
                  color: "#ccc",
                  opacity: 0.4,
                },
              },
            },
            dataLabels: {
              enabled: false,
            },
            plotOptions: {
              bar: {
                columnWidth: "80%",
                colors: {
                  ranges: [
                    {
                      from: -1000,
                      to: 0,
                      color: "#F15B46",
                    },
                    {
                      from: 1,
                      to: 10000,
                      color: "#FEB019",
                    },
                  ],
                },
              },
            },
            xaxis: {
              type: "datetime",
              axisBorder: {
                offsetX: 13,
              },
            },
            yaxis: {
              labels: {
                formatter: (val) => `${(val / 1000).toFixed(0)}K`,
              },
              title: { text: "Volumen" },
            },
            tooltip: {
              custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                return (
                  '<div class="arrow_box">' +
                  "<span>" +
                  w.globals.labels[dataPointIndex] +
                  ": " +
                  series[seriesIndex][dataPointIndex] +
                  "</span>" +
                  "</div>"
                );
              },
            },
          }}
          series={volumeSeries}
          type="bar"
          height={160}
        />
      </div>
    </div>
  );
}
