"use client";

import { useEffect, useState } from "react";
import { Save, Check } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => { setSettings(d.settings || {}); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const update = (key: string, value: any) => setSettings((s: any) => ({ ...s, [key]: value }));

  const inputCls = "w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#ff6b00] transition-colors placeholder:text-white/20";
  const labelCls = "block text-xs text-white/40 uppercase tracking-wider mb-2";

  if (loading) return <div className="p-8 text-white/40 text-sm">Loading settings...</div>;

  return (
    <div className="p-6 md:p-8 w-full space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-white">Settings</h1>
          <p className="text-white/40 text-sm">Configure your Storm Barz store</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 border border-[#ff6b00] bg-[#ff6b00]/10 text-[#ff6b00] text-sm font-semibold rounded hover:bg-[#ff6b00] hover:text-white transition-colors disabled:opacity-50">
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
      </div>

      {/* Store Info */}
      <section className="bg-white/3 border border-white/5 rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Store Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Store Name</label>
            <input className={inputCls} value={settings.storeName || ""} onChange={(e) => update("storeName", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Currency</label>
            <input className={inputCls} value={settings.currency || ""} onChange={(e) => update("currency", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Delivery Fee ({settings.currency || "TND"})</label>
          <input className={inputCls} type="number" step="0.01" value={settings.deliveryFee ?? ""} onChange={(e) => update("deliveryFee", parseFloat(e.target.value))} />
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white/3 border border-white/5 rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Contact Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Contact Email</label>
            <input className={inputCls} type="email" value={settings.contactEmail || ""} onChange={(e) => update("contactEmail", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Contact Phone</label>
            <input className={inputCls} value={settings.contactPhone || ""} onChange={(e) => update("contactPhone", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Address</label>
          <input className={inputCls} value={settings.contactAddress || ""} onChange={(e) => update("contactAddress", e.target.value)} />
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-white/3 border border-white/5 rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Social Links</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Instagram</label>
            <input className={inputCls} value={settings.socialInstagram || ""} onChange={(e) => update("socialInstagram", e.target.value)} placeholder="https://instagram.com/storm.barz" />
          </div>
          <div>
            <label className={labelCls}>Facebook</label>
            <input className={inputCls} value={settings.socialFacebook || ""} onChange={(e) => update("socialFacebook", e.target.value)} placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label className={labelCls}>TikTok</label>
            <input className={inputCls} value={settings.socialTiktok || ""} onChange={(e) => update("socialTiktok", e.target.value)} placeholder="https://tiktok.com/@..." />
          </div>
          <div>
            <label className={labelCls}>YouTube</label>
            <input className={inputCls} value={settings.socialYoutube || ""} onChange={(e) => update("socialYoutube", e.target.value)} placeholder="https://youtube.com/..." />
          </div>
        </div>
      </section>

      {/* Homepage */}
      <section className="bg-white/3 border border-white/5 rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Homepage Content</h2>
        <div>
          <label className={labelCls}>Hero Title</label>
          <input className={inputCls} value={settings.heroTitle || ""} onChange={(e) => update("heroTitle", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Hero Subtitle</label>
          <input className={inputCls} value={settings.heroSubtitle || ""} onChange={(e) => update("heroSubtitle", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Hero CTA Button Text</label>
          <input className={inputCls} value={settings.heroCtaPrimary || ""} onChange={(e) => update("heroCtaPrimary", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Footer Tagline</label>
          <input className={inputCls} value={settings.footerTagline || ""} onChange={(e) => update("footerTagline", e.target.value)} />
        </div>
      </section>


      {/* Storm Effects */}
      <section className="bg-white/3 border border-white/5 rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Storm Effects</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Storm Intensity</label>
            <div className="relative">
              <select className={inputCls + " appearance-none"} value={settings.stormIntensity || "heavy"} onChange={(e) => update("stormIntensity", e.target.value)}>
                <option value="calm">Calm</option>
                <option value="heavy">Heavy</option>
                <option value="thunder">Thunder Mode</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div>
            <label className={labelCls}>Homepage Mood</label>
            <div className="relative">
              <select className={inputCls + " appearance-none"} value={settings.homepageMood || "blue-thunder"} onChange={(e) => update("homepageMood", e.target.value)}>
                <option value="dark-metal">Dark Metal</option>
                <option value="blue-thunder">Blue Thunder</option>
                <option value="smoke-arena">Smoke Arena</option>
                <option value="minimal-luxury">Minimal Luxury</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          {[
            { key: "lightningEnabled", label: "Lightning Effects" },
            { key: "rainEnabled", label: "Rain Particles" },
            { key: "smokeEnabled", label: "Smoke Overlay" },
            { key: "defaultSoundEnabled", label: "Sound Effects" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-white" checked={settings[key] || false} onChange={(e) => update(key, e.target.checked)} />
              <span className="text-white/70 text-sm">{label}</span>
            </label>
          ))}
        </div>
      </section>

      <button onClick={handleSave} disabled={saving} className="px-8 py-3 border border-[#ff6b00] bg-[#ff6b00]/10 text-[#ff6b00] font-semibold rounded hover:bg-[#ff6b00] hover:text-white transition-colors disabled:opacity-50 text-sm uppercase tracking-wider">
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save All Settings"}
      </button>
    </div>
  );
}
