import { Link } from "react-router-dom";
import { stockCardPropTypes } from "@/features/stocks/stock-card.propTypes";
import { ChartIcon } from "@/shared/components/icons";
import styles from "./StockCard.module.scss";

export function StockCard({ stock }) {
  return (
    <span className={styles["stock-card"]}>
      <Link
        to={`/stock/${stock.symbol}`}
        className={styles["stock-card__link"]}
      >
        {stock.symbol}
      </Link>
      <Link
        to={`/historical-price/${stock.symbol}`}
        className={styles["stock-card__svg"]}
      >
        <ChartIcon
          width={24}
          height={24}
          className={styles["stock-card__svg"]}
        />
      </Link>
    </span>
  );
}

StockCard.propTypes = stockCardPropTypes;
