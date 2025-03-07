export const BASE_URL: string = import.meta.env.VITE_NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://freezer-be.vercel.app';

export const DATE_FORMAT = 'DD/MM/YYYY';