import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LogoIcon,
  LogoutIcon,
  MenuCloseIcon,
  MenuOpenIcon,
  NewsPaperIcon,
  SearchIcon,
} from "../Icons";
import styles from "./NavigationMenu.module.scss";

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  // Toggle menú en móvil (click)
  const handleToggle = () => {
    // e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  // Abrir/ cerrar en desktop (hover)
  const handleMouseEnter = () => window.innerWidth > 600 && setIsOpen(true);
  const handleMouseLeave = () => window.innerWidth > 600 && setIsOpen(false);

  return (
    <aside
      className={styles["menu"]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Menú lateral"
    >
      <div className={styles["menu__fixed-icons"]}>
        <div>
          <Link
            to="#"
            className={`${styles["menu__toggle"]} ${
              isOpen
                ? styles["menu__toggle--open"]
                : styles["menu__toggle--closed"]
            }`}
            onClick={handleToggle}
          >
            <MenuOpenIcon
              width={24}
              height={24}
              className={styles["menu__toggle-svg"]}
            />
            <MenuCloseIcon
              width={24}
              height={24}
              className={styles["menu__toggle-svg"]}
            />
          </Link>
          <Link to="search" className={styles["menu__icon"]}>
            <SearchIcon
              width={24}
              height={24}
              className={styles["menu__svg"]}
            />
          </Link>
          <Link to="news" className={styles["menu__icon"]}>
            <NewsPaperIcon
              width={24}
              height={24}
              className={styles["menu__svg"]}
            />
          </Link>
        </div>
        <div>
          <Link to="#" className={styles["menu__icon"]}>
            <LogoutIcon
              width={24}
              height={24}
              className={styles["menu__svg"]}
              onClick={logout}
            />
          </Link>
        </div>
      </div>
      <div
        className={`${styles["menu__overlay"]} ${
          isOpen ? styles["menu__overlay--visible"] : ""
        }`}
        onClick={handleToggle}
      ></div>
      <nav
        className={`${styles["menu__panel"]} ${
          isOpen ? styles["menu__panel--open"] : ""
        }`}
      >
        <ul className={styles["menu__list"]}>
          <li className={styles["menu__item"]}>
            <Link
              className={styles["menu__link"]}
              to="#"
              onClick={handleToggle}
            >
              <LogoIcon
                width={40}
                height={34}
                className={styles["menu__svg"]}
              />
            </Link>
          </li>
          <li className={styles["menu__item"]}>
            <Link
              to="search"
              onClick={handleToggle}
              className={styles["menu__link"]}
            >
              <span>Buscar</span>
            </Link>
          </li>
          <li className={styles["menu__item"]}>
            <Link
              to="news"
              onClick={handleToggle}
              className={styles["menu__link"]}
            >
              <span>Noticias</span>
            </Link>
          </li>
        </ul>
        <ul className={styles["menu__list"]}>
          <li className={styles["menu__item"]}>
            <Link
              to="#"
              onClick={[handleToggle, logout]}
              className={styles["menu__link"]}
            >
              <span>Cerrar sesión</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
