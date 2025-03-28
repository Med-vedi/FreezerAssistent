import { Product } from '@/models/products'
import { Modal } from 'antd'
import React from 'react'
import ProductDrawerCard from './ProductDrawerCard'
import { useIntl } from 'react-intl'
import { useCreateProductMutation, useUpdateProductMutation } from '@/store/products/products.api'
import { useDashboard } from '@/context/DashboardContext'

const AddProductModal = () => {
    const intl = useIntl()
    const [createProduct] = useCreateProductMutation()
    const [updateProduct] = useUpdateProductMutation()
    const {
        selectedProduct,
        showAddProductModal,
        onCloseAddProductModal
    } = useDashboard()

    const handleSubmit = async (product: Product) => {
        try {
            const newProduct = product?.id ? await updateProduct({ ...product, id: product.id }).unwrap() : await createProduct({ ...product, id: new Date().getTime().toString() }).unwrap()
            console.log('Product created successfully', newProduct)
            // handle success
        } catch (error) {
            console.error('Failed to create product:', error)
            // handle error
        }
    }

    const onCloseModal = () => {
        onCloseAddProductModal()
    }

    return (
        <Modal
            title={intl.formatMessage({ id: 'add.item' })}
            open={showAddProductModal}
            onCancel={onCloseModal}
            footer={null}
        >
            <ProductDrawerCard
                productId={selectedProduct?.id}
                onConfirm={handleSubmit}
            />
        </Modal>
    )
}

export default AddProductModal
