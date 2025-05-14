import { Link } from "react-router-dom";
import { newCardPropTypes } from "../../propTypes/NewCard.propTypes";
import { ExternalLinkIcon } from "../Icons";
import styles from "./NewCard.module.scss";

export function NewCard({ newItem }) {
  const tsSeconds = newItem.provider_publish_time;
  const dateObj = new Date(tsSeconds * 1000);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const readableDate = dateObj.toLocaleString("es-ES", options);

  return (
    <article className={styles.new__container}>
      <header className={styles.new__header}>
        <h2 className={styles.new__title}>
          <Link to={`/news/${newItem.uuid}`}>{newItem.title}</Link>
        </h2>
        <Link
          className={styles.new__link}
          to={`${newItem.link}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLinkIcon
            width={40}
            height={34}
            className={styles.new__svg}
          />
        </Link>
      </header>
      <div className={styles.new__body}>
        <div className={styles.new__data}>
          <span className={styles.new__subTitle}>Fecha</span>
          <time className={styles.new__badge} dateTime={readableDate}>
            {readableDate}
          </time>
        </div>
        <div className={styles.new__data}>
          <span className={styles.new__subTitle}>Editor</span>
          <span className={styles.new__badge}>{newItem.publisher}</span>
        </div>
        <div className={styles.new__data}>
          <span className={styles.new__subTitle}>Tipo</span>
          <span className={styles.new__badge}>{newItem.news_type}</span>
        </div>
        {newItem.related_tickers && newItem.related_tickers.length > 0 && (
          <div className={styles.new__data}>
            <span className={styles.new__subTitle}>Related Tickers</span>
            <div className={styles.new__badgesContainer}>
              {newItem.related_tickers.map((ticker) => (
                <span key={ticker} className={styles.new__badge}>
                  {ticker}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

NewCard.propTypes = newCardPropTypes;
