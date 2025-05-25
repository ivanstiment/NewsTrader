// client/src/hooks/useFormApi.js
import { useState, useCallback } from "react";
import { handleError } from "../api/handlers/error.handler";
import toast from "react-hot-toast";

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
        showErrorToast = true,
        onSuccess = null,
        onError = null,
        context = {},
      } = options;

      setLoading(true);
      setError(null);
      setFieldErrors({});

      try {
        const result = await apiCall();

        if (showSuccessToast) {
          toast.success(successMessage, { duration: 3000 });
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        setError(err);

        // Manejar errores de validación de campo (400)
        if (err.response?.status === 400 && err.response?.data) {
          const data = err.response.data;
          
          // Extraer errores de campo específicos
          const extractedFieldErrors = {};
          Object.keys(data).forEach(key => {
            if (Array.isArray(data[key]) && key !== 'non_field_errors') {
              extractedFieldErrors[key] = data[key];
            }
          });
          
          setFieldErrors(extractedFieldErrors);
          
          // Mostrar errores generales si existen
          if (data.non_field_errors || data.detail) {
            const generalError = data.non_field_errors?.[0] || data.detail;
            if (showErrorToast && generalError) {
              toast.error(generalError, { duration: 4000 });
            }
          }
        } else {
          // Para otros tipos de error, usar el handler global
          if (showErrorToast) {
            handleError(err, {
              context: { ...context, component: "useFormApi" },
            });
          }
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
    clearFieldError,
  };
}