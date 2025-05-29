// client/src/features/auth/auth.service.js
import { api, ENDPOINTS } from "@/api";
import { csrfManager } from "@/services/api/csrf/csrf.manager";
import { csrfService } from "@/services/api/csrf/csrf.service";
import { loginSchema } from "./validators/login-schema.validator";
import { registerSchema } from "./validators/register-schema.validator";

/**
 * Asegurar que tenemos token CSRF antes de operaciones críticas
 */
const ensureCsrfToken = async () => {
  if (!csrfManager.isValid()) {
    console.log('🔄 Obteniendo token CSRF para operación de autenticación...');
    const token = await csrfService.fetchCsrfToken();
    csrfManager.set(token);
  }
};

export const authService = {
  /**
   * Iniciar sesión
   * @param {Object} credentials - {username, password}
   * @returns {Promise} Response con access y refresh tokens
   */
  login: async (credentials) => {
    try {
      // Validar datos antes de enviar
      await loginSchema.validate(credentials);
      
      // Asegurar CSRF token antes del login
      await ensureCsrfToken();
      
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
      return response;
    } catch (error) {
      // Mejorar el manejo de errores específicos de login
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 401) {
          // Error de credenciales
          throw {
            ...error,
            response: {
              ...error.response,
              data: {
                detail: data.detail || "Credenciales incorrectas. Verifica tu usuario y contraseña.",
                non_field_errors: ["Credenciales incorrectas"]
              }
            }
          };
        }
        
        if (status === 403) {
          // Posible error de CSRF, intentar refrescar token
          console.warn('⚠️ Error 403 en login, posiblemente CSRF. Limpiando token...');
          csrfManager.clear();
          throw error;
        }
      }
      
      // Otros errores (incluyendo errores de validación de yup)
      throw error;
    }
  },

  /**
   * Cerrar sesión
   * @returns {Promise}
   */
  logout: async () => {
    try {
      // Asegurar CSRF token antes del logout
      await ensureCsrfToken();
      
      return await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Incluso si falla el logout en el servidor, 
      // podemos continuar con el logout local
      console.warn("⚠️ Error en logout del servidor:", error);
      return { data: { message: "Logout local exitoso" } };
    }
  },

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - {user, password, repassword}
   * @returns {Promise}
   */
  register: async (userData) => {
    try {
      // Validar datos antes de enviar
      await registerSchema.validate(userData);
      
      // Asegurar CSRF token antes del registro
      await ensureCsrfToken();
      
      return await api.post(ENDPOINTS.AUTH.REGISTER, userData);
    } catch (error) {
      if (error.response?.status === 403) {
        // Posible error de CSRF, intentar refrescar token
        console.warn('⚠️ Error 403 en register, posiblemente CSRF. Limpiando token...');
        csrfManager.clear();
      }
      throw error;
    }
  },

  /**
   * Refrescar token de acceso
   * @param {string} refreshToken
   * @returns {Promise}
   */
  refreshToken: (refreshToken) =>
    api.post(ENDPOINTS.AUTH.REFRESH, { refresh: refreshToken }),

  /**
   * Verificar si el token actual es válido
   * @returns {Promise}
   */
  verifyToken: () => api.get(ENDPOINTS.AUTH.VERIFY),
};

export default authService;