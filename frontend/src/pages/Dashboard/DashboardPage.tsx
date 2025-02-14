import { useState } from 'react'
import { Product } from '@/models/products'
import AddProductModal from './components/AddProductModal'
import BoxesIsland from './components/BoxesIsland'
import ExpiredProductsIsland from './components/ExpiredProductsIsland'
import AllProductsIsland from './components/AllProductsIsland'
import BoxDrawer from './components/BoxDrawer'

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


            <BoxDrawer
                selectedBoxId={selectedBoxId}
                setSelectedBoxId={setSelectedBoxId}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
            />

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