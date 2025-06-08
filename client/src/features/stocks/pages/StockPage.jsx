import { Stock } from "../components/Stock/index";
import { stockTermPropTypes } from "../stock-term.propTypes";

/**
 * @description Página de detalle de stock de la aplicación NewsTrader
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.searchStock - Término de búsqueda actual
 * @returns {JSX.Element} Página de búsqueda renderizada
 */
function StockPage({ searchStock }) {
  return <Stock searchStock={searchStock} />;
}

StockPage.propTypes = stockTermPropTypes;

export default StockPage;

export { StockPage };