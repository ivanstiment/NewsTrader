let csrfToken = null;

export const csrfManager = {
  get: () => csrfToken,
  set: (token) => { csrfToken = token; },
  clear: () => { csrfToken = null; }
};
