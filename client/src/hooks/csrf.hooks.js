import { csrfManager } from "@/utils/csrf.manager";
import { csrfService } from "@/services/api";
import { useEffect, useState } from "react";

export function useCsrf() {
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    csrfService.fetchCsrfToken().then((token) => {
      setCsrfToken(token);
      csrfManager.set(token);
    });
  }, []);

  return { csrfToken, setCsrfToken };
}
