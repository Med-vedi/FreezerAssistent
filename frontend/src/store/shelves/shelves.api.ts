import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SHELVES_TAGS } from '../tags';
import { Shelf } from '@/models/shelves';

export const shelvesApi = createApi({
    reducerPath: 'shelves',
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
    tagTypes: [SHELVES_TAGS.SHELVES],
    endpoints: (build) => ({
        getShelvesByBoxId: build.query<Shelf[], string>({
            query: (boxId) => `/shelves?box_id=${boxId}`,
            providesTags: [SHELVES_TAGS.SHELVES]
        }),
    }),
});

export const { useGetShelvesByBoxIdQuery } = shelvesApi;