import { Button, Drawer } from 'antd';
import ItemsList from './components/ItemsList';
import AddItemModal from './AddItemModal';
import { useState } from 'react';

interface LevelsDrawerProps {
    level: number;
    open: boolean;
    onClose: () => void;
}

const LevelsDrawer: React.FC<LevelsDrawerProps> = ({ level, open, onClose }) => {

    const [openAddItemModal, setOpenAddItemModal] = useState(false);

    return (
        <>
            <Drawer
                title={`Level ${level}`}
                open={open}
                onClose={onClose}
                footer={
                    <div className='flex justify-end gap-2'>
                        <Button
                            onClick={onClose}
                            size='large'
                        >
                            Close
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => setOpenAddItemModal(true)}
                            size='large'
                        >
                            Add Item
                        </Button>
                    </div>
                }
            >
                <ItemsList
                    level={level}
                    onToggle={() => { }}
                />
            </Drawer>
            <AddItemModal
                open={openAddItemModal}
                onClose={() => setOpenAddItemModal(false)}
            />
        </>
    )
        ;
};

export default LevelsDrawer;