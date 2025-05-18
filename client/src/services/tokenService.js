let inMemoryToken = null;
let inMemoryRefresh = null;

export function getAccessToken() {
  return inMemoryToken;
}
export function setAccessToken(token) {
  inMemoryToken = token;
}

export function getRefreshToken() {
  return inMemoryRefresh;
}
export function setRefreshToken(refresh) {
  inMemoryRefresh = refresh;
}
