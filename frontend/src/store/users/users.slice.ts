import { createSlice } from '@reduxjs/toolkit';
import { User } from './models';
import { userApi } from './users.api';

interface UserState {
    user: User | null;
    isLoading: boolean;
}

const initialState: UserState = {
    user: null,
    isLoading: false,
};

export const userSlice = createSlice({
    name: 'userState',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            userApi.endpoints.getUser.matchFulfilled,
            (state, action) => {
                state.user = action.payload.user;
            }
        );
    },
});

export default userSlice.reducer;
