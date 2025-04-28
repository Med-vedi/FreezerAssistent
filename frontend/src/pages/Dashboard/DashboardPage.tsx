import { useEffect } from 'react'
import AddProductModal from './components/AddProductModal'
import BoxesIsland from './components/BoxesIsland'
import ExpiredProductsIsland from './components/ExpiredProductsIsland'
import AllProductsIsland from './components/AllProductsIsland'
import BoxDrawer from './components/BoxDrawer'
import { useDashboard } from '@/context/DashboardContext'
import { useGetUserQuery } from '@/store/users/users.api'
import { useGetUserBoxesQuery } from '@/store/boxes/boxes.api'
import { useNavigate } from 'react-router-dom'
import { useGetUserDataQuery } from '@/store/userData/userData.api';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { data: userResponse, isLoading: userLoading } = useGetUserQuery();
    const { data: userData, isLoading: userDataLoading } = useGetUserDataQuery(userResponse?.user?.id ?? '', {
        skip: !userResponse?.user?.id
    });
    const { data: boxes = [], isLoading: boxesLoading } = useGetUserBoxesQuery(userResponse?.user?.id ?? '', {
        skip: !userResponse?.user?.id
    });
    const {
        showBoxDrawer,
        showAddProductModal
    } = useDashboard()


    useEffect(() => {
        if (!userResponse?.user?.isReady && !userLoading) {
            navigate('/onboarding');
        }
        if (userResponse?.user?.isReady && !userDataLoading && !userData?.products?.length) {
            console.log('Importing products');
        }
    }, [userResponse?.user?.isReady, userLoading, navigate]);

    if (userLoading || boxesLoading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
            </div>
        )
    }
    return (
        <div className='flex flex-col gap-4 pb-32'>
            <div
                className='flex flex-col md:flex-row gap-4'>
                <BoxesIsland
                    boxesLoading={boxesLoading}
                    boxes={boxes}
                />
                <div className='w-full md:w-1/2'>
                    <ExpiredProductsIsland />
                </div>
            </div>

            <AllProductsIsland />

            {showBoxDrawer
                ?
                <BoxDrawer
                    boxes={boxes}
                />
                :
                null
            }

            {showAddProductModal
                ?
                <AddProductModal />
                : null
            }


        </div>
    )
}

export default DashboardPage