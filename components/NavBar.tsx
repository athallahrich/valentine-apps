import React from 'react';
import { Heart, Grid, BookOpen, Key } from 'lucide-react';
import { AppScreen } from '../types';

interface NavBarProps {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  isUnlocked: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({ currentScreen, setScreen, isUnlocked }) => {
  if (!isUnlocked) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lift border border-white/40 flex gap-6">
      <button 
        onClick={() => setScreen(AppScreen.TIMELINE)}
        className={`flex flex-col items-center gap-1 transition-colors ${currentScreen === AppScreen.TIMELINE ? 'text-primary' : 'text-pencil hover:text-ink'}`}
      >
        <BookOpen size={20} />
        <span className="text-[10px] font-mono uppercase tracking-widest">Story</span>
      </button>
      
      <button 
        onClick={() => setScreen(AppScreen.POLAROID_WALL)}
        className={`flex flex-col items-center gap-1 transition-colors ${currentScreen === AppScreen.POLAROID_WALL ? 'text-primary' : 'text-pencil hover:text-ink'}`}
      >
        <Grid size={20} />
        <span className="text-[10px] font-mono uppercase tracking-widest">Wall</span>
      </button>
      
      <button 
        onClick={() => setScreen(AppScreen.LOVE_LETTER)}
        className={`flex flex-col items-center gap-1 transition-colors ${currentScreen === AppScreen.LOVE_LETTER ? 'text-primary' : 'text-pencil hover:text-ink'}`}
      >
        <Heart size={20} />
        <span className="text-[10px] font-mono uppercase tracking-widest">Note</span>
      </button>
      
      <button 
        onClick={() => setScreen(AppScreen.LOCK)}
        className={`flex flex-col items-center gap-1 transition-colors text-pencil hover:text-primary border-l border-pencil/20 pl-6`}
      >
        <Key size={20} />
        <span className="text-[10px] font-mono uppercase tracking-widest">Lock</span>
      </button>
    </div>
  );
};