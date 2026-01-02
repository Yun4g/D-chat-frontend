import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./slice/userSlice";
import ActiveTab from "./slice/activeTabsSlice"; 
import Notification from "./slice/notificationSlice"

export const store = configureStore({
  reducer: {
    user: UserReducer,
    activeTab: ActiveTab,
    Notification: Notification
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
