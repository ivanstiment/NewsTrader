import { Search } from "../components/Search/index";
import { stockTermPropTypes } from "@/features/stocks/stock-term.propTypes";

export function SearchPage({ searchStock, setSearchStock }) {
  return <Search searchStock={searchStock} setSearchStock={setSearchStock} />;
}

SearchPage.propTypes = stockTermPropTypes;
