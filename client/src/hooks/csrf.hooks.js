import { csrfService } from "@/services/api/csrf.service";
import { getCsrfTokenFromCookie, hasCsrfToken } from "@/utils/csrf.utils";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Estados posibles del hook
 */
const CSRF_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

/**
 * Hook personalizado para gestión de tokens CSRF
 * Maneja el estado, carga inicial y operaciones relacionadas con CSRF
 */
export function useCsrf() {
  // Estado del token y operaciones
  const [csrfToken, setCsrfToken] = useState(null);
  const [state, setState] = useState(CSRF_STATES.IDLE);
  const [error, setError] = useState(null);

  // Referencias para control de efectos
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  /**
   * Actualiza el estado del token de forma segura
   */
  const updateTokenState = useCallback((token) => {
    if (isMountedRef.current) {
      setCsrfToken(token);
    }
  }, []);

  /**
   * Actualiza el estado general de forma segura
   */
  const updateState = useCallback((newState, newError = null) => {
    if (isMountedRef.current) {
      setState(newState);
      setError(newError);
    }
  }, []);

  /**
   * Obtiene el token CSRF con manejo de estado
   */
  const fetchCsrfToken = useCallback(
    async (options = {}) => {
      // Cancelar petición anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Crear nuevo controlador de cancelación
      abortControllerRef.current = new AbortController();

      try {
        updateState(CSRF_STATES.LOADING);

        const token = await csrfService.getCsrfTokenWithRetry(options);

        if (
          isMountedRef.current &&
          !abortControllerRef.current.signal.aborted
        ) {
          updateTokenState(token);
          updateState(CSRF_STATES.SUCCESS);
          return token;
        }
      } catch (err) {
        if (
          isMountedRef.current &&
          !abortControllerRef.current.signal.aborted
        ) {
          console.error("Error al obtener token CSRF:", err);
          updateTokenState(null);
          updateState(CSRF_STATES.ERROR, err);
        }
        throw err;
      }
    },
    [updateTokenState, updateState]
  );

  /**
   * Refresca el token CSRF forzando una nueva petición
   */
  const refreshCsrfToken = useCallback(
    async (options = {}) => {
      try {
        updateState(CSRF_STATES.LOADING);

        const token = await csrfService.refreshCsrfToken();

        if (isMountedRef.current) {
          updateTokenState(token);
          updateState(CSRF_STATES.SUCCESS);
          return token;
        }
      } catch (err) {
        if (isMountedRef.current) {
          console.error("Error al refrescar token CSRF:", err);
          updateTokenState(null);
          updateState(CSRF_STATES.ERROR, err);
        }
        throw err;
      }
    },
    [updateTokenState, updateState]
  );

  /**
   * Verifica si hay un token CSRF válido
   */
  const checkCsrfToken = useCallback(() => {
    return hasCsrfToken();
  }, []);

  /**
   * Obtiene el token actual desde cookies
   */
  const getCurrentCsrfToken = useCallback(() => {
    return getCsrfTokenFromCookie();
  }, []);

  /**
   * Sincroniza el estado interno con el token actual
   */
  const syncTokenState = useCallback(() => {
    const currentToken = getCurrentCsrfToken();
    updateTokenState(currentToken);
  }, [getCurrentCsrfToken, updateTokenState]);

  // Efecto para carga inicial del token
  useEffect(() => {
    let mounted = true;

    const initializeCsrfToken = async () => {
      // Verificar si ya existe un token válido
      const existingToken = getCurrentCsrfToken();

      if (existingToken && mounted) {
        updateTokenState(existingToken);
        updateState(CSRF_STATES.SUCCESS);
        return;
      }

      // Si no existe, obtener uno nuevo
      try {
        await fetchCsrfToken();
      } catch (error) {
        // Error ya manejado en fetchCsrfToken
      }
    };

    initializeCsrfToken();

    return () => {
      mounted = false;
    };
  }, [fetchCsrfToken, getCurrentCsrfToken, updateTokenState, updateState]);

  // Efecto de limpieza al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Valores calculados para mejor UX
  const isLoading = state === CSRF_STATES.LOADING;
  const isError = state === CSRF_STATES.ERROR;
  const isSuccess = state === CSRF_STATES.SUCCESS;
  const hasToken = checkCsrfToken();

  return {
    // Estado del token
    csrfToken,
    hasToken,

    // Estados de carga
    isLoading,
    isError,
    isSuccess,
    error,

    // Acciones
    fetchCsrfToken,
    refreshCsrfToken,
    syncTokenState,

    // Utilidades
    checkCsrfToken: checkCsrfToken,
    getCurrentToken: getCurrentCsrfToken,
  };
}
