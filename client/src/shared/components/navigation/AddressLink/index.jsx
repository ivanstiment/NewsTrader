import { Link } from "react-router-dom";
import styles from "./AddressLink.module.scss";

export function AddressLink({ address1, city, country, size }) {
  const linkSize = size ? `address-link--${size}` : "";
  const query = [address1, city, country].filter(Boolean).join(", ");
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}`;

  return (
    <Link
      to="#"
      onClick={() => window.open(mapsUrl, "_blank", "noopener")}
      className={
        `${styles["address-link"]}` +
        (linkSize ? ` ${styles[linkSize]}` : "")
      }
    >
      {query}
    </Link>
  );
}
