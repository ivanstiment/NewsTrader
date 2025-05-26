import styles from "./ArticleCard.module.scss";

export function ArticleCard({ article, onSelect }) {
  return (
    <div className={styles.card}>
      <h2
        className={styles["card__title"]}
        onClick={() => onSelect(article.id)}
      >
        {article.title}
      </h2>
      <p className={styles["card__ticker"]}>{article.ticker}</p>
      <span className={styles["card__date"]}>
        {new Date(article.pub_date).toLocaleDateString()}
      </span>
    </div>
  );
}
