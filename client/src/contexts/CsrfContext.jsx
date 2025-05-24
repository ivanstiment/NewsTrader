import { createContext, useContext } from "react";
import { useCsrfApi } from "@/hooks/useCsrfApi";

const CsrfContext = createContext();

export function CsrfProvider({ children }) {
  const csrfData = useCsrfApi();

  return (
    <CsrfContext.Provider value={csrfData}>
      {children}
    </CsrfContext.Provider>
  );
}

export function useCsrf() {
  const context = useContext(CsrfContext);
  if (!context) {
    throw new Error("useCsrf debe usarse dentro de un CsrfProvider");
  }
  return context;
}