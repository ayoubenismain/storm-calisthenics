"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import Footer from "@/components/public/Footer";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">Order Confirmed!</h1>
      <p className="text-lg text-gray-500 max-w-md mx-auto mb-2">
        Thank you for choosing Storm Barz. Your order has been successfully placed and is now being processed.
      </p>
      
      {orderNumber && (
        <div className="bg-white px-6 py-4 rounded-xl border border-gray-200 mt-6 mb-10 shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">Order Number</p>
          <p className="text-2xl font-bold text-gray-900 font-mono">{orderNumber}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/products" className="bg-black text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/" className="bg-white text-black border border-gray-200 px-8 py-4 rounded-lg font-bold hover:bg-gray-50 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </main>
  );
}
