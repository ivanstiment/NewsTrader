import axios from "axios";
import toast from "react-hot-toast";
import { handleAuthError } from "../handlers/auth.handler";
import { handleApiError } from "../handlers/error.handler";
import { tokenRefreshManager } from "../handlers/token.handler";

export const responseInterceptor = (response) => {
  // Manejar warnings en respuestas exitosas
  if (response.data?.warning) {
    toast(response.data.warning, {
      icon: "⚠️",
      duration: 4000,
    });
  }

  return response;
};

export const responseErrorInterceptor = async (error) => {
  const { config, response } = error;

  // Manejar errores 401 (no autenticado)
  if (response?.status === 401 && !config._retry) {
    config._retry = true;

    try {
      const newToken = await tokenRefreshManager.refreshToken();
      config.headers.Authorization = `Bearer ${newToken}`;
      return axios.request(config);
    } catch (refreshError) {
      return handleAuthError(refreshError);
    }
  }

  // Manejar otros errores si no estamos en proceso de refresh
  if (!tokenRefreshManager.isRefreshing && response?.status !== 401) {
    handleApiError(error);
  }

  return Promise.reject(error);
};
