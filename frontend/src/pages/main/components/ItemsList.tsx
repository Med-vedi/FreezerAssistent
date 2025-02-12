import React, { useEffect, useState } from 'react';
import { List, Spin } from 'antd';
import MealItem from './MealItem';
import { Item } from '../../../models/shared';
import { db, doc } from '../../../firebaseConfig';
import { deleteDoc } from 'firebase/firestore';
import { useDecrementItemMutation, useGetItemsQuery, useIncrementItemMutation } from '../../../store/items/items.api';

interface ItemsListProps {
    level: number;
    onToggle: (id: string) => void;
}

const ItemsList: React.FC<ItemsListProps> = ({ level }) => {

    const [items, setItems] = useState<Item[]>([]);
    const { data: itemsResponse, isLoading: isItemsLoading, refetch } = useGetItemsQuery({ level });
    const [onDecrementClicked] = useDecrementItemMutation();
    const [onIncrementClicked] = useIncrementItemMutation();
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    useEffect(() => {
        // Add cleanup function
        return () => {
            setItems([]);
        };
    }, [level]);

    useEffect(() => {
        console.log('Fire!')
        if (itemsResponse) {
            console.log('Items fetched 2:', itemsResponse);
            setItems(itemsResponse || []);
        }
    }, [itemsResponse]);

    const onDecrement = async (id: string) => {
        try {
            const res = await onDecrementClicked(id);
            console.log('Decremented item:', res);
        } catch (error) {
            console.error('Error decrementing item:', error);
        }
    };

    const onIncrement = async (id: string) => {
        try {
            const res = await onIncrementClicked(id);
            console.log('Incremented item:', res);
        } catch (error) {
            console.error('Error incrementing item:', error);
        }
    };

    const onDelete = async (id: string) => {

        const itemRef = doc(db, "freezer", "medvedi", "items", id);
        try {
            setIsDeletingId(id);
            await deleteDoc(itemRef);
            refetch()
            setIsDeletingId(null);
        } catch (error) {
            console.error('Error deleting item:', error);
            setIsDeletingId(null);
        }
    };

    if (isItemsLoading) {
        return <Spin />;
    }

    return (
        <List
            dataSource={items}
            renderItem={(item) => (
                <MealItem
                    key={item.id}
                    item={item}
                    onDelete={onDelete}
                    onDecrement={onDecrement}
                    onIncrement={onIncrement}
                    isDeleting={isDeletingId === item.id}
                />
            )}
        />
    );
};

export default ItemsList;