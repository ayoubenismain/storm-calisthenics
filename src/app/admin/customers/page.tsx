"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

interface Customer {
  _id: string;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => {
        const orders = d.orders || [];
        const map = new Map<string, Customer>();
        for (const o of orders) {
          const key = o.phone || o.customerName;
          const existing = map.get(key);
          if (existing) {
            existing.totalOrders++;
            existing.totalSpent += o.total;
            if (new Date(o.createdAt) > new Date(existing.lastOrder)) existing.lastOrder = o.createdAt;
          } else {
            map.set(key, {
              _id: key,
              customerName: o.customerName,
              phone: o.phone,
              email: o.email,
              city: o.city,
              totalOrders: 1,
              totalSpent: o.total,
              lastOrder: o.createdAt,
            });
          }
        }
        setCustomers(Array.from(map.values()).sort((a, b) => b.totalOrders - a.totalOrders));
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tighter text-white">Customers</h1>
        <p className="text-white/40 text-sm">{customers.length} customers from orders</p>
      </div>

      <div className="bg-white/3 border border-white/5 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/30 text-sm">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No customers yet. Orders will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-xs text-white/40 uppercase tracking-wider font-medium">Customer</th>
                  <th className="text-left p-4 text-xs text-white/40 uppercase tracking-wider font-medium hidden md:table-cell">Phone</th>
                  <th className="text-left p-4 text-xs text-white/40 uppercase tracking-wider font-medium hidden md:table-cell">City</th>
                  <th className="text-left p-4 text-xs text-white/40 uppercase tracking-wider font-medium">Orders</th>
                  <th className="text-left p-4 text-xs text-white/40 uppercase tracking-wider font-medium hidden sm:table-cell">Total Spent</th>
                  <th className="text-left p-4 text-xs text-white/40 uppercase tracking-wider font-medium hidden lg:table-cell">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4">
                      <p className="text-white text-sm font-medium">{c.customerName}</p>
                      {c.email && <p className="text-white/40 text-xs">{c.email}</p>}
                    </td>
                    <td className="p-4 hidden md:table-cell text-white/50 text-sm">{c.phone}</td>
                    <td className="p-4 hidden md:table-cell text-white/50 text-sm">{c.city}</td>
                    <td className="p-4 text-white text-sm font-medium">{c.totalOrders}</td>
                    <td className="p-4 hidden sm:table-cell text-white/60 text-sm">{c.totalSpent.toFixed(0)} TND</td>
                    <td className="p-4 hidden lg:table-cell text-white/40 text-xs">{new Date(c.lastOrder).toLocaleDateString()}</td>
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
