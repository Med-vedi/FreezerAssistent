import Freezer from '@/assets/icons/Freezer'
import Fridge from '@/assets/icons/Fridge'
import DrawerCustom from '@/components/Drawer'
import IslandLayout from '@/layout/IslandLayout'
import Input from 'antd/es/input'
import { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { SearchOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import Button from 'antd/es/button'
import AddProductModal from './AddProductModal'
import { Badge, Spin } from 'antd'
import { Shelf } from '@/models/shelves'
import { useDashboard } from '@/context/DashboardContext'
import { Box } from '@/models/boxes'
import { useDeleteShelfProductMutation, useGetShelvesByBoxIdQuery, usePatchShelfProductCountMutation } from '@/store/shelves/shelves.api'
import { Product } from '@/models/products'

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
    // const [isLoadingId, setIsLoadingId] = useState('')

    const [isLoadingIncreaseId, setIsLoadingIncreaseId] = useState('')
    const [isLoadingDecreaseId, setIsLoadingDecreaseId] = useState('')
    const [filteredShelvesState, setFilteredShelvesState] = useState<Shelf[]>([])

    const { data: shelves, isLoading: shelvesLoading } = useGetShelvesByBoxIdQuery(selectedBoxId ?? '', {
        skip: !selectedBoxId
    })

    // const [deleteProductFromShelf] = useDeleteProductFromShelfMutation();
    // const { refetch: refetchShelves } = useGetShelvesByBoxIdQuery(selectedBoxId ?? '', {
    //     skip: !selectedBoxId
    // })

    const [deleteShelfProduct] = useDeleteShelfProductMutation();
    const [patchShelfProductCount] = usePatchShelfProductCountMutation()
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

    // const handleDeleteProduct = async (productId: string, shelfId: string) => {
    //     setIsLoadingId(productId)
    //     if (!productId || !shelfId) {
    //         setIsLoadingId('')
    //         return console.error('productId or shelfId is not defined')
    //     }
    //     try {
    //         await deleteProductFromShelf({ productId, shelfId })
    //         refetchShelves()
    //     } catch (error) {
    //         console.error('Error removing product from shelf:', error)
    //     } finally {
    //         setIsLoadingId('')
    //     }
    // }

    const handleIncreaseCount = async (product: Product) => {
        setIsLoadingIncreaseId(product.id)
        try {
            await patchShelfProductCount({
                shelfId: product.shelf_id as string,
                productId: product.id,
                count: (product.count || 0) + 1
            });
        } catch (error) {
            console.error('Error increasing count:', error);
        } finally {
            setIsLoadingIncreaseId('')
        }
    };

    const handleDecreaseCount = async (product: Product) => {
        setIsLoadingDecreaseId(product.id)
        try {
            const newCount = (product.count || 0) - 1;
            if (newCount < 1) {
                await deleteShelfProduct({ shelfId: product.shelf_id as string, productId: product.id });
            } else {
                await patchShelfProductCount({
                    shelfId: product.shelf_id as string,
                    productId: product.id,
                    count: newCount
                });
            }
        } catch (error) {
            console.error('Error decreasing count:', error);
        } finally {
            setIsLoadingDecreaseId('')
        }
    };

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
                            isLoadingIncreaseId={isLoadingIncreaseId}
                            isLoadingDecreaseId={isLoadingDecreaseId}
                            // handleDeleteProduct={handleDeleteProduct}
                            handleIncreaseCount={handleIncreaseCount}
                            handleDecreaseCount={handleDecreaseCount}
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
    isLoadingIncreaseId: string
    isLoadingDecreaseId: string
    // handleDeleteProduct: (productId: string, shelfId: string) => Promise<void>
    handleIncreaseCount: (product: Product) => void
    handleDecreaseCount: (product: Product) => void
}
const ShelvesIslands = ({
    shelves,
    isLoadingIncreaseId,
    isLoadingDecreaseId,
    // handleDeleteProduct,
    handleIncreaseCount,
    handleDecreaseCount
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
                    <div className='flex justify-between items-center mb-4'>
                        <h1 className='text-lg font-bold mb-0!'>{`${intl.formatMessage({ id: 'shelf' })} ${shelf.level}`}</h1>
                        {shelf.products.length > 0 && <Button
                            type='primary'
                            size='large'
                            onClick={() => onAddProductModal({ shelfId: shelf.id })}
                        >
                            <PlusOutlined />
                        </Button>}
                    </div>

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
                                        <Badge
                                            count={product.count}
                                            size='small'
                                            className='font-bold'
                                            color='cyan'
                                        >
                                            <span
                                                className='pr-2'
                                            >{product.name}</span>
                                        </Badge>

                                        <div className='flex gap-2'>
                                            <Button
                                                icon={<PlusOutlined />}
                                                size='large'
                                                type='primary'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleIncreaseCount(product);
                                                }}
                                                loading={isLoadingIncreaseId === product.id}
                                            />
                                            <Button
                                                type='primary'
                                                size='large'
                                                danger
                                                loading={isLoadingDecreaseId === product.id}
                                                icon={<MinusOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDecreaseCount(product);
                                                }}
                                            />
                                        </div>
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
