import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import UserReducer from "../store/slice/userSlice";
import ActiveTab from "../store/slice/activeTabsSlice";
import Notification from "../store/slice/notificationSlice";

const rootReducer = combineReducers({
  user: UserReducer,
  activeTab: ActiveTab,
  notification: Notification,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "notification", "activeTab"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
