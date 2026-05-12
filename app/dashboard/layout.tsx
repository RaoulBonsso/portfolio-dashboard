"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { ToastProvider } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      }
      setChecking(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push("/login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-muted">Chargement...</div>
      </div>
    );
  }

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
