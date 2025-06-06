import { useCallback } from "react";
import { toastService } from "@/services";

/**
 * Hook personalizado para manejar peticiones API con toasts
 * @returns {Object} Funciones para realizar peticiones API con toasts
 */
export function useToastApi() {
  /**
   * Ejecuta una petición API con manejo de toasts
   * @param {Function} apiCall - Función que realiza la petición API
   * @param {Object} options - Opciones para personalizar los toasts
   * @param {string} [options.loadingMessage="Procesando..."] - Mensaje de loading
   * @param {string} [options.successMessage="Operación exitosa"] - Mensaje de éxito
   * @param {string} [options.errorMessage="Ha ocurrido un error"] - Mensaje de error
   * @param {boolean} [options.showLoadingToast=true] - Mostrar toast de loading
   * @param {boolean} [options.showSuccessToast=true] - Mostrar toast de éxito
   * @param {boolean} [options.showErrorToast=true] - Mostrar toast de error
   * @returns {Promise} Resultado de la petición API
   */
  const executeWithToast = useCallback(async (apiCall, options = {}) => {
    const {
      loadingMessage = "Procesando...",
      successMessage = "Operación exitosa",
      errorMessage = "Ha ocurrido un error",
      showLoadingToast = true,
      showSuccessToast = true,
      showErrorToast = true,
      toastId = `toast-${Date.now()}`,
    } = options;

    let toastLoadingId;

    try {
      // Mostrar toast de loading
      if (showLoadingToast) {
        toastLoadingId = toastService.loading(loadingMessage, { id: toastId });
      }

      // Ejecutar la petición API
      const result = await apiCall();

      // Actualizar el toast a éxito
      if (showSuccessToast) {
        toastService.update(toastLoadingId, "success", successMessage, {
          duration: 3000,
        });
      }

      return result;
    } catch (error) {
      // Actualizar el toast a error
      if (showErrorToast) {
        toastService.update(
          toastLoadingId,
          "error",
          errorMessage || error.message || "Error desconocido",
          { duration: 5000 }
        );
      }

      throw error; // Re-lanzar el error para que el componente pueda manejarlo
    }
  }, []);

  return { executeWithToast };
}
