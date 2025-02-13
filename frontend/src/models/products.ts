export interface Product {
    id: string;
    [key: string]: ProductDetails | string;
}

export interface ProductDetails {
    name: string;
    category: ProductCategory;
    emoji: string;
    en: string;
    it: string;
}

export type ProductCategory =
    | 'vini'
    | 'liquori'
    | 'caffetteria'
    | 'latticini'
    | 'base'
    | 'pasta'
    | 'riso'
    | 'formaggi'
    | 'salumi'
    | 'verdure'
    | 'erbe'
    | 'pesce'
    | 'zuppe'
    | 'carni'
    | 'pane';