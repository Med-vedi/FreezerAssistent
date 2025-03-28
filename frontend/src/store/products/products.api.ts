import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PRODUCTS_TAGS } from '../tags';
import { Product } from '@/models/products';

interface GetProductsParams {
    name?: string;
    category_id?: string;
}

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
    tagTypes: [
        PRODUCTS_TAGS.PRODUCTS,
        PRODUCTS_TAGS.PRODUCTS_ALL,
        PRODUCTS_TAGS.PRODUCT
    ],
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
            providesTags: (result, error, id) => [{ type: PRODUCTS_TAGS.PRODUCT, id }]
        }),
        updateProduct: build.mutation<Product, Product>({
            query: (product) => ({
                url: `/products/${product.id}`,
                method: 'PATCH',
                body: product
            }),
            invalidatesTags: (result, error, { id }) => [{ type: PRODUCTS_TAGS.PRODUCTS, id }]
        }),
        getProducts: build.query<Product[], GetProductsParams>({
            query: (params) => ({
                url: '/products',
                params
            }),
            providesTags: [PRODUCTS_TAGS.PRODUCTS_ALL]
        }),
        deleteProduct: build.mutation<void, { productId: string, shelfId: string }>({
            query: ({ productId, shelfId }) => ({
                url: `/products/${productId}/shelf/${shelfId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [PRODUCTS_TAGS.PRODUCTS, PRODUCTS_TAGS.PRODUCTS_ALL]
        }),
    }),
});

export const {
    useCreateProductMutation,
    useGetProductQuery,
    useUpdateProductMutation,
    useGetProductsQuery,
    useDeleteProductMutation
} = productsApi;
