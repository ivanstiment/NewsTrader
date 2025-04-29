import styles from "./Register.module.scss";
import { UserIcon, PadlockIcon } from "../Icons";
import { useEffect } from "react";

export function Register() {
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
    <div className={styles.register__container}>
      <div className={styles.register__card}>
        <p className={styles.register__title}>Crear una cuenta</p>
        <div className={styles.register__inputWrapper}>
          <p className={styles.register__paragraph}>
            <UserIcon width={24} height={24} className={styles.register__svg} />
            <label htmlFor="user">Usuario</label>
          </p>
          <input
            id="user"
            name="user"
            className={styles.register__input}
          ></input>
        </div>
        <div className={styles.register__inputWrapper}>
          <p className={styles.register__paragraph}>
            <PadlockIcon
              width={24}
              height={24}
              className={styles.register__svg}
            />
            <label htmlFor="password">Password</label>
          </p>
          <input
            id="password"
            name="password"
            className={styles.register__input}
          ></input>
        </div>
        <div className={styles.register__inputWrapper}>
          <p className={styles.register__paragraph}>
            <PadlockIcon
              width={24}
              height={24}
              className={styles.register__svg}
            />
            <label htmlFor="repassword">Repetir password</label>
          </p>
          <input
            id="repassword"
            name="repassword"
            className={styles.register__input}
          ></input>
        </div>
        <div className={styles.register__buttons}>
          <button className={styles.register__buttonRight}>Registrarse</button>
        </div>
      </div>
    </div>
  );
}
