import { Product } from './products';

export interface Shelf {
    _id: string;
    id: string;
    level: string;
    box_id: string;
    products: Product[];
}