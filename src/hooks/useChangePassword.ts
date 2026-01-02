import { useState } from 'react';
import axios from 'axios';



const BASE_URL = 'https://d-chat-backend-338h.onrender.com';



const useChangePassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
    const [data, setData] = useState(null);

    const changePassword = async (token: string, newPassword: string, email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/reset-password/${token}`,
        { email, newPassword },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setData(res.data);
      setSuccess('Password changed successfully');
    } catch (err) {
      const message = axios.isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : 'Failed to change password';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading, error, success, data } as const;
};

export default useChangePassword;