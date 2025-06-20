/**
 * @fileoverview Servicio centralizado de notificaciones toast para NewsTrader
 * @module services/toast
 * @description Sistema unificado de notificaciones con actualizaciones
 */

import styles from "./Toast.module.scss";

class ToastService {
  constructor() {
    this.toasts = new Map();
    this.container = null;
    this.initialized = false;
  }

  /**
   * Inicializa el contenedor de toasts de forma lazy
   * @private
   */
  init() {
    if (this.initialized || typeof document === "undefined") return;

    if (!this.container) {
      this.container = document.createElement("div");
      this.container.className = styles["toast__container"];
      this.container.setAttribute("aria-live", "polite");
      this.container.setAttribute("aria-relevant", "additions removals");
      document.body.appendChild(this.container);
    }

    this.initialized = true;
  }

  /**
   * Obtiene las clases CSS para un toast según su tipo
   * @private
   * @param {ToastType} type - Tipo de toast
   * @returns {string} Clases CSS concatenadas
   */
  getToastClasses(type) {
    const baseClass = styles.toast;
    const typeClass = styles[`toast--${type}`];
    return `${baseClass} ${typeClass}`;
  }

  /**
   * Crea un toast con el tipo y opciones especificadas
   * @private
   * @param {ToastType} type - Tipo de toast
   * @param {string} message - Mensaje a mostrar
   * @param {ToastOptions} options - Opciones del toast
   * @returns {string} ID del toast creado
   */
  createToast(type, message, options = {}) {
    if (!this.initialized) {
      this.init();
    }

    const {
      duration = 3000,
      position = "top-right",
      showProgress = true,
      closeButton = true,
      id = `toast-${Date.now()}-${Math.random()}`,
      onClose,
    } = options;

    // Si ya existe un toast con este ID, actualizarlo en lugar de crear uno nuevo
    if (this.toasts.has(id)) {
      return this.updateExistingToast(id, type, message, options);
    }

    // Actualizar posición del contenedor
    this.updateContainerPosition(position);

    // Crear elemento del toast
    const toastElement = document.createElement("div");
    toastElement.className = this.getToastClasses(type);
    toastElement.setAttribute("role", "alert");
    toastElement.setAttribute("aria-live", "polite");

    // Agregar animación de duración a la barra de progreso
    if (showProgress && duration > 0) {
      toastElement.style.setProperty("--duration", `${duration}ms`);
    }

    // Clases para los elementos internos
    const iconClass = styles["toast__icon"];
    const contentClass = styles["toast__content"];
    const closeClass = styles["toast__close"];
    const progressClass = styles["toast__progress"];

    // Contenido del toast
    toastElement.innerHTML = `
      <div class="${iconClass}">
        ${this.getIcon(type)}
      </div>
      <div class="${contentClass}">
        ${this.escapeHtml(message)}
      </div>
      ${
        closeButton
          ? `
        <button class="${closeClass}" aria-label="Cerrar notificación">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      `
          : ""
      }
      ${
        showProgress && duration > 0
          ? `
        <div class="${progressClass}"></div>
      `
          : ""
      }
    `;

    // Agregar event listeners
    if (closeButton) {
      const closeBtnSelector = "." + closeClass;
      const closeBtn = toastElement.querySelector(closeBtnSelector);
      closeBtn?.addEventListener("click", () => this.remove(id));
    }

    // Agregar al contenedor
    this.container.appendChild(toastElement);

    // Guardar referencia
    this.toasts.set(id, {
      element: toastElement,
      timeout: null,
      onClose,
    });

    // Auto-cerrar si tiene duración
    if (duration > 0) {
      const timeout = setTimeout(() => this.remove(id), duration);
      this.toasts.get(id).timeout = timeout;
    }

    return id;
  }

  /**
   * Actualiza un toast existente SIN recrear el elemento DOM
   * @private
   * @param {string} id - ID del toast
   * @param {ToastType} type - Nuevo tipo
   * @param {string} message - Nuevo mensaje
   * @param {ToastOptions} options - Opciones del toast
   * @returns {string} ID del toast
   */
  updateExistingToast(id, type, message, options = {}) {
    const toast = this.toasts.get(id);
    if (!toast) return id;

    const { element } = toast;
    const {
      duration = 3000,
      closeButton = true,
      showProgress = true,
    } = options;

    // Limpiar timeout anterior
    if (toast.timeout) {
      clearTimeout(toast.timeout);
      toast.timeout = null;
    }

    // Actualizar clases del elemento para el nuevo tipo
    element.className = this.getToastClasses(type);

    // Actualizar duración de la barra de progreso
    if (showProgress && duration > 0) {
      element.style.setProperty("--duration", `${duration}ms`);
    } else {
      element.style.removeProperty("--duration");
    }

    // Actualizar contenido manteniendo la estructura
    const iconElement = element.querySelector(`.${styles["toast__icon"]}`);
    const contentElement = element.querySelector(`.${styles["toast__content"]}`);
    
    if (iconElement) {
      iconElement.innerHTML = this.getIcon(type);
    }
    
    if (contentElement) {
      contentElement.innerHTML = this.escapeHtml(message);
    }

    // Configurar nuevo timeout si tiene duración
    if (duration > 0) {
      toast.timeout = setTimeout(() => this.remove(id), duration);
    }

    return id;
  }

