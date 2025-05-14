import PropTypes from "prop-types";
import { newItemShape } from "./newItemShape";

export const newCardPropTypes = {
  newItem: PropTypes.shape(newItemShape).isRequired,
};
