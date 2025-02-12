import React, { useState } from 'react';
import { Modal } from 'antd';
import ItemsForm from './components/ItemsForm';
import { Item } from '../../models/shared';
import dayjs from 'dayjs';
import { useAddItemMutation } from '../../store/items/items.api';

interface AddItemModalProps {
    open: boolean;
    onClose: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ open, onClose }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [onAddClicked] = useAddItemMutation();
    const onAdd = async (values: Item) => {

        const payload = {
            created_at: dayjs(values.created_at).format('DD-MM-YYYY'),
            description: values.description || '',
            count: values.count || 1,
            level: values.level || 1,
            category: values.category || 'frozen',
            title: values.title || '',
            completed: false,
        }
        console.log("Adding item:", payload);
        try {
            setIsLoading(true);
            await onAddClicked(payload);
            onClose();
        } catch (error) {
            console.error("Error inserting items:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal open={open}
            title="Add Item"
            onCancel={onClose}
            footer={null}
        >
            <ItemsForm
                onAdd={onAdd}
                isLoading={isLoading}
            />
        </Modal>
    );
};

export default AddItemModal;
