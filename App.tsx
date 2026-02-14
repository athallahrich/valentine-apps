import React, { useState, useEffect } from 'react';
import { TimelineScreen } from './screens/TimelineScreen';
import { PolaroidWall } from './screens/PolaroidWall';
import { LockScreen } from './screens/LockScreen';
import { LoveLetter } from './screens/LoveLetter';
import { NavBar } from './components/NavBar';
import { AppScreen } from './types';
import { DataProvider } from './context/DataContext';
import { AdminDashboard } from './screens/AdminDashboard';

function MainApp() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LOCK);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'Space') {
        e.preventDefault();
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    setCurrentScreen(AppScreen.TIMELINE);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.LOCK:
        return <LockScreen onUnlock={handleUnlock} />;
      case AppScreen.TIMELINE:
        return <TimelineScreen onContinue={() => setCurrentScreen(AppScreen.POLAROID_WALL)} />;
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
      <div key={currentScreen} className="page-transition-wrapper">
        {renderScreen()}
      </div>

      {currentScreen !== AppScreen.LOCK && (
        <NavBar
          currentScreen={currentScreen}
          setScreen={setCurrentScreen}
          isUnlocked={isUnlocked}
        />
      )}

      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
}

export default App;