import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { searchTermPropTypes } from "../../propTypes/searchTerm.propTypes";
import { ArrowRightIcon, LogoIcon } from "../Icons";
import styles from "./Header.module.scss";

export function Header({ searchTerm, setSearchTerm }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { user } = useAuth();

  const isAuthPage = path === "/login" || path === "/register";
  const isNewsPage = path === "/news";

  const insideClass = isAuthPage
    ? styles.header__inside
    : styles.header__background;

  const renderHeaderRight = () => {
    if (user && isNewsPage) {
      console.log("user");
      console.log(user);
      return (
        <div className={styles.header__backgroundSearch}>
          <input
            type="text"
            placeholder="Buscar noticias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.header__search}
          ></input>
        </div>
      );
    } else if (path === "/register") {
      return (
        <div className={insideClass}>
          <span className={styles.header__text}>
            ¿Por primera vez en NewsTrader?
          </span>
          <button
            className={styles.header__button}
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
            <ArrowRightIcon
              width={16}
              height={20}
              className={styles.header__svg}
            />
          </button>
        </div>
      );
    } else if (path === "/login") {
      return (
        <div className={insideClass}>
          <span className={styles.header__text}>
            ¿Ya tienes una cuenta en NewsTrader?
          </span>
          <button
            className={styles.header__button}
            onClick={() => navigate("/register")}
          >
            Crear una cuenta
            <ArrowRightIcon
              width={16}
              height={20}
              className={styles.header__svg}
            />
          </button>
        </div>
      );
    } else {
      return <div className={insideClass}></div>;
    }
  };

  return (
    <div className={styles.header__container}>
      <LogoIcon width={52} height={44} />
      {renderHeaderRight()}
    </div>
  );
}

Header.propTypes = searchTermPropTypes;
