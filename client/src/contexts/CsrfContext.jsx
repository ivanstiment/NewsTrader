// client/src/contexts/CsrfContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { fetchCsrfToken } from "@/utils/csrf";

const CsrfContext = createContext();

export function CsrfProvider({ children }) {
  const [csrfToken, setCsrfToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeCsrf = async () => {
      try {
        const token = await fetchCsrfToken();
        setCsrfToken(token);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCsrf();
  }, []);

  return (
    <CsrfContext.Provider value={{ csrfToken, isLoading }}>
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
