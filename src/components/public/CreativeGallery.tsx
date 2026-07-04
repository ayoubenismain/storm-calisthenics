"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const galleryItems = [
  { id: 1, src: "/skill1.jpg", title: "FULL PLANCHE", subtitle: "Defy Gravity" },
  { id: 2, src: "/skill2.jpg", title: "STRADDLE", subtitle: "Absolute Control" },
  { id: 3, src: "/skill3.jpg", title: "ONE ARM", subtitle: "Perfect Balance" },
  { id: 4, src: "/skill4.jpg", title: "STATIC", subtitle: "Raw Strength" },
  { id: 5, src: "/skill5.jpg", title: "EQUIPPED", subtitle: "The Tools" },
];

export default function CreativeGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full bg-storm-dark py-24 overflow-hidden border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs sm:text-sm uppercase tracking-[0.4em] text-white/50 mb-4 font-medium"
        >
          The Storm Community
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-heading tracking-tighter font-bold mb-4"
        >
          MASTERY IN MOTION
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-white/60 text-lg max-w-2xl mx-auto"
        >
          Explore the peak of human capability. Pure strength, raw power, and absolute control.
        </motion.p>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 h-[50vh] md:h-[65vh] flex gap-2 md:gap-4">
        {galleryItems.map((item, index) => {
          const isHovered = hoveredIndex === index;
          const isAnyHovered = hoveredIndex !== null;
          
          // If none hovered, all share equal space (flex-1).
          // If one is hovered, it expands (flex-[4]), others shrink (flex-1).
          const flexBasis = !isAnyHovered ? "1" : isHovered ? "4" : "1";

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group"
              style={{ flex: flexBasis }}
            >
              {/* Background Image */}
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                className="absolute inset-0 object-cover transition-transform duration-1000 ease-out group-hover:scale-110 filter brightness-[0.6] group-hover:brightness-[0.9]"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end h-full">
                <div 
                  className={`transform transition-all duration-500 ease-out ${
                    isHovered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 md:opacity-100 md:translate-y-0"
                  }`}
                >
                  <p className="text-white/70 text-xs md:text-sm uppercase tracking-[0.3em] font-medium mb-2 transform origin-left transition-all duration-300">
                    {item.subtitle}
                  </p>
                  <h3 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tighter whitespace-nowrap">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
