"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Category { _id: string; name: string; slug: string; status: string; }

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", slug: "", description: "", status: "active" });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch("/api/admin/categories").then((r) => r.json()).then((d) => { setCategories(d.categories || []); setLoading(false); });
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ name: "", slug: "", description: "", status: "active" }); setEditId(null); setShowForm(false); };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, description: "", status: cat.status });
    setEditId(cat._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editId ? `/api/admin/categories/${editId}` : "/api/admin/categories";
    const method = editId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    await load();
    resetForm();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c._id !== id));
  };

  const inputCls = "w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#ff6b00] transition-colors placeholder:text-white/20";

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-white">Categories</h1>
          <p className="text-white/40 text-sm">{categories.length} categories</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 border border-[#ff6b00] bg-[#ff6b00]/10 text-[#ff6b00] text-sm font-semibold rounded hover:bg-[#ff6b00] hover:text-white transition-colors">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white/3 border border-white/5 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">{editId ? "Edit Category" : "New Category"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Name</label>
                <input className={inputCls} value={form.name} onChange={(e) => {
                  const name = e.target.value;
                  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                  setForm((p) => ({ ...p, name, slug }));
                }} required placeholder="Parallettes" />
              </div>
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Slug</label>
                <input className={inputCls} value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required placeholder="parallettes" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Status</label>
              <div className="relative">
              <select className={inputCls + " appearance-none"} value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="px-6 py-2 border border-[#ff6b00] bg-[#ff6b00]/10 text-[#ff6b00] text-sm font-semibold rounded hover:bg-[#ff6b00] hover:text-white transition-colors disabled:opacity-50">
                {saving ? "Saving..." : editId ? "Update" : "Create"}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2 bg-white/5 border border-white/10 text-white/60 text-sm rounded hover:bg-white/10 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white/3 border border-white/5 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/30 text-sm">Loading...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-xs text-white/40 uppercase tracking-wider font-medium">Name</th>
                <th className="text-left p-4 text-xs text-white/40 uppercase tracking-wider font-medium hidden md:table-cell">Slug</th>
                <th className="text-left p-4 text-xs text-white/40 uppercase tracking-wider font-medium">Status</th>
                <th className="text-right p-4 text-xs text-white/40 uppercase tracking-wider font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((c) => (
                <tr key={c._id} className="hover:bg-white/2 transition-colors">
                  <td className="p-4 text-white text-sm font-medium">{c.name}</td>
                  <td className="p-4 hidden md:table-cell text-white/40 text-sm">{c.slug}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded ${c.status === "active" ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(c)} className="p-2 rounded hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c._id)} className="p-2 rounded hover:bg-red-500/10 transition-colors text-white/50 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
