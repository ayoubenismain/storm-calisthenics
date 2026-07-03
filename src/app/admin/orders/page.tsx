"use client";

import { useEffect, useState } from "react";

interface Order {
  _id: string; orderNumber: string; customerName: string;
  phone: string; total: number; orderStatus: string;
  paymentMethod: string; createdAt: string;
  items: { name: string; quantity: number; price: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300",
  confirmed: "bg-blue-500/20 text-blue-300",
  processing: "bg-purple-500/20 text-purple-300",
  shipped: "bg-cyan-500/20 text-cyan-300",
  delivered: "bg-green-500/20 text-green-300",
  cancelled: "bg-red-500/20 text-red-300",
};

const STATUSES = ["pending","confirmed","processing","shipped","delivered","cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = (status?: string) => {
    const q = status ? `?status=${status}` : "";
    fetch(`/api/admin/orders${q}`).then((r) => r.json()).then((d) => { setOrders(d.orders || []); setLoading(false); });
  };

  useEffect(() => { load(filter || undefined); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderStatus: status }),
    });
    const data = await res.json();
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, orderStatus: data.order.orderStatus } : o)));
    if (selected?._id === id) setSelected((s) => s ? { ...s, orderStatus: data.order.orderStatus } : s);
    setUpdating(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tighter text-white">Orders</h1>
        <p className="text-white/40 text-sm">{orders.length} orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded text-sm border transition-all ${filter === s ? "bg-[#ff6b00]/15 text-[#ff6b00] border-[#ff6b00]/50" : "bg-white/5 text-white/50 border-white/10 hover:border-white/30"}`}>
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 bg-white/3 border border-white/5 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-white/30 text-sm">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-white/30 text-sm">No orders found</div>
          ) : (
            <div className="divide-y divide-white/5">
              {orders.map((order) => (
                <div key={order._id} onClick={() => setSelected(order)} className={`p-4 cursor-pointer hover:bg-white/3 transition-colors ${selected?._id === order._id ? "bg-white/5 border-l-2 border-white" : ""}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white font-medium text-sm">#{order.orderNumber}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLORS[order.orderStatus] || "bg-white/10 text-white/40"}`}>{order.orderStatus}</span>
                  </div>
                  <p className="text-white/50 text-xs">{order.customerName} · {order.phone}</p>
                  <p className="text-white/40 text-xs mt-1">{new Date(order.createdAt).toLocaleDateString()} · {order.total} TND</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Detail */}
        <div className="bg-white/3 border border-white/5 rounded-lg p-5">
          {!selected ? (
            <div className="text-center text-white/30 text-sm py-8">Select an order to view details</div>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-white font-bold text-lg">#{selected.orderNumber}</p>
                <p className="text-white/40 text-xs">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Customer</p>
                <p className="text-white text-sm">{selected.customerName}</p>
                <p className="text-white/50 text-xs">{selected.phone}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Items</p>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white/70">{item.name} ×{item.quantity}</span>
                      <span className="text-white">{item.price * item.quantity} TND</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 mt-3 pt-3 flex justify-between">
                  <span className="text-white/50 text-sm">Total</span>
                  <span className="text-white font-bold text-sm">{selected.total} TND</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button key={s} onClick={() => updateStatus(selected._id, s)} disabled={updating || selected.orderStatus === s}
                      className={`px-3 py-1.5 rounded text-xs border transition-all capitalize ${selected.orderStatus === s ? "bg-[#ff6b00]/15 text-[#ff6b00] border-[#ff6b00]/40" : "bg-white/5 text-white/50 border-white/10 hover:border-[#ff6b00]/30 hover:text-[#ff6b00]"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
