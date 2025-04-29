import { Link } from "react-router-dom";
import styles from "./NewCard.module.scss";
import { newCardPropTypes } from "./newCard.propTypes";

// export function NewCard({ newItem }) {
//   return (
//     <Link to={`/news/${newItem.uuid}`} className={styles.new__item}>
//       <h1>{newItem.title}</h1>
//       <p>{newItem.news_type}</p>
//       <p>{newItem.link}</p>
//       <p>{newItem.provider_publish_time}</p>
//       <p>{newItem.publisher}</p>
//     </Link>
//   );
// }

export function NewCard({ newItem }) {
  return (
    <article className={styles.new__container}>
      <header>
        <h2 className={styles.new__title}>
          <Link to={`/news/${newItem.uuid}`}>
            {newItem.title}
          </Link>
        </h2>
      </header>
      <div className={styles.new__body}>
        <div className={styles.new__data}>
          <span className={styles.new__subTitle}>Fecha</span>
          <time
            className={styles.new__badge}
            dateTime={newItem.provider_publish_time}
          >
            {new Date(newItem.provider_publish_time).toLocaleDateString()}
          </time>
        </div>
        {/* <p className={styles.new__link}>
          <a href={newItem.link} target="_blank" rel="noopener">
            Ver fuente
          </a>
        </p> */}
        <div className={styles.new__data}>
          <span className={styles.new__subTitle}>Editor</span>
          <span className={styles.new__badge}>{newItem.publisher}</span>
        </div>
        <div className={styles.new__data}>
          <span className={styles.new__subTitle}>Tipo</span>
          <span className={styles.new__badge}>{newItem.news_type}</span>
        </div>
      </div>
    </article>
  );
}

NewCard.propTypes = newCardPropTypes;
