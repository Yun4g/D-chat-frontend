
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActiveTab{
    activeTab: string;
}

const initialState: ActiveTab = {
    activeTab: 'chats',
};






const ActiveTabSlice = createSlice({
    name: 'ActiveTab',
    initialState,
    reducers: {
        setActiveTab(state, action: PayloadAction<string>) {
            state.activeTab = action.payload;
        },
   
    }
});

export const { setActiveTab } = ActiveTabSlice.actions;
export default ActiveTabSlice.reducer;