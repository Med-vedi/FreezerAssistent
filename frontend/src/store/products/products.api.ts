import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PRODUCTS_TAGS } from '../tags';
import { Product } from '@/models/products';

export const productsApi = createApi({
    reducerPath: 'products',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_URL_DEV,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
            return headers;
        },
        credentials: 'include',
    }),
    tagTypes: [PRODUCTS_TAGS.PRODUCTS],
    endpoints: (build) => ({
        createProduct: build.mutation<Product, Product>({
            query: (product) => ({
                url: '/products/shelf',
                method: 'POST',
                body: product
            }),
            invalidatesTags: [PRODUCTS_TAGS.PRODUCTS]
        }),
        getProduct: build.query<Product, string>({
            query: (productId) => `/products/${productId}`,
            providesTags: (result, error, id) => [{ type: PRODUCTS_TAGS.PRODUCTS, id }]
        }),
        updateProduct: build.mutation<Product, Product>({
            query: (product) => ({
                url: `/products/${product.id}`,
                method: 'PATCH',
                body: product
            }),
            invalidatesTags: (result, error, { id }) => [{ type: PRODUCTS_TAGS.PRODUCTS, id }]
        }),
    }),
});

export const { useCreateProductMutation, useGetProductQuery, useUpdateProductMutation } = productsApi;
