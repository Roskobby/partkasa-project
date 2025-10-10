import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  try {
    const reqId = crypto?.randomUUID?.();
    if (reqId) {
      config.headers['X-Request-ID'] = reqId;
    }
  } catch (_) {}
  return config;
});

export default api;

