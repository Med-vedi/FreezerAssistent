import { Product, ProductBase } from '@/models/products'
import { Modal } from 'antd'
import React from 'react'
import ProductDrawerCard from './ProductDrawerCard'
import { useIntl } from 'react-intl'
import { useCreateProductMutation, usePostProductToShelfMutation } from '@/store/products/products.api'
import { useDashboard } from '@/context/DashboardContext'

const AddProductModal = () => {
    const intl = useIntl()
    const [createProduct] = useCreateProductMutation()
    const [postProductToShelf] = usePostProductToShelfMutation()
    const {
        showAddProductModal,
        // selectedBoxId,
        onCloseAddProductModal
    } = useDashboard()

    const handleCreateProduct = async (product: ProductBase) => {
        try {
            const newProduct = await createProduct(product).unwrap()
            if (newProduct) {
                void handleAddProduct(newProduct)
            }
            // handle success
        } catch (error) {
            console.error('Failed to create product:', error)
            // handle error
        }
    }

    const handleAddProduct = async (product: Product | ProductBase) => {
        try {
            await postProductToShelf({ product }).unwrap()
            onCloseAddProductModal()
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
                onConfirm={(product) => {
                    if (!product.id) {
                        handleCreateProduct(product)
                    } else {
                        handleAddProduct(product)
                    }
                }}
            />
        </Modal>
    )
}

export default AddProductModal
