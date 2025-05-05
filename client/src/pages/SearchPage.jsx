import React from "react";
import { Search } from "../components/Search/index";
import { stockTermPropTypes } from "../propTypes/stockTerm.propTypes";

export function SearchPage({ searchStock, setSearchTerm }) {
  return <Search searchStock={searchStock} setSearchTerm={setSearchTerm} />;
}

SearchPage.propTypes = stockTermPropTypes;