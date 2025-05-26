/**
 * Token storage con fallback a sessionStorage en caso de ser necesario.
 */
let inMemoryRefresh = null;
let inMemoryAccessToken = null;

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

/**
 * Obtener el token de acceso almacenado en memoria o sessionStorage como fallback.
 * @returns {string|null} Token de acceso o null si no está definido.
 */
export const getAccessToken = () => {
  if (inMemoryAccessToken) {
    return inMemoryAccessToken;
  }

  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

/**
 * Almacenar el token de acceso en memoria y sessionStorage.
 * @param {string|null} token - Token de acceso a almacenar.
 */
export const setAccessToken = (token) => {
  inMemoryAccessToken = token;

  try {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Falla silenciosamente si sessionStorage no está disponible
  }
};

/**
 * Eliminar el token de acceso de la memoria y sessionStorage.
 */
export const removeAccessToken = () => {
  inMemoryAccessToken = null;

  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // Falla silenciosamente
  }
};

/**
 * Obtener el token de actualización almacenado en memoria o sessionStorage.
 * @returns {string|null} Token de actualización o null si no está definido.
 */
export const getRefreshToken = () => {
  if (inMemoryRefresh) {
    return inMemoryRefresh;
  }

  try {
    return sessionStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
};

/**
 * Almacenar el token de actualización en memoria y sessionStorage.
 * @param {string|null} refresh - Token de actualización a almacenar.
 */
export const setRefreshToken = (refresh) => {
  inMemoryRefresh = refresh;

  try {
    if (refresh) {
      sessionStorage.setItem(REFRESH_KEY, refresh);
    } else {
      sessionStorage.removeItem(REFRESH_KEY);
    }
  } catch {
    // Falla silenciosamente
  }
};

/**
 * Eliminar el token de actualización de la memoria y sessionStorage.
 */
export const removeRefreshToken = () => {
  inMemoryRefresh = null;

  try {
    sessionStorage.removeItem(REFRESH_KEY);
  } catch {
    // Falla silenciosamente
  }
};

/**
 * Limpia todos los tokens (acceso y refresh).
 */
export const clearAllTokens = () => {
  removeAccessToken();
  removeRefreshToken();
};

/**
 * Servicio token que agrupa todas las funciones relacionadas al manejo de tokens JWT.
 */
export const tokenService = {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  clearAllTokens,
};

export default tokenService;