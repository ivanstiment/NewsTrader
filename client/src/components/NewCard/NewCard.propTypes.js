import PropTypes from 'prop-types';
import { newItemShape } from '../../propTypes/newItemShape';

export const newCardPropTypes = {
  newItem: PropTypes.shape(newItemShape).isRequired,
};