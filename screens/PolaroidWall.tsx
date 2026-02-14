import React, { useState } from 'react';
import { Shuffle } from 'lucide-react';
import { useAppData } from '../context/DataContext';
import { useEffect } from 'react';
import { WashiTape } from '../components/WashiTape';
import { PolaroidPhoto } from '../types';

export const PolaroidWall: React.FC = () => {
  const { data } = useAppData();
  const [photos, setPhotos] = useState<PolaroidPhoto[]>(data.polaroids);
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPhotos(data.polaroids);
  }, [data.polaroids]);

  const shufflePhotos = () => {
    const shuffled = photos.map(photo => ({
      ...photo,
      rotation: Math.floor(Math.random() * 50) - 25, // -25 to +25 deg
      top: Math.floor(Math.random() * 80) + 5,      // 5% to 85%
      left: Math.floor(Math.random() * 80) + 5,     // 5% to 85%
      zIndex: Math.floor(Math.random() * photos.length),
    }));
    setPhotos(shuffled);
    setFlippedId(null);
  };

  const handleFlip = (id: string) => {
    setFlippedId(flippedId === id ? null : id);
  };

  const bringToFront = (id: string) => {
    setPhotos(prev => {
      const maxZ = Math.max(...prev.map(p => p.zIndex), 0);
      return prev.map(p => p.id === id ? { ...p, zIndex: maxZ + 1 } : p);
    });
  }

  const handleDragStart = (id: string, e: React.PointerEvent) => {
    // Only handle primary button (left click)
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    bringToFront(id);
    setDraggedId(id);
    setHasMoved(false);
    setDragStartPosition({ x: clientX, y: clientY });
    setDragOffset({ x: clientX, y: clientY });

    // Capture the pointer to continue receiving events even if leave element
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleDragMove = (e: React.PointerEvent) => {
    if (!draggedId) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    const dist = Math.sqrt(
      Math.pow(clientX - dragStartPosition.x, 2) +
      Math.pow(clientY - dragStartPosition.y, 2)
    );

    // If moved more than 10px, it's a drag, not a click
    if (dist > 10) {
      setHasMoved(true);
    }

    const dx = ((clientX - dragOffset.x) / window.innerWidth) * 100;
    const dy = ((clientY - dragOffset.y) / window.innerHeight) * 100;

    setPhotos(prev => prev.map(p =>
      p.id === draggedId
        ? { ...p, left: p.left + dx, top: p.top + dy }
        : p
    ));

    setDragOffset({ x: clientX, y: clientY });
  };

  const handleDragEnd = (id: string, e: React.PointerEvent) => {
    if (!draggedId) return;

    // Release pointer capture
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    if (!hasMoved) {
      handleFlip(id);
    }

    setDraggedId(null);
    setHasMoved(false);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-bg-paper cursor-move select-none touch-none touch-action-none"
      onPointerMove={handleDragMove}
      onPointerUp={() => { setDraggedId(null); setHasMoved(false); }}
    >
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

      {photos.map((photo) => (
        <div
          key={photo.id}
          className={`absolute w-28 h-40 md:w-64 md:h-80 transition-shadow duration-300 ease-out preserve-3d perspective-1000 touch-none ${draggedId === photo.id ? 'z-50 scale-105 shadow-lift' : ''}`}
          style={{
            top: `${photo.top}%`,
            left: `${photo.left}%`,
            transform: `rotate(${photo.rotation}deg)`,
            zIndex: photo.zIndex,
            transition: draggedId === photo.id ? 'none' : 'all 0.5s ease-out'
          }}
          onPointerDown={(e) => handleDragStart(photo.id, e)}
          onPointerUp={(e) => handleDragEnd(photo.id, e)}
        >
          <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flippedId === photo.id ? 'rotate-y-180' : ''}`}>

            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-paper-white p-2 md:p-3 pb-8 md:pb-12 shadow-polaroid hover:shadow-lift flex flex-col cursor-grab active:cursor-grabbing">
              {/* Conditional Washi Tape */}
              {photo.id === 'p1' && <WashiTape className="w-16 md:w-24 left-1/2 -translate-x-1/2 -top-2 md:-top-3 bg-primary/80" rotation={2} />}
              {photo.id === 'p3' && <WashiTape className="w-16 md:w-20 right-2 md:right-4 -top-2 md:-top-3 bg-accent/90" rotation={-10} />}

              <div className="relative w-full aspect-square overflow-hidden bg-gray-100 border border-gray-100 shadow-inner">
                <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover grayscale-[0.2] contrast-110 sepia-[0.1] pointer-events-none" />
              </div>
              <div className="flex-1 flex items-center justify-center pt-2 md:pt-4">
                <p className="font-hand text-lg md:text-2xl text-ink text-center px-1">{photo.caption}</p>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-paper-white p-3 md:p-6 shadow-polaroid border-2 border-white flex flex-col justify-between overflow-hidden">
              <div className="bg-[radial-gradient(#8D99AE_0.5px,transparent_0.5px)] [background-size:20px_20px] absolute inset-0 opacity-20 pointer-events-none" />
              <div className="relative z-10">
                {photo.date && (
                  <>
                    <span className="font-mono text-[8px] md:text-xs text-pencil uppercase tracking-widest block mb-0.5 md:mb-2">Date</span>
                    <p className="font-mono text-sm md:text-lg text-ink">{photo.date}</p>
                    <div className="w-full h-px bg-pencil/30 my-1 md:my-3" />
                  </>
                )}
                <span className="font-mono text-[8px] md:text-xs text-pencil uppercase tracking-widest block mb-0.5 md:mb-2">Memory</span>
                <p className="font-mono text-[10px] md:text-sm text-ink leading-relaxed">Recorded with love.</p>
              </div>
              <div className="relative z-10 self-center text-ink/20 font-hand text-2xl md:text-4xl rotate-6">xoxo</div>
            </div>

          </div>
        </div>
      ))}

      {/* Shuffle FAB */}
      <div className="absolute bottom-24 right-8 z-[60]">
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