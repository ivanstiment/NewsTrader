import { useCallback, useState } from "react";
import { csrfService } from "./csrf.service";
import { csrfManager } from "./csrf.manager";

export function useCsrf() {
  const [csrfToken, setCsrfToken] = useState(() => csrfManager.get());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchToken = useCallback(async () => {
    // No hacer nada si ya tenemos un token válido
    if (csrfToken) return csrfToken;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await csrfService.fetchCsrfToken();
      csrfManager.set(token);
      setCsrfToken(token);
      return token;
    } catch (err) {
      console.error("Error obteniendo token CSRF:", err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [csrfToken]);

  const clearToken = useCallback(() => {
    csrfManager.clear();
    setCsrfToken(null);
    setError(null);
  }, []);

  return {
    csrfToken,
    setCsrfToken,
    fetchToken,
    clearToken,
    isLoading,
    error
  };
}