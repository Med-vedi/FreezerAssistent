import { useState } from 'react'
import { Product } from '@/models/products'
import AddProductModal from './components/AddProductModal'
import DrawerCustom from '@/components/Drawer'
import BoxesIsland from './components/BoxesIsland'
import ExpiredProductsIsland from './components/ExpiredProductsIsland'
import AllProductsIsland from './components/AllProductsIsland'
import { boxes } from '@/MOCKS/boxes'
import Freezer from '@/assets/icons/Freezer'
import Fridge from '@/assets/icons/Fridge'

const DashboardPage = () => {
    const [selectedBoxId, setSelectedBoxId] = useState<string>('')

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)



    const handleProductClick = (product: Product) => {
        setSelectedBoxId('')
        setSelectedProduct(product)
    }

    const handleBoxClick = (boxId: string) => {
        setSelectedBoxId(boxId)
        setSelectedProduct(null)
    }

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
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col md:flex-row gap-4'>
                <BoxesIsland
                    selectedBoxId={selectedBoxId}
                    handleBoxClick={handleBoxClick}
                />
                <div className='w-full md:w-1/2'>
                    <ExpiredProductsIsland
                        handleProductClick={handleProductClick}
                        selectedProduct={selectedProduct}
                    />
                </div>
            </div>

            <AllProductsIsland
                handleProductClick={handleProductClick}
                selectedProduct={selectedProduct}
            />


            <DrawerCustom
                title={boxTitleIconRender({ id: selectedBoxId })}
                open={!!selectedBoxId}
                onClose={() => setSelectedBoxId('')}
                width='50%'
            >
                <div>
                    <h1>{selectedProduct?.name}</h1>
                    <p>{selectedProduct?.category}</p>
                </div>
            </DrawerCustom>

            {selectedProduct ?
                <AddProductModal
                    open={!!selectedProduct}
                    onCancel={() => setSelectedProduct(null)}
                    product={selectedProduct}
                />
                : null
            }


        </div>
    )
}

export default DashboardPage