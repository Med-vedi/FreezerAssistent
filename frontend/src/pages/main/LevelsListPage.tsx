import LevelsList from "./components/LevelsList";
import LevelsDrawer from './LevelsDrawer';
import { useState } from 'react';

const LevelsListPage: React.FC = () => {
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    return (

        <div className='w-full flex flex-col gap-6'>
            <LevelsList
                onLevelClick={(level) => setSelectedLevel(level)}
            />
            {selectedLevel && (
                <LevelsDrawer
                    open={!!selectedLevel}
                    onClose={() => setSelectedLevel(null)}
                    level={selectedLevel}
                />
            )}
        </div>

    );
};

export default LevelsListPage;