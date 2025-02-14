import { Product } from './products';

export interface Shelf {
    _id: string;
    id: string;
    level: string;
    products: Product[];
}