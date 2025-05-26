import { api, ENDPOINTS } from "@/api";
import { useAuth } from "@/features/auth/hooks/auth-context.hook";
import { useApi } from "@/hooks/useApi";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function PrivateRoute() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { executeRequest } = useApi();

  // Verificar estado de autenticación al montar el componente
  useEffect(() => {
    if (user) {
      // Verificar si el token sigue siendo válido
      executeRequest(() => api.get(ENDPOINTS.AUTH.VERIFY_TOKEN), {
        showErrorToast: false, // No mostrar error toast para verificación silenciosa
        context: { component: "PrivateRoute", action: "verify_token" },
        onError: (error) => {
          // Si el token no es válido, cerrar sesión
          if (error.response?.status === 401) {
            console.log("El token no es válido, cerrando sesión...");
            logout();
          }
        },
      }).catch(() => {
        // Error ya manejado en onError
      });
    }
  }, [user, executeRequest, logout]);

  if (!user) {
    // Guardar la ubicación desde donde se intentó acceder
    return <Navigate to="/home" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
