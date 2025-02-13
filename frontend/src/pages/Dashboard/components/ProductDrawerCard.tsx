import { Product } from '@/models/products';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, InputNumber, Select } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { DATE_FORMAT } from '@/constants';
import { boxes } from '@/MOCKS/boxes';
import Freezer from '@/assets/icons/Freezer';
import Fridge from '@/assets/icons/Fridge';

const ProductDrawerCard = ({ product, onConfirm }: { product: Product, onConfirm: () => void }) => {
    const [count, setCount] = useState(product.count || 5)
    const [expirationDate, setExpirationDate] = useState<Date>(product?.expirationDate ? new Date(product.expirationDate) : new Date());
    const intl = useIntl();


    const mboxes = boxes.map(box => ({
        value: box.id, label: <div className='flex items-center gap-2'>
            <div className='w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center'>
                {box.type === 'fridge' ? <Fridge size={16} /> : box.type === 'freezer' ? <Freezer size={16} /> : <Fridge size={16} />}
            </div>
            <span>{box.title}</span>
        </div>
    }))


    const handleConfirm = () => {
        onConfirm()
        console.log('FIREEE: ', expirationDate);
    }

    return (
        <div className='flex flex-col gap-4 mt-4'>

            <div className='flex items-center gap-2'>
                <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                    {product.emoji}
                </div>
                <h1 className='text-lg font-bold m-0!'>{product.name}</h1>
                <p className='text-sm text-gray-500'>{product.category}</p>
            </div>
            {/* <DatePicker onChange={onChange} /> */}

            <div className='flex flex-col'>
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
                        }
                    }}
                />
            </div>

            <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>{intl.formatMessage({ id: 'count' })}</span>
                <div className='flex items-center gap-2'>
                    <InputNumber
                        value={count}
                        onChange={(value) => setCount(value || 0)}
                        min={0}
                        max={100}
                        size='large'
                        className='w-full'
                        style={{ width: '100%' }}
                    />


                    <Button
                        size='large'
                        onClick={() => setCount(count - 1)}
                    >
                        <MinusOutlined />
                    </Button>
                    <Button
                        type='primary'
                        size='large'
                        onClick={() => setCount(count + 1)}
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
                    />
                </div>
            </div>


            <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>{intl.formatMessage({ id: 'description' })}</span>
                <Input.TextArea
                    rows={4}
                    placeholder={intl.formatMessage({ id: 'description.placeholder' })}
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