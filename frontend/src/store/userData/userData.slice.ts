import { createSlice } from '@reduxjs/toolkit';
import { UserData } from './models';
import { userDataApi } from './userData.api';

interface UserDataState {
    userData: UserData | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserDataState = {
    userData: null,
    isLoading: false,
    error: null
};

const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                userDataApi.endpoints.getUserData.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                userDataApi.endpoints.getUserData.matchFulfilled,
                (state, { payload }) => {
                    state.userData = payload;
                    state.isLoading = false;
                }
            )
            .addMatcher(
                userDataApi.endpoints.getUserData.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error.message || 'Failed to fetch user data';
                }
            );
    }
});

export default userDataSlice.reducer;