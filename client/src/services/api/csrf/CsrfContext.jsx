import React, { createContext, useContext } from "react";
import { useCsrf } from "./csrf.hook";

const CsrfContext = createContext();

export function CsrfProvider({ children }) {
  const { csrfToken, setCsrfToken } = useCsrf();
  return (
    <CsrfContext.Provider value={{ csrfToken, setCsrfToken }}>
      {children}
    </CsrfContext.Provider>
  );
}

// Hook para consumir el contexto
export function useCsrfContext() {
  return useContext(CsrfContext);
}