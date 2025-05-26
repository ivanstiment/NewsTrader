import { useFormApi } from "@/hooks/useFormApi";
import { authService } from "@/features/auth/auth.service";
import { PadlockIcon, UserIcon } from "@/shared/components/icons";
import styles from "@/shared/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { registerSchema } from "../../validators/register-schema.validator";
import { useNavigate } from "react-router-dom";

export function Register() {
  const navigate = useNavigate();
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

  // Usar useFormApi
  const {
    loading,
    error,
    fieldErrors,
    submitForm,
    getFieldError,
    hasFieldError,
    clearError,
    clearFieldError,
  } = useFormApi();

  // Envío de formulario usando submitForm y authService
  const onSubmit = async (data) => {
    try {
      await submitForm(() => authService.register(data), {
        showSuccessToast: true,
        onSuccess: () => {
          reset(); // Limpiar formulario
          clearFieldError(); // Limpiar errores de campo
          setTimeout(() => {
            navigate("/login");
          }, 500);
        },
        context: { component: "Register", action: "create_account" },
      });
    } catch (err) {
      // El error ya fue manejado por useFormApi
      console.log("El registro de la cuenta falló:", err);
    }
  };

  // Limpiar errores cuando el usuario empiece a escribir
  const handleInputFocus = () => {
    if (error) {
      clearError();
      clearFieldError();
    }
  };

  return (
    <div className={styles["card__container"]}>
      <div className={styles["card"]} aria-live="polite">
        <h2 className={styles["card__title"]}>Crear una cuenta</h2>

        {/* Mostrar mensaje de error general o éxito */}
        {error && !error.response?.status === 400 && (
          <div role="alert" className={styles["form-field__error"]}>
            {error.response?.data?.error ||
              "Error inesperado, inténtalo de nuevo más tarde"}
          </div>
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
