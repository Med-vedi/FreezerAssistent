import Freezer from '@/assets/icons/Freezer'
import Fridge from '@/assets/icons/Fridge'
import DrawerCustom from '@/components/Drawer'
import IslandLayout from '@/layout/IslandLayout'
import Input from 'antd/es/input'
import { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import Button from 'antd/es/button'
import AddProductModal from './AddProductModal'
import { Spin } from 'antd'
import { Shelf } from '@/models/shelves'
import { useDashboard } from '@/context/DashboardContext'
import { Box } from '@/models/boxes'
import { useGetShelvesByBoxIdQuery } from '@/store/shelves/shelves.api'
import { useDeleteProductMutation } from '@/store/products/products.api'
interface BoxDrawerProps {
    boxes: Box[]
}

const BoxDrawer = ({
    boxes
}: BoxDrawerProps) => {
    const intl = useIntl()

    const {
        selectedBoxId,
        setSelectedBoxId,
        showAddProductModal
    } = useDashboard()
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    const [filteredShelvesState, setFilteredShelvesState] = useState<Shelf[]>([])
    const [isLoadingId, setIsLoadingId] = useState('')

    const { data: shelves, isLoading: shelvesLoading } = useGetShelvesByBoxIdQuery(selectedBoxId ?? '', {
        skip: !selectedBoxId
    })

    const [deleteProduct] = useDeleteProductMutation();

    useEffect(() => {
        if (shelves) {
            setFilteredShelvesState(shelves)
        }
    }, [shelves])


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
            await deleteProduct({ productId, shelfId });
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
                    {shelvesLoading ? (
                        <div className="flex justify-center items-center p-4">
                            <Spin size='large' />
                        </div>
                    ) : (
                        <ShelvesIslands
                            shelves={filteredShelvesState}
                            isLoadingId={isLoadingId}
                            handleDeleteProduct={handleDeleteProduct}
                        />
                    )}
                </div>
            </DrawerCustom>

            {showAddProductModal &&
                <AddProductModal />
            }
        </>
    )
}

export default BoxDrawer

interface ShelvesIslandsProps {
    shelves: Shelf[]
    isLoadingId: string
    handleDeleteProduct: (productId: string, shelfId: string) => Promise<void>
}
const ShelvesIslands = ({
    shelves,
    isLoadingId,
    handleDeleteProduct,
}: ShelvesIslandsProps) => {
    const intl = useIntl()
    const {
        selectedBoxId,
        setSelectedBoxId,
        selectedShelfProduct,
        setSelectedShelfProduct,
        setShowAddProductModal,
        setSelectedShelfId
    } = useDashboard()

    const onAddProductModal = ({ shelfId }: { shelfId: string }) => {
        setSelectedShelfProduct(null)
        setSelectedBoxId(selectedBoxId)
        setSelectedShelfId(shelfId)
        setShowAddProductModal(true)
    }

    if (shelves.length === 0) {
        return (
            <div className='flex flex-col gap-4 justify-center items-center p-4'>
                <h1>{intl.formatMessage({ id: 'noShelves' })}</h1>
                {/* <Button type='primary' onClick={() => setShowAddItemModal&&setShowAddItemModal(true)}>{intl.formatMessage({ id: 'addProduct' })}</Button> */}
            </div>
        )
    }



    return (
        shelves.map((shelf, index) => (
            <div key={shelf.id + index + shelf.level}>
                <IslandLayout className='max-h-[200px] overflow-y-auto'>
                    <h1>{`${intl.formatMessage({ id: 'shelf' })} ${shelf.level}`}</h1>
                    {shelf.products.length > 0
                        ?

                        <div className='flex flex-col gap-2'>
                            {shelf.products.map((product, index) => (
                                <div
                                    key={index}
                                    className={`p-2 border-2 bg-white shadow-md rounded-md ${selectedShelfProduct?.id === product.id ? 'border-[#33BEA6]' : 'border-transparent'} hover:border-[#33BEA6] flex flex-col cursor-pointer`}
                                    onClick={() => setSelectedShelfProduct({
                                        ...product,
                                        box_id: selectedBoxId,
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
                        <div
                            key={shelf.id + index + shelf.level}
                            className='w-full flex justify-center items-center'>
                            <Button
                                size='large'
                                type='primary'
                                onClick={() => onAddProductModal({ shelfId: shelf.id })}
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
