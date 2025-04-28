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
        selectedBoxId,
        selectedShelfId,
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
        const { box, shelf, ...productData } = product as Product
        const payload = {
            product: {
                ...productData,
                box_id: selectedBoxId || box?.id,
                shelf_id: selectedShelfId || shelf?.id
            }
        }
        try {
            await postProductToShelf(payload).unwrap()
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
