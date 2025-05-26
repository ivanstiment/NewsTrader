export const createRequestConfig = (options = {}) => {
  const { showErrorToast = true, errorMessage, ...axiosConfig } = options;

  return {
    axiosConfig,
    meta: { showErrorToast, errorMessage },
  };
};

export const handleSilentError = (error, meta) => {
  if (!meta.showErrorToast) {
    console.error("API Error (silencioso):", error);
  }
  throw error;
};
