export const getApiBase = () => {
  try {
    if (typeof window !== 'undefined' && window.__ENV && window.__ENV.REACT_APP_API_URL) {
      return window.__ENV.REACT_APP_API_URL;
    }
  } catch (_) {}
  return process.env.REACT_APP_API_URL;
};

