let inMemoryRefresh = null;
let inMemoryAccessToken = null;

/**
 * Obtiene el token de acceso almacenado en memoria.
 * @returns {string|null} Token de acceso o null si no está definido.
*/
export function getAccessToken() {
  return inMemoryAccessToken;
}

/**
 * Almacena el token de acceso en memoria.
 * @param {string} token - Token de acceso a almacenar.
 */
export function setAccessToken(token) {
  inMemoryAccessToken = token;
}

/**
 * Elimina el token de acceso de la memoria.
 */
export function removeAccessToken() {
  inMemoryAccessToken = null;
}

export function getRefreshToken() {
  return inMemoryRefresh;
}

export function setRefreshToken(refresh) {
  inMemoryRefresh = refresh;
}
