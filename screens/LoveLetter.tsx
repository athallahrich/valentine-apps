import React, { useState, useEffect } from 'react';
import { Heart, CheckCircle } from 'lucide-react';
import { LETTER_CONTENT } from '../constants';

export const LoveLetter: React.FC = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= LETTER_CONTENT.length) {
        setDisplayedText(LETTER_CONTENT.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 40); // Typing speed

    return () => clearInterval(interval);
  }, []);

  const handleAccept = () => {
    setIsAccepted(true);
  };

  return (
    <div className="min-h-screen bg-bg-paper flex items-center justify-center p-4 pb-32 md:pb-8 relative overflow-y-auto">

      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-0" />

      {/* Paper Container */}
      <div className="relative z-10 w-full max-w-xl bg-paper-white shadow-lift rounded-sm rotate-[1deg] hover:rotate-0 transition-transform duration-500 min-h-[500px] md:min-h-[600px] flex flex-col">

        {/* Top Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-primary/80 -rotate-2 shadow-sm tape-edge" />

        <div className="p-6 md:p-12 flex flex-col h-full flex-grow relative">

          {/* Date */}
          <div className="self-end mb-4 md:mb-8 font-mono text-pencil text-xs md:text-sm tracking-widest rotate-1">
            September 25, 2022
          </div>

          {/* Content */}
          <div className="font-mono text-ink text-lg leading-relaxed whitespace-pre-wrap flex-grow">
            {displayedText}
            <span className="inline-block w-0.5 h-5 bg-ink ml-1 animate-pulse" />
          </div>

          {/* Footer / Signature */}
          <div className="mt-12 flex flex-col items-center gap-6 relative">

            {/* Animated Signature (simplified as text here for React purity) */}
            <div className="self-end mr-8 w-48 relative text-right">
              <div className="font-hand text-3xl text-ink transform -rotate-6">Hubyy</div>
            </div>

            {/* Wax Seal Decor */}
            <div className="absolute bottom-20 left-4 rotate-[-15deg] opacity-80">
              <div className="w-16 h-16 rounded-full bg-yellow-300 border-4 border-dashed border-red-800/30 flex items-center justify-center shadow-sm">
                <StarIcon />
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleAccept}
              disabled={isAccepted}
              className={`group relative inline-flex items-center justify-center gap-2 px-8 py-3 rounded shadow-[2px_2px_0px_rgba(0,0,0,0.2)] transition-all duration-200 mt-4 
                        ${isAccepted ? 'bg-green-600 text-white cursor-default' : 'bg-primary text-white hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)]'}`}
            >
              {isAccepted ? (
                <>
                  <CheckCircle className="text-xl" />
                  <span className="text-lg tracking-wide font-display">Accepted!</span>
                </>
              ) : (
                <>
                  <Heart className={`text-xl ${isAccepted ? '' : 'group-hover:animate-bounce'}`} fill="currentColor" />
                  <span className="text-lg tracking-wide font-display">Yes, I accept!</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Shadow Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

// Simple Star SVG helper
const StarIcon = () => (
  <svg className="w-8 h-8 text-red-800/50" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);