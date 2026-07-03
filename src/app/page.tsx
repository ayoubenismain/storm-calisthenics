"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EnterStormOverlay from "@/components/public/EnterStormOverlay";
import LightningEffect from "@/components/public/LightningEffect";
import ProductViewer from "@/components/3d/ProductViewer";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { ShoppingBag, Mail, Phone, MapPin, Send } from "lucide-react";

interface Product {
  _id: string; name: string; slug: string; price: number;
  discountPrice?: number; images: string[]; shortDescription: string;
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
        <nav className="fixed top-0 w-full z-40 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
          <div className="text-2xl font-bold tracking-tighter font-heading">STORM</div>
          <div className="flex gap-8 text-sm uppercase tracking-wider hidden md:flex">
            <Link href="/products" className="hover:text-storm-metal transition-colors">Parallettes</Link>
            <Link href="/drops" className="hover:text-storm-metal transition-colors">Drops</Link>
            <Link href="/about" className="hover:text-storm-metal transition-colors">About</Link>
            <Link href="/contact" className="hover:text-storm-metal transition-colors">Contact</Link>
          </div>
          <Link href="/cart" className="relative hover:text-storm-metal transition-colors" aria-label="Cart">
            <ShoppingBag className="w-6 h-6" />
          </Link>
        </nav>

        {/* Hero Section */}
        <section className="relative h-screen flex flex-col md:flex-row justify-center items-center overflow-hidden">
          <LightningEffect isActive={hasEntered} />

          <div className="absolute inset-0 z-0">
            <picture>
              <source media="(max-width: 768px)" srcSet="/mobile_bg.png" />
              <img src="/desktop_bg.png" alt="Storm Background" className="w-full h-full object-cover opacity-60" />
            </picture>
            <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
          </div>

          <div className="relative z-10 w-full px-6 md:px-12 lg:px-0 max-w-[100rem] mx-auto flex flex-col md:flex-row items-center mt-20">
            <div className="w-full md:w-5/12 lg:w-1/2 text-left pt-20 md:pt-0 relative z-30 lg:pl-40">
              <motion.h1
                initial={{ x: -50, opacity: 0 }}
                animate={hasEntered ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 font-heading storm-gradient-text leading-tight"
              >
                BECOME <br /> THE STORM.
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={hasEntered ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-lg md:text-2xl text-storm-metal mb-12 max-w-lg"
              >
                Premium parallettes built for control, power, and clean movement. Master your body.
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={hasEntered ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-6 items-start"
              >
                <Link href="/products" className="px-8 py-4 bg-white text-black font-semibold uppercase tracking-wider hover:bg-gray-200 transition-colors w-full sm:w-auto text-center">
                  Shop Parallettes
                </Link>
              </motion.div>
            </div>

            <div className="w-full md:w-7/12 lg:w-1/2 flex justify-end items-center mt-12 md:-mt-32 z-20 md:translate-x-16 lg:translate-x-32" id="explore">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={hasEntered ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.5, delay: 1.2 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <ProductViewer />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Products Section - White Background */}
        <section className="bg-white text-black py-24 px-6">
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
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.shortDescription}</p>
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
        <section className="bg-gray-50 text-black py-24 px-6">
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
