"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  stock: number;
  status: string;
  featured: boolean;
  images: string[];
  category?: { name: string };
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    fetch(`/api/admin/products?${params}`)
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false); });
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const STATUS_COLORS: Record<string, string> = {
    active: "text-green-400",
    draft: "text-yellow-400",
    hidden: "text-white/30",
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-white">Products</h1>
          <p className="text-white/40 text-sm">{products.length} products in database</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded hover:bg-gray-200 transition-colors w-fit">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
        />
      </div>

      {/* Table */}
      <div className="bg-white/3 border border-white/5 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/30 text-sm">Loading...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No products found</p>
            <Link href="/admin/products/new" className="mt-4 inline-block text-white/60 hover:text-white text-sm underline transition-colors">Add your first product</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-xs text-white/40 uppercase tracking-wider font-medium">Product</th>
                  <th className="text-left p-4 text-xs text-white/40 uppercase tracking-wider font-medium hidden md:table-cell">Category</th>
                  <th className="text-left p-4 text-xs text-white/40 uppercase tracking-wider font-medium">Price</th>
                  <th className="text-left p-4 text-xs text-white/40 uppercase tracking-wider font-medium hidden sm:table-cell">Stock</th>
                  <th className="text-left p-4 text-xs text-white/40 uppercase tracking-wider font-medium hidden sm:table-cell">Status</th>
                  <th className="text-right p-4 text-xs text-white/40 uppercase tracking-wider font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-white/5 border border-white/10 overflow-hidden shrink-0">
                          {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{p.name}</p>
                          {p.featured && <span className="text-[10px] text-yellow-400">⚡ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-white/50 text-sm">{p.category?.name || "—"}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        {p.discountPrice ? (
                          <>
                            <p className="text-white text-sm font-medium">{p.discountPrice} TND</p>
                            <p className="text-white/30 text-xs line-through">{p.price} TND</p>
                          </>
                        ) : (
                          <p className="text-white text-sm">{p.price} TND</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`text-sm ${p.stock < 5 ? "text-orange-400" : "text-white/60"}`}>{p.stock}</span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`text-xs capitalize ${STATUS_COLORS[p.status] || "text-white/40"}`}>{p.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${p._id}/edit`} className="p-2 rounded hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(p._id)} className="p-2 rounded hover:bg-red-500/10 transition-colors text-white/50 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
