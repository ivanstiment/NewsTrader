import PropTypes from "prop-types";
import { stockCardShape } from "./stock-cardShape";

export const stockCardPropTypes = {
  newItem: PropTypes.shape(stockCardShape).isRequired,
};
