import { useCallback, useEffect, useState } from 'react';
import { csrfService } from '@/services/api';

export function useCsrfApi() {
  const [csrfToken, setCsrfToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCsrfToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Usar el servicio migrado con reintentos
      const token = await csrfService.getCsrfTokenWithRetry();
      setCsrfToken(token);
      return token;
    } catch (err) {
      console.error('Error al obtener token CSRF:', err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshCsrfToken = useCallback(async () => {
    return fetchCsrfToken();
  }, [fetchCsrfToken]);

  const hasCsrfToken = useCallback(() => {
    return csrfService.hasToken();
  }, []);

  const getCsrfToken = useCallback(() => {
    return csrfService.getToken();
  }, []);

  useEffect(() => {
    fetchCsrfToken();
  }, [fetchCsrfToken]);

  return {
    csrfToken,
    isLoading,
    error,
    refreshCsrfToken,
    hasCsrfToken,
    getCsrfToken,
  };
}