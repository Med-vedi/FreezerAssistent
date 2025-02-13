export interface Box {
    _id: { $oid: string };
    id: string;
    title: string;
    shelves_id: string[];
}