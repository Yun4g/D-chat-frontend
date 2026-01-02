import axios from "axios";
import { useState } from "react";






const useForgotPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
    const [data, setData] = useState(null);

    const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(`https://d-chat-backend-338h.onrender.com/api/forgot-password`,
        { email },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setData(res.data);
      setSuccess('Password reset email sent successfully');
    } catch (err) {
      const message = axios.isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : 'Failed to send password reset email';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading, error, success, data } as const;
};

export default useForgotPassword;