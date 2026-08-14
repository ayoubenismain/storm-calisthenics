"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import ContactSection from "@/components/public/ContactSection";
import Footer from "@/components/public/Footer";

export default function ContactPage() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || {}))
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white selection:bg-blue-500 selection:text-white">
      {/* Header / Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tighter font-heading text-white">
          STORM
        </Link>
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-wider">
          <Link href="/products" className="text-white/70 hover:text-white transition-colors">
            Shop
          </Link>
          <Link href="/about" className="text-white/70 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-white font-semibold border-b-2 border-white pb-0.5">
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

      {/* Main Contact Section */}
      <ContactSection theme="dark" className="pt-12 pb-24" />

      {/* Footer */}
      <Footer settings={settings} />
    </main>
  );
}
