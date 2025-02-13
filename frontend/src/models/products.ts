export interface Product {
    id: string;
    name: string;
    category: ProductCategory;
    emoji: string;
    en: string;
    it: string;
    expirationDate?: string;
    boxId?: string;
    count?: number;
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