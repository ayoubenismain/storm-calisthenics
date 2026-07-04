"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EnterStormOverlay from "@/components/public/EnterStormOverlay";
import LightningEffect from "@/components/public/LightningEffect";

import Footer from "@/components/public/Footer";
import Link from "next/link";
import { ShoppingBag, Mail, Phone, MapPin, Send } from "lucide-react";

interface Product {
  _id: string; name: string; slug: string; price: number;
  discountPrice?: number; images: string[]; description: string;
}

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    fetch("/api/products?limit=6").then((r) => r.json()).then((d) => setProducts(d.products || [])).catch(() => {});
    fetch("/api/settings").then((r) => r.json()).then((d) => setSettings(d.settings || {})).catch(() => {});
  }, []);

  return (
    <main className="relative min-h-screen bg-storm-dark text-white overflow-hidden">
      {!hasEntered && <EnterStormOverlay onEnter={() => setHasEntered(true)} />}

      <div className={`transition-opacity duration-1000 ${hasEntered ? "opacity-100" : "opacity-0"}`}>
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-40 px-6 py-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
          <div className="text-2xl font-bold tracking-tighter font-heading text-white">STORM</div>
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-wider">
            <Link href="/products" className="text-white/70 hover:text-white transition-colors">Shop</Link>
            <Link href="#products" className="text-white/70 hover:text-white transition-colors">Products</Link>
            <Link href="#contact" className="text-white/70 hover:text-white transition-colors">Contact</Link>
          </div>
          <Link href="/cart" className="relative text-white/70 hover:text-white transition-colors" aria-label="Cart">
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
          <LightningEffect isActive={hasEntered} />

          {/* Background */}
          <div className="absolute inset-0 z-0">
            <picture>
              <source media="(max-width: 768px)" srcSet="/mobile_bg.png" type="image/png" />
              <source media="(min-width: 769px)" srcSet="/desktop_bg.png" type="image/png" />
              <img src="/desktop_bg.png" alt="Storm Background" className="w-full h-full object-cover object-center opacity-70" />
            </picture>
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
              <Link href="/products" className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-gray-100 transition-colors text-center">
                Shop Now
              </Link>
              <Link href="#products" className="w-full sm:w-auto px-10 py-4 border border-white/30 text-white font-semibold uppercase tracking-widest text-sm hover:border-white hover:bg-white/5 transition-all text-center">
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

        {/* Products Section - White Background */}
        <section id="products" className="bg-white text-black py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-heading tracking-tighter font-bold text-gray-900 mb-4">
                BUILT FOR EXPLOSIVE CONTROL
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Premium calisthenics equipment designed for athletes who demand more.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.length > 0 ? products.map((product) => (
                <Link href={`/products/${product.slug}`} key={product._id} className="group">
                  <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No Image</div>
                      )}
                      {product.discountPrice && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          SALE
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-3">
                        {product.discountPrice ? (
                          <>
                            <span className="text-xl font-bold text-gray-900">{product.discountPrice} TND</span>
                            <span className="text-sm text-gray-400 line-through">{product.price} TND</span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-gray-900">{product.price} TND</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )) : (
                /* Placeholder products when DB is empty */
                [1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                    <div className="aspect-square bg-gray-200 animate-pulse" />
                    <div className="p-6 space-y-3">
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-center mt-12">
              <Link href="/products" className="inline-block px-8 py-4 bg-gray-900 text-white font-semibold uppercase tracking-wider hover:bg-gray-700 transition-colors rounded-lg">
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section - White Background */}
        <section id="contact" className="bg-gray-50 text-black py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading tracking-tighter font-bold text-gray-900 mb-4">
                GET IN TOUCH
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Questions about our products? Want to collaborate? We&apos;d love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Email</h3>
                    <p className="text-gray-500">{settings.contactEmail || "contact@stormbarz.com"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Phone</h3>
                    <p className="text-gray-500">{settings.contactPhone || "+216 XX XXX XXX"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Location</h3>
                    <p className="text-gray-500">{settings.contactAddress || "Tunisia"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Message sent! We will get back to you."); setContactForm({ name: "", email: "", message: "" }); }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none"
                      placeholder="Your message..."
                    />
                  </div>
                  <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer settings={settings} />
      </div>
    </main>
  );
}
