import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  _id: string;
  userId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationsState {
  notifications: Notification[];
}

const initialState: NotificationsState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotificationsData(
      state,
      action: PayloadAction<Notification[]>
    ) {
      state.notifications = action.payload;
    },

    addNotification(
      state,
      action: PayloadAction<Notification>
    ) {
      state.notifications.unshift(action.payload);
    },

    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const {
  setNotificationsData,
  addNotification,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
