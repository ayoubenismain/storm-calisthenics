"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function RainEffect({ active }: { active: boolean }) {
  const [drops, setDrops] = useState<{ id: number; left: number; duration: number; delay: number; height: number; opacity: number }[]>([]);

  useEffect(() => {
    if (!active) return;
    
    // Generate static drop configuration once
    const newDrops = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      duration: Math.random() * 0.5 + 0.3, // fast falling
      delay: Math.random() * 2,
      height: Math.random() * 40 + 20, // 20px to 60px long
      opacity: Math.random() * 0.4 + 0.1,
    }));
    
    setDrops(newDrops);
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen opacity-40">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute top-[-10%] w-[1px] bg-gradient-to-b from-transparent via-white to-white rounded-full"
          style={{
            left: `${drop.left}%`,
            height: `${drop.height}px`,
            opacity: drop.opacity,
          }}
          animate={{
            y: ["0vh", "110vh"],
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
