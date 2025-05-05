import React from "react";
import { NewsList } from "../components/NewsList/index";
import { searchTermPropTypes } from "../propTypes/searchTerm.propTypes";

export function NewsPage({ searchTerm }) {
  return <NewsList searchTerm={searchTerm} />;
}

NewsPage.propTypes = searchTermPropTypes;