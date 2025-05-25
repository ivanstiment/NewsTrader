import { csrfService } from "@/services/api";
import { getCookie } from "@/utils/csrf.utils";
import { useEffect, useState } from "react";

export function useCsrf() {
  const [csrfToken, setCsrfToken] = useState(getCookie());

  useEffect(() => {
    if (!csrfToken) {
      csrfService.fetchCsrfToken().then((token) => setCsrfToken(token));
    }
  }, [csrfToken]);

  return { csrfToken, setCsrfToken };
}
