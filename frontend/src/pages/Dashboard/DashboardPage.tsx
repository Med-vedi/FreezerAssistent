import { useState } from 'react'
import { Product } from '@/models/products'
import AddProductModal from './components/AddProductModal'
import BoxesIsland from './components/BoxesIsland'
import ExpiredProductsIsland from './components/ExpiredProductsIsland'
import AllProductsIsland from './components/AllProductsIsland'
import BoxDrawer from './components/BoxDrawer'
import { DashboardProvider } from '@/context/DashboardContext'

const DashboardPage = () => {

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product)
    }

    return (
        <DashboardProvider>
            <div className='flex flex-col gap-4 pb-32'>
                <div className='flex flex-col md:flex-row gap-4'>
                    <BoxesIsland />
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
        </DashboardProvider>
    )
}

export default DashboardPage