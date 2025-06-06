import { Search } from "../components/Search/index";
import { stockTermPropTypes } from "@/features/stocks/stock-term.propTypes";

/**
 * @description Página de búsqueda de stocks de la aplicación NewsTrader
 * Implementa funcionalidad de búsqueda y filtrado de instrumentos financieros
 * con validación en tiempo real y navegación optimizada
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.searchStock - Término de búsqueda actual
 * @param {Function} props.setSearchStock - Función para actualizar término de búsqueda
 * @returns {JSX.Element} Página de búsqueda renderizada
 * 
 * @example
 * <SearchPage 
 *   searchStock="AAPL" 
 *   setSearchStock={(term) => console.log(term)} 
 * />
 */
function SearchPage({ searchStock, setSearchStock }) {
  return <Search searchStock={searchStock} setSearchStock={setSearchStock} />;
}

SearchPage.propTypes = stockTermPropTypes;

export default SearchPage;

export { SearchPage };