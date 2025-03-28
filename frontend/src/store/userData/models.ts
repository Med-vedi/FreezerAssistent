import { Product } from '@/models/products';

export interface UserData {
    id: string;
    products: Product[];
    products_all: Product[];
}