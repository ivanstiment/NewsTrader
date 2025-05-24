// Token storage con fallback a sessionStorage en caso de ser necesario
let inMemoryRefresh = null;
let inMemoryAccessToken = null;

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

/**
 * Obtiene el token de acceso almacenado en memoria o sessionStorage como fallback.
 * @returns {string|null} Token de acceso o null si no está definido.
 */
export function getAccessToken() {
  if (inMemoryAccessToken) {
    return inMemoryAccessToken;
  }
  
  // Fallback para casos donde se recarga la página
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Almacena el token de acceso en memoria y sessionStorage.
 * @param {string|null} token - Token de acceso a almacenar.
 */
export function setAccessToken(token) {
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
}

/**
 * Elimina el token de acceso de la memoria y sessionStorage.
 */
export function removeAccessToken() {
  inMemoryAccessToken = null;
  
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // Falla silenciosamente
  }
}

/**
 * Obtiene el token de actualización.
 * @returns {string|null}
 */
export function getRefreshToken() {
  if (inMemoryRefresh) {
    return inMemoryRefresh;
  }
  
  try {
    return sessionStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

/**
 * Almacena el token de actualización.
 * @param {string|null} refresh - token de actualización a almacenar.
 */
export function setRefreshToken(refresh) {
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
}

/**
 * Limpia todos los tokens.
 */
export function clearAllTokens() {
  removeAccessToken();
  inMemoryRefresh = null;
  
  try {
    sessionStorage.removeItem(REFRESH_KEY);
  } catch {
    // Falla silenciosamente
  }
}