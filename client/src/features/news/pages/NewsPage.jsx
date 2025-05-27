import { NewsList } from "../components/NewsList/index";
import { searchTermPropTypes } from "@/features/search/search-term.propTypes";

export function NewsPage({ searchTerm }) {
  return <NewsList searchTerm={searchTerm} />;
}

NewsPage.propTypes = searchTermPropTypes;
