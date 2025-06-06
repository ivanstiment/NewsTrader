import styles from "./FinancialSkeleton.module.scss";

/**
 * @description Skeleton loader con temática financiera para lazy loading
 * Muestra un diseño provisional mientras se cargan los componentes
 * @returns {JSX.Element} Componente skeleton con animación de carga
 * @example
 * <Suspense fallback={<FinancialSkeleton />}>
 *   <LazyComponent />
 * </Suspense>
 */
export function FinancialSkeleton() {
  return (
    <div className={styles["skeleton-container"]}>
      <div className={styles["skeleton-header"]}>
        <div className={styles["skeleton-logo"]} />
        <div className={styles["skeleton-nav"]}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles["skeleton-nav-item"]} />
          ))}
        </div>
      </div>
      
      <div className={styles["skeleton-content"]}>
        {/* Simulación de gráfico financiero */}
        <div className={styles["skeleton-chart"]}>
          <div className={styles["skeleton-chart-bars"]}>
            {[40, 65, 45, 70, 55, 80, 50].map((height, i) => (
              <div
                key={i}
                className={styles["skeleton-bar"]}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
        
        {/* Simulación de métricas */}
        <div className={styles["skeleton-metrics"]}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles["skeleton-metric-card"]} />
          ))}
        </div>
      </div>
      
      <div className={styles["skeleton-pulse"]}>
        <span>Cargando datos del mercado...</span>
      </div>
    </div>
  );
}