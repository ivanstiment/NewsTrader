import PropTypes from 'prop-types';
import { newCardShape } from "./new-card-shape";

export const newCardPropTypes = {
  newItem: PropTypes.shape(newCardShape).isRequired,
};
