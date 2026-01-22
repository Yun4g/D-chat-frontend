import api from "@/api/axios";
import axios from "axios";
import { useState } from "react";

const BASE_URL = 'https://d-chat-backend-338h.onrender.com';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post(
        `${BASE_URL}/api/login`,
        { email, password },
       { withCredentials: true } 
      );
      const userData = res.data?.userData;
      console.log('Raw API response userData:', userData);
      
      // Ensure all required fields are present
      const processedUser = {
        ...userData,
        _id: userData._id || userData.userId || '',
        userName: userData.userName || userData.name || '',
        email: userData.email || '',
        avatarUrl: userData.avatarUrl || userData.avatar || ''
      };
      
      console.log('Processed user for return:', processedUser);
      return processedUser;
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

  return { login, loading, error,  };
};

export default useLogin;
