import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { getCsrfToken } from "../../api/utils";
import { PadlockIcon, UserIcon } from "../Icons";
import styles from "./Register.module.scss";

// 1. Esquema de validación usando Yup
const schema = yup.object().shape({
  user: yup
    .string()
    .trim()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(30, "Máximo 30 caracteres")
    .required("Usuario es obligatorio"),
  password: yup
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "Debe contener una letra mayúscula")
    .matches(/[a-z]/, "Debe contener una letra minúscula")
    .matches(/[0-9]/, "Debe contener un número")
    .required("Contraseña es obligatoria"),
  repassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir")
    .required("Repetir contraseña es obligatorio"),
});

export function Register() {
  // 2. Hook useForm con validación y modo onBlur para accesibilidad
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);

  // 3. Envío de formulario
  const onSubmit = async (data) => {
    setApiError(null);
    setApiSuccess(null);
    try {
      const csrfToken = getCsrfToken();
      const response = await axios.post(
        "/register/",
        { user: data.user, password: data.password },
        { headers: { "X-CSRFToken": csrfToken } }
      );
      setApiSuccess(response.data.success);
      reset();
    } catch (error) {
      if (error.response?.data?.error) {
        setApiError(error.response.data.error);
      } else {
        setApiError("Error inesperado, inténtalo de nuevo más tarde");
      }
    }
  };

  return (
    <div className={styles.register__container}>
      <div className={styles.register__card} aria-live="polite">
        <h2 className={styles.register__title}>Crear una cuenta</h2>

        {/* Mostrar mensaje de error o éxito */}
        {(apiError || apiSuccess) && (
          <div
            role={apiError ? "alert" : "status"}
            className={
              apiError
                ? styles.register__alertError
                : styles.register__alertSuccess
            }
          >
            {apiError || apiSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Usuario */}
          <div className={styles.register__inputWrapper}>
            <label htmlFor="user" className={styles.register__label}>
              <UserIcon width={24} height={24} /> Usuario
            </label>
            <input
              type="text"
              id="user"
              {...register("user")}
              aria-invalid={errors.user ? "true" : "false"}
              className={`${styles.register__input} ${
                errors.user ? styles.register__inputError : ""
              }`}
            />
            <span
              role="alert"
              className={`${styles.register__errorMsg} ${
                errors.user ? styles.register__errorMsgDisplay : ""
              }`}
            >
              {errors.user?.message || "\u00A0"}
              {/* \u00A0 mantiene altura aunque no haya mensaje */}
            </span>
          </div>

          {/* Contraseña */}
          <div className={styles.register__inputWrapper}>
            <label htmlFor="password" className={styles.register__label}>
              <PadlockIcon width={24} height={24} /> Contraseña
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
              className={`${styles.register__input} ${
                errors.password ? styles.register__inputError : ""
              }`}
            />
            <span
              role="alert"
              className={`${styles.register__errorMsg} ${
                errors.password ? styles.register__errorMsgDisplay : ""
              }`}
            >
              {errors.password?.message || "\u00A0"}
            </span>
          </div>

          {/* Repetir contraseña */}
          <div className={styles.register__inputWrapper}>
            <label htmlFor="repassword" className={styles.register__label}>
              <PadlockIcon width={24} height={24} /> Repetir contraseña
            </label>
            <input
              type="password"
              id="repassword"
              {...register("repassword")}
              aria-invalid={errors.repassword ? "true" : "false"}
              className={`${styles.register__input} ${
                errors.repassword ? styles.register__inputError : ""
              }`}
            />
            <span
              role="alert"
              className={`${styles.register__errorMsg} ${
                errors.repassword ? styles.register__errorMsgDisplay : ""
              }`}
            >
              {errors.repassword?.message || "\u00A0"}
            </span>
          </div>

          {/* Submit */}
          <div className={styles.register__buttons}>
            <button
              type="submit"
              className={styles.register__button}
              disabled={!isDirty || isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
