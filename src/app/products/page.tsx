"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search, SlidersHorizontal } from "lucide-react";
import Footer from "@/components/public/Footer";

interface Product {
  _id: string; name: string; slug: string; price: number;
  discountPrice?: number; images: string[]; shortDescription: string;
  category?: { name: string; slug: string };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((d) => { setProducts(d.products || []); setLoading(false); });
    fetch("/api/settings").then((r) => r.json()).then((d) => setSettings(d.settings || {}));
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tighter">STORM</Link>
        <div className="flex gap-8 text-sm uppercase tracking-wider hidden md:flex">
          <Link href="/products" className="text-gray-900 font-semibold">Shop</Link>
          <Link href="/about" className="text-gray-500 hover:text-black transition-colors">About</Link>
          <Link href="/contact" className="text-gray-500 hover:text-black transition-colors">Contact</Link>
        </div>
        <Link href="/cart" aria-label="Cart"><ShoppingBag className="w-6 h-6 text-gray-700 hover:text-black transition-colors" /></Link>
      </nav>

      {/* Header */}
      <div className="bg-gray-50 py-16 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-heading tracking-tighter font-bold text-gray-900 mb-4">ALL PRODUCTS</h1>
        <p className="text-gray-500 text-lg">Premium calisthenics equipment by Storm Barz</p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-2xl mb-4" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No products available yet.</p>
            <Link href="/" className="text-gray-700 underline hover:text-black">Back to Home</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link href={`/products/${product.slug}`} key={product._id} className="group">
                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                    )}
                    {product.discountPrice && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">SALE</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
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
            ))}
          </div>
        )}
      </div>

      <Footer settings={settings} />
    </main>
  );
}
