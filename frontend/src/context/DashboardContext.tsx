import { ShelfProduct, Product } from '@/models/products';
import { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardContextType {
    selectedBoxId: string;
    setSelectedBoxId: (id: string) => void;
    selectedShelfId: string;
    setSelectedShelfId: (id: string) => void;
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product | null) => void;
    selectedShelfProduct: ShelfProduct | null;
    setSelectedShelfProduct: (product: ShelfProduct | null) => void;
    //MODALS
    showAddProductModal: boolean;
    setShowAddProductModal: (show: boolean) => void;
    showAddShelfModal: boolean;
    setShowAddShelfModal: (show: boolean) => void;
    //DRAWERS
    showBoxDrawer: boolean;
    setShowBoxDrawer: (show: boolean) => void;
    onCloseBoxDrawer: () => void;
    onCloseAddProductModal: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [selectedBoxId, setSelectedBoxId] = useState('');
    const [selectedShelfId, setSelectedShelfId] = useState('');
    const [selectedShelfProduct, setSelectedShelfProduct] = useState<ShelfProduct | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showAddShelfModal, setShowAddShelfModal] = useState(false);
    const [showBoxDrawer, setShowBoxDrawer] = useState(false);

    const onCloseBoxDrawer = () => {
        setShowBoxDrawer(false);
        setSelectedProduct(null);
        setSelectedShelfProduct(null);
    }

    const onCloseAddProductModal = () => {
        setShowAddProductModal(false);
        setSelectedProduct(null);
        setSelectedShelfProduct(null);
    }
    return (
        <DashboardContext.Provider value={{
            selectedBoxId,
            setSelectedBoxId,
            selectedShelfId,
            setSelectedShelfId,
            selectedProduct,
            setSelectedProduct,
            selectedShelfProduct,
            setSelectedShelfProduct,

            showAddProductModal,
            setShowAddProductModal,
            showAddShelfModal,
            setShowAddShelfModal,
            showBoxDrawer,
            setShowBoxDrawer,
            onCloseBoxDrawer,
            onCloseAddProductModal
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};