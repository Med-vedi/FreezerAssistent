import Avatar from './Avatar'
import { Dropdown } from 'antd'
import Logo from '@/assets/icons/Logo'
import { useBreakpoints } from '@/hooks/useBreakpoints'
const Navbar = ({ title, showAvatar = true }: { title: string, showAvatar?: boolean }) => {
    const isDesktop = useBreakpoints().md
    return (
        <div className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
            {isDesktop &&
                <div className="flex items-center gap-2">
                    <Logo height={36} />
                    <span className="text-2xl font-bold">{title}</span>
                </div>
            }

            {!isDesktop && <Logo height={36} />}
            {!isDesktop && <span className="text-2xl font-bold">{title}</span>}
            { }
            <div className="flex items-center gap-4">
                {showAvatar &&
                    <Dropdown menu={{
                        items: [
                            {
                                label: <span className="text-red-500">Logout</span>,
                                key: 'logout'
                            }
                        ]
                    }}>
                        <div className="cursor-pointer">
                            <Avatar name="John" lastName="Doe" />
                        </div>
                    </Dropdown>
                }

            </div>
        </div>
    )
}

export default Navbar
