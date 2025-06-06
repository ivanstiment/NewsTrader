import { tokenService } from "./token.service";
import { ENDPOINTS } from "@/api/config/endpoints";

// No importamos apiClient aquí para evitar dependencia circular
let apiClientInstance = null;

class TokenRefreshManager {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Método para inyectar el cliente API
  setApiClient(client) {
    apiClientInstance = client;
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  async refreshToken() {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      const error = new Error("No hay refresh token disponible");
      this.processQueue(error);
      this.handleRefreshFailure();
      throw error;
    }

    if (!apiClientInstance) {
      const error = new Error("API client no inicializado");
      this.processQueue(error);
      throw error;
    }

    this.isRefreshing = true;

    try {
      const response = await apiClientInstance.post(ENDPOINTS.AUTH.REFRESH, {
        refresh: refreshToken
      }, {
        // Configuración especial para evitar interceptors problemáticos
        skipAuthCheck: true,    // No agregar Authorization header
        skipRetryOn401: true    // No intentar refresh en caso de 401
      });

      const { access } = response.data;
      if (!access) {
        throw new Error("No se recibió token de acceso");
      }
      
      tokenService.setAccessToken(access);
      
      this.processQueue(null, access);
      this.isRefreshing = false;
      
      if (import.meta.env.MODE === "development") {
        console.log('✅ Token actualizado');
      }
      return access;
    } catch (error) {
      if (import.meta.env.MODE === "development") {
        console.error("❌ Falló la actualización de Token:", error);
      }
      this.processQueue(error);
      this.isRefreshing = false;
      this.handleRefreshFailure();
      throw error;
    }
  }

  handleRefreshFailure() {
    if (import.meta.env.MODE === "development") {
      console.log('🚪 Manejo de errores de actualización: borrado de tokens');
    }
    tokenService.clearAllTokens();
    
    // Redirigir solo si no estamos en páginas públicas
    const publicRoutes = ["/home", "/login", "/register"];
    const currentPath = window.location.pathname;
    
    if (!publicRoutes.includes(currentPath)) {
    if (import.meta.env.MODE === "development") {
      console.log('↩️ Redirigiendo al login...');
    }
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
  }

  reset() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }
}

export const tokenRefreshManager = new TokenRefreshManager();

export default tokenRefreshManager;