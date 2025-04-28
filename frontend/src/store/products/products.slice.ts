import { createSlice } from '@reduxjs/toolkit';
import { Product } from '@/models/products';
import { productsApi } from './products.api';

interface ProductsState {
    products: Product[];
    isLoading: boolean;
}

const initialState: ProductsState = {
    products: [],
    isLoading: false,
};

export const productsSlice = createSlice({
    name: 'productsState',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            productsApi.endpoints.createProduct.matchFulfilled,
            (state, { payload }) => {
                state.products.push(payload);
            }
        );
    },
});

export default productsSlice.reducer;
