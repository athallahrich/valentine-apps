import React, { useState, useRef, useEffect } from 'react';
import { Lock, LockOpen, Plane, CheckCircle } from 'lucide-react';
import { CORRECT_PIN } from '../constants';
import { WashiTape } from '../components/WashiTape';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError(false);

    if (value && index < 3) {
      refs[index + 1].current?.focus();
    }

    if (newPin.every(d => d !== '')) {
      checkPin(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const checkPin = (enteredPin: string) => {
    if (enteredPin === CORRECT_PIN) {
      setIsSuccess(true);
      setTimeout(onUnlock, 1000);
    } else {
      setError(true);
      setTimeout(() => {
        setPin(['', '', '', '']);
        setError(false);
        refs[0].current?.focus();
      }, 500);
    }
  };

  useEffect(() => {
    refs[0].current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <div className="absolute top-10 right-20 rotate-45 w-64 h-4 bg-yellow-400 shadow-md rounded-full" />
        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 rounded-full border-[12px] border-[#3E2723]/10 opacity-60 filter blur-sm" />
      </div>

      {/* Book Cover */}
      <div className={`relative w-full max-w-[400px] aspect-[4/5] bg-accent shadow-lift rounded-r-xl rounded-l-sm flex flex-col items-center transition-all duration-700 ${isSuccess ? 'rotate-y-180 opacity-0 translate-x-20' : ''}`}>
        
        {/* Spine Shadow */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none rounded-l-sm" />
        
        {/* Content */}
        <div className="relative z-20 w-full h-full flex flex-col p-8 items-center justify-center">
          
          {/* Title Sticker */}
          <div className="relative mb-12 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
             <WashiTape className="w-32 left-1/2 -translate-x-1/2 -top-3" rotation={1} />
            <div className="bg-paper-white p-8 shadow-float border border-gray-100 relative">
              <h1 className="font-hand text-5xl text-ink text-center leading-none">Our Story</h1>
              <div className="absolute -bottom-4 -right-4 bg-white px-2 py-1 shadow-sm transform -rotate-3">
                 <span className="font-mono text-xs text-pencil">Vol. 1</span>
              </div>
            </div>
          </div>

          {/* Lock UI */}
          <div className={`bg-white/30 backdrop-blur-sm p-6 rounded-xl border border-white/40 shadow-inner w-full transform transition-transform duration-300 ${error ? 'animate-shake border-red-400' : ''}`}>
             <div className="text-center mb-4">
               <label className="font-hand text-ink text-xl block transform -rotate-1">Enter Anniversary</label>
               <span className="font-mono text-[10px] text-white/80 opacity-60">(Hint: 1024)</span>
             </div>
             
             <div className="flex justify-center gap-2 mb-6">
                {pin.map((digit, i) => (
                  <input
                    key={i}
                    ref={refs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-12 h-14 bg-paper-white border-2 border-pencil/30 rounded shadow-inner text-center font-display text-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-ink placeholder-gray-300"
                    placeholder={i < 2 ? "M" : "D"}
                  />
                ))}
             </div>

             <div className="flex justify-center">
               <div className={`p-2 rounded-full transition-colors duration-300 ${isSuccess ? 'bg-green-500 text-white' : 'bg-ink/10 text-ink'}`}>
                 {isSuccess ? <CheckCircle size={24} /> : <Lock size={24} />}
               </div>
             </div>
          </div>

          {/* Plane Ticket Decor */}
          <div className="absolute bottom-12 -left-6 bg-blue-100 p-3 border-l-4 border-dashed border-blue-300 shadow-float transform -rotate-12 w-48 z-30">
             <div className="flex justify-between items-center opacity-70">
                <Plane className="text-blue-800" size={20} />
                <span className="font-mono text-xs text-blue-900 font-bold tracking-widest">ADMIT ONE</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};