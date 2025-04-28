export interface User {
    id: string;
    name: string;
    email: string;
    isReady: boolean;
}

export interface GetUserResponse {
    user: User;
    message: string;
}