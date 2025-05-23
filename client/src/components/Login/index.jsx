import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/validators/login-schema.validator";
import { PadlockIcon, UserIcon } from "../Icons";
import styles from "@/shared/styles";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur", // validación al perder foco
    reValidateMode: "onChange",
  });

  const [apiError, setApiError] = useState("");

  // Envío del formulario
  const onSubmit = async (data) => {
    setApiError("");
    try {
      const resp = await api.post("/token/", {
        username: data.username,
        password: data.password,
      });
      login(resp.data.access, resp.data.refresh);
      navigate("/news");
    } catch (err) {
      setApiError(
        err.response?.data?.detail ||
          "Error de autenticación, verifica tus credenciales"
      );
    }
  };

  return (
    // <div className={styles['form-field__container}>
    <div className={styles["card__container"]}>
      <div className={styles["card"]} aria-live="polite">
        <h2 className={styles["card__title"]}>¡Bienvenido de nuevo!</h2>

        {/* Mensaje de error genérico */}
        {apiError && (
          <div role="alert" className={styles["form__alertError"]}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Usuario */}
          <div className={styles["form-field__wrapper"]}>
            <label htmlFor="username" className={styles["form-field__label"]}>
              <UserIcon width={24} height={24} /> Usuario
            </label>
            <input
              type="text"
              id="username"
              {...register("username")}
              aria-invalid={errors.username ? "true" : "false"}
              className={`${styles["form-field__input"]} ${
                errors.username ? styles["form-field__input--error"] : ""
              }`}
            />
            <span
              role="alert"
              className={`${styles["form-field__error"]} ${
                errors.username ? styles["form-field__error--visible"] : ""
              }`}
            >
              {errors.username?.message || "\u00A0"}
            </span>
          </div>

          {/* Contraseña */}
          <div className={styles["form-field__wrapper"]}>
            <label htmlFor="password" className={styles["form-field__label"]}>
              <PadlockIcon width={24} height={24} /> Contraseña
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
              className={`${styles["form-field__input"]} ${
                errors.password ? styles["form-field__input--error"] : ""
              }`}
            />
            <span
              role="alert"
              className={`${styles["form-field__error"]} ${
                errors.password ? styles["form-field__error--visible"] : ""
              }`}
            >
              {errors.password?.message || "\u00A0"}
            </span>
          </div>

          {/* Botón de envío */}
          <div className={styles["button-wrapper"]}>
            <button
              type="submit"
              className={`${styles["button"]} ${styles["button--primary"]}`}
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
