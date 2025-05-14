import { Search } from "../components/Search/index";
import { stockTermPropTypes } from "../propTypes/stockTerm.propTypes";

export function SearchPage({ searchStock, setSearchStock }) {
  return <Search searchStock={searchStock} setSearchStock={setSearchStock} />;
}

SearchPage.propTypes = stockTermPropTypes;
