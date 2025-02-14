import { Product } from '@/models/products'
import { Modal } from 'antd'
import React from 'react'
import ProductDrawerCard from './ProductDrawerCard'
import { useIntl } from 'react-intl'

const AddProductModal = ({ open, onCancel, product }: { open: boolean, onCancel: () => void, product?: Product }) => {
    const intl = useIntl()

    const handleConfirm = () => {
        onCancel()
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
                onConfirm={handleConfirm}
            />
        </Modal>
    )
}

export default AddProductModal
