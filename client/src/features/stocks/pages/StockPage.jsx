import { Stock } from "../components/Stock/index";
import { stockTermPropTypes } from "../stock-term.propTypes";

export function StockPage({ searchStock }) {
  return <Stock searchStock={searchStock} />;
}

StockPage.propTypes = stockTermPropTypes;
