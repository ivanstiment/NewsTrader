import { handleError } from "../api/handlers/error.handler";
import { useCallback, useState } from "react";
import { toastService } from "@/services";

/**
 * Hook personalizado para manejar peticiones API con estados y errores
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeRequest = useCallback(
    async (apiCall, options = {}) => {
      const {
        showSuccessToast = false,
        successMessage = "Operación con éxito",
        showErrorToast = true,
        errorMessage = null,
        onSuccess = null,
        onError = null,
        resetErrorOnStart = true,
        context = {},
      } = options;

      // Resetear estado de error si se especifica
      if (resetErrorOnStart && error) {
        setError(null);
      }

      setLoading(true);

      try {
        const result = await apiCall();

        // Mostrar toast de éxito si se especifica
        if (showSuccessToast) {
          toastService.success(successMessage);
        }

        // Callback de éxito
        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        // Almacenar error en el estado
        setError(err);

        // Manejar error con el sistema global si se especifica
        if (showErrorToast) {
          handleError(err, {
            customMessage: errorMessage,
            context: { ...context, component: "useApi" },
          });
        }

        // Callback de error
        if (onError) {
          onError(err);
        }

        // Re-lanzar el error para que el componente pueda manejarlo
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [error]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    executeRequest,
    clearError,
  };
}

/**
 * Hook para operaciones asíncronas con reintentos
 */
export function useAsyncOperation() {
  const { loading, error, executeRequest, clearError } = useApi();
  const [retryCount, setRetryCount] = useState(0);

  const executeWithRetry = useCallback(
    async (apiCall, maxRetries = 3, retryDelay = 1000, options = {}) => {
      let lastError;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          setRetryCount(attempt);

          const result = await executeRequest(apiCall, {
            ...options,
            showErrorToast: attempt === maxRetries, // Solo mostrar error en el último intento
          });

          setRetryCount(0); // Resetear contador en éxito
          return result;
        } catch (err) {
          lastError = err;

          // Si no es el último intento y el error es recuperable, esperar y reintentar
          if (attempt < maxRetries && isRetriableError(err)) {
            await new Promise((resolve) =>
              setTimeout(resolve, retryDelay * (attempt + 1))
            );
            continue;
          }

          // Si llegamos aquí, ya no podemos reintentar
          break;
        }
      }

      setRetryCount(0);
      throw lastError;
    },
    [executeRequest]
  );

  return {
    loading,
    error,
    retryCount,
    clearError,
    executeWithRetry,
  };
}

/**
 * Determina si un error es recuperable y vale la pena reintentar
 */
function isRetriableError(error) {
  if (!error.response) {
    // Errores de red son generalmente retriables
    return true;
  }

  const status = error.response.status;

  // Errores de servidor (5xx) y algunos 4xx son retriables
  return status >= 500 || status === 408 || status === 429;
}