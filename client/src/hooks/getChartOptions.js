export function getCandlestickOptions({
  symbol,
  annotationPoints,
  newsByDate,
  showVolume,
  volumeData,
}) {
  return {
    chart: {
      id: "candles",
      type: "candlestick",
      toolbar: { autoSelected: "pan", show: true },
      zoom: { enabled: true },
    },
    title: { text: `Histórico de ${symbol.toUpperCase()}`, align: "left" },
    annotations: {
      points: annotationPoints,
    },
    plotOptions: {
      candlestick: { colors: { upward: "#26a69a", downward: "#ef5350" } },
    },
    xaxis: { type: "datetime" },
    yaxis: [
      {
        seriesName: symbol?.toUpperCase(),
        title: { text: "Precio" },
        labels: { formatter: (v) => parseFloat(v).toFixed(4) },
        tooltip: { enabled: true },
      },
    ],
    tooltip: {
      shared: true,
      custom: ({ w, dataPointIndex }) => {
        // 1) Obtenemos OHLC
        const ohlc = w.config.series[0].data[dataPointIndex].y;
        const ts = w.globals.seriesX[0][dataPointIndex];
        const isoDay = new Date(ts).toISOString().slice(0, 10);
        let html = `<div style="padding:6px;"><b>${new Date(
          ts
        ).toLocaleDateString()}</b><br/>
                    Open: <b>${ohlc[0].toFixed(4)}</b><br/>
                    High: <b>${ohlc[1].toFixed(4)}</b><br/>
                    Low: <b>${ohlc[2].toFixed(4)}</b><br/>
                    Close: <b>${ohlc[3].toFixed(4)}</b><br/>`;

        // 2) Volumen (solo si lo mostramos)
        if (showVolume && Array.isArray(volumeData)) {
          const volume = volumeData[dataPointIndex].y;
          html += `Volumen: <b>${volume.toLocaleString()}</b><br/>`;
        }

        // 3) Noticias
        const titles = newsByDate[isoDay] || [];
        if (titles.length) {
          html += `<hr style="margin:4px 0;"/>`;
          titles.forEach((t) => {
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
  };
}

export function getVolumeOptions() {
  return {
    chart: {
      id: "volume",
      height: 160,
      type: "bar",
      brush: { enabled: true, target: "candles" },
      // selection: {
      //   enabled: true,
      //   fill: { color: "#ccc", opacity: 0.4 },
      // },
    },
    plotOptions: {
      bar: { columnWidth: "80%" },
    },
    dataLabels: { enabled: false },
    xaxis: { type: "datetime" },
    yaxis: {
      labels: { formatter: (v) => `${(v / 1000).toFixed(0)}K` },
      title: { text: "Volumen" },
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
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
          <div style="
            padding:6px;
            background: rgba(0,0,0,0.8);
            color: white;
            border-radius:4px;">
              <div><b>${new Date(ts).toLocaleDateString()}</b></div>
              <div>Volumen: <b>${val.toLocaleString()}</b></div>
          </div>
        `;
      },
    },
  };
}
