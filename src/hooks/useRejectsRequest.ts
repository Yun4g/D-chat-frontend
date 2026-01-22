import { useState, useCallback } from "react";
import axios from "axios";
import api from "@/api/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";






 export interface RejectRequestResponse {
  status: "success";
  message: string;
}

const useRejectRequest = () => {
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const userId = useSelector((state : RootState)=> state.user._id);
  const  email = useSelector((state : RootState)=> state.user.email)

  const reJectRequest = useCallback(async (senderId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

  
    


    if ( !userId ) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

 
    try {
      const res = await api.post<RejectRequestResponse>(
        `/api/rejectRequest`,
        {
          senderId,
          receiverId: userId,
          recieverEmail:  email
        },
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
