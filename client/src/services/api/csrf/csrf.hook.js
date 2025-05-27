import { csrfManager } from "./csrf.manager";
import { csrfService } from "./csrf.service";
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
