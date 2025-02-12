import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Select, AutoComplete } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FoodCategory, FoodEmoji, Item } from '../../../models/shared';
import dayjs from 'dayjs';
import { meals_examples } from '../../../helpers/constants';

interface ItemsFormProps {
    onAdd: (values: Item) => void;
    isLoading: boolean;
}

const ItemsForm: React.FC<ItemsFormProps> = ({ onAdd, isLoading }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            created_at: dayjs(),
            count: 1,
            level: 1,
        });
        return () => {
            form.resetFields();
        };
    }, [form]);

    const handleSelect = (value: string) => {
        // Find the selected meal example
        const selectedMeal = Object.entries(meals_examples).find(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([_, meal]) => meal.name === value
        );

        if (selectedMeal) {
            const [_, mealData] = selectedMeal;
            // Auto-fill the form with the example data
            form.setFieldsValue({
                title: mealData.name,
                category: mealData.category,
                // Add any other fields you want to auto-fill
            });
        }
    };

    return (
        <Form form={form} onFinish={onAdd} layout="horizontal">
            <Form.Item
                name="title"
                rules={[{ required: true, message: 'Please enter a title' }]}
            >
                <AutoComplete
                    placeholder="Enter title"
                    size='large'
                    options={Object.values(meals_examples).map(meal => ({
                        value: meal.name,
                        label: `${meal.emoji} ${meal.name}`
                    }))}
                    onSelect={handleSelect}
                    filterOption={(inputValue, option) =>
                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                />
            </Form.Item>


            <Form.Item name="description">
                <Input.TextArea
                    placeholder="Enter description (optional)"
                    size='large'
                />
            </Form.Item>
            <Form.Item name="count">
                <InputNumber
                    placeholder="Enter count"
                    size='large'
                />
            </Form.Item>
            <Form.Item name="level">
                <Select
                    placeholder="Select level"
                    size='large'
                    options={[
                        { label: '1', value: 1 },
                        { label: '2', value: 2 },
                        { label: '3', value: 3 },
                        { label: '4', value: 4 },
                        { label: '5', value: 5 },
                        { label: '6', value: 6 },
                    ]}
                />
            </Form.Item>
            <Form.Item name="category">
                <Select
                    placeholder="Select category"
                    size='large'
                    options={Object.values(FoodCategory).map(category => (
                        {
                            label: (
                                <div className='flex items-center gap-2'>
                                    <span className='text-lg'>{FoodEmoji[category]}</span>
                                    <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                                </div>
                            ),
                            value: category
                        }))}
                />
            </Form.Item>
            <Form.Item
                name="created_at"
                rules={[{ required: true, message: 'Please select a date' }]}
            >
                <DatePicker
                    placeholder="Select date"
                    size='large'
                    style={{ width: '100%' }}
                    format="DD-MM-YYYY"
                    defaultValue={dayjs()}
                />
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    loading={isLoading}
                    disabled={isLoading}
                    size='large'
                    onClick={() => onAdd(form.getFieldsValue())}
                >
                    Add
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ItemsForm;