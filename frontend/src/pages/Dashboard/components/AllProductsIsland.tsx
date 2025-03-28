import { useDashboard } from '@/context/DashboardContext'
import { useDebounce } from '@/hooks/useDebounce'
import IslandLayout from '@/layout/IslandLayout'
// import { products } from '@/MOCKS/products'
import { Product } from '@/models/products'
import { RootState } from '@/store'
import { useGetUserDataQuery } from '@/store/userData/userData.api'
import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { Input, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

const AllProductsIsland = () => {
    const user = useSelector((state: RootState) => state.userState.user);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [searchAllProducts, setSearchAllProducts] = useState<string>('')

    const { selectedProduct, setSelectedProduct } = useDashboard()

    const { data: userData, isLoading: userDataLoading } = useGetUserDataQuery(user?.id ?? '', {
        skip: !user?.id
    });

    const debouncedSearchAll = useDebounce(searchAllProducts, 500)

    useEffect(() => {
        setFilteredProducts(userData?.products_all?.filter((product) =>
            product.name.toLowerCase().includes(debouncedSearchAll.toLowerCase())
        ) ?? [])
    }, [debouncedSearchAll, userData?.products_all])

    if (userDataLoading) {
        return (
            <IslandLayout>
                <Spin />
            </IslandLayout>
        )
    }
    return (
        <IslandLayout>
            <div className='flex flex-col gap-4 overflow-y-auto h-[360px]'>
                <header className='sticky top-0 left-0 right-0 bg-[#f5f5f5] z-0!'>
                    <h1><FormattedMessage id="products.catalog" />:</h1>
                    <Input
                        placeholder='Search'
                        className='mb-4'
                        size='large'
                        prefix={<SearchOutlined />}
                        suffix={<CloseOutlined onClick={() => setSearchAllProducts('')} />}
                        style={{ width: '100%' }}
                        value={searchAllProducts}
                        onChange={(e) => setSearchAllProducts(e.target.value)}
                    />
                </header>
                <div className='flex flex-wrap gap-4'>
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className={`p-4 border-2 bg-white shadow-md rounded-md ${selectedProduct?.id === product.id ? 'border-[#33BEA6]' : 'border-transparent'} hover:border-[#33BEA6] flex items-center gap-2 cursor-pointer`}
                            onClick={() => setSelectedProduct(product)}
                        >{product.emoji} {product.name}</div>
                    ))}
                </div>
            </div>
        </IslandLayout>
    )
}

export default AllProductsIsland
