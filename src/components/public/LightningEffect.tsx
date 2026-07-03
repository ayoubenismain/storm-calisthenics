"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LightningEffect({ isActive }: { isActive: boolean }) {
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    // Initial big flash synced with the thunder entry
    const initialTimer = setTimeout(() => {
      triggerFlash();
    }, 100);

    // Random lightning flashes every 5 to 15 seconds
    const intervalTimer = setInterval(() => {
      // 30% chance to flash every 5 seconds to keep it unpredictable and cinematic
      if (Math.random() > 0.7) {
        triggerFlash();
      }
    }, 5000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [isActive]);

  const triggerFlash = () => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 1500); // Give enough time for the animation to finish
  };

  return (
    <AnimatePresence>
      {showFlash && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 mix-blend-screen bg-white"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0, 0.8, 0, 0.4, 0],
          }}
          transition={{
            duration: 1.2,
            times: [0, 0.05, 0.1, 0.15, 0.25, 0.3, 1],
            ease: "easeOut",
          }}
        />
      )}
    </AnimatePresence>
  );
}
