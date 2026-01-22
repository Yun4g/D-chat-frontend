
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    _id: string;
    userName: string;
    email: string;
    avatarUrl?: string;
    IsAuthenticated: boolean;
}

const initialState: UserState = {
    _id: '',
    userName: '',
    email: '',
    avatarUrl: '',
    IsAuthenticated : false
};






const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state._id = action.payload._id;   
            state.userName = action.payload.userName;
            state.email = action.payload.email;
            state.avatarUrl = action.payload.avatarUrl;
            state.IsAuthenticated = action.payload.IsAuthenticated;
        },
        clearUser(state) {
            state._id = '';
            state.userName = '';
            state.email = '';
            state.avatarUrl = '';
            state.IsAuthenticated = false;
    
        }
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;