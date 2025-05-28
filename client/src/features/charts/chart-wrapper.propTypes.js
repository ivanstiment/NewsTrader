import PropTypes from "prop-types";

export const chartWrapperPropTypes = {
  /** Identificador único del chart (apexcharts) */
  id: PropTypes.string.isRequired,

  /** Opciones de configuración de ApexCharts */
  options: PropTypes.shape({
    chart: PropTypes.object,
    annotations: PropTypes.object,
    xaxis: PropTypes.object,
    yaxis: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    // expandir según el uso real
  }).isRequired,

  /** Series de datos para el chart */
  series: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      data: PropTypes.arrayOf(
        PropTypes.oneOfType([
          // Velas: { x: Date|number, y: [open,high,low,close] }
          PropTypes.shape({
            x: PropTypes.oneOfType([
              PropTypes.number,
              PropTypes.instanceOf(Date),
            ]),
            y: PropTypes.arrayOf(PropTypes.number),
          }),
          // Barras: { x: Date|number, y: PropTypes.number }
          PropTypes.shape({
            x: PropTypes.oneOfType([
              PropTypes.number,
              PropTypes.instanceOf(Date),
            ]),
            y: PropTypes.number,
          }),
        ])
      ),
      type: PropTypes.string, // opcional en candlesSeries
    })
  ).isRequired,

  /** Tipo de gráfico: 'candlestick', 'bar', etc. */
  type: PropTypes.string.isRequired,

  /** Altura en píxeles del contenedor */
  height: PropTypes.number,
};
