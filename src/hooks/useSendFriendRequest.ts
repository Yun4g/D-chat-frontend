import { useState } from "react";
import axios from "axios";

export interface SendRequestPayload {
  senderId: string;
  receiverId: string;
  receiverEmail: string;
}

interface SendRequestResponse {
  message: string;
}

export const useSendFriendRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sendRequest = async (payload: SendRequestPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post<SendRequestResponse>(
        "https://d-chat-backend-338h.onrender.com/api/sendRequest",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess(res.data.message);
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Request failed");
      } else {
        setError("Something went wrong");
      }
      return false;
    } finally {
      setLoading(false);
      setTimeout(() => {
         setError(null)
      }, 3000);
    }
  };

  return {
    sendRequest,
    loading,
    error,
    success,
  };
};
