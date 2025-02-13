import { boxes } from '@/MOCKS/boxes'
import BoxCard from './components/BoxCard'
import { useEffect, useState } from 'react'
import IslandLayout from '@/layout/IslandLayout'
import { FormattedMessage, useIntl } from 'react-intl'
import { products } from '@/MOCKS/products'
import { Product } from '@/models/products'
import { Input } from 'antd'
import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { useDebounce } from '@/hooks/useDebounce'

const DashboardPage = () => {
    const intl = useIntl()
    const mboxes = boxes
    const mproducts = products as Product[]
    const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [productsWithExpirationDate, setProductsWithExpirationDate] = useState<Product[]>([])

    const [searchExpiredProducts, setSearchExpiredProducts] = useState<string>('')
    const [searchAllProducts, setSearchAllProducts] = useState<string>('')

    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [filteredProductsWithExpirationDate, setFilteredProductsWithExpirationDate] = useState<Product[]>([])

    const debouncedSearchExpired = useDebounce(searchExpiredProducts, 500)
    const debouncedSearchAll = useDebounce(searchAllProducts, 500)
    useEffect(() => {
        console.log('selectedBoxId', selectedBoxId)
    }, [selectedBoxId])

    useEffect(() => {
        setProductsWithExpirationDate(mproducts.map((product) => {
            if (product.id && product.id.length % 2 === 0) {
                return { ...product, expirationDate: new Date().toISOString() }
            }
            return product
        }))
    }, [mproducts])

    useEffect(() => {
        setFilteredProductsWithExpirationDate(
            productsWithExpirationDate.filter((product) =>
                product.name.toLowerCase().includes(debouncedSearchExpired.toLowerCase())
            )
        )
    }, [debouncedSearchExpired, productsWithExpirationDate])

    useEffect(() => {
        setFilteredProducts(products.filter((product) =>
            product.name.toLowerCase().includes(debouncedSearchAll.toLowerCase())
        ))
    }, [debouncedSearchAll, products])

    const handleProductClick = (product: Product) => {
        setSelectedBoxId(null)
        setSelectedProduct(product)
    }

    const handleBoxClick = (boxId: string) => {
        setSelectedBoxId(boxId)
        setSelectedProduct(null)
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col md:flex-row gap-4'>
                <IslandLayout className='w-full md:w-1/2 max-h-[400px] overflow-y-auto'>
                    <div className="flex flex-col gap-4 w-full">
                        {mboxes.map((box) => (
                            <BoxCard
                                key={box.id}
                                box={box}
                                onClick={handleBoxClick}
                                isSelected={selectedBoxId === box.id}
                            />
                        ))}
                    </div>
                </IslandLayout>
                <div className='w-full md:w-1/2'>
                    <IslandLayout>
                        <div className='flex flex-col gap-4 w-full h-[360px] overflow-y-auto relative'>
                            <header className='sticky top-0 left-0 right-0 bg-[#f5f5f5] z-10'>
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
                                            {intl.formatDate(new Date(product.expirationDate!), {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </IslandLayout>
                </div>
            </div>

            <IslandLayout>
                <div className='flex flex-col gap-4 overflow-y-auto h-[360px]'>
                    <header className='sticky top-0 left-0 right-0 bg-[#f5f5f5] z-10'>
                        <h1><FormattedMessage id="productsWithoutExpirationDate" />:</h1>
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
                                onClick={() => handleProductClick(product)}
                            >{product.emoji} {product.name}</div>
                        ))}
                    </div>
                </div>
            </IslandLayout>
        </div>
    )
}

export default DashboardPage