import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { LogoIcon, ArrowRightIcon } from "../Icons";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Determinar si estamos en /login o /register
  const isAuthPage = path === "/login" || path === "/register";

  // Asignar clase condicional
  const insideClass = isAuthPage
    ? styles.header__inside
    : styles.header__background;

  const renderHeaderRight = () => {
    if (path === "/register") {
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
              width={24}
              height={24}
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
              width={24}
              height={24}
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
      <LogoIcon width={52} height={44} className={styles.menu__svg} />
      {renderHeaderRight()}
    </div>
  );
}
