import axios from "axios";

const api = axios.create({
  baseURL: 'https://d-chat-backend-338h.onrender.com',
  withCredentials: true, 
});


let isRefreshing = false;
let failedQueue: Array<(token?: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url === "/api/refresh-token") {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for ongoing refresh to complete
        return new Promise((resolve) => {
          failedQueue.push(() => resolve(api(originalRequest)));
        });
      }

      isRefreshing = true;

      try {
        await api.post("/api/refresh-token");
      
        failedQueue.forEach((callback) => callback());
        failedQueue = [];
        return api(originalRequest);
      } catch (refreshError) {
        failedQueue = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);



export default api;
