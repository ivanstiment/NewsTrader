import { api } from "@/api";
import { CSRF_ENDPOINT } from "./csrf.config";
import { getCookie } from "./csrf.util";

export const csrfService = {
  /**
   * Llama al endpoint que siempre setea la cookie CSRF en el navegador
   */
  fetchCsrfToken: async () => {
    const res = await api.get(CSRF_ENDPOINT, { withCredentials: true });
    // El token estará en la cookie tras esta llamada
    return res.data.csrfToken;
  },

  /**
   * Devuelve el token actual de cookie, o lo recupera si falta
   */
  ensureCsrfToken: async () => {
    let token = getCookie();
    if (!token) {
      token = await this.fetchCsrfToken();
    }
    return token;
  },
};

export default csrfService;
