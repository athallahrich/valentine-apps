import React, { useState, useRef, useEffect } from 'react';
import { Heart, Grid, BookOpen, Key, Music, VolumeX } from 'lucide-react';
import { AppScreen } from '../types';
import { useAppData } from '../context/DataContext';

interface NavBarProps {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  isUnlocked: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({ currentScreen, setScreen, isUnlocked }) => {
  const { data } = useAppData();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSpotify, setShowSpotify] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync state with actual audio element state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: any) => {
      console.error("Audio error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [data.musicType, data.musicUrl]);

  // Handle auto-play on unlock
  useEffect(() => {
    if (isUnlocked && audioRef.current && data.musicType === 'mp3') {
      audioRef.current.play().catch(e => {
        console.log("Auto-play blocked, waiting for user interaction", e);
      });
    }
  }, [isUnlocked]);

  // Handle music source changes
  useEffect(() => {
    if (audioRef.current && data.musicType === 'mp3') {
      audioRef.current.pause();
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Play after reload failed", e));
      }
    }
  }, [data.musicUrl]);

  const toggleMusic = () => {
    if (data.musicType === 'spotify-redirect') {
      window.open(data.musicUrl, '_blank');
      return;
    }

    if (data.musicType === 'spotify-embed') {
      setShowSpotify(!showSpotify);
      return;
    }

    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(err => {
          console.error("Manual play failed:", err);
          alert("Gagal memutar musik. Pastikan link MP3 valid.");
        });
      } else {
        audioRef.current.pause();
      }
    }
  };

  if (!isUnlocked) return null;

  return (
    <>
      {/* Spotify Embed Floating - Now on the Bottom Left */}
      {data.musicType === 'spotify-embed' && (
        <div
          className={`fixed bottom-24 left-6 z-50 w-[320px] md:w-[380px] transition-all duration-500 transform ${showSpotify
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
        >
          <div className="bg-white/40 backdrop-blur-xl p-2 rounded-[24px] shadow-2xl border border-white/40 overflow-hidden relative group">
            <iframe
              style={{ borderRadius: '18px' }}
              src={data.musicUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      )}

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full px-4 md:w-auto">
        <div className="flex items-center gap-4">
          {/* Premium Music Player */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative flex items-center"
          >
            {data.musicType === 'mp3' && (
              <audio
                ref={audioRef}
                src={data.musicUrl}
                loop
                crossOrigin="anonymous"
                preload="auto"
              />
            )}

            <button
              onClick={toggleMusic}
              className={`group relative z-10 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-lift border-2 transition-all duration-500 flex items-center justify-center overflow-hidden ${data.musicType === 'spotify-redirect' ? 'border-blue-400 text-blue-500' :
                data.musicType === 'spotify-embed' ? 'border-[#1DB954] text-[#1DB954]' :
                  isPlaying ? 'border-primary text-primary' : 'border-gray-100 text-pencil'
                } ${isHovered ? 'scale-110 shadow-xl' : (showSpotify && data.musicType === 'spotify-embed' ? 'bg-[#1DB954] text-white' : '')}`}
            >
              {/* Spinning Background for Play State */}
              {isPlaying && data.musicType === 'mp3' && (
                <div className="absolute inset-0 bg-primary/5 animate-spin-slow rounded-full" />
              )}

              <div className={`transition-transform duration-500 ${isPlaying || showSpotify ? 'rotate-[360deg]' : 'rotate-0'}`}>
                {data.musicType === 'spotify-redirect' ? (
                  <Music size={22} />
                ) : data.musicType === 'spotify-embed' ? (
                  <Music size={22} className={showSpotify ? '' : 'animate-bounce'} />
                ) : (
                  isPlaying ? <Music size={22} /> : <VolumeX size={22} />
                )}
              </div>
            </button>

            {/* Expanded Song Title Info */}
            <div className={`absolute left-full ml-4 transition-all duration-500 whitespace-nowrap overflow-hidden ${isHovered ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0 pointer-events-none'}`}>
              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Now Playing</p>
                <p className="text-xs font-bold text-gray-800 tracking-tight truncate max-w-[150px]">
                  {data.musicTitle || 'Sweet Memories'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="bg-white/90 backdrop-blur-xl px-4 md:px-8 py-3 rounded-full shadow-lift border border-white/40 flex gap-6 md:gap-8 items-center">
            <button
              onClick={() => setScreen(AppScreen.TIMELINE)}
              className={`flex flex-col items-center gap-1.5 transition-all group ${currentScreen === AppScreen.TIMELINE ? 'text-primary' : 'text-pencil hover:text-ink'}`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${currentScreen === AppScreen.TIMELINE ? 'bg-primary/5' : 'group-hover:bg-gray-50'}`}>
                <BookOpen size={20} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Story</span>
            </button>

            <button
              onClick={() => setScreen(AppScreen.POLAROID_WALL)}
              className={`flex flex-col items-center gap-1.5 transition-all group ${currentScreen === AppScreen.POLAROID_WALL ? 'text-primary' : 'text-pencil hover:text-ink'}`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${currentScreen === AppScreen.POLAROID_WALL ? 'bg-primary/5' : 'group-hover:bg-gray-50'}`}>
                <Grid size={20} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Wall</span>
            </button>

            <button
              onClick={() => setScreen(AppScreen.LOVE_LETTER)}
              className={`flex flex-col items-center gap-1.5 transition-all group ${currentScreen === AppScreen.LOVE_LETTER ? 'text-primary' : 'text-pencil hover:text-ink'}`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${currentScreen === AppScreen.LOVE_LETTER ? 'bg-primary/5' : 'group-hover:bg-gray-50'}`}>
                <Heart size={20} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Note</span>
            </button>

            <div className="w-px h-8 bg-gray-100 mx-1" />

            <button
              onClick={() => setScreen(AppScreen.LOCK)}
              className="flex flex-col items-center gap-1.5 transition-all group text-pencil hover:text-primary"
            >
              <div className="p-1.5 rounded-xl transition-colors group-hover:bg-primary/5">
                <Key size={20} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Lock</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};