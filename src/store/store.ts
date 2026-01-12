import { configureStore, combineReducers } from "@reduxjs/toolkit";
import UserReducer from "./slice/userSlice";
import ActiveTab from "./slice/activeTabsSlice"; 
import Notification from "./slice/notificationSlice";
import uiSlice from "./slice/uiSlice"
import selectedUser from "./slice/selectedUserSlice"
import recentMessage from "./slice/recentMessageSlice"

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; 


const rootReducer = combineReducers({
  user: UserReducer,
  activeTab: ActiveTab,
  notification: Notification,
  UiSlice:  uiSlice,
  selectedUser: selectedUser,
  recentMessage: recentMessage
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "activeTab", "notification", "selectedUser", "UiSlice", "recentMessage" ],
};




const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});


export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
