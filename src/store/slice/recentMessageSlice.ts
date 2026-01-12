import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface recentMessageType {
  message: string | null
}


const initialState: recentMessageType = {
  message: null,
};

const recentMessageSlice = createSlice({
  name: "recentMessage",
  initialState,
  reducers: {
    setRecentMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },

    clearRecentMessage(state) {
      state.message = null;
    },
  },
});

export const { setRecentMessage, clearRecentMessage } = recentMessageSlice.actions;

export default recentMessageSlice.reducer;
