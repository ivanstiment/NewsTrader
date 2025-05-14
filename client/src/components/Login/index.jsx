import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import { UserIcon, PadlockIcon } from "../Icons";
import styles from "./Login.module.scss";

// 1) Definimos el esquema de validación con Yup
const loginSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required("El usuario es obligatorio"),
  password: yup
    .string()
    .required("La contraseña es obligatoria"),
});

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",       // validación al perder foco
    reValidateMode: "onChange",
  });

  const [apiError, setApiError] = React.useState("");

  // 2) Envío del formulario
  const onSubmit = async (data) => {
    setApiError("");
    try {
      const resp = await api.post("/api/token/", {
        username: data.username,
        password: data.password,
      });
      login(resp.data.access);
      navigate("/news");
    } catch (err) {
      setApiError(
        err.response?.data?.detail ||
          "Error de autenticación, verifica tus credenciales"
      );
    }
  };

  return (
    <div className={styles.login__container}>
      <div className={styles.login__card} aria-live="polite">
        <h2 className={styles.login__title}>¡Bienvenido de nuevo!</h2>

        {/* Mensaje de error genérico */}
        {apiError && (
          <div role="alert" className={styles.login__alertError}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Usuario */}
          <div className={styles.login__inputWrapper}>
            <label htmlFor="username" className={styles.login__label}>
              <UserIcon width={24} height={24} /> Usuario
            </label>
            <input
              type="text"
              id="username"
              {...register("username")}
              aria-invalid={errors.username ? "true" : "false"}
              className={`${styles.login__input} ${
                errors.username ? styles.login__inputError : ""
              }`}
            />
            <span
              role="alert"
              className={`${styles.login__errorMsg} ${
                errors.username ? styles.login__errorMsgDisplay : ""
              }`}
            >
              {errors.username?.message || "\u00A0"}
            </span>
          </div>

          {/* Contraseña */}
          <div className={styles.login__inputWrapper}>
            <label htmlFor="password" className={styles.login__label}>
              <PadlockIcon width={24} height={24} /> Contraseña
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
              className={`${styles.login__input} ${
                errors.password ? styles.login__inputError : ""
              }`}
            />
            <span
              role="alert"
              className={`${styles.login__errorMsg} ${
                errors.password ? styles.login__errorMsgDisplay : ""
              }`}
            >
              {errors.password?.message || "\u00A0"}
            </span>
          </div>

          {/* Botón de envío */}
          <div className={styles.login__buttons}>
            <button
              type="submit"
              className={styles.login__button}
              disabled={!isDirty || isSubmitting}
            >
              {isSubmitting ? "Iniciando sesión..." : "Continuar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}