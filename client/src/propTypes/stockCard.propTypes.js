import PropTypes from "prop-types";
import { stockCardShape } from "./stockCardShape";

export const stockCardPropTypes = {
  newItem: PropTypes.shape(stockCardShape).isRequired,
};
