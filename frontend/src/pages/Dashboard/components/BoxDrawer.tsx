import Freezer from '@/assets/icons/Freezer'
import Fridge from '@/assets/icons/Fridge'
import DrawerCustom from '@/components/Drawer'
import IslandLayout from '@/layout/IslandLayout'
// import { boxes } from '@/MOCKS/boxes'
// import { shelves } from '@/MOCKS/shelves'
import { Product } from '@/models/products'
import Input from 'antd/es/input'
import { useState, useEffect } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import Button from 'antd/es/button'
import AddProductModal from './AddProductModal'
import axiosInstance from '@/utils/axiosInstance'
import { message, Spin } from 'antd'
import { Shelf } from '@/models/shelves'
import { Box } from '@/models/boxes'
import { useDashboard } from '@/context/DashboardContext'
interface BoxDrawerProps {
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product | null) => void;
}

const BoxDrawer = ({
    selectedProduct,
    setSelectedProduct
}: BoxDrawerProps) => {
    const { selectedBoxId, setSelectedBoxId } = useDashboard()
    const intl = useIntl()
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [showAddItemModal, setShowAddItemModal] = useState(false)
    const [filteredShelvesState, setFilteredShelvesState] = useState<Shelf[]>([])
    const [isLoadingId, setIsLoadingId] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [boxes, setBoxes] = useState<Box[]>([])

    const getBoxes = async () => {
        const response = await axiosInstance.get<Box[]>('/boxes/user')
        setBoxes(response.data)
    }

    useEffect(() => {
        getBoxes()
    }, [])
    const getShelvesByBoxId = async (boxId: string) => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.get<Shelf[]>(`/shelves?box_id=${boxId}`)
            setFilteredShelvesState(response.data)
        } catch (error) {
            console.error('Error fetching shelves:', error)
            message.error(intl.formatMessage({ id: 'error.fetchingShelves' }))
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (selectedBoxId) {
            getShelvesByBoxId(selectedBoxId)
        }
    }, [selectedBoxId])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 700)

        return () => clearTimeout(timer)
    }, [search])

    useEffect(() => {
        const filtered = filteredShelvesState.map((shelf) => ({
            ...shelf,
            products: shelf.products.filter((product) =>
                product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        })).filter((shelf) => shelf.products.length > 0)
        setFilteredShelvesState(filtered)
    }, [debouncedSearch])

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

    const handleDeleteProduct = async (productId: string, shelfId: string) => {
        try {
            setIsLoadingId(productId)
            await axiosInstance.delete(`/products/${productId}/shelf/${shelfId}`);
            // Update local state
            const updatedShelves = filteredShelvesState.map(s => {
                if (s.id === shelfId) {
                    return {
                        ...s,
                        products: s.products.filter(p => p.id !== productId)
                    };
                }
                return s;
            });
            setFilteredShelvesState(updatedShelves);
        } catch (error) {
            console.error('Error removing product from shelf:', error);
        } finally {
            setIsLoadingId('')
        }
    }

    return (
        <>
            <DrawerCustom
                open={!!selectedBoxId}
                onClose={() => setSelectedBoxId('')}
                title={boxTitleIconRender({ id: selectedBoxId })}
            >
                <div className='flex flex-col gap-4 mt-4'>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder={intl.formatMessage({ id: 'search' })}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {isLoading ? (
                        <div className="flex justify-center items-center p-4">
                            <Spin size='large' />
                        </div>
                    ) : (
                        <ShelvesIslands
                            shelves={filteredShelvesState}
                            intl={intl}
                            boxId={selectedBoxId}
                            selectedProduct={selectedProduct}
                            setSelectedProduct={setSelectedProduct}
                            isLoadingId={isLoadingId}
                            handleDeleteProduct={handleDeleteProduct}
                            setShowAddItemModal={setShowAddItemModal}
                        />
                    )}
                </div>
            </DrawerCustom>

            <AddProductModal
                open={showAddItemModal}
                onCancel={() => {
                    setShowAddItemModal(false)
                    setSelectedProduct(null)
                }}
                product={selectedProduct || undefined}
            />
        </>
    )
}

export default BoxDrawer

interface ShelvesIslandsProps {
    shelves: Shelf[]
    intl: IntlShape
    selectedProduct: Product | null
    setSelectedProduct: (product: Product | null) => void
    boxId: string
    isLoadingId: string
    handleDeleteProduct: (productId: string, shelfId: string) => Promise<void>
    setShowAddItemModal: (show: boolean) => void
}
const ShelvesIslands = ({
    shelves,
    intl,
    selectedProduct,
    setSelectedProduct,

    boxId,
    isLoadingId,
    handleDeleteProduct,
    setShowAddItemModal
}: ShelvesIslandsProps) => {
    if (shelves.length === 0) {
        return (
            <div className='flex flex-col gap-4 justify-center items-center p-4'>
                <h1>{intl.formatMessage({ id: 'noShelves' })}</h1>
                <Button type='primary' onClick={() => setShowAddItemModal(true)}>{intl.formatMessage({ id: 'addProduct' })}</Button>
            </div>
        )
    }

    return (
        shelves.map((shelf, index) => (
            <div key={shelf.id + index}>
                <IslandLayout className='max-h-[200px] overflow-y-auto'>
                    <h1>{`${intl.formatMessage({ id: 'shelf' })} ${shelf.level}`}</h1>
                    {shelf.products.length > 0
                        ?

                        <div className='flex flex-col gap-2'>
                            {shelf.products.map((product) => (
                                <div
                                    key={product.id}
                                    className={`p-2 border-2 bg-white shadow-md rounded-md ${selectedProduct?.id === product.id ? 'border-[#33BEA6]' : 'border-transparent'} hover:border-[#33BEA6] flex flex-col cursor-pointer`}
                                    onClick={() => setSelectedProduct({
                                        ...product,
                                        box_id: boxId,
                                        shelf_id: shelf.id
                                    })}
                                >
                                    <div className='flex justify-between items-center'>
                                        <span className='font-bold'>{product.name}</span>
                                        <Button
                                            type='text'
                                            icon={<DeleteOutlined />}
                                            loading={isLoadingId === product.id}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteProduct(product.id, shelf.id)
                                            }}
                                        />
                                    </div>
                                    <span className='text-sm text-gray-500'>
                                        {product.expiration_date}
                                    </span>
                                </div>
                            ))}
                        </div>
                        :
                        <div className='w-full flex justify-center items-center'>
                            <Button
                                size='large'
                                type='primary'
                                onClick={() => {
                                    setShowAddItemModal(true)
                                }}
                            >
                                {intl.formatMessage({ id: 'addProduct' })}
                            </Button>
                        </div>
                    }
                </IslandLayout>
            </div>
        ))
    )
}
