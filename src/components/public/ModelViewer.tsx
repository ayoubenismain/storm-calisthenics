"use client";

import { useState, useRef, useEffect } from "react";

const images = [
  "/3d/view1.png",
  "/3d/view2.png",
  "/3d/view3.png",
  "/3d/view4.png",
];

export default function ModelViewer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  // Preload images for smoother rotation
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX.current;
    
    // Lower threshold for smoother, more responsive rotation
    if (Math.abs(deltaX) > 25) {
      if (deltaX > 0) {
        // Swipe right, rotate left
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else {
        // Swipe left, rotate right
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
      startX.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <section className="relative w-full z-30 flex flex-col items-center justify-center bg-white pt-24 pb-12 pointer-events-none">
      
      <div className="relative z-10 text-center mb-4 px-6 pointer-events-auto">
        <h2 className="text-4xl md:text-5xl font-heading tracking-tighter font-bold text-gray-900 mb-4">
          EXPLORE EVERY ANGLE
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Drag horizontally to rotate our signature parallettes and see the craftsmanship in 3D.
        </p>
      </div>

      {/* 
        This container enables pointer events specifically for the model interaction,
        while allowing the parent section to pass through clicks elsewhere 
      */}
      <div 
        className="relative w-full max-w-[800px] aspect-square flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {images.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`3D View ${index + 1}`}
            className={`absolute w-full h-full object-contain transition-opacity duration-300 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            style={{ 
              filter: "drop-shadow(0px 30px 40px rgba(0,0,0,0.15))",
              userSelect: "none",
              WebkitUserSelect: "none"
            }}
            draggable={false}
          />
        ))}

        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 flex items-center gap-3 pointer-events-none z-20 text-gray-900">
           <span className="text-xs font-bold uppercase tracking-[0.2em]">360° Drag</span>
           <svg className="w-4 h-4 text-gray-900 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        </div>
      </div>
    </section>
  );
}
