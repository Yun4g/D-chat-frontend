import { useState } from "react";
import api from "@/api/axios";

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
      const res = await api.post<SendRequestResponse>(
        "/api/sendRequest",
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
        console.log(err)
        setError("Something went wrong");
   
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
