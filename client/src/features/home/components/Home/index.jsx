import styles from "@/shared/styles";
import { useNavigate } from "react-router-dom";
import { LogoIcon } from "@/shared/components/icons";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles["card__container"]}>
      <div className={styles["card"]}>
        <LogoIcon
          width={128}
          height={110}
          className={styles["card__logo"]}
        />
        <h2 className={styles["card__title"]}>¡Bienvenido a NewsTrader!</h2>
        <p className={styles["card__text"]}>
          Inicia sesión con tus cuenta para continuar
        </p>
        <div
          className={`${styles["button-wrapper"]} ${styles["button-wrapper--dual"]}`}
        >
          <button
            className={`${styles["button"]} ${styles["button--secondary"]}`}
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>
          <button
            className={`${styles["button"]} ${styles["button--primary"]}`}
            onClick={() => navigate("/register")}
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}
