import AdminSidebar from "@/components/admin/AdminSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storm Control Room | Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0d0d10] text-white">
      <AdminSidebar />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
