// client/src/services/api/token/token.handler.js
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
      const error = new Error("No refresh token available");
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
        throw new Error("No access token received");
      }
      
      tokenService.setAccessToken(access);
      
      this.processQueue(null, access);
      this.isRefreshing = false;
      
      console.log('✅ Token refreshed successfully');
      return access;
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      this.processQueue(error);
      this.isRefreshing = false;
      this.handleRefreshFailure();
      throw error;
    }
  }

  handleRefreshFailure() {
    console.log('🚪 Handling refresh failure - clearing tokens');
    tokenService.clearAllTokens();
    
    // Redirigir solo si no estamos en páginas públicas
    const publicRoutes = ["/home", "/login", "/register"];
    const currentPath = window.location.pathname;
    
    if (!publicRoutes.includes(currentPath)) {
      console.log('↩️ Redirecting to login...');
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