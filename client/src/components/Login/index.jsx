import styles from "./Login.module.scss";
import { UserIcon, PadlockIcon } from "../Icons";
import { useEffect } from "react";

export function Login() {
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
    <div className={styles.login__container}>
      <div className={styles.login__card}>
        <p className={styles.login__title}>¡Bienvenido de nuevo!</p>
        <div className={styles.login__inputWrapper}>
          <p className={styles.login__paragraph}>
            <UserIcon width={24} height={24} className={styles.login__svg} />
            <label htmlFor="user">Usuario</label>
          </p>
          <input id="user" name="user" className={styles.login__input}></input>
        </div>
        <div className={styles.login__inputWrapper}>
          <p className={styles.login__paragraph}>
            <PadlockIcon width={24} height={24} className={styles.login__svg} />
            <label htmlFor="password">Password</label>
          </p>
          <input
            id="password"
            name="password"
            className={styles.login__input}
          ></input>
        </div>
        <div className={styles.login__buttons}>
          <button className={styles.login__buttonRight}>Continuar</button>
        </div>
      </div>
    </div>
  );
}
