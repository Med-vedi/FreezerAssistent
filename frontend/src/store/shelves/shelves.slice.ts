import { createSlice } from '@reduxjs/toolkit';
import { Shelf } from '@/models/shelves';
import { shelvesApi } from './shelves.api';

interface ShelvesState {
    shelves: Shelf[];
    isLoading: boolean;
}

const initialState: ShelvesState = {
    shelves: [],
    isLoading: false,
};

export const shelvesSlice = createSlice({
    name: 'shelvesState',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            shelvesApi.endpoints.getShelvesByBoxId.matchFulfilled,
            (state, { payload }) => {
                state.shelves = payload;
            }
        );
    },
});

export default shelvesSlice.reducer;