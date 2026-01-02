
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    userId: string;
    userName: string;
    email: string;
    avatarUrl?: string;
}

const initialState: UserState = {
    userId: '',
    userName: '',
    email: '',
    avatarUrl: '',
};






const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.userId = action.payload.userId;   
            state.userName = action.payload.userName;
            state.email = action.payload.email;
            state.avatarUrl = action.payload.avatarUrl;
        },
        clearUser(state) {
            state.userId = '';
            state.userName = '';
            state.email = '';
            state.avatarUrl = '';
        }
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;