import IslandLayout from '@/layout/IslandLayout'
import BoxCard from './BoxCard'
import { useState } from 'react'
import axiosInstance from '@/utils/axiosInstance'
import { useEffect } from 'react'
import { Box } from '@/models/boxes'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useDashboard } from '@/context/DashboardContext'

const BoxesIsland = () => {
    const { user } = useAuth()
    const { selectedBoxId, setSelectedBoxId } = useDashboard()
    const navigate = useNavigate()
    // const [isLoading, setIsLoading] = useState(true)

    const [boxes, setBoxes] = useState<Box[]>([])

    useEffect(() => {
        const fetchBoxes = async () => {
            if (!user?.id) return;

            try {
                const res = await axiosInstance.get(`/boxes/user?user_id=${user.id}`);
                const boxes = res.data;
                if (boxes.length > 0) {
                    setBoxes(boxes);
                } else {
                    navigate('/onboarding');
                    setBoxes([]);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchBoxes();
    }, [user?.id, navigate]);

    return (
        <IslandLayout className='w-full md:w-1/2 max-h-[400px] overflow-y-auto'>
            <div className="flex flex-col gap-4 w-full">
                {boxes.map((box) => (
                    <BoxCard
                        key={box.id}
                        box={box}
                        onClick={setSelectedBoxId}
                        isSelected={selectedBoxId === box.id}
                    />
                ))}
            </div>
        </IslandLayout>
    )
}

export default BoxesIsland