import { useState, useCallback } from "react";
import { toastService } from "@/services";

/**
 * Hook especializado para manejar formularios con API
 */
export function useFormApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const submitForm = useCallback(
    async (apiCall, options = {}) => {
      const {
        showSuccessToast = false,
        successMessage = "Operación exitosa",
        onSuccess = null,
        onError = null,
      } = options;

      setLoading(true);
      setError(null);
      setFieldErrors({});

      try {
        const result = await apiCall();

        if (showSuccessToast) {
          toastService.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        setError(err);

        // Manejar errores de validación de campo (400)
        if (err.response?.status === 400) {
          const data = err.response.data;
          
          const extractedErrors = {};
          Object.keys(data).forEach(key => {
            if (Array.isArray(data[key]) && key !== 'non_field_errors') {
              extractedErrors[key] = data[key];
            }
          });
          setFieldErrors(extractedErrors);

          if (data.detail) {
            toastService.error(data.detail);
          }
        } else if (err.response?.status === 401) {
          const message = err.response.data?.detail || 'Credenciales incorrectas';
          toastService.error(message);
        } else {
          toastService.error('Ha ocurrido un error inesperado');
        }

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

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

  const clearError = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    loading,
    error,
    fieldErrors,
    submitForm,
    getFieldError,
    hasFieldError,
    clearError,
    clearFieldError
  };
}