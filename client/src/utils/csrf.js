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
    const response = await fetch('/api/csrf/', {
      method: 'GET',
      credentials: 'include',
    });
    if (response.ok) {
      // El token está en las cookies
      return getCsrfToken();
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
  return null;
}