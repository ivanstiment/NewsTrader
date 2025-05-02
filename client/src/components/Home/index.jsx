import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.scss";
import { LogoIcon } from "../Icons";

export function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const prevDisplay = document.body.style.display;
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    return () => {
      document.body.style.display = prevDisplay;
    };
  }, []);

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
