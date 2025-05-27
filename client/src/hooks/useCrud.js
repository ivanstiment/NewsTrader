import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
/**
 * Hook especializado para operaciones CRUD
 */
export function useCrud(apiService) {
  const { loading, error, executeRequest, clearError } = useApi();

  const create = useCallback(
    (data, options = {}) => {
      return executeRequest(() => apiService.create(data), {
        showSuccessToast: true,
        successMessage: "Creado con éxito",
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
        successMessage: "Actualizado con éxito",
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
        successMessage: "Eliminado con éxito",
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
