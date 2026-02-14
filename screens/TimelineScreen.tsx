import React from 'react';
import { Heart, Coffee, Star } from 'lucide-react';
import { TIMELINE_DATA } from '../constants';
import { WashiTape } from '../components/WashiTape';

interface TimelineScreenProps {
  onContinue: () => void;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-24 md:pb-32 px-4 max-w-4xl mx-auto relative">

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 p-2 md:p-4 pointer-events-none flex justify-between items-start">
        <div className="pointer-events-auto bg-paper-white/90 backdrop-blur px-4 md:px-6 py-2 rounded shadow-float transform -rotate-1 border border-primary/10 mt-1 ml-1 md:mt-2 md:ml-2">
          <h1 className="font-hand text-2xl md:text-3xl text-primary">Our Journey</h1>
        </div>
      </div>

      {/* Dashed Center Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px -ml-px border-l-2 border-dashed border-pencil/40 hidden md:block h-full" />

      {/* Start Marker */}
      <div className="flex justify-center mb-16 md:mb-24 relative z-10">
        <div className="bg-paper-white px-4 md:px-6 py-4 md:py-6 shadow-float rotate-2 text-center border-2 border-dashed border-pencil/30 rounded-sm">
          <Heart className="mx-auto text-primary mb-2 fill-primary/20" />
          <p className="font-hand text-2xl text-ink">How it started...</p>
        </div>
      </div>

      {/* Events */}
      {TIMELINE_DATA.map((item, index) => (
        <div key={item.id} className={`relative flex flex-col md:flex-row items-center justify-between mb-20 md:mb-32 group ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>

          {/* Date Label (Tape) */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-10 md:top-8 z-20">
            <div className={`bg-primary text-white font-hand text-xl px-8 py-1 shadow-sm tape-edge transform ${index % 2 === 0 ? '-rotate-2' : 'rotate-1'}`}>
              {item.date}
            </div>
          </div>

          {/* Photo Section */}
          <div className={`w-full md:w-[45%] flex justify-center ${index % 2 === 0 ? 'md:justify-end md:pr-12' : 'md:justify-start md:pl-12'} relative`}>
            <div
              className="relative bg-paper-white p-3 pb-12 shadow-float transition-transform duration-300 hover:scale-105 hover:z-10 w-full max-w-sm"
              style={{ transform: `rotate(${item.rotation}deg)` }}
            >
              {/* Tape on Photo */}
              <WashiTape className="w-24 left-1/2 -translate-x-1/2 -top-3 bg-primary/40" rotation={index % 2 === 0 ? 2 : -2} />

              <div className="relative aspect-[4/5] bg-gray-200 overflow-hidden rounded-sm filter sepia-[.15]">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <p className="font-hand text-xl text-ink">{item.title}</p>
                {item.location && <span className="font-mono text-xs text-pencil">{item.location}</span>}
              </div>
            </div>
          </div>

          {/* Text/Note Section */}
          <div className={`w-full md:w-[45%] flex justify-center ${index % 2 === 0 ? 'md:justify-start md:pl-12' : 'md:justify-end md:pr-12'} mt-6 md:mt-0`}>
            <div className="bg-sticky p-4 md:p-6 shadow-float transform rotate-1 w-full max-w-[280px] md:w-64 relative">
              {/* Pin */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-800 shadow-sm z-20 border border-white/30" />

              {index === 0 && <Coffee className="absolute -right-4 -top-4 text-ink opacity-50" size={32} />}
              {index === 2 && <Star className="absolute -right-4 -top-4 text-accent fill-accent" size={32} />}

              <p className="font-hand text-xl text-ink leading-tight mb-4">{item.description}</p>
            </div>
          </div>

        </div>
      ))}

      {/* Footer */}
      <div className="flex flex-col items-center mt-20 relative z-10">
        <div
          onClick={onContinue}
          className="bg-transparent border-2 border-primary/20 rounded-full px-8 py-3 text-ink font-display font-medium hover:bg-primary/5 transition-colors cursor-pointer active:scale-95"
        >
          Continue the Story...
        </div>
      </div>
    </div>
  );
};