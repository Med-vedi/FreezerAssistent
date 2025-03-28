import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { userApi } from './users/users.api';
import { boxesApi } from './boxes/boxes.api';
import userReducer from './users/users.slice';
import { productsApi } from './products/products.api';
import productsReducer from './products/products.slice';
import { shelvesApi } from './shelves/shelves.api';
import shelvesReducer from './shelves/shelves.slice';

export const store = configureStore({
    reducer: {
        userState: userReducer,
        [userApi.reducerPath]: userApi.reducer,
        [boxesApi.reducerPath]: boxesApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
        productsState: productsReducer,
        shelvesState: shelvesReducer,
        [shelvesApi.reducerPath]: shelvesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(userApi.middleware)
            .concat(boxesApi.middleware)
            .concat(productsApi.middleware)
            .concat(shelvesApi.middleware)
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
