import Freezer from '@/assets/icons/Freezer'
import Fridge from '@/assets/icons/Fridge'
import DrawerCustom from '@/components/Drawer'
import IslandLayout from '@/layout/IslandLayout'
import { boxes } from '@/MOCKS/boxes'
import { shelves } from '@/MOCKS/shelves'
import { Product } from '@/models/products'
import Input from 'antd/es/input'
import { useState, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import Button from 'antd/es/button'
import AddProductModal from './AddProductModal'

interface BoxDrawerProps {
    selectedBoxId: string;
    setSelectedBoxId: (id: string) => void;
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product | null) => void;
}
const BoxDrawer = ({
    selectedBoxId,
    setSelectedBoxId,
    selectedProduct,
    setSelectedProduct
}: BoxDrawerProps) => {

    const intl = useIntl()

    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [showAddItemModal, setShowAddItemModal] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 700)

        return () => clearTimeout(timer)
    }, [search])

    const filteredShelves = shelves.map((shelf) => ({
        ...shelf,
        products: shelf.products.filter((product) =>
            product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
    })).filter((shelf) => shelf.products.length > 0)
    // const filteredProducts = shelves.flatMap((shelf) => shelf.products).filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))

    const boxTitleIconRender = ({ id }: { id: string }) => {
        const box = boxes.find((box) => box.id === id)
        const type = box?.type
        const name = box?.title || 'Box'
        return (
            <div className='w-full h-full flex items-center gap-2'>
                {type === 'freezer' ? <Freezer size={24} /> : <Fridge size={24} />}
                <h1 className='text-lg font-bold m-0!'>{name}</h1>
            </div>
        )
    }
    return (
        <>
            <DrawerCustom
                title={boxTitleIconRender({ id: selectedBoxId })}
                open={!!selectedBoxId}
                onClose={() => setSelectedBoxId('')}
                width='50%'
                footer={<Button className='w-full' type='primary' onClick={() => setShowAddItemModal(true)}>{intl.formatMessage({ id: 'add.product' })}</Button>}
            >
                <div className='flex flex-col gap-4'>
                    <Input
                        placeholder={intl.formatMessage({ id: 'search.placeholder' })}
                        className='mb-4'
                        size='large'
                        value={search}
                        suffix={<CloseOutlined onClick={() => {
                            setSearch('');
                            setDebouncedSearch('');
                        }} />}
                        prefix={<SearchOutlined />}
                        style={{ width: '100%' }}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {filteredShelves.map((shelf) => (
                        <div key={shelf.id}>
                            <IslandLayout className='max-h-[200px] overflow-y-auto'>
                                <h1> {`${intl.formatMessage({ id: 'shelf' })} ${shelf.id}`}</h1>
                                <div className='flex flex-col gap-2'>
                                    {shelf.products.map((product) => (
                                        <div
                                            key={product.id}
                                            className={`p-2 border-2 bg-white shadow-md rounded-md ${selectedProduct?.id === product.id ? 'border-[#33BEA6]' : 'border-transparent'} hover:border-[#33BEA6] flex flex-col cursor-pointer`}
                                            onClick={() => setSelectedProduct(product as Product)}
                                        >
                                            <div className='flex items-center gap-2'>
                                                <h1 className='text-xl m-0!'>{product.emoji}</h1>
                                                <h1 className='text-lg font-bold m-0!'>{product.name}</h1>
                                                <p className='text-sm text-gray-500'>{product.count}</p>
                                            </div>

                                            <div className='flex items-center gap-2 text-sm'>
                                                <FormattedMessage id="expirationDate" />: {product.expiring_date}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </IslandLayout>
                        </div>
                    ))}
                </div>
            </DrawerCustom>
            <AddProductModal
                open={showAddItemModal}
                onCancel={() => {
                    setShowAddItemModal(false)
                    setSelectedProduct(null)
                }}
                product={selectedProduct as Product}
            />
        </>
    )
}

export default BoxDrawer
