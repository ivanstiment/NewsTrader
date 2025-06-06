export function getCandlestickOptions({
  symbol,
  candlesSeries,
  annotationPoints,
  newsByDate,
  showVolume,
  volumeData,
  tooltipClasses,
}) {
  // Acceder al último elemento de la serie de velas:
  const lastSeries = candlesSeries[0]?.data;
  const lastClose = lastSeries?.length
    ? lastSeries[lastSeries.length - 1].y[3] // y = [open, high, low, close]
    : null;

  return {
    chart: {
      id: "candles",
      group: "sync-group",
      type: "candlestick",
      animations: { enabled: false },
      toolbar: { autoSelected: "pan", show: true },
      zoom: { enabled: true },
    },
    title: {
      text: `Histórico de ${symbol.toUpperCase()}`,
      style: {
        color: "#e0e0e0",
        fontFamily: "Roboto",
        fontSize: "16px",
        letterSpacing: "1.5px",
      },
      align: "left",
    },
    annotations: {
      points: annotationPoints,
      // Añadir la línea horizontal en el close más reciente
      yaxis:
        lastClose != null
          ? [
              {
                y: lastClose,
                borderColor: "#FFEB3B",
                strokeDashArray: 4,
                label: {
                  borderColor: "#FFEB3B",
                  style: {
                    color: "#000",
                    background: "#FFEB3B",
                  },
                  text: `Cierre: ${lastClose.toFixed(4)}`,
                  position: "right",
                },
              },
            ]
          : [],
    },
    plotOptions: {
      candlestick: { colors: { upward: "#26a69a", downward: "#ef5350" } },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#e0e0e0",
        },
      },
    },
    yaxis: [
      {
        seriesName: symbol?.toUpperCase(),
        title: {
          text: "Precio",
          style: {
            color: "#e0e0e0",
            fontFamily: "Roboto",
            fontSize: "14px",
            letterSpacing: "1.5px",
          },
        },
        labels: {
          formatter: (v) => parseFloat(v).toFixed(4),
          style: {
            colors: "#e0e0e0",
          },
        },
        tooltip: { enabled: true },
      },
    ],
    tooltip: {
      shared: true,
      custom: ({ w, dataPointIndex }) => {
        // Obtener OHLC
        const ohlc = w.config.series[0].data[dataPointIndex].y;
        const ts = w.globals.seriesX[0][dataPointIndex];
        const isoDay = new Date(ts).toISOString().slice(0, 10);
        let html = `<div class=${tooltipClasses.tooltipClass}>
                    <p class="${
                      tooltipClasses.tooltipDateClass
                    }"><span class="${
          tooltipClasses.tooltipTextBoldClass
        }">${new Date(ts).toLocaleDateString()}</span></p>
                    <p class="${
                      tooltipClasses.tooltipDataClass
                    }">Open: <span class="${
          tooltipClasses.tooltipTextBoldClass
        }">${ohlc[0].toFixed(4)}</span></p>
                    <p class="${
                      tooltipClasses.tooltipDataClass
                    }">High: <span class="${
          tooltipClasses.tooltipTextBoldClass
        }">${ohlc[1].toFixed(4)}</span></p>
                    <p class="${
                      tooltipClasses.tooltipDataClass
                    }">Low: <span class="${
          tooltipClasses.tooltipTextBoldClass
        }">${ohlc[2].toFixed(4)}</span></p>
                    <p class="${
                      tooltipClasses.tooltipDataClass
                    }">Close: <span class="${
          tooltipClasses.tooltipTextBoldClass
        }">${ohlc[3].toFixed(4)}</span></p>`;

        // Volumen (solo si se muestra)
        if (showVolume && Array.isArray(volumeData)) {
          const volume = volumeData[dataPointIndex].y;
          html += `<p class="${
            tooltipClasses.tooltipDataClass
          }">Volumen: <span class="${
            tooltipClasses.tooltipTextBoldClass
          }">${volume.toLocaleString()}</span></p>`;
        }

        // Noticias
        const titles = newsByDate[isoDay] || [];
        if (titles.length) {
          html += `<hr class="${tooltipClasses.tooltipSeparationLineClass}"/>`;
          titles.forEach((t) => {
            html += `
              <div class="${tooltipClasses.tooltipNewTitleClass}" >
                “${t}”
              </div>`;
          });
        }
        html += `</div>`;
        return html;
      },
    },
  };
}
export function getVolumeOptions({ tooltipClasses }) {
  return {
    chart: {
      id: "volume",
      group: "sync-group",
      height: 160,
      type: "bar",
      animations: { enabled: false },
      brush: { enabled: true, target: "candles" },
    },
    plotOptions: {
      bar: { columnWidth: "80%" },
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#e0e0e0",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (v) => `${(v / 1000).toFixed(0)}K`,
        style: {
          colors: "#e0e0e0",
        },
      },
      title: {
        text: "Volumen",
        style: {
          color: "#e0e0e0",
          fontFamily: "Roboto",
          fontSize: "14px",
          letterSpacing: "1.5px",
        },
      },
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: false,
      y: {
        formatter: (val) => val.toLocaleString(),
        title: {
          formatter: () => "Volumen:",
        },
      },
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const val = w.config.series[seriesIndex].data[dataPointIndex].y;
        const ts = w.globals.seriesX[0][dataPointIndex];
        return `
          <div class=${tooltipClasses.tooltipClass}>
                    <p class="${
                      tooltipClasses.tooltipDateClass
                    }"><span class="${
          tooltipClasses.tooltipTextBoldClass
        }">${new Date(ts).toLocaleDateString()}</span></p>
              <p class="${
                tooltipClasses.tooltipDataClass
              }">Volumen: <span class="${
          tooltipClasses.tooltipTextBoldClass
        }">${val.toLocaleString()}</span></p>
          </div>
        `;
      },
    },
  };
}
