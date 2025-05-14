import { useNavigate } from "react-router-dom";
import { LogoIcon } from "../Icons";
import styles from "./Home.module.scss";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.home__container}>
      <div className={styles.home__card}>
        <LogoIcon width={128} height={110} className={styles.home__svg} />
        <p className={styles.home__title}>¡Bienvenido a NewsTrader!</p>
        <p className={styles.home__text}>
          Inicia sesión con tus cuenta para continuar
        </p>
        <div className={styles.home__buttons}>
          <button
            className={styles.home__buttonLeft}
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>
          <button
            className={styles.home__buttonRight}
            onClick={() => navigate("/register")}
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}
