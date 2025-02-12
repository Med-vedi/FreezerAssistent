import React from 'react'
import { Button } from 'antd'
const Navbar = ({ title }: { title: string }) => {
    return (
        <div className="flex justify-between items-center px-6 py-4 shadow-md">
            <span className="text-2xl font-bold">{title}</span>
            <div className="flex items-center gap-4">
                <Button type="primary">Login</Button>
                <Button>Sign up</Button>
            </div>
        </div>
    )
}

export default Navbar
