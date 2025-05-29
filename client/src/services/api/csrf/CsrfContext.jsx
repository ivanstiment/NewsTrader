// client/src/services/api/csrf/CsrfContext.jsx
import React, { createContext, useContext, useEffect } from "react";
import { useCsrf } from "./csrf.hook";

const CsrfContext = createContext();

export function CsrfProvider({ children }) {
  const csrfData = useCsrf();

  // Obtener token CSRF al inicializar la app
  // Es necesario para cualquier operación POST/PUT/DELETE, incluyendo register
  useEffect(() => {
    if (!csrfData.csrfToken && !csrfData.isLoading) {
      csrfData.fetchToken();
    }
  }, [csrfData]);

  return (
    <CsrfContext.Provider value={csrfData}>
      {children}
    </CsrfContext.Provider>
  );
}

export function useCsrfContext() {
  const context = useContext(CsrfContext);
  if (!context) {
    throw new Error("useCsrfContext debe usarse dentro de CsrfProvider");
  }
  return context;
}