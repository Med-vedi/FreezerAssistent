import React from 'react';
import { Card, Button } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Item } from '../../../models/shared';
import { getEmoji } from '../../../helpers/meals';

interface MealItemProps {
    item: Item;
    onDelete: (id: string) => void;
    onDecrement: (id: string) => void;
    onIncrement: (id: string) => void;
    isDeleting: boolean;
}

const MealItem: React.FC<MealItemProps> = ({
    item,
    onDelete,
    onDecrement,
    onIncrement,
    isDeleting
}) => {
    console.log(item);
    return (
        <Card
            style={{ marginBottom: 16 }}
            actions={[
                <Button
                    type="text"
                    onClick={() => onDecrement(item.id)}
                    block
                >
                    <div className='flex items-center gap-2'>
                        <MinusOutlined />
                    </div>
                </Button>,
                <Button
                    type="text"
                    onClick={() => onIncrement(item.id)}
                    block
                >
                    <div className='flex items-center gap-2'>
                        <PlusOutlined />
                    </div>
                </Button>,
                <Button
                    key="delete"
                    type="text"
                    danger
                    block
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(item.id)}
                    loading={isDeleting}
                >
                </Button>,
            ]}
        >
            <div className='flex items-center justify-between gap-8'>
                <div>
                    <div className='flex items-center gap-2'>
                        <h4 style={{ margin: 0, textDecoration: item.completed ? 'line-through' : 'none' }}>
                            {item.title} {getEmoji(item.category)}
                        </h4>
                    </div>

                    {item.description && <p style={{ margin: '4px 0' }}>{item.description}</p>}
                    <small>Date: {item.created_at}</small>
                </div>
                <h1 className='text-2xl font-bold'>
                    {item.count}
                </h1>
            </div>
        </Card>
    );
};

export default MealItem;