  /**
   * Actualiza la posición del contenedor
   * @private
   * @param {ToastPosition} position - Nueva posición
   */
  updateContainerPosition(position) {
    if (!this.container) return;

    this.container.className = styles["toast__container"];

    if (position.includes("center")) {
      const centerClass = styles["toast__container--center"];
      this.container.classList.add(centerClass);
    }

    if (position.includes("bottom")) {
      const bottomClass = styles["toast__container--bottom"];
      this.container.classList.add(bottomClass);
    }
  }

  /**
   * Obtiene el icono SVG según el tipo
   * @private
   * @param {ToastType} type - Tipo de toast
   * @returns {string} SVG del icono
   */
  getIcon(type) {
    const icons = {
      info: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
      success: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
      error: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
      loading: `<div class="${styles["toast__spinner"]}"></div>`,
    };
    return icons[type] || icons.info;
  }

  /**
   * Escapa HTML para prevenir XSS
   * @private
   * @param {string} text - Texto a escapar
   * @returns {string} Texto escapado
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Remueve un toast
   * @param {string} id - ID del toast a eliminar
   */
  remove(id) {
    const toast = this.toasts.get(id);
    if (!toast) return;

    const { element, timeout, onClose } = toast;

    // Cancelar timeout si existe
    if (timeout) {
      clearTimeout(timeout);
    }

    const exitClass = styles["toast--exit"];
    element.classList.add(exitClass);

    // Eliminar después de la animación
    setTimeout(() => {
      if (element && element.parentNode) {
        element.remove();
      }
      this.toasts.delete(id);

      // Callback
      if (onClose) {
        onClose();
      }
    }, 300);
  }

  /**
   * Elimina todos los toasts
   */
  clear() {
    this.toasts.forEach((_, id) => this.remove(id));
  }

  /**
   * Muestra un toast informativo
   * @param {string} message - Mensaje a mostrar
   * @param {ToastOptions} options - Opciones del toast
   * @returns {string} ID del toast
   */
  info(message, options = {}) {
    return this.createToast("info", message, options);
  }

  /**
   * Muestra un toast de éxito
   * @param {string} message - Mensaje a mostrar
   * @param {ToastOptions} options - Opciones del toast
   * @returns {string} ID del toast
   */
  success(message, options = {}) {
    return this.createToast("success", message, options);
  }

  /**
   * Muestra un toast de advertencia
   * @param {string} message - Mensaje a mostrar
   * @param {ToastOptions} options - Opciones del toast
   * @returns {string} ID del toast
   */
  warning(message, options = {}) {
    return this.createToast("warning", message, options);
  }

  /**
   * Muestra un toast de error
   * @param {string} message - Mensaje a mostrar
   * @param {ToastOptions} options - Opciones del toast
   * @returns {string} ID del toast
   */
  error(message, options = {}) {
    return this.createToast("error", message, { duration: 5000, ...options });
  }

  /**
   * Muestra un toast de carga
   * @param {string} message - Mensaje a mostrar
   * @param {ToastOptions} options - Opciones del toast
   * @returns {string} ID del toast
   */
  loading(message, options = {}) {
    return this.createToast("loading", message, {
      duration: 0,
      closeButton: false,
      showProgress: false,
      ...options,
    });
  }

  /**
   * Actualiza un toast existente manteniendo la referencia DOM
   * ESTA ES LA CORRECCIÓN PRINCIPAL
   * @param {string} id - ID del toast a actualizar
   * @param {ToastType} type - Nuevo tipo
   * @param {string} message - Nuevo mensaje
   * @param {ToastOptions} options - Nuevas opciones
   */
  update(id, type, message, options = {}) {
    return this.updateExistingToast(id, type, message, options);
  }

  /**
   * Convierte un toast de loading a success/error
   * @param {string} id - ID del toast de loading
   * @param {ToastType} type - Nuevo tipo ('success' o 'error')
   * @param {string} message - Nuevo mensaje
   * @param {ToastOptions} options - Opciones adicionales
   */
  promise(id, type, message, options = {}) {
    return this.update(id, type, message, {
      duration: 3000,
      closeButton: true,
      showProgress: true,
      ...options,
    });
  }
}

// Crear instancia singleton
const toastService = new ToastService();

// Exportar instancia por defecto
export default toastService;

// Exportar métodos individuales correctamente bindeados
export const info = (message, options) => toastService.info(message, options);
export const success = (message, options) => toastService.success(message, options);
export const warning = (message, options) => toastService.warning(message, options);
export const error = (message, options) => toastService.error(message, options);
export const loading = (message, options) => toastService.loading(message, options);
export const update = (id, type, message, options) => toastService.update(id, type, message, options);
export const promise = (id, type, message, options) => toastService.promise(id, type, message, options);
export const clear = () => toastService.clear();