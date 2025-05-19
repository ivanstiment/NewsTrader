import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { searchTermPropTypes } from "@/propTypes/searchTerm.propTypes";
import { ArrowRightIcon, LogoIcon } from "../Icons";
import styles from "./Header.module.scss";

export function Header({ searchTerm, setSearchTerm }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { user } = useAuth();

  const isAuthPage = path === "/login" || path === "/register";
  const isNewsPage = path === "/news";

  const headerInnerClass = isAuthPage
    ? styles["header__inner--auth"]
    : styles["header__inner--default"];

  const headerContainerClass = `${styles["header__container"]} ${
    isAuthPage
      ? styles["header__container--auth"]
      : styles["header__container--default"]
  }`;

  const renderRight = () => {
    if (user && isNewsPage) {
      return (
        <div className={styles["header__search-container"]}>
          <input
            type="text"
            placeholder="Buscar noticias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles["header__search-input"]}
          ></input>
        </div>
      );
    }

    const text =
      path === "/register"
        ? "¿Por primera vez en NewsTrader?"
        : "¿Ya tienes una cuenta en NewsTrader?";
    const btnText =
      path === "/register" ? "Iniciar Sesión" : "Crear una cuenta";
    const targetPath = path === "/register" ? "/login" : "/register";

    if (path === "/register" || path === "/login") {
      return (
        <div className={headerInnerClass}>
          <span className={styles["header__text"]}>{text}</span>
          <button
            className={styles["header__button"]}
            onClick={() => navigate(targetPath)}
          >
            {btnText}
            <ArrowRightIcon
              width={16}
              height={20}
              className={styles["header__button-icon"]}
            />
          </button>
        </div>
      );
    }

    return <div className={headerInnerClass}></div>;
  };

  return (
    <header className={styles["header"]}>
      <div className={headerContainerClass}>
        <LogoIcon width={52} height={44} className={styles["header__logo"]} />
        {renderRight()}
      </div>
    </header>
  );
}

Header.propTypes = searchTermPropTypes;
