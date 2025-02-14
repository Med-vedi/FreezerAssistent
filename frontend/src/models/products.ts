export interface Product {
    id: string;
    name: string;
    category: ProductCategory;
    category_id: number;
    emoji: string;
    en: string;
    it: string;
    expiration_date?: string;
    box_id?: string;
    shelf_id?: string;
    count?: number;
}

export type ProductCategory =
    | 'vini' | 'liquori' | 'caffetteria' | 'latticini' | 'base'
    | 'pasta' | 'riso' | 'formaggi' | 'salumi' | 'verdure'
    | 'erbe' | 'pesce' | 'zuppe' | 'carni' | 'pane'
    | 'frozen' | 'pasta_fresca' | 'dolci' | 'sughi'
    | 'piatti_pronti' | 'primi_pronti' | 'secondi_pronti' | 'contorni' | 'frutta'
    | 'carne' | 'pane_da_forno' | 'insalate' | 'spreads' | 'cereali' | 'legumi'
    | 'secondi' | 'street_food' | 'antipasti' | 'altro';