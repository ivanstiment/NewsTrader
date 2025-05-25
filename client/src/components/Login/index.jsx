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

  // Usar useFormApi
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

  // Envío del formulario usando submitForm
  const onSubmit = async (data) => {
    try {
      await submitForm(() => authService.login(data), {
        showSuccessToast: true,
        successMessage: "¡Bienvenido! Redirigiendo...",
        onSuccess: (response) => {
          login(response.data.access, response.data.refresh);
          navigate("/news");
        },
        context: { component: "Login", action: "authenticate" },
      });
    } catch (err) {
      // El error ya fue manejado por useFormApi
      console.log("Error de inicio de sesion:", err);
    }
  };

  // Limpiar errores cuando el usuario empiece a escribir
  const handleInputFocus = () => {
    if (error) {
      clearError();
    }
  };

  return (
    <div className={styles["card__container"]}>
      <div className={styles["card"]} aria-live="polite">
        <h2 className={styles["card__title"]}>¡Bienvenido de nuevo!</h2>

        {/* Mostrar errores generales (no de campo específico) */}
        {error && !error.response?.status === 400 && (
          <div role="alert" className={styles["form__alertError"]}>
            {error.response?.data?.detail ||
              "Error de autenticación, verifica tus credenciales"}
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
