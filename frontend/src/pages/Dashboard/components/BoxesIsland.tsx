import IslandLayout from '@/layout/IslandLayout'
import BoxCard from './BoxCard'
import { boxes } from '@/MOCKS/boxes'

const BoxesIsland = ({
    selectedBoxId,
    handleBoxClick
}: {
    selectedBoxId: string
    handleBoxClick: (boxId: string) => void
}) => {
    const mboxes = boxes
    return (
        <IslandLayout className='w-full md:w-1/2 max-h-[400px] overflow-y-auto'>
            <div className="flex flex-col gap-4 w-full">
                {mboxes.map((box) => (
                    <BoxCard
                        key={box.id}
                        box={box}
                        onClick={handleBoxClick}
                        isSelected={selectedBoxId === box.id}
                    />
                ))}
            </div>
        </IslandLayout>
    )
}

export default BoxesIsland