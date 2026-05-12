"use client";

import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { ToastProvider } from "@/components/ui/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <ToastProvider />
      <Sidebar />
      <div className="lg:ml-64">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
