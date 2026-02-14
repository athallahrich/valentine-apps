import React, { useState } from 'react';
import { Shuffle } from 'lucide-react';
import { POLAROID_DATA } from '../constants';
import { WashiTape } from '../components/WashiTape';
import { PolaroidPhoto } from '../types';

export const PolaroidWall: React.FC = () => {
  const [photos, setPhotos] = useState<PolaroidPhoto[]>(POLAROID_DATA);
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const shufflePhotos = () => {
    const shuffled = photos.map(photo => ({
      ...photo,
      rotation: Math.floor(Math.random() * 30) - 15,
      top: Math.floor(Math.random() * 60) + 10,
      left: Math.floor(Math.random() * 70) + 5,
      zIndex: Math.floor(Math.random() * 10),
    }));
    setPhotos(shuffled);
    setFlippedId(null);
  };

  const handleFlip = (id: string) => {
    setFlippedId(flippedId === id ? null : id);
  };

  const bringToFront = (id: string) => {
    setPhotos(prev => {
        const maxZ = Math.max(...prev.map(p => p.zIndex));
        return prev.map(p => p.id === id ? { ...p, zIndex: maxZ + 1 } : p);
    });
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-bg-paper cursor-move">
      {/* Decorative Background Stains */}
      <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full border-[12px] border-[#3C2A21]/5 blur-[2px] pointer-events-none rotate-12" />
      
      {/* Navbar Overlay */}
      <div className="absolute top-0 left-0 w-full z-50 px-6 py-4 pointer-events-none">
        <div className="inline-block pointer-events-auto bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-stone-200">
           <h1 className="font-hand text-2xl text-primary font-bold rotate-2">Our Moments</h1>
        </div>
      </div>

      {/* Instruction Toast */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-ink/90 text-white px-6 py-2 rounded-full shadow-lg backdrop-blur-md animate-float pointer-events-none">
         <span className="text-xs font-bold uppercase tracking-wider">Click to Flip • Drag to Explore</span>
      </div>

      {/* Polaroid Container */}
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="absolute w-64 h-80 transition-all duration-500 ease-out preserve-3d perspective-1000"
          style={{
            top: `${photo.top}%`,
            left: `${photo.left}%`,
            transform: `rotate(${photo.rotation}deg)`,
            zIndex: photo.zIndex,
          }}
          onClick={() => {
              bringToFront(photo.id);
              handleFlip(photo.id);
          }}
        >
          <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flippedId === photo.id ? 'rotate-y-180' : ''}`}>
            
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-paper-white p-3 pb-12 shadow-polaroid hover:shadow-lift flex flex-col cursor-pointer">
              {/* Conditional Washi Tape */}
              {photo.id === 'p1' && <WashiTape className="w-24 left-1/2 -translate-x-1/2 -top-3 bg-primary/80" rotation={2} />}
              {photo.id === 'p3' && <WashiTape className="w-20 right-4 -top-3 bg-accent/90" rotation={-10} />}
              
              <div className="relative w-full aspect-square overflow-hidden bg-gray-100 border border-gray-100 shadow-inner">
                <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover grayscale-[0.2] contrast-110 sepia-[0.1]" />
              </div>
              <div className="flex-1 flex items-center justify-center pt-4">
                <p className="font-hand text-2xl text-ink">{photo.caption}</p>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-paper-white p-6 shadow-polaroid border-2 border-white flex flex-col justify-between">
               <div className="bg-[radial-gradient(#8D99AE_0.5px,transparent_0.5px)] [background-size:20px_20px] absolute inset-0 opacity-20 pointer-events-none" />
               <div className="relative z-10">
                  <span className="font-mono text-xs text-pencil uppercase tracking-widest block mb-2">Date</span>
                  <p className="font-mono text-lg text-ink">{photo.date}</p>
                  <div className="w-full h-px bg-pencil/30 my-3" />
                  <span className="font-mono text-xs text-pencil uppercase tracking-widest block mb-2">Memory</span>
                  <p className="font-mono text-sm text-ink leading-relaxed">Recorded with love.</p>
               </div>
               <div className="relative z-10 self-center text-ink/20 font-hand text-4xl rotate-6">xoxo</div>
            </div>

          </div>
        </div>
      ))}

      {/* Shuffle FAB */}
      <div className="absolute bottom-24 right-8 z-50">
        <button 
            onClick={shufflePhotos}
            className="group flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-[0px_8px_0px_0px_rgba(163,22,33,1),0px_15px_20px_rgba(0,0,0,0.3)] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all duration-150"
        >
          <Shuffle className="text-white group-hover:rotate-180 transition-transform duration-500" size={28} />
        </button>
      </div>

    </div>
  );
};