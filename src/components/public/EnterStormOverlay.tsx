"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnterStormOverlayProps {
  onEnter: () => void;
}

export default function EnterStormOverlay({ onEnter }: EnterStormOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleEnter = () => {
    // Play sound if possible
    try {
      const audio = new Audio('/sounds/thunder.mp3'); // Will fail gracefully if missing
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play blocked or missing file:', e));
    } catch (err) {}

    setIsVisible(false);
    onEnter();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
        >
          {/* Subtle grain/noise overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative z-10 flex flex-col items-center"
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
              STORM BARZ
            </h1>
            
            <button 
              onClick={handleEnter}
              className="px-8 py-4 bg-transparent border border-white/20 text-white uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-500 overflow-hidden relative group"
            >
              <span className="relative z-10 font-semibold">Enter the Storm</span>
              <div className="absolute inset-0 h-full w-0 bg-white group-hover:w-full transition-all duration-500 ease-out z-0"></div>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
