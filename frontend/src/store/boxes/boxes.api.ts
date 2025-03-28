import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BOXES_TAGS } from '../tags';
import { Box } from './models';

interface CreateBoxesPayload {
    boxes: Box[];
    user_id: string;
}

export const boxesApi = createApi({
    reducerPath: 'boxes',
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
    tagTypes: [BOXES_TAGS.BOXES],
    endpoints: (build) => ({
        createUserBoxes: build.mutation<void, CreateBoxesPayload>({
            query: (payload) => ({
                url: '/boxes/user',
                method: 'POST',
                body: payload
            }),
            invalidatesTags: [BOXES_TAGS.BOXES]
        }),
        getUserBoxes: build.query<Box[], string>({
            query: (userId) => `/boxes/user?user_id=${userId}`,
            providesTags: [BOXES_TAGS.BOXES]
        }),
    }),
});

export const {
    useCreateUserBoxesMutation,
    useGetUserBoxesQuery
} = boxesApi;
