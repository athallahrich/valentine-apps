import React, { useState } from 'react';
import { TimelineScreen } from './screens/TimelineScreen';
import { PolaroidWall } from './screens/PolaroidWall';
import { LockScreen } from './screens/LockScreen';
import { LoveLetter } from './screens/LoveLetter';
import { NavBar } from './components/NavBar';
import { AppScreen } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LOCK);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
    setCurrentScreen(AppScreen.TIMELINE);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.LOCK:
        return <LockScreen onUnlock={handleUnlock} />;
      case AppScreen.TIMELINE:
        return <TimelineScreen />;
      case AppScreen.POLAROID_WALL:
        return <PolaroidWall />;
      case AppScreen.LOVE_LETTER:
        return <LoveLetter />;
      default:
        return <LockScreen onUnlock={handleUnlock} />;
    }
  };

  return (
    <div className="w-full min-h-screen">
      {renderScreen()}
      
      {currentScreen !== AppScreen.LOCK && (
        <NavBar 
          currentScreen={currentScreen} 
          setScreen={setCurrentScreen} 
          isUnlocked={isUnlocked} 
        />
      )}
    </div>
  );
}

export default App;