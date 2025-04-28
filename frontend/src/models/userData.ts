export interface UserProduct {
    id: string;
    name: string;
    category: string;
    category_id: number;
    emoji: string;
    en: string;
    it: string;
    box_id?: string;
    shelf_id?: string;
    count?: number;
    expiration_date?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserData {
    user_id: string;
    products: UserProduct[];
}