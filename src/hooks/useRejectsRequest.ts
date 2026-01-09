import { useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = "https://d-chat-backend-338h.onrender.com";


interface UserData {
  email: string;
}

 export interface RejectRequestResponse {
  status: "success";
  message: string;
}

const useRejectRequest = () => {
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reJectRequest = useCallback(async (senderId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
     const rawUserData = localStorage.getItem("userData");


    if (!token || !userId || !rawUserData) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const userData: UserData = JSON.parse(rawUserData);
     const email = userData.email;

    try {
      const res = await axios.post<RejectRequestResponse>(
        `${BASE_URL}/api/rejectRequest`,
        {
          senderId,
          receiverId: userId,
          recieverEmail:  email
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setSuccess(true);
      }

       return res.data; 
      
    } catch (err) {
      const message = axios.isAxiosError(err) && err.response?.data?.message ? err.response.data.message : "Failed to Reject friend request";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reJectRequest,
    loading,
    error,
    success,
  };
};

export default useRejectRequest;
