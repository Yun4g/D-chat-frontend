import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import api from "@/api/axios";


interface SenderRequest {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
  mutualFriendsCount:number
}

interface FriendRequestResponse {
  message: string;
  senderRequest: SenderRequest[];
  status: "success";
}

const useGetFriendRequest = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FriendRequestResponse | null>(null);
    const user =  useSelector((state: RootState) => state.user._id);



  const getFriendRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(
        `/api/getRequest/${user}`,
      );

      setData(res.data);
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to fetch friend requests";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getFriendRequests,
    loading,
    error,
    data,
  };
};

export default useGetFriendRequest;
