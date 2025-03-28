import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from './models';
import { USER_TAGS } from '../tags';

const apiBaseUrl = import.meta.env.VITE_BACKEND_URL_DEV;

export const userApi = createApi({
    reducerPath: 'user',
    baseQuery: fetchBaseQuery({
        baseUrl: apiBaseUrl,
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
    tagTypes: [USER_TAGS.USER],
    endpoints: (build) => ({
        login: build.mutation<{ accessToken: string; user: User }, { email: string; password: string }>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
            onQueryStarted: async (_, { queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    localStorage.setItem('token', data.accessToken);
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),

        register: build.mutation<{ accessToken: string; user: User }, { name: string; email: string; password: string }>({
            query: (userData) => ({
                url: '/users',
                method: 'POST',
                body: userData,
            }),
            onQueryStarted: async (_, { queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    localStorage.setItem('token', data.accessToken);
                } catch (error) {
                    console.error('Registration failed:', error);
                }
            },
        }),

        getUser: build.query<{ user: User }, void>({
            query: () => '/get-user',
        }),

        logout: build.mutation<void, { email: string }>({
            query: (body) => ({
                url: '/logout',
                method: 'POST',
                body,
            }),
            onQueryStarted: async () => {
                localStorage.removeItem('token');
            },
        }),

        updateUserReady: build.mutation<void, { email: string }>({
            query: (body) => ({
                url: '/user-ready',
                method: 'POST',
                body
            }),
            invalidatesTags: [USER_TAGS.USER]
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetUserQuery,
    useLogoutMutation,
    useUpdateUserReadyMutation,
} = userApi;