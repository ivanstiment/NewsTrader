import styles from "./Register.module.scss";
import { UserIcon, PadlockIcon } from "../Icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCsrfToken } from "../../api/utils";

export function Register() {
  const [formData, setFormData] = useState({
    user: "",
    password: "",
    repassword: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const prevDisplay = document.body.style.display;
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    return () => {
      document.body.style.display = prevDisplay;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.repassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }
    try {
      const csrfToken = getCsrfToken();
      const response = await axios.post(
        "http://localhost:8000/register/register/",
        {
          user: formData.user,
          password: formData.password,
        },
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );
      setMessage(response.data.success);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className={styles.register__container}>
      <div className={styles.register__card}>
        <p className={styles.register__title}>Crear una cuenta</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.register__inputWrapper}>
            <p className={styles.register__paragraph}>
              <UserIcon
                width={24}
                height={24}
                className={styles.register__svg}
              />
              <label htmlFor="user">Usuario</label>
            </p>
            <input
              id="user"
              name="user"
              className={styles.register__input}
              value={formData.user}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
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
              value={formData.repassword}
              onChange={handleChange}
            ></input>
          </div>
          <div className={styles.register__buttons}>
            <button type="submit" className={styles.register__buttonRight}>
              Registrarse
            </button>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
