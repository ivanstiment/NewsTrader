import { useCsrf } from "@/hooks/csrf.hooks";
import { createContext, useContext } from "react";

/**
 * Contexto para gestión global de tokens CSRF
 */
const CsrfContext = createContext(undefined);

/**
 * Provider del contexto CSRF
 * Proporciona acceso global al estado y operaciones de CSRF
 */
export function CsrfProvider({ children }) {
  const csrfData = useCsrf();

  return (
    <CsrfContext.Provider value={csrfData}>{children}</CsrfContext.Provider>
  );
}

/**
 * Hook para acceder al contexto CSRF
 * @returns {Object} Datos y funciones del contexto CSRF
 * @throws {Error} Si se usa fuera del CsrfProvider
 */
export function useCsrfContext() {
  const context = useContext(CsrfContext);

  if (context === undefined) {
    throw new Error(
      "useCsrf debe ser usado dentro de un CsrfProvider. " +
        "Asegúrate de envolver tu componente con <CsrfProvider>."
    );
  }

  return context;
}

/**
 * Hook opcional para usar CSRF de forma condicional
 * No lanza error si no está dentro del provider
 * @returns {Object|null} Datos del contexto o null
 */
export function useCsrfOptional() {
  const context = useContext(CsrfContext);
  return context || null;
}

/**
 * HOC para agregar props de CSRF a un componente
 * @param {React.Component} WrappedComponent - Componente a envolver
 * @returns {React.Component} Componente con props de CSRF
 */
export function withCsrf(WrappedComponent) {
  const ComponentWithCsrf = (props) => {
    const csrfData = useCsrf();

    return <WrappedComponent {...props} csrf={csrfData} />;
  };

  ComponentWithCsrf.displayName = `withCsrf(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return ComponentWithCsrf;
}

export { CsrfContext };
export default CsrfProvider;
