import { handleError } from "@/utils/errorHandler";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

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
        successMessage = "Operación exitosa",
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
          toast.success(successMessage, {
            duration: 3000,
          });
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
 * Hook especializado para operaciones CRUD
 */
export function useCrud(apiService) {
  const { loading, error, executeRequest, clearError } = useApi();

  const create = useCallback(
    (data, options = {}) => {
      return executeRequest(() => apiService.create(data), {
        showSuccessToast: true,
        successMessage: "Creado exitosamente",
        context: { operation: "create" },
        ...options,
      });
    },
    [apiService, executeRequest]
  );

  const read = useCallback(
    (id, options = {}) => {
      return executeRequest(() => apiService.get(id), {
        showErrorToast: true,
        context: { operation: "read", id },
        ...options,
      });
    },
    [apiService, executeRequest]
  );

  const update = useCallback(
    (id, data, options = {}) => {
      return executeRequest(() => apiService.update(id, data), {
        showSuccessToast: true,
        successMessage: "Actualizado exitosamente",
        context: { operation: "update", id },
        ...options,
      });
    },
    [apiService, executeRequest]
  );

  const remove = useCallback(
    (id, options = {}) => {
      return executeRequest(() => apiService.delete(id), {
        showSuccessToast: true,
        successMessage: "Eliminado exitosamente",
        context: { operation: "delete", id },
        ...options,
      });
    },
    [apiService, executeRequest]
  );

  const list = useCallback(
    (params = {}, options = {}) => {
      return executeRequest(() => apiService.getAll(params), {
        showErrorToast: true,
        context: { operation: "list", params },
        ...options,
      });
    },
    [apiService, executeRequest]
  );

  return {
    loading,
    error,
    clearError,
    create,
    read,
    update,
    remove,
    list,
  };
}

/**
 * Hook para manejar formularios con API
 */
export function useFormApi() {
  const { loading, error, executeRequest, clearError } = useApi();
  const [fieldErrors, setFieldErrors] = useState({});

  const submitForm = useCallback(
    async (apiCall, options = {}) => {
      const {
        onValidationError = null,
        clearFieldErrorsOnStart = true,
        ...restOptions
      } = options;

      // Limpiar errores de campo al iniciar
      if (clearFieldErrorsOnStart && Object.keys(fieldErrors).length > 0) {
        setFieldErrors({});
      }

      try {
        return await executeRequest(apiCall, {
          showErrorToast: false, // Manejamos errores de validación por separado
          ...restOptions,
        });
      } catch (err) {
        // Manejar errores de validación (400)
        if (err.response?.status === 400 && err.response?.data) {
          const data = err.response.data;
          const newFieldErrors = {};

          // Extraer errores de campo
          Object.keys(data).forEach((field) => {
            if (Array.isArray(data[field])) {
              newFieldErrors[field] = data[field];
            } else if (typeof data[field] === "string") {
              newFieldErrors[field] = [data[field]];
            }
          });

          if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors);

            if (onValidationError) {
              onValidationError(newFieldErrors);
            }

            // Mostrar mensaje general de validación
            toast.error("Por favor corrige los errores en el formulario", {
              duration: 4000,
            });
          } else {
            // Si no hay errores de campo específicos, usar manejo global
            handleError(err, {
              context: { component: "useFormApi" },
            });
          }
        } else {
          // Para otros errores, usar manejo global
          handleError(err, {
            context: { component: "useFormApi" },
          });
        }

        throw err;
      }
    },
    [executeRequest, fieldErrors]
  );

  const clearFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const getFieldError = useCallback(
    (fieldName) => {
      return fieldErrors[fieldName] || null;
    },
    [fieldErrors]
  );

  const hasFieldError = useCallback(
    (fieldName) => {
      return Boolean(fieldErrors[fieldName]);
    },
    [fieldErrors]
  );

  return {
    loading,
    error,
    fieldErrors,
    clearError,
    clearFieldErrors,
    getFieldError,
    hasFieldError,
    submitForm,
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
