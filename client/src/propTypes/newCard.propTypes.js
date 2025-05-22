import PropTypes from 'prop-types';
import { newCardShape } from "./newCardShape";

export const newCardPropTypes = {
  newItem: PropTypes.shape(newCardShape).isRequired,
};
