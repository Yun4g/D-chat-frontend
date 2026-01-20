import api from "@/api/axios";
import axios from "axios";
import { useState } from "react";

const BASE_URL = 'https://d-chat-backend-338h.onrender.com';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post(
        `${BASE_URL}/api/login`,
        { email, password },
       { withCredentials: true } 
      );

      setData(res.data.userData);
      return res.data?.userData;
    } catch (err) {
      const message = axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Login failed';

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, data };
};

export default useLogin;
