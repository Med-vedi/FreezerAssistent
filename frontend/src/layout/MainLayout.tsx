import Navbar from '../components/Navbar'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col h-screen relative">
            <div className="fixed top-0 left-0 right-0 z-10">
                <Navbar title="Freezer assistant" />
            </div>
            <div className="flex-1 overflow-y-auto mt-16 px-6 py-4">
                {children}
            </div>
        </div>
    )
}

export default MainLayout