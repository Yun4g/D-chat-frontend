import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export interface User {
  _id: string;
  userName: string;
  email: string;
  avatarUrl?: string;
  requestStatus: "pending" | "accepted" | "rejected";
}

export const useGetMessage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<User[]>([]);
  const user =  useSelector((state: RootState) => state.user.userId);

  const getMessage = async () => {
    setLoading(true);
    setError(null);
     const token = localStorage.getItem('token');
    try {
      const res = await axios.get<{ status: string; users: User[] }>(`https://d-chat-backend-338h.onrender.com/api/getfriends/${user}`, 
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data && res.data.users) {
        setMessage(res.data.users);
      } else {
        setMessage([]);
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

  return { getMessage, message, loading, error };
};
