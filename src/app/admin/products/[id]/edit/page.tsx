"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import Link from "next/link";

interface Category { _id: string; name: string; }
interface Spec { label: string; value: string; }

const TRAINING_MODES = ["Planche", "L-sit", "Handstand", "Push-up", "Dips", "Mobility"];

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);

  const [form, setForm] = useState({
    name: "", slug: "", category: "", shortDescription: "",
    description: "", price: "", discountPrice: "", stock: "0",
    status: "active", featured: false,
    images: [] as string[], videoUrl: "", model3dUrl: "",
    trainingModes: [] as string[], sceneStyle: "Dark",
    seoTitle: "", seoDescription: "",
    specs: [] as Spec[],
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch(`/api/admin/products/${id}`).then((r) => r.json()),
    ]).then(([catData, prodData]) => {
      setCategories(catData.categories || []);
      const p = prodData.product;
      if (p) {
        setForm({
          name: p.name || "", slug: p.slug || "",
          category: p.category?._id || p.category || "",
          shortDescription: p.shortDescription || "",
          description: p.description || "",
          price: String(p.price || ""), discountPrice: String(p.discountPrice || ""),
          stock: String(p.stock || "0"), status: p.status || "active",
          featured: p.featured || false, images: p.images || [],
          videoUrl: p.videoUrl || "", model3dUrl: p.model3dUrl || "",
          trainingModes: p.trainingModes || [], sceneStyle: p.sceneStyle || "Dark",
          seoTitle: p.seoTitle || "", seoDescription: p.seoDescription || "",
          specs: p.specs || [],
        });
      }
      setLoading(false);
    });
  }, [id]);

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

  const toggleMode = (mode: string) => {
    setForm((prev) => ({
      ...prev,
      trainingModes: prev.trainingModes.includes(mode)
        ? prev.trainingModes.filter((m) => m !== mode)
        : [...prev.trainingModes, mode],
    }));
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
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to save");
      else router.push("/admin/products");
    } catch { setError("Network error"); }
    finally { setSaving(false); }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20";
  const labelCls = "block text-xs text-white/40 uppercase tracking-wider mb-2";

  if (loading) return <div className="p-8 text-white/40 text-sm">Loading product...</div>;

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-white/40 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-white">Edit Product</h1>
          <p className="text-white/40 text-sm">{form.name}</p>
        </div>
      </div>

      {error && <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white/3 border border-white/5 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Basic Info</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Product Name</label>
              <input className={inputCls} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input className={inputCls} value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select className={inputCls} value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Short Description</label>
            <input className={inputCls} value={form.shortDescription} onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Full Description</label>
            <textarea rows={5} className={inputCls + " resize-none"} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
        </section>

        <section className="bg-white/3 border border-white/5 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Pricing & Inventory</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Price (TND)</label>
              <input className={inputCls} type="number" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
            </div>
            <div>
              <label className={labelCls}>Discount Price</label>
              <input className={inputCls} type="number" step="0.01" value={form.discountPrice} onChange={(e) => setForm((p) => ({ ...p, discountPrice: e.target.value }))} placeholder="Optional" />
            </div>
            <div>
              <label className={labelCls}>Stock</label>
              <input className={inputCls} type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer mt-4">
              <input type="checkbox" className="w-4 h-4 accent-white" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} />
              <span className="text-white/70 text-sm">Featured ⚡</span>
            </label>
          </div>
        </section>

        <section className="bg-white/3 border border-white/5 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Product Images</h2>
          <div className="flex flex-wrap gap-3">
            {form.images.map((url, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded overflow-hidden border border-white/10">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
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

        <section className="bg-white/3 border border-white/5 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Training Modes</h2>
          <div className="flex flex-wrap gap-2">
            {TRAINING_MODES.map((mode) => (
              <button key={mode} type="button" onClick={() => toggleMode(mode)}
                className={`px-4 py-2 rounded text-sm border transition-all ${form.trainingModes.includes(mode) ? "bg-white text-black border-white" : "bg-white/5 text-white/50 border-white/10 hover:border-white/30"}`}>
                {mode}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white/3 border border-white/5 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Specifications</h2>
            <button type="button" onClick={() => setForm((p) => ({ ...p, specs: [...p.specs, { label: "", value: "" }] }))} className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {form.specs.map((spec, idx) => (
              <div key={idx} className="flex gap-3">
                <input className={inputCls} placeholder="Label" value={spec.label} onChange={(e) => {
                  const specs = [...form.specs]; specs[idx].label = e.target.value; setForm((p) => ({ ...p, specs }));
                }} />
                <input className={inputCls} placeholder="Value" value={spec.value} onChange={(e) => {
                  const specs = [...form.specs]; specs[idx].value = e.target.value; setForm((p) => ({ ...p, specs }));
                }} />
                <button type="button" onClick={() => setForm((p) => ({ ...p, specs: p.specs.filter((_, i) => i !== idx) }))} className="text-white/30 hover:text-red-400 transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="px-8 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm uppercase tracking-wider">
            {saving ? "Saving..." : "Update Product"}
          </button>
          <Link href="/admin/products" className="px-8 py-3 bg-white/5 border border-white/10 text-white/60 rounded hover:bg-white/10 transition-colors text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
