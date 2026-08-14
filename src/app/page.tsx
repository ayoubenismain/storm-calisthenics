"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import EnterStormOverlay from "@/components/public/EnterStormOverlay";
import LightningEffect from "@/components/public/LightningEffect";
import CreativeGallery from "@/components/public/CreativeGallery";
import PremiumProducts from "@/components/public/PremiumProducts";
import ContactSection from "@/components/public/ContactSection";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  description: string;
}

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch("/api/products?limit=6")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {});

    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || {}))
      .catch(() => {});
  }, []);

  return (
    <main className="relative min-h-screen bg-storm-dark text-white overflow-hidden">
      {!hasEntered && <EnterStormOverlay onEnter={() => setHasEntered(true)} />}

      <div
        className={`transition-opacity duration-1000 ${
          hasEntered ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-40 px-6 py-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
          <div className="text-2xl font-bold tracking-tighter font-heading text-white">
            STORM
          </div>

          <div className="hidden md:flex gap-8 text-sm uppercase tracking-wider">
            <Link
              href="/products"
              className="text-white/70 hover:text-white transition-colors"
            >
              Shop
            </Link>
            <Link
              href="#products"
              className="text-white/70 hover:text-white transition-colors"
            >
              Products
            </Link>
            <Link
              href="#contact"
              className="text-white/70 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>

          <Link
            href="/cart"
            className="relative text-white/70 hover:text-white transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
          <LightningEffect isActive={hasEntered} />

          {/* Background */}
          <div className="absolute inset-0 z-0">
            <div className="relative w-full h-full">
              {/* Mobile Background */}
              <Image
                src="/mobile_bg.png"
                alt="Storm Mobile Background"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center opacity-70 md:hidden"
              />

              {/* Desktop Background */}
              <Image
                src="/desktop_bg.png"
                alt="Storm Desktop Background"
                fill
                priority
                sizes="100vw"
                className="hidden object-cover object-center opacity-70 md:block"
              />
            </div>

            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
          </div>

          {/* Centered Hero Content */}
          <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-6 pt-28 pb-20">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xs sm:text-sm uppercase tracking-[0.4em] text-white/50 mb-6 font-medium"
            >
              Premium Calisthenics Equipment
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-[clamp(3.5rem,14vw,11rem)] font-bold tracking-tighter font-heading storm-gradient-text leading-none mb-2"
            >
              BECOME
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-[clamp(3.5rem,14vw,11rem)] font-bold tracking-tighter font-heading storm-gradient-text leading-none mb-10"
            >
              THE STORM.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1 }}
              className="text-base sm:text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Built for control, power, and clean movement. Forge your discipline.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-sm sm:max-w-none"
            >
              <Link
                href="/products"
                className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-gray-100 transition-colors text-center"
              >
                Shop Now
              </Link>

              <Link
                href="#products"
                className="w-full sm:w-auto px-10 py-4 border border-white/30 text-white font-semibold uppercase tracking-widest text-sm hover:border-white hover:bg-white/5 transition-all text-center"
              >
                Explore
              </Link>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={hasEntered ? { opacity: 1 } : {}}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          >
            <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
          </motion.div>
        </section>

        {/* Premium Animated Products Section */}
        <PremiumProducts products={products} />

        {/* Creative Image Gallery Section */}
        <CreativeGallery />

        {/* Contact Section */}
        <ContactSection id="contact" theme="dark" />

        {/* Footer */}
        <Footer settings={settings} />
      </div>
    </main>
  );
}