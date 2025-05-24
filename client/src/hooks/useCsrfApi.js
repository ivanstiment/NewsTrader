import { useCallback, useEffect, useState } from 'react';
import { csrfService } from '@/services/api';
import { getCsrfToken } from '@/utils/csrf';

export function useCsrfApi() {
  const [csrfToken, setCsrfToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCsrfToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Primero intentar obtener de cookies
      let token = getCsrfToken();
      
      // Si no está en cookies, pedirlo al servidor
      if (!token) {
        await csrfService.getCsrfToken();
        token = getCsrfToken();
      }
      
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

  useEffect(() => {
    fetchCsrfToken();
  }, [fetchCsrfToken]);

  return {
    csrfToken,
    isLoading,
    error,
    refreshCsrfToken,
  };
}