// client/src/services/api/auth.service.js
import { api, ENDPOINTS } from "@/api";
import { loginSchema } from "./validators/login-schema.validator";
import { registerSchema } from "./validators/register-schema.validator";

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
        
        if (status === 400) {
          // Errores de validación
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
      return await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Incluso si falla el logout en el servidor, 
      // podemos continuar con el logout local
      console.warn("Error en logout del servidor:", error);
      return { data: { message: "Logout local exitoso" } };
    }
  },

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - {user, password, repassword}
   * @returns {Promise}
   */
  register: async (userData) => {
    // Validar datos antes de enviar
    await registerSchema.validate(userData);
    return api.post(ENDPOINTS.AUTH.REGISTER, userData);
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