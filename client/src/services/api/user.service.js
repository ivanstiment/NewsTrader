import { api, ENDPOINTS } from "@/api";

export const userService = {
  getProfile: () => api.get(ENDPOINTS.USER.PROFILE),

  updateProfile: (profileData) => api.put(ENDPOINTS.USER.PROFILE, profileData),

  getUsers: (params = {}) => api.get(ENDPOINTS.USER.LIST, { params }),
};

export default userService;
