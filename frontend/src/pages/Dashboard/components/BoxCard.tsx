import Freezer from '@/assets/icons/Freezer'
import Fridge from '@/assets/icons/Fridge'
import { useDashboard } from '@/context/DashboardContext'
import { Box } from '@/models/boxes'
import React from 'react'

interface BoxCardProps {
    box: Partial<Box>
}
const BoxCard = ({ box }: BoxCardProps) => {
    const { type, title } = box;
    const { selectedBoxId, setSelectedBoxId } = useDashboard()
    const isSelected = box.id === selectedBoxId
    return (
        <button
            className={`w-full max-w-[400px] bg-white rounded-lg p-4 shadow-md border-2 flex items-center cursor-pointer ${isSelected ? 'border-[#33BEA6]' : 'border-transparent'}`}
            onClick={(e) => {
                e.preventDefault()
                setSelectedBoxId(box.id!)
            }}
        >
            {type === 'freezer' ? <Freezer size={100} /> : <Fridge size={100} />}
            <h1>{title}</h1>
        </button>
    )
}

export default BoxCard
