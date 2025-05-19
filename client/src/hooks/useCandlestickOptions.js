export function useCandlestickOptions({ symbol, annotations, newsByDate }) {
  return {
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
    annotations,
    plotOptions: {
      candlestick: {
        colors: { upward: "#26a69a", downward: "#ef5350" },
      },
    },
    xaxis: { type: "datetime" },
    yaxis: [
      {
        tooltip: { enabled: true },
        labels: { formatter: (v) => v.toFixed(4) },
        title: { text: "Precio" },
      },
    ],
    tooltip: {
      shared: true,
      custom: ({ w, dataPointIndex }) => {
        const ts = w.globals.seriesX[0][dataPointIndex];
        const isoDay = new Date(ts).toISOString().slice(0, 10);
        const ohlc = w.config.series[0].data[dataPointIndex].y;
        let html = `
          <div style="padding:6px;">
            <b>${new Date(ts).toLocaleDateString()}</b><br/>
            Open: <b>${ohlc[0].toFixed(4)}</b><br/>
            High: <b>${ohlc[1].toFixed(4)}</b><br/>
            Low: <b>${ohlc[2].toFixed(4)}</b><br/>
            Close: <b>${ohlc[3].toFixed(4)}</b><br/>`;

        // Añadimos aquí los títulos de las noticias, si existen:
        const titles = newsByDate[isoDay] || [];
        if (titles.length) {
          html += `<hr style="margin:4px 0;" />`;
          titles.forEach((t) => {
            html += `
              <div style="
                font-style: italic;
                font-size: 0.85em;
                max-width: 200px;
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
