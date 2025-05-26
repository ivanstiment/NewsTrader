import toast from "react-hot-toast";

const AUTH_ROUTES = ["/login", "/register", "/home"];

export const shouldRedirectToLogin = () => {
  return !AUTH_ROUTES.some((route) => window.location.pathname.includes(route));
};

export const handleAuthRedirect = () => {
  if (shouldRedirectToLogin()) {
    toast.error("Tu sesión ha expirado. Redirigiendo al login...", {
      duration: 3000,
    });

    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }
};

export const handleAuthError = (error) => {
  console.error("Error de autenticación:", error);

  if (shouldRedirectToLogin()) {
    handleAuthRedirect();
  }

  return Promise.reject(error);
};
