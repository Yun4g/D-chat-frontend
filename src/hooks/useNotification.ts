import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { setNotificationsData } from "@/store/slice/notificationSlice";

interface Notification {
  _id: string;
  userId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  getNotifications: () => Promise<void>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const getNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    
    if (!userId || userId.includes('"')) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get<{ notifications: Notification[] }>(
        `https://d-chat-backend-338h.onrender.com/api/notification/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(res.data.notifications);
      dispatch(setNotificationsData(res.data.notifications));
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(
        axiosError.response?.data.message ?? "Failed to fetch notifications"
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return { notifications, loading, error, getNotifications, setNotifications };
};
