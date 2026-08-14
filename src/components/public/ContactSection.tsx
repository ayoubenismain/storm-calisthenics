"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";

interface ContactSectionProps {
  id?: string;
  className?: string;
  theme?: "dark" | "light";
}

export default function ContactSection({
  id = "contact",
  className = "",
  theme = "dark",
}: ContactSectionProps) {
  const [settings, setSettings] = useState<any>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || {}))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send message.");
      }

      setSuccess(
        data.message || "Message sent successfully! We will get back to you shortly."
      );
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <section
      id={id}
      className={`relative py-24 px-6 overflow-hidden ${
        isDark ? "bg-[#0a0a0c] text-white" : "bg-gray-50 text-gray-900"
      } ${className}`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5" />
            STORM Direct Channel
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-4xl md:text-5xl font-extrabold tracking-tighter uppercase font-heading ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            GET IN TOUCH
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={isDark ? "text-white/60 text-lg" : "text-gray-600 text-lg"}
          >
            Questions about our parallettes, customized gear, or orders?
            Send us a message and our performance team will assist you.
          </motion.p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Contact Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`lg:col-span-5 p-8 md:p-10 rounded-2xl border ${
              isDark
                ? "bg-white/[0.03] border-white/10 backdrop-blur-xl"
                : "bg-white border-gray-200 shadow-xl shadow-gray-200/50"
            } space-y-8`}
          >
            <div>
              <h3 className={`text-2xl font-bold tracking-tight mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Contact Information
              </h3>
              <p className={isDark ? "text-white/50 text-sm" : "text-gray-500 text-sm"}>
                Reach out to us directly or drop your details on the form.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    isDark
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "bg-gray-900 text-white"
                  }`}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-white/40" : "text-gray-400"
                  }`}>
                    Email Address
                  </h4>
                  <a
                    href={`mailto:${settings.contactEmail || "contact@stormbarz.com"}`}
                    className={`text-base font-semibold transition-colors ${
                      isDark
                        ? "text-white hover:text-blue-400"
                        : "text-gray-900 hover:text-blue-600"
                    }`}
                  >
                    {settings.contactEmail || "contact@stormbarz.com"}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 group">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    isDark
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "bg-gray-900 text-white"
                  }`}
                >
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-white/40" : "text-gray-400"
                  }`}>
                    Phone Support
                  </h4>
                  <a
                    href={`tel:${settings.contactPhone || "+216 XX XXX XXX"}`}
                    className={`text-base font-semibold transition-colors ${
                      isDark
                        ? "text-white hover:text-blue-400"
                        : "text-gray-900 hover:text-blue-600"
                    }`}
                  >
                    {settings.contactPhone || "+216 XX XXX XXX"}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 group">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    isDark
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "bg-gray-900 text-white"
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-white/40" : "text-gray-400"
                  }`}>
                    Headquarters
                  </h4>
                  <p className={`text-base font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                    {settings.contactAddress || "Tunisia"}
                  </p>
                </div>
              </div>
            </div>

            {/* Response Time Guarantee Box */}
            <div
              className={`p-4 rounded-xl border flex items-center gap-3.5 ${
                isDark
                  ? "bg-blue-950/30 border-blue-500/20 text-blue-200"
                  : "bg-blue-50 border-blue-200 text-blue-900"
              }`}
            >
              <Clock className="w-5 h-5 shrink-0 text-blue-400" />
              <div className="text-xs leading-relaxed">
                <span className="font-bold">Fast Response Guarantee:</span> Our team
                typically responds to inquiries within 12–24 business hours.
              </div>
            </div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`lg:col-span-7 p-8 md:p-10 rounded-2xl border ${
              isDark
                ? "bg-white/[0.03] border-white/10 backdrop-blur-xl"
                : "bg-white border-gray-200 shadow-xl shadow-gray-200/50"
            }`}
          >
            <h3 className={`text-2xl font-bold tracking-tight mb-6 ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Send a Message
            </h3>

            {/* Success Feedback Alert */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-start gap-3 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Message Delivered!</p>
                    <p className="text-emerald-400/90 text-xs mt-0.5">{success}</p>
                  </div>
                </motion.div>
              )}

              {/* Error Feedback Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-start gap-3 text-sm"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Submission Failed</p>
                    <p className="text-rose-400/90 text-xs mt-0.5">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDark ? "text-white/60" : "text-gray-700"
                  }`}>
                    Full Name <span className="text-blue-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="John Doe"
                    className={`w-full px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none ${
                      isDark
                        ? "bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-blue-500 focus:bg-white/[0.08]"
                        : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:bg-white"
                    }`}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDark ? "text-white/60" : "text-gray-700"
                  }`}>
                    Email Address <span className="text-blue-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none ${
                      isDark
                        ? "bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-blue-500 focus:bg-white/[0.08]"
                        : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Phone Number */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDark ? "text-white/60" : "text-gray-700"
                  }`}>
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="+216 12 345 678"
                    className={`w-full px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none ${
                      isDark
                        ? "bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-blue-500 focus:bg-white/[0.08]"
                        : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:bg-white"
                    }`}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDark ? "text-white/60" : "text-gray-700"
                  }`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, subject: e.target.value }))
                    }
                    placeholder="Order inquiry, Product question..."
                    className={`w-full px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none ${
                      isDark
                        ? "bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-blue-500 focus:bg-white/[0.08]"
                        : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                  isDark ? "text-white/60" : "text-gray-700"
                }`}>
                  Message <span className="text-blue-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  placeholder="How can we help you? Describe your question or request..."
                  className={`w-full px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none resize-none ${
                    isDark
                      ? "bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-blue-500 focus:bg-white/[0.08]"
                      : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:bg-white"
                  }`}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg ${
                  loading
                    ? "opacity-75 cursor-wait"
                    : "hover:scale-[1.01] active:scale-[0.99]"
                } ${
                  isDark
                    ? "bg-white text-black hover:bg-gray-100 shadow-white/10"
                    : "bg-gray-900 text-white hover:bg-black shadow-gray-900/20"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>SENDING MESSAGE...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SEND MESSAGE</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
