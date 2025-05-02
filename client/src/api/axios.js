import axios from 'axios';
import { getAccessToken, setAccessToken } from '../contexts/AuthContext';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,           // para HttpOnly cookie 
});

api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(null, async error => {
  if (error.response.status === 401) {
    // intentar refresh
    const resp = await axios.post(
      'http://localhost:8000/api/token/refresh/',
      {},
      { withCredentials: true }
    );
    const newToken = resp.data.access;
    setAccessToken(newToken);
    error.config.headers.Authorization = `Bearer ${newToken}`;
    return axios.request(error.config);
  }
  return Promise.reject(error);
});

export default api;