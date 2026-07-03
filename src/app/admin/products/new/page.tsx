"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";

interface Category { _id: string; name: string; }


export default function NewProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);

  const [form, setForm] = useState({
    name: "", slug: "", category: "",
    description: "", price: "", discountPrice: "", stock: "0",
    status: "active", featured: false,
    images: [] as string[],
  });

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then((d) => setCategories(d.categories || []));
  }, []);

  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data = await res.json();
      if (data.asset?.url) uploaded.push(data.asset.url);
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
    setUploadingImages(false);
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        ...form,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
        stock: parseInt(form.stock),
      };
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to save");
      else router.push("/admin/products");
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const input = "w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#ff6b00] transition-colors placeholder:text-white/20";
  const label = "block text-xs text-white/40 uppercase tracking-wider mb-2";

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-white">Add Product</h1>
          <p className="text-white/40 text-sm">Create a new product listing</p>
        </div>
      </div>

      {error && <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="bg-white/3 border border-white/5 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Basic Info</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={label}>Product Name</label>
              <input className={input} value={form.name} onChange={(e) => {
                const name = e.target.value;
                const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                setForm((p) => ({ ...p, name, slug }));
              }} required placeholder="Storm Premium Parallettes" />
            </div>
            <div>
              <label className={label}>Slug</label>
              <input className={input} value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required placeholder="storm-premium-parallettes" />
            </div>
          </div>
          <div>
            <label className={label}>Category</label>
            <div className="relative">
              <select className={input + " appearance-none"} value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} required>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div>
            <label className={label}>Description</label>
            <textarea rows={5} className={input + " resize-none"} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required />
          </div>
        </section>

        {/* Pricing & Stock */}
        <section className="bg-white/3 border border-white/5 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Pricing & Inventory</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={label}>Price (TND)</label>
              <input className={input} type="number" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
            </div>
            <div>
              <label className={label}>Discount Price (TND)</label>
              <input className={input} type="number" step="0.01" value={form.discountPrice} onChange={(e) => setForm((p) => ({ ...p, discountPrice: e.target.value }))} placeholder="Optional" />
            </div>
            <div>
              <label className={label}>Stock</label>
              <input className={input} type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} required />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <label className={label}>Status</label>
              <div className="relative">
                <select className={input + " appearance-none"} value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="hidden">Hidden</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/40">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer mt-4">
              <input type="checkbox" className="w-4 h-4 accent-white" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} />
              <span className="text-white/70 text-sm">Featured Product ⚡</span>
            </label>
          </div>
        </section>

        {/* Images */}
        <section className="bg-white/3 border border-white/5 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Product Images</h2>
          <div className="flex flex-wrap gap-3">
            {form.images.map((url, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded overflow-hidden border border-white/10">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            <label className="w-20 h-20 rounded border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors">
              <Upload className="w-5 h-5 text-white/40" />
              <span className="text-[10px] text-white/30 mt-1">{uploadingImages ? "..." : "Upload"}</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleImageUpload(e.target.files)} />
            </label>
          </div>
        </section>



        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="px-8 py-3 border border-[#ff6b00] bg-[#ff6b00]/10 text-[#ff6b00] font-semibold rounded hover:bg-[#ff6b00] hover:text-white transition-colors disabled:opacity-50 text-sm uppercase tracking-wider">
            {saving ? "Saving..." : "Save Product"}
          </button>
          <Link href="/admin/products" className="px-8 py-3 bg-white/5 border border-white/10 text-white/60 rounded hover:bg-white/10 transition-colors text-sm uppercase tracking-wider">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
