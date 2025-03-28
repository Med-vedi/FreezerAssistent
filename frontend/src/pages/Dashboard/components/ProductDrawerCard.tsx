import { Product } from '@/models/products';
import { MinusOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Input, InputNumber, InputRef, Select, Space } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { DATE_FORMAT } from '@/constants';
import Freezer from '@/assets/icons/Freezer';
import Fridge from '@/assets/icons/Fridge';

import { products } from '@/MOCKS/products';
import { categories } from '@/MOCKS/categories';
import { Category } from '@/models/categories';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/context/DashboardContext';
import { useGetProductQuery, useUpdateProductMutation } from '@/store/products/products.api';
import { useGetUserBoxesQuery } from '@/store/boxes/boxes.api';
import { useGetShelvesByBoxIdQuery } from '@/store/shelves/shelves.api';

interface ProductDrawerCardProps {
    productId: string;
}

const ProductDrawerCard = ({ productId }: ProductDrawerCardProps) => {
    const { user } = useAuth();
    const { selectedBoxId, selectedShelfId } = useDashboard();
    const { data: product, isLoading } = useGetProductQuery(productId);
    const [updateProduct] = useUpdateProductMutation();
    const { data: boxes = [] } = useGetUserBoxesQuery(user?.id ?? '');
    const { data: shelves = [] } = useGetShelvesByBoxIdQuery(selectedBoxId ?? '');

    const initialProduct: Partial<Product> = {
        id: new Date().getTime().toString(),
        name: '',
        category: 'altro',
        expiration_date: new Date().toISOString(),
        count: 0,
        box_id: selectedBoxId,
        shelf_id: selectedShelfId || product?.shelf_id || '',
        notes: product?.notes || ''
    };
    const [expirationDate, setExpirationDate] = useState<Date>(product?.expiration_date ? new Date(product.expiration_date) : new Date());
    const [productInfo, setProductInfo] = useState<Partial<Product>>(product || initialProduct);
    const [productsList, setProductsList] = useState<Product[]>(products);
    const [categoriesList, setCategoriesList] = useState<Category[]>(categories);
    const [newProductName, setNewProductName] = useState('');

    const intl = useIntl();
    const inputRef = useRef<InputRef>(null);

    const mboxes = useMemo(() => boxes.map(box => ({
        value: box.id,
        label: <div className='flex items-center gap-2'>
            <div className='w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center'>
                {box.type === 'fridge' ? <Fridge size={16} /> : box.type === 'freezer' ? <Freezer size={16} /> : <Fridge size={16} />}
            </div>
            <span>{box.title}</span>
        </div>
    })), [boxes]);

    useEffect(() => {
        setCategoriesList(categories);
    }, [categories]);

    useEffect(() => {
        if (product && boxes.length > 0 && shelves.length > 0) {
            setProductInfo({
                ...product,
                box_id: product.box_id || selectedBoxId || boxes[0].id,
                shelf_id: product.shelf_id || selectedShelfId || shelves[0].id
            });
        } else if (!product && boxes.length > 0 && shelves.length > 0) {
            setProductInfo({
                ...initialProduct,
                expiration_date: dayjs().toDate().toISOString(),
                box_id: selectedBoxId || boxes[0].id,
                shelf_id: selectedShelfId || shelves[0].id
            });
        }
    }, [product, boxes, shelves, selectedBoxId, selectedShelfId]);

    const handleSave = async () => {
        try {
            await updateProduct(productInfo as Product).unwrap();
            // Handle success
        } catch (error) {
            console.error('Failed to update product:', error);
            // Handle error
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex flex-col gap-4 mt-4'>
            {product ?
                <div className='flex items-center gap-2'>
                    <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                        {productInfo?.emoji || ''}
                    </div>
                    <h1 className='text-lg font-bold m-0!'>{productInfo?.name || ''}</h1>
                    <p className='text-sm text-gray-500'>{productInfo?.category || ''}</p>
                </div>
                :
                <div className='flex  gap-2'>
                    <div className='flex flex-col w-full max-w-1/2'>
                        <span className='text-sm text-gray-500'>{intl.formatMessage({ id: 'product' })}</span>
                        <Select
                            showSearch={true}
                            prefix={<SearchOutlined />}
                            placeholder={intl.formatMessage({ id: 'product.placeholder' })}
                            options={productsList.map(product => ({ value: product.name, label: product.name }))}
                            size='large'
                            className='w-full'
                            value={productInfo.name}
                            onChange={(value) => {
                                //TODO: filter by id instead of name
                                const product = productsList.find(product => product.name === value)
                                setProductInfo({ ...productInfo, name: product?.name, category_id: product?.category_id || 0, emoji: product?.emoji } as Product)
                            }}
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider style={{ margin: '8px 0' }} />
                                    <Space style={{ padding: '0 8px 4px' }}>
                                        <Input
                                            className='w-full'
                                            placeholder={intl.formatMessage({ id: 'product.placeholder' })}
                                            ref={inputRef}
                                            value={newProductName}
                                            onChange={(e) => setNewProductName(e.target.value)}
                                            onKeyDown={(e) => e.stopPropagation()}
                                        />
                                        <Button type="text" icon={<PlusOutlined />} onClick={(e) => {
                                            e.preventDefault();
                                            setNewProductName('');
                                            setProductsList([
                                                {
                                                    ...productInfo,
                                                    id: new Date().getTime().toString(),
                                                    name: newProductName,
                                                    category: productInfo.category || 'altro',
                                                    emoji: productInfo.emoji || '🍽️',
                                                    en: newProductName,
                                                    it: newProductName
                                                } as Product,
                                                ...productsList
                                            ])
                                            setTimeout(() => {
                                                inputRef.current?.focus();
                                            }, 0);
                                            // inputRef.current?.input?.focus()
                                        }}>
                                            {intl.formatMessage({ id: 'add' })}
                                        </Button>
                                    </Space>
                                </>
                            )}
                        />
                    </div>

                    <div className='flex flex-col w-1/2'>
                        <span className='text-sm text-gray-500'>{intl.formatMessage({ id: 'category' })}</span>
                        <Select
                            showSearch

                            placeholder={intl.formatMessage({ id: 'category.placeholder' })}
                            options={categoriesList.map(category => ({ value: category.id, label: <span className='text-sm text-gray-500'>{category.emoji} {category.name}</span> }))}
                            size='large'
                            className='w-full'
                            value={productInfo.category_id}
                            // defaultValue={productInfo.categoryId}
                            // onSearch={(value) => {
                            //     const category = categories.find(category => category.name.toLowerCase().includes(value.toLowerCase()))
                            //     if (category) {
                            //         console.log('category: ', category);
                            //         setCategoriesList([category])
                            //     }

                            // }}
                            //TODO: filter by id instead of name
                            onChange={(value) => {
                                const category = categoriesList.find(category => category.id === value)
                                setProductInfo({ ...productInfo, category_id: category?.id, emoji: category?.emoji, category: category?.name } as Product)
                            }}
                        />
                    </div>


                </div>
            }
            {/* <DatePicker onChange={onChange} /> */}

            <div className='flex flex-col w-full'>
                <span className='text-sm text-gray-500'>{intl.formatMessage({ id: 'expirationDate' })}</span>
                <DatePicker
                    className='w-full'
                    size='large'
                    defaultValue={dayjs(expirationDate, DATE_FORMAT)}
                    value={dayjs(expirationDate)}
                    format={DATE_FORMAT}
                    showTime={false}
                    onChange={(date) => {
                        if (date) {
                            const newDate = date.toDate();
                            setExpirationDate(newDate);
                            setProductInfo({ ...productInfo, expirationDate: newDate.toISOString() } as Product)
                        }
                    }}
                />
            </div>

            <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>{intl.formatMessage({ id: 'count' })}</span>
                <div className='flex items-center gap-2'>
                    <InputNumber
                        value={productInfo.count}
                        onChange={(value) => {
                            setProductInfo({ ...productInfo, count: value || 0 } as Product)
                        }}
                        min={0}
                        max={100}
                        size='large'
                        className='w-full'
                        style={{ width: '100%' }}
                    />
                    <Button
                        size='large'
                        onClick={() => {
                            setProductInfo({ ...productInfo, count: productInfo?.count ? productInfo.count - 1 : 0 } as Product)
                        }}
                    >
                        <MinusOutlined />
                    </Button>
                    <Button
                        type='primary'
                        size='large'
                        onClick={() => {
                            setProductInfo({ ...productInfo, count: productInfo?.count ? productInfo.count + 1 : 1 } as Product)
                        }}

                    >
                        <PlusOutlined />
                    </Button>
                </div>
            </div>

            <div className='flex items-center gap-2'>
                <div className='flex w-full flex-col'>
                    <span className='text-sm text-gray-500'>{intl.formatMessage({ id: 'shelf' })}</span>
                    <Select
                        options={shelves.map(shelf => ({ value: shelf.id, label: shelf.level }))}
                        size='large'
                        className='w-full z-0'
                        defaultValue={selectedShelfId}
                        style={{ width: '100%', zIndex: '0 !important' }}
                        onChange={(value) => {
                            const shelf = shelves.find(shelf => shelf.id === value.toString())
                            setProductInfo({ ...productInfo, shelf: shelf } as Product)
                        }}
                    />
                </div>
                <div className='flex w-full flex-col'>
                    <span className='text-sm text-gray-500'>{intl.formatMessage({ id: 'box' })}</span>
                    <Select
                        options={mboxes}
                        size='large'
                        className='w-full'
                        value={productInfo.box_id}
                        style={{ width: '100%' }}
                        onChange={(value) => {
                            const box = boxes.find(box => box.id === value)
                            setProductInfo({ ...productInfo, box: box } as Product)
                        }}
                    />
                </div>
            </div>

            <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>{intl.formatMessage({ id: 'description' })}</span>
                <Input.TextArea
                    rows={4}
                    placeholder={intl.formatMessage({ id: 'description.placeholder' })}
                    value={productInfo?.notes}
                    onChange={(e) => setProductInfo({ ...productInfo, notes: e.target.value } as Product)}
                />
            </div>

            <footer className='flex items-center gap-2 mt-8'>
                <Button
                    type='primary'
                    size='large'
                    block
                    onClick={handleSave}
                >
                    {intl.formatMessage({ id: 'confirm' })}
                </Button>
            </footer>
        </div>
    );
};

export default ProductDrawerCard;