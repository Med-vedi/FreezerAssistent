import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserData } from './models';
import { Product } from '@/models/products';

export const userDataApi = createApi({
    reducerPath: 'userDataApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_URL_DEV,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
        credentials: 'include'
    }),
    tagTypes: ['UserData'],
    endpoints: (builder) => ({
        getUserData: builder.query<UserData, string>({
            query: (userId) => `/user-data?user_id=${userId}`,
            providesTags: ['UserData']
        }),

        createUserData: builder.mutation<UserData, string>({
            query: (userId) => ({
                url: '/user-data',
                method: 'POST',
                body: { user_id: userId, products: [] }
            }),
            invalidatesTags: ['UserData']
        }),

        addProduct: builder.mutation<UserData, { userId: string; product: Product }>({
            query: ({ userId, product }) => ({
                url: `/user-data/products`,
                method: 'PUT',
                body: { user_id: userId, products: [product] }
            }),
            invalidatesTags: ['UserData']
        }),

        updateProduct: builder.mutation<UserData, { userId: string; productId: string; updates: Partial<Product> }>({
            query: ({ userId, productId, updates }) => ({
                url: `/user-data/${userId}/products/${productId}`,
                method: 'PATCH',
                body: updates
            }),
            invalidatesTags: ['UserData']
        }),

        deleteProduct: builder.mutation<UserData, { userId: string; productId: string }>({
            query: ({ userId, productId }) => ({
                url: `/user-data/${userId}/products/${productId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['UserData']
        }),

        importProducts: builder.mutation<UserData, string>({
            query: (userId) => ({
                url: '/user-data/products/import',
                method: 'POST',
                body: { user_id: userId }
            }),
            invalidatesTags: ['UserData']
        })
    })
});

export const {
    useGetUserDataQuery,
    useCreateUserDataMutation,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useImportProductsMutation
} = userDataApi;