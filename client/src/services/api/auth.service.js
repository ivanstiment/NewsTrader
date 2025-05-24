import { api, ENDPOINTS } from "@/api";
import { loginSchema } from "@/validators/login-schema.validator";
import { registerSchema } from "@/validators/register-schema.validator";

export const authService = {
  /**
   * Iniciar sesión
   * @param {Object} credentials - {username, password}
   * @returns {Promise} Response con access y refresh tokens
   */
  login: async (credentials) => {
    // Validar datos antes de enviar
    await loginSchema.validate(credentials);
    return api.post(ENDPOINTS.AUTH.LOGIN, credentials);
  },

  /**
   * Cerrar sesión
   * @returns {Promise}
   */
  logout: () => api.post(ENDPOINTS.AUTH.LOGOUT),

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
};

export default authService;
