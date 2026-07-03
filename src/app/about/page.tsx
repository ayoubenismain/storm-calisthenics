"use client";

import Link from "next/link";
import Footer from "@/components/public/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tighter">STORM</Link>
        <div className="flex gap-8 text-sm uppercase tracking-wider hidden md:flex">
          <Link href="/products" className="text-gray-500 hover:text-black transition-colors">Shop</Link>
          <Link href="/about" className="text-gray-900 font-semibold">About</Link>
          <Link href="/contact" className="text-gray-500 hover:text-black transition-colors">Contact</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter font-heading mb-8">THE STORM<br/>PHILOSOPHY</h1>
        <div className="space-y-8 text-lg text-gray-600 leading-relaxed">
          <p>
            Storm Barz was born from a simple realization: the calisthenics equipment market was saturated with flimsy, mass-produced tools that couldn&apos;t withstand the intensity of advanced street workout athletes.
          </p>
          <p>
            We believe that your equipment should never be the limiting factor in your progression. Whether you&apos;re fighting for your first full planche or mastering dynamic combos, you need a foundation you can trust blindly.
          </p>
          <p>
            That&apos;s why every Storm Barz product is engineered with obsessive attention to detail, using premium materials, and tested under extreme loads by professional athletes.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Built for Explosive Control</h2>
          <p>
            We don&apos;t just make parallettes; we build instruments for human flight. Become the storm.
          </p>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
