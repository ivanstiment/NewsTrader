import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./NavigationMenu.module.scss";
import {
  NewsPaperIcon,
  SearchIcon,
  MenuOpenIcon,
  MenuCloseIcon,
  LogoIcon
} from "../Icons";

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle menú en móvil (click)
  const handleToggle = (e) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  // Abrir/ cerrar en desktop (hover)
  const handleMouseEnter = () => window.innerWidth > 600 && setIsOpen(true);
  const handleMouseLeave = () => window.innerWidth > 600 && setIsOpen(false);

  return (
    <aside
      className={styles.menu__container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Menú lateral"
    >
      <div className={styles.menu__fixedIcons}>
        <Link
          to="#"
          className={`${styles.menu__animateIcon} ${
            isOpen
              ? styles.menu__animateIconOpen
              : styles.menu__animateIconClosed
          }`}
          onClick={handleToggle}
        >
          <MenuOpenIcon
            width={24}
            height={24}
            className={styles.menu__animateSvg}
          />
          <MenuCloseIcon
            width={24}
            height={24}
            className={styles.menu__animateSvg}
          />
        </Link>
        <Link to="/news" className={styles.menu__icon}>
          <SearchIcon width={24} height={24} className={styles.menu__svg} />
        </Link>
        <Link to="/news" className={styles.menu__icon}>
          <NewsPaperIcon width={24} height={24} className={styles.menu__svg} />
        </Link>
      </div>
      <div
        className={`${styles.menu__overlay} ${
          isOpen ? styles.menu__overlayOpen : ""
        }`}
        onClick={handleToggle}
      ></div>
      <nav
        // className={`${styles.menu__panel} ${styles.menu__panelOpen}`}
        className={`${styles.menu__panel} ${
          isOpen ? styles.menu__panelOpen : ""
        }`}
      >
        <ul className={styles.menu__linkList}>
          <li className={styles.menu__linkElement}>
            <Link className={styles.menu__link} to="#" onClick={handleToggle}>
              <LogoIcon width={40} height={34} className={styles.menu__svg} />
            </Link>
          </li>
          <li className={styles.menu__linkElement}>
            <Link
              to="/news"
              onClick={handleToggle}
              className={styles.menu__link}
            >
              <span>Buscar</span>
            </Link>
          </li>
          <li className={styles.menu__linkElement}>
            <Link
              to="/news"
              onClick={handleToggle}
              className={styles.menu__link}
            >
              <span>Noticias</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
