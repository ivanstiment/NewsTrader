import { tokenService } from "@/services/api";
import axios from "axios";
import { getRefreshUrl } from "../config/endpoints";
import { handleAuthRedirect } from "./auth.handler";

class TokenRefreshManager {
  constructor() {
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  subscribeTokenRefresh(callback) {
    this.refreshSubscribers.push(callback);
  }

  onRefreshed(newToken) {
    this.refreshSubscribers.forEach((callback) => callback(newToken));
    this.refreshSubscribers = [];
  }

  async refreshToken() {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.subscribeTokenRefresh((newToken) => {
          if (newToken) {
            resolve(newToken);
          } else {
            reject(new Error("El token de actualización ha fallado"));
          }
        });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error("No hay token de actualización disponible");
      }

      const response = await axios.post(
        getRefreshUrl(),
        { refresh: refreshToken },
        { withCredentials: true }
      );

      const newAccessToken = response.data.access;
      setAccessToken(newAccessToken);

      this.isRefreshing = false;
      this.onRefreshed(newAccessToken);

      return newAccessToken;
    } catch (error) {
      console.error("Error de token de actualización:", error);
      this.isRefreshing = false;
      this.onRefreshed(null);

      tokenService.clearAllTokens();
      handleAuthRedirect();

      throw error;
    }
  }

  reset() {
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }
}

export const tokenRefreshManager = new TokenRefreshManager();

