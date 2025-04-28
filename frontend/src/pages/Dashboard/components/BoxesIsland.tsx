import IslandLayout from '@/layout/IslandLayout'
import BoxCard from './BoxCard'
import { Box } from '@/models/boxes'
interface BoxesIslandProps {
    boxesLoading: boolean
    boxes: Box[]
}

const BoxesIsland = ({ boxesLoading, boxes }: BoxesIslandProps) => {

    if (boxesLoading) {
        return (
            <IslandLayout className='w-full md:w-1/2 max-h-[400px] overflow-y-auto'>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </IslandLayout>
        )
    }

    return (
        <IslandLayout className='w-full md:w-1/2 max-h-[400px] overflow-y-auto'>
            <div className="flex flex-col gap-4 w-full">
                {boxes.map((box) => (
                    <BoxCard
                        key={box.id}
                        box={box}
                    />
                ))}
            </div>
        </IslandLayout>
    )
}

export default BoxesIsland