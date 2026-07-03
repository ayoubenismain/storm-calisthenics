"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const deliveryFee = 8;
  const total = subtotal + deliveryFee;

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    paymentMethod: "cod"
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 text-black flex flex-col items-center justify-center p-6">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">You need items in your cart to proceed to checkout.</p>
        <Link href="/products" className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
          Browse Products
        </Link>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map(i => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image
          }))
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");

      clearCart();
      router.push(`/checkout/success?order=${data.orderNumber}`);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all";
  const labelCls = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-12">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">{error}</div>}

              <section>
                <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Full Name *</label>
                    <input required className={inputCls} value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} placeholder="John Doe" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Phone Number *</label>
                      <input required className={inputCls} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="216 XX XXX XXX" />
                    </div>
                    <div>
                      <label className={labelCls}>Email (Optional)</label>
                      <input type="email" className={inputCls} value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-6">Delivery Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>City *</label>
                    <input required className={inputCls} value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="Tunis" />
                  </div>
                  <div>
                    <label className={labelCls}>Full Address *</label>
                    <input required className={inputCls} value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Street name, building, apartment..." />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                <div className="border border-gray-200 rounded-lg p-4 bg-white flex items-center gap-3">
                  <input type="radio" id="cod" name="payment" checked readOnly className="w-4 h-4 text-black focus:ring-black accent-black" />
                  <label htmlFor="cod" className="font-medium">Cash on Delivery</label>
                </div>
                <p className="text-sm text-gray-500 mt-2">Pay in cash when your order is delivered to your address.</p>
              </section>

              <button type="submit" disabled={submitting} className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : `Place Order • ${total.toFixed(0)} TND`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm leading-tight text-gray-900">{item.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm text-gray-900">{(item.price * item.quantity).toFixed(0)} TND</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(0)} TND</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee.toFixed(0)} TND</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>{total.toFixed(0)} TND</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
