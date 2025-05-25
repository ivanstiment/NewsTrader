// client/src/config/csrf.config.js
import { csrfErrorHandler } from "@/api/interceptors/csrf.interceptor";

/**
 * Configuración centralizada para el sistema CSRF
 * Este archivo inicializa y configura todos los aspectos del manejo CSRF
 */

/**
 * Configuraciones por entorno
 */
const ENVIRONMENT_CONFIGS = {
  development: {
    maxRetries: 5,
    retryDelay: 500,
    enableDebugLogs: true,
    autoRefreshOnError: true,
    showDetailedErrors: true,
  },
  production: {
    maxRetries: 3,
    retryDelay: 1000,
    enableDebugLogs: false,
    autoRefreshOnError: true,
    showDetailedErrors: false,
  },
};

/**
 * Configuración por defecto
 */
const DEFAULT_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  enableDebugLogs: false,
  autoRefreshOnError: true,
  showDetailedErrors: false,
};

/**
 * Obtener configuración actual basada en el entorno
 */
const getCurrentEnvironment = () => {
  return import.meta.env.MODE === "production" ? "production" : "development";
};

/**
 * Obtener configuración para el entorno actual
 */
const getEnvironmentConfig = () => {
  const env = getCurrentEnvironment();
  return ENVIRONMENT_CONFIGS[env] || DEFAULT_CONFIG;
};

/**
 * Configuración de mensajes de error por idioma
 */
const ERROR_MESSAGES = {
  es: {
    csrfError:
      "Error de seguridad. Por favor, recarga la página e inténtalo de nuevo.",
    tokenExpired: "La sesión de seguridad ha expirado. Recargando página...",
    networkError: "Error de conexión. Verificando seguridad...",
    maxRetriesReached:
      "No se pudo verificar la seguridad después de varios intentos.",
  },
  en: {
    csrfError: "Security error. Please reload the page and try again.",
    tokenExpired: "Security session has expired. Reloading page...",
    networkError: "Connection error. Verifying security...",
    maxRetriesReached: "Could not verify security after multiple attempts.",
  },
};

/**
 * Configuración de notificaciones
 */
const NOTIFICATION_CONFIG = {
  showToasts: true,
  autoReload: true,
  reloadDelay: 3000,
  maxNotificationsPerMinute: 3,
};

/**
 * Referencia lazy al servicio CSRF
 */
let _csrfService = null;

/**
 * Obtener servicio CSRF de forma lazy
 */
const getCsrfService = async () => {
  if (!_csrfService) {
    try {
      const { csrfService } = await import("@/services/api/csrf.service");
      _csrfService = csrfService;
    } catch (error) {
      console.error("Error importando CSRF service:", error);
    }
  }
  return _csrfService;
};

/**
 * Clase para gestionar la configuración CSRF
 */
class CsrfConfig {
  constructor() {
    this.config = getEnvironmentConfig();
    this.language = "es"; // Por defecto español
    this.listeners = [];
    this.notificationCount = 0;
    this.lastNotificationTime = 0;

    this.init();
  }

  /**
   * Inicializar la configuración
   */
  init() {
    this.configureCsrfService();
    this.configureErrorHandler();
    this.setupDebugMode();
  }

  /**
   * Configurar el servicio CSRF
   */
  async configureCsrfService() {
    try {
      const csrfService = await getCsrfService();
      if (csrfService) {
        csrfService.configure({
          maxRetries: this.config.maxRetries,
          retryDelay: this.config.retryDelay,
        });

        if (this.config.enableDebugLogs) {
          console.log("🔒 CSRF Service configurado:", this.config);
        }
      }
    } catch (error) {
      console.error("Error configurando CSRF service:", error);
    }
  }

  /**
   * Configurar el manejador de errores
   */
  configureErrorHandler() {
    // Listener principal para errores CSRF
    csrfErrorHandler.onCsrfError(async (error) => {
      await this.handleCsrfError(error);
    });
  }

  /**
   * Configurar modo debug
   */
  async setupDebugMode() {
    if (this.config.enableDebugLogs && typeof window !== "undefined") {
      // Agregar herramientas de debug al objeto global
      const csrfService = await getCsrfService();

      window.__CSRF_DEBUG__ = {
        config: this.config,
        service: csrfService,
        reloadConfig: () => this.reloadConfig(),
        testCsrfFlow: () => this.testCsrfFlow(),
      };
    }
  }

