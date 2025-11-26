import axios from 'axios';
import { getApiBase } from '../config';

const api = axios.create({
  baseURL: getApiBase(),
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

