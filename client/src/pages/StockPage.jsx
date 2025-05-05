import React from "react";
import { Stock } from "../components/Stock/index";
import { stockTermPropTypes } from "../propTypes/stockTerm.propTypes";

export function StockPage({ searchStock }) {
  return <Stock searchStock={searchStock} />;
}

StockPage.propTypes = stockTermPropTypes;
