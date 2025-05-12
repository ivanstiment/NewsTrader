import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { getHistoricalPrice } from "../../api/historical-price.api";
import styles from "./CandlestickChart.module.scss";

export function CandlestickChart() {
  const { symbol } = useParams();
  const [ohlcSeries, setOhlcSeries] = useState([]);
  const [volumeSeries, setVolumeSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getHistoricalPrice(symbol);
        const data = res.data;

        const ohlcData = data.map((item) => ({
          x: new Date(item.date),
          y: [item.open, item.high, item.low, item.close],
        }));

        const volumeData = data.map((item) => ({
          x: new Date(item.date),
          y: item.volume,
        }));

        setOhlcSeries([{ data: ohlcData }]);
        setVolumeSeries([{ data: volumeData }]);
      } catch (error) {
        console.error("Error al cargar precios históricos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) return <p>Cargando datos de {symbol.toUpperCase()}...</p>;

  return (
    <div className={styles.candleStickChart__container}>
      <div>
        <div id="chart-candlestick">
          <ReactApexChart
            options={{
              chart: {
                id: "candles",
                type: "candlestick",
                height: 400,
                toolbar: {
                  autoSelected: "pan",
                  show: true,
                },
                zoom: {
                  enabled: true,
                },
              },
              title: {
                text: `Histórico de ${symbol.toUpperCase()}`,
                align: "left",
              },
              plotOptions: {
                candlestick: {
                  colors: {
                    upward: "#26a69a",
                    downward: "#ef5350",
                  },
                },
              },
              xaxis: {
                type: "datetime",
              },
              yaxis: {
                labels: {
                  formatter: val => `${(val.toFixed(4))}`
                },
                tooltip: { enabled: true }
              },
            }}
            series={ohlcSeries}
            type="candlestick"
            height={400}
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
                    max: new Date().getTime()
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
                }
              },
              yaxis: {
                labels: {
                  formatter: val => `${(val / 1000).toFixed(0)}K`
                },
                title: { text: 'Volumen' }
              },
              tooltip: {
                custom: function({ series, seriesIndex, dataPointIndex, w }) {
                  return (
                    '<div class="arrow_box">' +
                    "<span>" +
                    w.globals.labels[dataPointIndex] +
                    ": " +
                    series[seriesIndex][dataPointIndex] +
                    "</span>" +
                    "</div>"
                  );
                }
              }
            }}
            series={volumeSeries}
            type="bar"
            height={160}
          />
        </div>
      </div>
      <div id="html-dist"></div>
    </div>
  );
}