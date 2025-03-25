import { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardContextType {
    selectedBoxId: string;
    setSelectedBoxId: (id: string) => void;
    selectedShelfId: string;
    setSelectedShelfId: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [selectedBoxId, setSelectedBoxId] = useState('');
    const [selectedShelfId, setSelectedShelfId] = useState('');


    return (
        <DashboardContext.Provider value={{
            selectedBoxId,
            setSelectedBoxId,
            selectedShelfId,
            setSelectedShelfId
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};