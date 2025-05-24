/**
 * Obtener el token CSRF de las cookies
 */
export function getCsrfToken() {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

/**
 * Obtener el token CSRF desde el backend de Django
 */
export async function fetchCsrfToken() {
  try {
    // TODO: Usar el nuevo servicio
    if (window.__API_SERVICES__?.csrf) {
      const response = await window.__API_SERVICES__.csrf.getCsrfToken();
      return getCsrfToken();
    }
    
    // Fallback al método original
    const response = await fetch('/api/csrf/', {
      method: 'GET',
      credentials: 'include',
    });
    if (response.ok) {
      return getCsrfToken();
    }
  } catch (error) {
    console.error('Error al obtener token CSRF:', error);
  }
  return null;
}