import axios from "axios";

const api = axios.create({
  baseURL: 'https://d-chat-backend-338h.onrender.com',
  withCredentials: true, 
});


api.interceptors.response.use((response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry ) {
      originalRequest._retry = true;
      try {
        await api.post("/refresh-token");
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
