import React from 'react'

const IslandLayout = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={`flex flex-col bg-[#F5F5F5] border-2 border-gray-300 shadow-md rounded-lg p-4 ${className}`} >
            <div className='flex-1'>
                {children}
            </div>
        </div>
    )
}

export default IslandLayout
