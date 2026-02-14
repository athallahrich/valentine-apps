import React, { createContext, useContext, useState, useEffect } from 'react';
import { Memory, PolaroidPhoto } from '../types';
import { TIMELINE_DATA as DEFAULT_TIMELINE, POLAROID_DATA as DEFAULT_POLAROID, CORRECT_PIN as DEFAULT_PIN, LETTER_CONTENT as DEFAULT_LETTER } from '../constants';

interface AppData {
    pin: string;
    appTitle: string;
    timeline: Memory[];
    polaroids: PolaroidPhoto[];
    letterContent: string;
    letterSignature: string;
    waNumbers: string[];
    musicUrl: string;
    musicTitle: string;
    musicType: 'mp3' | 'spotify-redirect';
}

interface DataContextType {
    data: AppData;
    updateData: (newData: Partial<AppData>) => void;
    resetToDefaults: () => void;
}

const STORAGE_KEY = 'valentine_app_data';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<AppData>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved data", e);
            }
        }
        return {
            pin: DEFAULT_PIN,
            appTitle: 'Our Story',
            timeline: DEFAULT_TIMELINE,
            polaroids: DEFAULT_POLAROID,
            letterContent: DEFAULT_LETTER,
            letterSignature: 'Hubyy',
            waNumbers: ["6285335769655", "6285745270398"],
            musicUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequency/Ketsa_-_09_-_Warm_Glow.mp3',
            musicTitle: 'Warm Glow - Ketsa',
            musicType: 'mp3'
        };
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    const updateData = (newData: Partial<AppData>) => {
        setData(prev => ({ ...prev, ...newData }));
    };

    const resetToDefaults = () => {
        setData({
            pin: DEFAULT_PIN,
            appTitle: 'Our Story',
            timeline: DEFAULT_TIMELINE,
            polaroids: DEFAULT_POLAROID,
            letterContent: DEFAULT_LETTER,
            letterSignature: 'Hubyy',
            waNumbers: ["6285335769655", "6285745270398"],
            musicUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequency/Ketsa_-_09_-_Warm_Glow.mp3',
            musicTitle: 'Warm Glow - Ketsa',
            musicType: 'mp3'
        });
    };

    return (
        <DataContext.Provider value={{ data, updateData, resetToDefaults }}>
            {children}
        </DataContext.Provider>
    );
};

export const useAppData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useAppData must be used within a DataProvider');
    return context;
};
