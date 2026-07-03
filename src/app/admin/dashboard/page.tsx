"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingCart, TrendingUp, AlertTriangle, Plus, Zap } from "lucide-react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStock: { _id: string; name: string; stock: number; images: string[] }[];
  latestOrders: { _id: string; orderNumber: string; customerName: string; total: number; orderStatus: string; createdAt: string }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  processing: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  shipped: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  delivered: "bg-green-500/20 text-green-300 border border-green-500/30",
  cancelled: "bg-red-500/20 text-red-300 border border-red-500/30",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 flex items-center gap-3 text-white/40">
      <Zap className="w-5 h-5 animate-pulse" /> Loading control room data...
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-white">Storm Overview</h1>
          <p className="text-white/40 text-sm mt-1">Your real-time control room</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2 border border-[#ff6b00] bg-[#ff6b00]/10 text-[#ff6b00] text-sm font-semibold rounded hover:bg-[#ff6b00] hover:text-white transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: stats?.totalProducts ?? 0, icon: Package, color: "text-blue-400" },
          { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: ShoppingCart, color: "text-purple-400" },
          { label: "Pending Orders", value: stats?.pendingOrders ?? 0, icon: AlertTriangle, color: "text-yellow-400" },
          { label: "Total Revenue", value: `${(stats?.totalRevenue ?? 0).toFixed(0)} TND`, icon: TrendingUp, color: "text-green-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white/3 border border-white/5 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Latest Orders */}
        <div className="bg-white/3 border border-white/5 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <h2 className="font-semibold text-white text-sm uppercase tracking-wider">Latest Orders</h2>
            <Link href="/admin/orders" className="text-xs text-white/40 hover:text-white transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-white/5">
            {stats?.latestOrders?.length === 0 && (
              <p className="p-5 text-white/30 text-sm">No orders yet</p>
            )}
            {stats?.latestOrders?.map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4 hover:bg-white/2 transition-colors">
                <div>
                  <p className="text-white text-sm font-medium">#{order.orderNumber}</p>
                  <p className="text-white/40 text-xs">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">{order.total} TND</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLORS[order.orderStatus] || "bg-white/10 text-white/40"}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white/3 border border-white/5 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <h2 className="font-semibold text-white text-sm uppercase tracking-wider">Low Stock Alert</h2>
            <Link href="/admin/products" className="text-xs text-white/40 hover:text-white transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-white/5">
            {stats?.lowStock?.length === 0 && (
              <p className="p-5 text-white/30 text-sm">All products well-stocked ⚡</p>
            )}
            {stats?.lowStock?.map((p) => (
              <div key={p._id} className="flex items-center gap-4 p-4 hover:bg-white/2 transition-colors">
                <div className="w-10 h-10 rounded bg-white/5 border border-white/10 overflow-hidden shrink-0">
                  {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{p.name}</p>
                </div>
                <span className="text-orange-400 font-bold text-sm">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add Product", href: "/admin/products/new" },
            { label: "View Orders", href: "/admin/orders" },
            { label: "Media Library", href: "/admin/media" },
            { label: "Settings", href: "/admin/settings" },
          ].map(({ label, href }) => (
            <Link key={href} href={href} className="border border-[#ff6b00]/30 hover:border-[#ff6b00] bg-[#ff6b00]/5 hover:bg-[#ff6b00]/10 rounded-lg px-4 py-4 text-sm text-[#ff6b00] hover:text-white transition-all text-center">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
