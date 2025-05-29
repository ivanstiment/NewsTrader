import ApexCharts from "apexcharts";
import { useEffect, useRef } from "react";
import { chartWrapperPropTypes } from "../../chart-wrapper.propTypes"

export function ChartWrapper({ id, options, series, type, height }) {
  const el = useRef(null);

  useEffect(() => {
    // AÑADE el id al options.chart
    const chart = new ApexCharts(el.current, {
      ...options,
      series,
      chart: { ...(options.chart || {}), id, type, height },
    });
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [id, options, series, type, height]);

  return <div ref={el} />;
}

ChartWrapper.propTypes = chartWrapperPropTypes;

ChartWrapper.defaultProps = {
  height: 400,
};
