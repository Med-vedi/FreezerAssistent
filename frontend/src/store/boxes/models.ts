export interface Box {
    type: "freezer" | "fridge";
    title: string;
    id: string;
    shelves_ids: string[];
    user_id: string;
}