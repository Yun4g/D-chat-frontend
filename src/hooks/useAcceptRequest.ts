import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import api from "@/api/axios";


interface AcceptRequestResponse {
  status: "success";
  message: string;
  roomId: string;
}

const useAcceptRequest = () => {
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
   const userId = useSelector((state : RootState)=>  state.user._id)
    const email = useSelector((state : RootState)=>  state.user.email)

  const acceptRequest = useCallback(async (senderId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

  
     const payload = {
           senderId: senderId, 
          receiverId: userId,
          recieverEmail:  email
     }

     console.log(payload, 'payload')
    try {
      const res = await api.post<AcceptRequestResponse>(
        `/api/acceptRequest`, payload,
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
