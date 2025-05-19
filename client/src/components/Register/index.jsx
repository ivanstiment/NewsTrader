import { getCsrfToken } from "@/api/utils";
import styles from "@/shared/styles";
import { registerSchema } from "@/validators/register-schema.validator";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PadlockIcon, UserIcon } from "../Icons";

export function Register() {
  // 2. Hook useForm con validación y modo onBlur para accesibilidad
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(registerSchema),
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
        "http://localhost:8000/register/",
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
    <div className={styles["card__container"]}>
      <div className={styles["card"]} aria-live="polite">
        <h2 className={styles["card__title"]}>Crear una cuenta</h2>

        {/* Mostrar mensaje de error o éxito */}
        {(apiError || apiSuccess) && (
          <div
            role={apiError ? "alert" : "status"}
            className={
              apiError
                ? styles["form__alertError"]
                : styles["form__alertSuccess"]
            }
          >
            {apiError || apiSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Usuario */}
          <div className={styles["form-field__wrapper"]}>
            <label htmlFor="user" className={styles["form-field__label"]}>
              <UserIcon width={24} height={24} /> Usuario
            </label>
            <input
              type="text"
              id="user"
              {...register("user")}
              aria-invalid={errors.user ? "true" : "false"}
              className={`${styles["form-field__input"]} ${
                errors.user ? styles["form-field__input--error"] : ""
              }`}
            />
            <span
              role="alert"
              className={`${styles["form-field__error"]} ${
                errors.user ? styles["form-field__error--visible"] : ""
              }`}
            >
              {errors.user?.message || "\u00A0"}
              {/* \u00A0 mantiene altura aunque no haya mensaje */}
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

          {/* Repetir contraseña */}
          <div className={styles["form-field__wrapper"]}>
            <label htmlFor="repassword" className={styles["form-field__label"]}>
              <PadlockIcon width={24} height={24} /> Repetir contraseña
            </label>
            <input
              type="password"
              id="repassword"
              {...register("repassword")}
              aria-invalid={errors.repassword ? "true" : "false"}
              className={`${styles["form-field__input"]} ${
                errors.repassword ? styles["form-field__input--error"] : ""
              }`}
            />
            <span
              role="alert"
              className={`${styles["form-field__error"]} ${
                errors.repassword ? styles["form-field__error--visible"] : ""
              }`}
            >
              {errors.repassword?.message || "\u00A0"}
            </span>
          </div>

          {/* Submit */}
          <div className={styles["button-wrapper"]}>
            <button
              type="submit"
              className={`${styles["button"]} ${styles["button--primary"]}`}
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
