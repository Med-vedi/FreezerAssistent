import { useEffect, useState } from 'react'
import { Product } from '@/models/products'
import AddProductModal from './components/AddProductModal'
import BoxesIsland from './components/BoxesIsland'
import ExpiredProductsIsland from './components/ExpiredProductsIsland'
import AllProductsIsland from './components/AllProductsIsland'
import BoxDrawer from './components/BoxDrawer'
import { DashboardProvider } from '@/context/DashboardContext'
import { useGetUserQuery } from '@/store/users/users.api'
import { useGetUserBoxesQuery } from '@/store/boxes/boxes.api'
import { useNavigate } from 'react-router-dom'
const DashboardPage = () => {
    const navigate = useNavigate();
    const { data: userData, isLoading: userLoading } = useGetUserQuery();
    const { data: boxes = [], isLoading: boxesLoading } = useGetUserBoxesQuery(userData?.user?.id ?? '', {
        skip: !userData?.user?.id
    });
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product)
    }

    useEffect(() => {
        if (!userData?.user?.isReady && !userLoading) {
            navigate('/onboarding');
        }
    }, [userData?.user?.isReady, userLoading, navigate]);

    if (userLoading || boxesLoading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
            </div>
        )
    }
    return (
        <DashboardProvider>
            <div className='flex flex-col gap-4 pb-32'>
                <div className='flex flex-col md:flex-row gap-4'>
                    <BoxesIsland
                        boxesLoading={boxesLoading}
                        boxes={boxes}
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
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                    boxes={boxes}
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