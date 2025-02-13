import { Drawer, DrawerProps } from 'antd';
import { useBreakpoint } from '@hooks/useBreakpoint';

interface DrawerCustomProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    props: DrawerProps;

}

const DrawerCustom = ({ open, title, children, onClose, ...props }: DrawerCustomProps) => {
    const isDesktop = useBreakpoint();
    if (isDesktop) {
        return (
            <Drawer
                {...props}
                title={title}
                open={open}
                onClose={onClose}
            >
                {children}
            </Drawer>
        )
    }

    return (
        <Drawer
            title={title}
            open={open}
            onClose={onClose}
            placement="bottom"
            height="80vh"
            rootStyle={{ position: 'fixed', bottom: 0 }}
            style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
            {...props}
        >
            {children}
        </Drawer>
    );
};

export default DrawerCustom;