import { Product } from '@/models/products'
import { Modal } from 'antd'
import React from 'react'
import ProductDrawerCard from './ProductDrawerCard'
import { useIntl } from 'react-intl'
import { usePostProductToShelfMutation } from '@/store/products/products.api'
import { useDashboard } from '@/context/DashboardContext'
import { useGetShelvesByBoxIdQuery } from '@/store/shelves/shelves.api'

const AddProductModal = () => {
    const intl = useIntl()
    // const [createProduct] = useCreateProductMutation()
    // const [updateProduct] = useUpdateProductMutation()
    const [postProductToShelf] = usePostProductToShelfMutation()
    const {
        showAddProductModal,
        selectedBoxId,
        onCloseAddProductModal
    } = useDashboard()
    const { refetch } = useGetShelvesByBoxIdQuery(selectedBoxId ?? '', {
        skip: !selectedBoxId
    });

    const handleSubmit = async (product: Product) => {
        try {
            // const newProduct = product?.id
            //     ?
            //     await postProductToShelf({ product }).unwrap()
            //     :
            //     await createProduct({ product }).unwrap()
            // refetch()
            await postProductToShelf({ product }).unwrap()
            refetch()

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
                onConfirm={handleSubmit}
            />
        </Modal>
    )
}

export default AddProductModal
