import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const BASE_URL = "https://d-chat-backend-338h.onrender.com";


interface UserData {
  email: string;
}

interface AcceptRequestResponse {
  status: "success";
  message: string;
  roomId: string;
}

const useAcceptRequest = () => {
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
   const userId = useSelector((state : RootState)=>  state.user.userId)

  const acceptRequest = useCallback(async (senderId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("token");
   
     const rawUserData = localStorage.getItem("userData");


    if (!token || !userId || !rawUserData) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const userData: UserData = JSON.parse(rawUserData);
     const email = userData.email;
      
     const payload = {
           senderId: senderId, 
          receiverId: userId,
          recieverEmail:  email
     }

     console.log(payload, 'payload')
    try {
      const res = await axios.post<AcceptRequestResponse>(
        `${BASE_URL}/api/acceptRequest`, payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setSuccess(true);  
      }

      return res.data
      
    } catch (err) {
      const message = axios.isAxiosError(err) && err.response?.data?.message ? err.response.data.message : "Failed to accept friend request";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    acceptRequest,
    loading,
    error,
    success,
  };
};

export default useAcceptRequest;
