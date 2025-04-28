import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import IslandLayout from '@/layout/IslandLayout'
import { Input } from 'antd'
import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { Product } from '@/models/products'
import { useDebounce } from '@/hooks/useDebounce'
import { products } from '@/MOCKS/products'
import dayjs from 'dayjs'
import { useDashboard } from '@/context/DashboardContext'
const ExpiredProductsIsland = () => {
    const mproducts = products as Product[]
    const [searchExpiredProducts, setSearchExpiredProducts] = useState<string>('')
    const [filteredProductsWithExpirationDate, setFilteredProductsWithExpirationDate] = useState<Product[]>([])
    const [productsWithExpirationDate, setProductsWithExpirationDate] = useState<Product[]>([])
    const {
        selectedProduct,
        setSelectedProduct,
        showAddProductModal,
        onCloseAddProductModal,
        setShowAddProductModal
    } = useDashboard()

    const debouncedSearchExpired = useDebounce(searchExpiredProducts, 500)

    useEffect(() => {
        setFilteredProductsWithExpirationDate(
            productsWithExpirationDate.filter((product) =>
                product.name.toLowerCase().includes(debouncedSearchExpired.toLowerCase())
            )
        )
    }, [debouncedSearchExpired, productsWithExpirationDate])

    useEffect(() => {
        setProductsWithExpirationDate(mproducts.map((product) => {
            if (product.id && product.id.length % 2 === 0) {
                return { ...product, expiration_date: dayjs().format('YYYY-MM-DD') }
            }
            return product
        }))
    }, [mproducts])

    const formatDate = (date: string | undefined) => {
        if (!date) return '-';
        try {
            const parsedDate = dayjs(date);
            if (!parsedDate.isValid()) return '-';
            return parsedDate.format('DD/MM/YYYY');
        } catch {
            return '-';
        }
    }

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product)
        setTimeout(() => {
            setShowAddProductModal(true)
        }, 100)
        if (showAddProductModal) {
            onCloseAddProductModal()
        }
    }

    return (
        <IslandLayout>
            <div className='flex flex-col gap-4 w-full h-[360px] overflow-y-auto relative'>
                <header className='sticky top-0 left-0 right-0 bg-[#f5f5f5] z-0!'>
                    <h1><FormattedMessage id="productsWithExpirationDate" />:</h1>
                    <Input
                        placeholder='Search'
                        className='mb-4'
                        size='large'
                        prefix={<SearchOutlined />}
                        suffix={<CloseOutlined onClick={() => setSearchExpiredProducts('')} />}
                        style={{ width: '100%' }}
                        value={searchExpiredProducts}
                        onChange={(e) => setSearchExpiredProducts(e.target.value)}
                    />
                </header>
                <div className='flex flex-col gap-4'>
                    {filteredProductsWithExpirationDate.map((product) => (
                        <div
                            key={product.id}
                            className={`p-4 border-2  shadow-md bg-white rounded-md ${selectedProduct?.id === product.id ? 'border-[#33BEA6]' : 'border-transparent'} hover:border-[#33BEA6] flex items-center justify-between gap-2 cursor-pointer`}
                            onClick={() => handleProductClick(product)}
                        >
                            <div className='flex items-center gap-2'>
                                {product.emoji} {product.name}
                            </div>
                            <span className='text-sm text-gray-500'>
                                {formatDate(product.expiration_date)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </IslandLayout>
    )
}

export default ExpiredProductsIsland
