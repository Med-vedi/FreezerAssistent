export interface Box {
    id: string;
    title: string;
    shelves_ids: string[];
    type: 'freezer' | 'fridge';
}