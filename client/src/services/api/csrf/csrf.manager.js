// client/src/services/api/csrf/csrf.manager.js

class CsrfManager {
  constructor() {
    this.token = null;
    this.listeners = [];
  }

  get() {
    return this.token;
  }

  set(token) {
    if (token && typeof token === 'string' && token.trim() !== '') {
      this.token = token.trim();
      this.notifyListeners(this.token);
    }
  }

  clear() {
    this.token = null;
    this.notifyListeners(null);
  }

  isValid() {
    return !!(this.token && typeof this.token === 'string' && this.token.trim() !== '');
  }

  // Sistema de listeners para componentes que necesiten saber cuando cambia el token
  addListener(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners(token) {
    this.listeners.forEach(callback => {
      try {
        callback(token);
      } catch (error) {
        console.error('Error en listener de CSRF:', error);
      }
    });
  }

  // Para debugging
  getStatus() {
    return {
      hasToken: !!this.token,
      token: this.token ? `${this.token.slice(0, 8)}...` : null,
      isValid: this.isValid()
    };
  }
}

// Instancia singleton
export const csrfManager = new CsrfManager();

// Para debugging en desarrollo
if (import.meta.env.MODE === 'development') {
  window.__csrfManager = csrfManager;
}

export default csrfManager;