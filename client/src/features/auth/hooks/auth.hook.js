import { useFormApi } from "@/hooks/useFormApi";
import { useAuth } from "@/features/auth/hooks/auth-context.hook";
import { authService } from "../auth.service";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useAuthApi() {
  const { login: contextLogin, logout: contextLogout } = useAuth();
  const { loading, fieldErrors, submitForm, getFieldError, hasFieldError } =
    useFormApi();
  const navigate = useNavigate();

  const login = useCallback(
    async (credentials) => {
      return submitForm(() => authService.login(credentials), {
        showSuccessToast: true,
        successMessage: "¡Bienvenido! Iniciando sesión...",
        onSuccess: (response) => {
          const { access, refresh } = response.data;
          contextLogin(access, refresh);

          // Redirigir después del login exitoso
          setTimeout(() => {
            navigate("/search");
          }, 1000);
        },
        context: { action: "login" },
      });
    },
    [submitForm, contextLogin, navigate]
  );

  const register = useCallback(
    async (userData) => {
      return submitForm(() => authService.register(userData), {
        showSuccessToast: true,
        successMessage: "¡Registro exitoso! Ahora puedes iniciar sesión",
        onSuccess: () => {
          // Redirigir al login después del registro
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        },
        context: { action: "register" },
      });
    },
    [submitForm, navigate]
  );

  const logout = useCallback(async () => {
    try {
      // Intentar cerrar sesión en el servidor
      await authService.logout();
    } catch (error) {
      // Aunque falle en el servidor, cerrar sesión localmente
      console.warn("Error al cerrar sesión en el servidor:", error);
    } finally {
      contextLogout();
      toast.success("Sesión cerrada correctamente");
    }
  }, [contextLogout]);

  return {
    login,
    register,
    logout,
    loading,
    fieldErrors,
    getFieldError,
    hasFieldError,
  };
}
