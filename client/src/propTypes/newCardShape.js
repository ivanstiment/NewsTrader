import PropTypes from "prop-types";

export const newCardShape = {
  uuid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  news_type: PropTypes.string,
  link: PropTypes.string,
  provider_publish_time: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  publisher: PropTypes.string,
};
