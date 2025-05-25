import { useFormApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/api";
import styles from "@/shared/styles";
import { loginSchema } from "@/validators/login-schema.validator";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PadlockIcon, UserIcon } from "../Icons";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Usar useFormApi mejorado
  const {
    loading,
    error,
    fieldErrors,
    submitForm,
    getFieldError,
    hasFieldError,
    clearError,
  } = useFormApi();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // Envío del formulario
  const onSubmit = async (data) => {
    try {
      await submitForm(() => authService.login(data), {
        showSuccessToast: true,
        successMessage: "¡Bienvenido! Redirigiendo...",
        showErrorToast: false, // No mostrar toast para errores de login
        onSuccess: (response) => {
          const { access, refresh } = response.data;
          if (login(access, refresh)) {
            setTimeout(() => {
              navigate("/news");
            }, 500);
          } else {
            console.error("Error al procesar tokens de autenticación");
          }
        },
        context: { component: "Login", action: "authenticate" },
      });
    } catch (err) {
      // El error ya fue procesado por useFormApi
      console.log("Error de inicio de sesión:", err.response?.data);
    }
  };

  // Limpiar errores cuando el usuario empiece a escribir
  const handleInputFocus = () => {
    if (error) {
      clearError();
    }
  };

  // Determinar si mostrar error general
  const shouldShowGeneralError = error && !error.response?.status === 400;
  const generalErrorMessage =
    error?.message || "Error de autenticación, verifica tus credenciales";

  return (
    <div className={styles["card__container"]}>
      <div className={styles["card"]} aria-live="polite">
        <h2 className={styles["card__title"]}>¡Bienvenido de nuevo!</h2>

        {/* Mostrar errores generales (no de validación) */}
        {shouldShowGeneralError && (
          <div role="alert" className={styles["form__alertError"]}>
            {generalErrorMessage}
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
              onFocus={handleInputFocus}
              aria-invalid={
                errors.username || hasFieldError("username") ? "true" : "false"
              }
              className={`${styles["form-field__input"]} ${
                errors.username || hasFieldError("username")
                  ? styles["form-field__input--error"]
                  : ""
              }`}
            />
            <span
              role="alert"
              className={`${styles["form-field__error"]} ${
                errors.username || hasFieldError("username")
                  ? styles["form-field__error--visible"]
                  : ""
              }`}
            >
              {errors.username?.message ||
                getFieldError("username")?.[0] ||
                "\u00A0"}
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

          {/* Mostrar error de credenciales inválidas */}
          {error?.response?.status === 401 && (
            <div role="alert" className={styles["form__alertError"]}>
              {error.response.data?.detail ||
                "Credenciales incorrectas. Verifica tu usuario y contraseña."}
            </div>
          )}

          {/* Botón de envío */}
          <div className={styles["button-wrapper"]}>
            <button
              type="submit"
              className={`${styles["button"]} ${styles["button--primary"]}`}
              disabled={!isDirty || loading}
            >
              {loading ? "Iniciando sesión..." : "Continuar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
