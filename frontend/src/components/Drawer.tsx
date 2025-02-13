import { Drawer, DrawerProps } from 'antd';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import React from 'react';
import { CloseOutlined } from '@ant-design/icons';

interface DrawerCustomProps {
    open: boolean;
    onClose: () => void;
    title?: string | React.ReactNode;
    children: React.ReactNode;
    props?: DrawerProps;
    width?: string;
}

const DrawerCustom = ({ open, title, children, onClose, width, ...props }: DrawerCustomProps) => {
    const isDesktop = useBreakpoints().md;
    const [touchStart, setTouchStart] = React.useState<number | null>(null);
    const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

    // Minimum distance required for swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientY);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientY);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchEnd - touchStart;
        if (distance > minSwipeDistance) {
            onClose();
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    if (isDesktop) {
        return (
            <Drawer
                {...props}
                width={width}
                closeIcon={null}
                title={<div className='flex items-center gap-2'>
                    {title}
                    <CloseOutlined onClick={onClose} />
                </div>}
                open={open}
                onClose={onClose}
            >
                {children}
            </Drawer>
        )
    }

    return (
        <Drawer
            // title={title}
            open={open}
            closeIcon={null}
            onClose={onClose}
            placement="bottom"
            height="80vh"
            bodyStyle={{ padding: 0 }}
            rootStyle={{ position: 'fixed', bottom: 0 }}
            style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
            {...props}
        >
            <div
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className='h-full w-full bg-white rounded-t-lg pt-0 flex flex-col gap-4'

            >
                <header className='flex p-4 items-center justify-between border-b border-gray-200 relative'>
                    <div className='w-[100px] h-0.5 bg-black rounded-full absolute top-2 left-1/2 -translate-x-1/2' />
                    <h1 className='text-lg font-bold m-0!'>{title}</h1>
                    <CloseOutlined onClick={onClose} />
                </header>
                <div className='p-4'>
                    {children}
                </div>
            </div>
        </Drawer>
    );
};

export default DrawerCustom;