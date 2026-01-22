import { useState, useCallback } from "react";
import  { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationsData } from "@/store/slice/notificationSlice";
import api from "@/api/axios";
import { RootState } from "@/store/store";

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
   const userId = useSelector((state: RootState)=> state.user._id)

  const getNotifications = useCallback(async () => {
   

    
    if (!userId || userId.includes('"')) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.get<{ notifications: Notification[] }>(
        `/api/notification/${userId}`,
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