  /**
   * Manejar errores CSRF
   */
  async handleCsrfError(error) {
    const errorMessage = this.getErrorMessage("csrfError");

    if (this.config.enableDebugLogs) {
      console.error("🚨 Error CSRF detectado:", error);
    }

    // Mostrar notificación si está habilitada
    if (this.shouldShowNotification()) {
      await this.showErrorNotification(errorMessage);
    }

    // Auto-refresh si está habilitado
    if (this.config.autoRefreshOnError && NOTIFICATION_CONFIG.autoReload) {
      setTimeout(() => {
        window.location.reload();
      }, NOTIFICATION_CONFIG.reloadDelay);
    }

    // Notificar a listeners personalizados
    this.notifyListeners("csrfError", { error, message: errorMessage });
  }

  /**
   * Verificar si se debe mostrar notificación (rate limiting)
   */
  shouldShowNotification() {
    const now = Date.now();
    const oneMinute = 60 * 1000;

    // Reset counter si ha pasado más de un minuto
    if (now - this.lastNotificationTime > oneMinute) {
      this.notificationCount = 0;
    }

    // Verificar límite de notificaciones
    if (
      this.notificationCount >= NOTIFICATION_CONFIG.maxNotificationsPerMinute
    ) {
      return false;
    }

    this.notificationCount++;
    this.lastNotificationTime = now;
    return true;
  }

  /**
   * Mostrar notificación de error
   */
  async showErrorNotification(message) {
    if (NOTIFICATION_CONFIG.showToasts) {
      // Aquí puedes integrar con tu sistema de toasts/notificaciones
      // Por ejemplo: toast.error(message);
      console.warn("🔒 CSRF:", message);

      // Fallback a alert si no hay sistema de toasts
      if (this.config.showDetailedErrors && typeof window !== "undefined") {
        // Solo en desarrollo mostrar alert
        if (getCurrentEnvironment() === "development") {
          alert(message);
        }
      }
    }
  }

  /**
   * Obtener mensaje de error en el idioma actual
   */
  getErrorMessage(key) {
    return ERROR_MESSAGES[this.language]?.[key] || ERROR_MESSAGES.es[key];
  }

  /**
   * Agregar listener para eventos CSRF
   */
  addEventListener(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Remover listener
   */
  removeEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    }
  }

  /**
   * Notificar a listeners
   */
  notifyListeners(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error("Error en listener CSRF:", error);
        }
      });
    }
  }

  /**
   * Recargar configuración
   */
  async reloadConfig() {
    const newConfig = getEnvironmentConfig();
    this.config = { ...this.config, ...newConfig };
    await this.configureCsrfService();

    if (this.config.enableDebugLogs) {
      console.log("🔄 Configuración CSRF recargada:", this.config);
    }
  }

  /**
   * Test del flujo CSRF completo
   */
  async testCsrfFlow() {
    if (!this.config.enableDebugLogs) {
      console.warn("Debug mode no está habilitado");
      return;
    }

    console.group("🧪 Test CSRF Flow");
    try {
      console.log("1. Configuración actual:", this.config);

      const csrfService = await getCsrfService();
      if (!csrfService) {
        throw new Error("CSRF Service no disponible");
      }

      console.log("2. Obteniendo token CSRF...");
      const token = await csrfService.getCsrfTokenWithRetry();
      console.log("Token obtenido:", token ? "✅ Válido" : "❌ Inválido");

      console.log("3. Estado del servicio:", {
        hasToken: csrfService.hasValidToken(),
        currentToken: csrfService.getCurrentToken(),
      });

      console.log("✅ Test completado");
    } catch (error) {
      console.error("❌ Error en test:", error);
    } finally {
      console.groupEnd();
    }
  }

  /**
   * Cambiar idioma
   */
  setLanguage(lang) {
    if (ERROR_MESSAGES[lang]) {
      this.language = lang;
      if (this.config.enableDebugLogs) {
        console.log("🌐 Idioma CSRF cambiado a:", lang);
      }
    }
  }

  /**
   * Obtener configuración actual
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Actualizar configuración específica
   */
  async updateConfig(updates) {
    this.config = { ...this.config, ...updates };
    await this.configureCsrfService();

    if (this.config.enableDebugLogs) {
      console.log("⚙️ Configuración CSRF actualizada:", updates);
    }
  }
}

// Crear instancia singleton
const csrfConfig = new CsrfConfig();

// Exportar instancia y utilidades
export { csrfConfig, ERROR_MESSAGES, NOTIFICATION_CONFIG };
export default csrfConfig;

// Auto-inicialización en desarrollo
if (getCurrentEnvironment() === "development") {
  console.log("🔒 CSRF Config inicializado para desarrollo");
}
