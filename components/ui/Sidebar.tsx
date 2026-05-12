"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Wrench,
  FolderKanban,
  Briefcase,
  Award,
  FileText,
  BarChart3,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "./Button";
import { supabase } from "@/lib/supabase";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profil", icon: User },
  { href: "/dashboard/skills", label: "Compétences", icon: Wrench },
  { href: "/dashboard/projects", label: "Projets", icon: FolderKanban },
  { href: "/dashboard/experiences", label: "Expériences", icon: Briefcase },
  { href: "/dashboard/certifications", label: "Certifications", icon: Award },
  { href: "/dashboard/blog", label: "Blog", icon: FileText },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile toggle */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 transform border-r border-[rgba(100,255,218,0.1)] bg-surface transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-[rgba(100,255,218,0.1)] px-6">
            <Link href="/dashboard" className="text-xl font-bold text-primary">
              Portfolio Admin
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary/10 text-primary border border-[rgba(100,255,218,0.1)]"
                      : "text-muted hover:bg-surface-light hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[rgba(100,255,218,0.1)] p-3">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
