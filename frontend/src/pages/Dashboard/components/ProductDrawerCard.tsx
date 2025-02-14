import { Product } from '@/models/products';
import { MinusOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Input, InputNumber, InputRef, Select, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { DATE_FORMAT } from '@/constants';
import { boxes } from '@/MOCKS/boxes';
import Freezer from '@/assets/icons/Freezer';
import Fridge from '@/assets/icons/Fridge';
import { shelves } from '@/MOCKS/shelves';
import { products } from '@/MOCKS/products';
import { categories } from '@/MOCKS/categories';

const initialProduct: Partial<Product> = {
    id: new Date().getTime().toString(),
    name: '',
    category: 'altro',
    expirationDate: new Date(),
    count: 0
}
const ProductDrawerCard = ({ product, onConfirm }: { product?: Product, onConfirm: () => void }) => {
    const [expirationDate, setExpirationDate] = useState<Date>(product?.expirationDate ? new Date(product.expirationDate) : new Date());
    const [productInfo, setProductInfo] = useState<Partial<Product>>(product || initialProduct)
    const [productsList, setProductsList] = useState<Product[]>(products)
    const [newProductName, setNewProductName] = useState('')

    const intl = useIntl();
    const inputRef = useRef<InputRef>(null);

    const categoriesOptions = categories.map(category => ({ value: category.id, label: <span className='text-sm text-gray-500'>{category.emoji} {category.name}</span> }))

    const mboxes = boxes.map(box => ({
        value: box.id, label: <div className='flex items-center gap-2'>
            <div className='w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center'>
                {box.type === 'fridge' ? <Fridge size={16} /> : box.type === 'freezer' ? <Freezer size={16} /> : <Fridge size={16} />}
            </div>
            <span>{box.title}</span>
        </div>
    }))

    useEffect(() => {
        if (product) {
            setProductInfo({
                ...product,
                expirationDate: product.expirationDate,
                count: product.count || 0,
                categoryId: product.categoryId || 0,
                name: product.name || '',
                boxId: product.boxId || boxes[0].id,
                shelfId: product.shelfId || shelves[0].id
            })
        } else {
            setProductInfo({
                ...initialProduct,
                expirationDate: dayjs().toDate(),
                count: 1,
                categoryId: 0,
                name: '',
                boxId: boxes[0].id,
                shelfId: shelves[0].id
            })
        }
    }, [product])


    const handleConfirm = () => {
        onConfirm()
        console.log('FIREEE: ', expirationDate);
    }

    console.log('productInfo: ', productInfo);
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
                    <div className='flex flex-col w-full'>
                        <span className='text-sm text-gray-500'>{intl.formatMessage({ id: 'product' })}</span>
                        <Select
                            showSearch={true}
                            prefix={<SearchOutlined />}
                            placeholder={intl.formatMessage({ id: 'product.placeholder' })}
                            options={productsList.map(product => ({ value: product.name, label: product.name }))}
                            size='large'
                            className='w-full'
                            defaultValue={productInfo.name}

                            onChange={(value) => {
                                const product = productsList.find(product => product.name === value)
                                setProductInfo({ ...productInfo, name: product?.name, categoryId: product?.categoryId, emoji: product?.emoji } as Product)
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

                    <div className='flex flex-col w-full'>
                        <span className='text-sm text-gray-500'>{intl.formatMessage({ id: 'category' })}</span>
                        <Select
                            showSearch
                            placeholder={intl.formatMessage({ id: 'category.placeholder' })}
                            options={categoriesOptions}
                            size='large'
                            className='w-full'
                            // defaultValue={productInfo.categoryId}
                            onChange={(value) => {
                                const category = categories.find(category => category.id === value)
                                setProductInfo({ ...productInfo, categoryId: category?.id, name: category?.name, emoji: category?.emoji } as Product)
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
                            setExpirationDate(date.toDate());
                            setProductInfo({ ...productInfo, expirationDate: date.toDate() } as Product)
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
                        options={[1, 2, 3, 4, 5, 6].map(num => ({ value: num, label: num }))}
                        size='large'
                        className='w-full z-0'
                        defaultValue={1}
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
                        defaultValue={mboxes[0].value}
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
                    // value={productInfo?.description}
                    onChange={(e) => setProductInfo({ ...productInfo, description: e.target.value } as Product)}
                />
            </div>




            <footer className='flex items-center gap-2 mt-8'>
                <Button
                    type='primary'
                    size='large'
                    block
                    onClick={handleConfirm}
                >
                    {intl.formatMessage({ id: 'confirm' })}
                </Button>
            </footer>
        </div>
    );
};

export default ProductDrawerCard;