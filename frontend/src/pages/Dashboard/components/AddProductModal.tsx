import { Product } from '@/models/products'
import { Modal } from 'antd'
import React from 'react'
import ProductDrawerCard from './ProductDrawerCard'
import { useIntl } from 'react-intl'
import { useCreateProductMutation } from '@/store/products/products.api'

interface AddProductModalProps {
    open: boolean
    onCancel: () => void
    product?: Product
}
const AddProductModal = ({
    open,
    onCancel,
    product,
}: AddProductModalProps) => {
    const intl = useIntl()
    const [createProduct] = useCreateProductMutation()

    const handleSubmit = async (product: Product) => {
        try {
            await createProduct(product).unwrap()
            console.log('Product created successfully')
            // handle success
        } catch (error) {
            console.error('Failed to create product:', error)
            // handle error
        }
    }

    return (
        <Modal
            title={intl.formatMessage({ id: 'add.item' })}
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <ProductDrawerCard
                product={product}
                onConfirm={handleSubmit}
            />
        </Modal>
    )
}

export default AddProductModal
