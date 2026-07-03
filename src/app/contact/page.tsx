"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Footer from "@/components/public/Footer";

export default function ContactPage() {
  const [settings, setSettings] = useState<any>({});
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => setSettings(d.settings || {}));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tighter">STORM</Link>
        <div className="flex gap-8 text-sm uppercase tracking-wider hidden md:flex">
          <Link href="/products" className="text-gray-500 hover:text-black transition-colors">Shop</Link>
          <Link href="/about" className="text-gray-500 hover:text-black transition-colors">About</Link>
          <Link href="/contact" className="text-gray-900 font-semibold">Contact</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading tracking-tighter font-bold text-gray-900 mb-4">
            GET IN TOUCH
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Questions about our products? Want to collaborate? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
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
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Message sent! We will get back to you."); setForm({ name: "", email: "", message: "" }); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows={4} required value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none" placeholder="Your message..." />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-lg">
                <Send className="w-5 h-5" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer settings={settings} />
    </main>
  );
}
