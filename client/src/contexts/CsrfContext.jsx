import { createContext } from "react";
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

export { CsrfContext };