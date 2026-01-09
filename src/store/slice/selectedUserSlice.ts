import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SelectedUser {
  _id: string;
  userName: string;
  avatarUrl: string;
   roomId:string;
}

interface SelectedUserState {
  selectedUser: SelectedUser | null;
  roomId: string | null
}

const initialState: SelectedUserState = {
  selectedUser: null,
  roomId: null 
};

const selectedUserSlice = createSlice({
  name: "selectedUser",
  initialState,
  reducers: {
    setSelectedUser(state, action: PayloadAction<SelectedUser>) {
      state.selectedUser = action.payload;
    },

    clearSelectedUser(state) {
      state.selectedUser = null;
    },
  },
});

export const { setSelectedUser, clearSelectedUser } =
  selectedUserSlice.actions;

export default selectedUserSlice.reducer;
