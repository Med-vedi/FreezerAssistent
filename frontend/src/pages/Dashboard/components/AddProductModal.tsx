import { Product } from '@/models/products'
import { Modal } from 'antd'
import React from 'react'
import ProductDrawerCard from './ProductDrawerCard'
import { useIntl } from 'react-intl'
import axiosInstance from '@/utils/axiosInstance'

interface AddProductModalProps {
    open: boolean
    onCancel: () => void
    product?: Product
    shelfId: string
    boxId: string
}
const AddProductModal = ({
    open,
    onCancel,
    product,
    shelfId,
    boxId
}: AddProductModalProps) => {
    const intl = useIntl()

    const handleConfirm = async (product: Product) => {
        // onCancel()
        console.log('product to SAVE', product)
        try {
            const res = await axiosInstance.post('/products/shelf', product);
            console.log('res', res);
        } catch (err) {
            console.error('Error:', err);
        }
    }
    // const handleConfirm = async (product: Product) => {
    //     // onCancel()
    //     console.log('product', product)
    //     try {
    //         const token = localStorage.getItem('token');
    //         const res = await axiosInstance.post('/products',
    //             { ...product },
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`
    //                 }
    //             }
    //         );
    //         console.log('res', res);
    //     } catch (err) {
    //         console.log(err);
    //     }
    //     console.log('product: ', product)
    // }

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
                shelfId={shelfId}
                boxId={boxId}
            />
        </Modal>
    )
}

export default AddProductModal
