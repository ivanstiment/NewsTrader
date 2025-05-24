import api from "@/api/axios";
import styles from "@/shared/styles";
import { registerSchema } from "@/validators/register-schema.validator";
import { useFormApi } from "@/hooks/useApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { PadlockIcon, UserIcon } from "../Icons";

export function Register() {
  // Hook useForm con validación y modo onBlur para accesibilidad
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
  });

  // Usar useFormApi en lugar de useState manual
  const {
    loading,
    error,
    fieldErrors,
    submitForm,
    getFieldError,
    hasFieldError,
    clearError,
    clearFieldErrors,
  } = useFormApi();

  // Estado para mensaje de éxito
  const [successMessage, setSuccessMessage] = useState(null);

  // Envío de formulario usando submitForm
  const onSubmit = async (data) => {
    // Limpiar mensaje de éxito previo
    setSuccessMessage(null);

    try {
      await submitForm(
        () =>
          api.post("/register/", {
            user: data.user,
            password: data.password,
          }),
        {
          showSuccessToast: true,
          successMessage: "¡Cuenta creada con éxito!",
          onSuccess: (response) => {
            setSuccessMessage(
              response.data.success ||
                "¡Registro exitoso! Ya puedes iniciar sesión."
            );
            reset(); // Limpiar formulario
            clearFieldErrors(); // Limpiar errores de campo
          },
          context: { component: "Register", action: "create_account" },
        }
      );
    } catch (err) {
      // El error ya fue manejado por useFormApi
      console.log("El registro de la cuenta falló:", err);
    }
  };

  // Limpiar errores cuando el usuario empiece a escribir
  const handleInputFocus = () => {
    if (error) {
      clearError();
    }
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  return (
    <div className={styles["card__container"]}>
      <div className={styles["card"]} aria-live="polite">
        <h2 className={styles["card__title"]}>Crear una cuenta</h2>

        {/* Mostrar mensaje de error general o éxito */}
        {error && !error.response?.status === 400 && (
          <div role="alert" className={styles["form__alertError"]}>
            {error.response?.data?.error ||
              "Error inesperado, inténtalo de nuevo más tarde"}
          </div>
        )}

        {successMessage && (
          <output className={styles["form__alertSuccess"]}>
            {successMessage}
          </output>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Username */}
          <div className={styles["form-field__wrapper"]}>
            <label htmlFor="user" className={styles["form-field__label"]}>
              <UserIcon width={24} height={24} /> Usuario
            </label>
            <input
              type="text"
              id="user"
              {...register("user")}
              onFocus={handleInputFocus}
              aria-invalid={
                errors.user || hasFieldError("user") ? "true" : "false"
              }
              className={`${styles["form-field__input"]} ${
                errors.user || hasFieldError("user")
                  ? styles["form-field__input--error"]
                  : ""
              }`}
            />
            <span
              role="alert"
              className={`${styles["form-field__error"]} ${
                errors.user || hasFieldError("user")
                  ? styles["form-field__error--visible"]
                  : ""
              }`}
            >
              {errors.user?.message || getFieldError("user")?.[0] || "\u00A0"}
            </span>
          </div>

          {/* Password */}
          <div className={styles["form-field__wrapper"]}>
            <label htmlFor="password" className={styles["form-field__label"]}>
              <PadlockIcon width={24} height={24} /> Contraseña
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              onFocus={handleInputFocus}
              aria-invalid={
                errors.password || hasFieldError("password") ? "true" : "false"
              }
              className={`${styles["form-field__input"]} ${
                errors.password || hasFieldError("password")
                  ? styles["form-field__input--error"]
                  : ""
              }`}
            />
            <span
              role="alert"
              className={`${styles["form-field__error"]} ${
                errors.password || hasFieldError("password")
                  ? styles["form-field__error--visible"]
                  : ""
              }`}
            >
              {errors.password?.message ||
                getFieldError("password")?.[0] ||
                "\u00A0"}
            </span>
          </div>

          {/* Repeat password */}
          <div className={styles["form-field__wrapper"]}>
            <label htmlFor="repassword" className={styles["form-field__label"]}>
              <PadlockIcon width={24} height={24} /> Repetir contraseña
            </label>
            <input
              type="password"
              id="repassword"
              {...register("repassword")}
              onFocus={handleInputFocus}
              aria-invalid={
                errors.repassword || hasFieldError("repassword")
                  ? "true"
                  : "false"
              }
              className={`${styles["form-field__input"]} ${
                errors.repassword || hasFieldError("repassword")
                  ? styles["form-field__input--error"]
                  : ""
              }`}
            />
            <span
              role="alert"
              className={`${styles["form-field__error"]} ${
                errors.repassword || hasFieldError("repassword")
                  ? styles["form-field__error--visible"]
                  : ""
              }`}
            >
              {errors.repassword?.message ||
                getFieldError("repassword")?.[0] ||
                "\u00A0"}
            </span>
          </div>

          {/* Submit */}
          <div className={styles["button-wrapper"]}>
            <button
              type="submit"
              className={`${styles["button"]} ${styles["button--primary"]}`}
              disabled={!isDirty || loading}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
