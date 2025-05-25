import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { handleError, extractErrorMessage, getErrorType } from "@/api/handlers/error.handler";

/**
 * Hook para manejo de formularios con API
 */
export function useFormApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  /**
   * Limpiar todos los errores
   */
  const clearError = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  /**
   * Limpiar error de un campo específico
   */
  const clearFieldError = useCallback((fieldName) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Obtener error de un campo específico
   */
  const getFieldError = useCallback((fieldName) => {
    return fieldErrors[fieldName] || null;
  }, [fieldErrors]);

  /**
   * Verificar si un campo tiene error
   */
  const hasFieldError = useCallback((fieldName) => {
    return Boolean(fieldErrors[fieldName]);
  }, [fieldErrors]);

  /**
   * Procesar errores de validación del servidor
   */
  const processValidationErrors = useCallback((errorResponse) => {
    const data = errorResponse.data;
    const newFieldErrors = {};

    // Manejar diferentes formatos de error de Django/DRF
    if (data && typeof data === 'object') {
      // Errores de campo específicos
      Object.keys(data).forEach(key => {
        if (key !== 'detail' && key !== 'non_field_errors') {
          const fieldError = data[key];
          if (Array.isArray(fieldError)) {
            newFieldErrors[key] = fieldError;
          } else if (typeof fieldError === 'string') {
            newFieldErrors[key] = [fieldError];
          }
        }
      });

      // Errores no específicos de campo
      if (data.non_field_errors) {
        const nonFieldErrors = Array.isArray(data.non_field_errors) 
          ? data.non_field_errors 
          : [data.non_field_errors];
        setError({ message: nonFieldErrors.join(', '), response: errorResponse });
      } else if (data.detail && Object.keys(newFieldErrors).length === 0) {
        // Solo mostrar detail si no hay errores de campo
        setError({ message: data.detail, response: errorResponse });
      }
    }

    setFieldErrors(newFieldErrors);
    return Object.keys(newFieldErrors).length > 0;
  }, []);

  /**
   * Función principal para enviar formularios
   */
  const submitForm = useCallback(async (apiCall, options = {}) => {
    const {
      showSuccessToast = false,
      successMessage = "Operación exitosa",
      showErrorToast = true,
      onSuccess,
      onError,
      context = {},
    } = options;

    // Limpiar errores previos
    clearError();
    setLoading(true);

    try {
      const response = await apiCall();

      // Mostrar toast de éxito si está habilitado
      if (showSuccessToast) {
        toast.success(successMessage, {
          duration: 3000,
          position: "top-right",
        });
      }

      // Ejecutar callback de éxito
      if (onSuccess) {
        await onSuccess(response);
      }

      return response;
    } catch (err) {
      console.error("Error en submitForm:", err);

      // Procesar errores de validación (400)
      if (err.response?.status === 400) {
        const hasFieldErrors = processValidationErrors(err.response);
        
        // Si no hay errores de campo específicos, mostrar error general
        if (!hasFieldErrors && err.response?.data?.detail) {
          setError({ 
            message: err.response.data.detail, 
            response: err.response 
          });
        }
      } else {
        // Para otros tipos de error
        const errorMessage = extractErrorMessage(err);
        setError({ message: errorMessage, response: err.response });
      }

      // Mostrar toast de error si está habilitado y no es error 400
      // (los errores 400 se muestran en el formulario)
      if (showErrorToast && err.response?.status !== 400) {
        const errorType = getErrorType(err);
        const toastMessage = extractErrorMessage(err);
        
        toast.error(toastMessage, {
          duration: 5000,
          position: "top-right",
        });
      }

      // Ejecutar callback de error
      if (onError) {
        await onError(err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError, processValidationErrors]);

  return {
    loading,
    error,
    fieldErrors,
    submitForm,
    clearError,
    clearFieldError,
    getFieldError,
    hasFieldError,
  };
}