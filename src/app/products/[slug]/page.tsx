"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, ChevronLeft, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Footer from "@/components/public/Footer";

interface Product {
  _id: string; name: string; slug: string; price: number;
  discountPrice?: number; images: string[]; shortDescription: string;
  description: string; stock: number;
  specs: { label: string; value: string }[];
  trainingModes: string[];
  category?: { name: string };
}

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch(`/api/products/${slug}`).then((r) => r.json()).then((d) => { setProduct(d.product || null); setLoading(false); });
    fetch("/api/settings").then((r) => r.json()).then((d) => setSettings(d.settings || {}));
  }, [slug]);

  const handleAdd = () => {
    if (!product) return;
    addItem({
      id: product._id,
      productId: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity: qty,
      image: product.images?.[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center text-gray-400">Loading product...</div>
  );

  if (!product) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-lg">Product not found</p>
      <Link href="/products" className="text-gray-700 underline">Back to products</Link>
    </div>
  );

  const price = product.discountPrice || product.price;

  return (
    <main className="min-h-screen bg-white text-black">
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tighter">STORM</Link>
        <Link href="/cart" aria-label="Cart"><ShoppingBag className="w-6 h-6 text-gray-700" /></Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-black text-sm mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> All Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 mb-4">
              {product.images?.[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? "border-gray-900" : "border-gray-200"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {product.category && <p className="text-sm text-gray-400 uppercase tracking-widest">{product.category.name}</p>}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">{price} TND</span>
              {product.discountPrice && (
                <span className="text-lg text-gray-400 line-through">{product.price} TND</span>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {product.stock > 0 ? (
              <p className="text-green-600 text-sm font-medium">✓ In Stock ({product.stock} available)</p>
            ) : (
              <p className="text-red-500 text-sm font-medium">Out of Stock</p>
            )}

            {/* Qty & Add */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="w-12 text-center font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={handleAdd} disabled={product.stock === 0 || added}
                className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {added ? <><Check className="w-4 h-4" /> Added!</> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>}
              </button>
            </div>

            {/* Training Modes */}
            {product.trainingModes?.length > 0 && (
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Training Modes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.trainingModes.map((mode) => (
                    <span key={mode} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">{mode}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Specs */}
            {product.specs?.length > 0 && (
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Specifications</h3>
                <div className="space-y-2">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500 text-sm">{spec.label}</span>
                      <span className="text-gray-900 text-sm font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer settings={settings} />
    </main>
  );
}
