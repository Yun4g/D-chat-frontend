import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import api from "@/api/axios";

export interface User {
  _id: string;
  userName: string;
  email: string;
  avatarUrl?: string;
  requestStatus: "pending" | "accepted" | "rejected";
}

export const useFriends = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<User[]>([]);
  const user =  useSelector((state: RootState) => state.user._id);

  const getFriends = async () => {
    setLoading(true);
    setError(null);
   
    try {
      const res = await api.get<{ status: string; users: User[] }>(`/api/getfriends/${user}`, 
      );

      if (res.data && res.data.users) {
        setFriends(res.data.users);
      } else {
        setFriends([]);
      }

      setLoading(false);
      return res.data.users;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || "Something went wrong");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
      setLoading(false);
      return [];
    }
  };

  return { getFriends, friends, loading, error };
};
