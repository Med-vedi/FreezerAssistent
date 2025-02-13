import Navbar from '../components/Navbar'
import BACKGROUND from '../assets/frozen_meals_background_blue.jpg'
import { useLocation } from 'react-router-dom'
import { PATHS } from '../constants/paths'
const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { pathname } = useLocation()
    return (
        <div className="flex flex-col h-screen relative">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${BACKGROUND})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.2
                }}
            />
            <div className="relative z-10 flex flex-col h-full">
                {pathname !== PATHS.LOGIN && pathname !== PATHS.SIGNUP && <div className="fixed top-0 left-0 right-0">
                    <Navbar title="Freezer assistant" />
                </div>}
                <div className="flex-1 overflow-y-auto mt-16 px-6 py-4">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default MainLayout