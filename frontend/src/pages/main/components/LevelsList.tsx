import React, { useEffect, useState } from 'react';
import { FoodEmoji } from '../../../models/shared';
import { useGetLevelsQuery } from '../../../store/level/level.api';
import { LevelItem } from '../../../store/level/models';

interface LevelsListProps {
    onLevelClick: (level: number) => void;
}

const LevelsList: React.FC<LevelsListProps> = ({
    onLevelClick
}) => {
    const [levelData, setLevelData] = useState<LevelItem[]>([]);

    const { data: levelsResponse, isLoading: isLevelsLoading } = useGetLevelsQuery();

    useEffect(() => {
        if (levelsResponse) {
            console.log(levelsResponse);
            setLevelData(levelsResponse);
        }
    }, [levelsResponse]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const itemsRef = collection(db, "freezer", "medvedi", "items");
    //         const querySnapshot = await getDocs(itemsRef);
    //         const items = querySnapshot.docs.map((doc) => doc.data() as Item);
    //         setItems(items);
    //         const allLevels = items.map((item) => item.level);
    //         const uniqueSortedLevels = [...new Set(allLevels)].sort((a, b) => a - b);
    //         setLevels(uniqueSortedLevels);
    //     };
    //     fetchData();
    // }, []);

    if (isLevelsLoading) {
        return <div>Loading...</div>;
    }


    return (
        <div className='flex flex-col gap-6 w-full'>
            {levelData.length > 0 && levelData.map((level) => {
                const itemsByLevel = level.items;
                const emojis = itemsByLevel.map((item) =>
                    FoodEmoji[item.category as keyof typeof FoodEmoji]
                ).join(' ');

                return (
                    <div
                        className="cursor-pointer w-full rounded-md border border-gray-300 p-2 hover:bg-gray-300 transition-colors duration-200 shadow-md"
                        key={level.level}
                        onClick={() => onLevelClick(level.level)}
                    >
                        <div className='flex flex-col gap-2'>
                            <h1 className='text-lg font-bold'>Level {level.level}</h1>
                            <p className='text-sm text-gray-500'>{itemsByLevel.length} items</p>
                            <p className='text-sm text-gray-500'>{emojis}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default LevelsList;
