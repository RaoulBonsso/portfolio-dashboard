"use client";

import { User } from "lucide-react";
import { Badge } from "./Badge";
import { useProfiles } from "@/hooks/useSupabase";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Header() {
  const { data: profiles } = useProfiles();
  const [authEmail, setAuthEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setAuthEmail(data.user.email);
    });
  }, []);

  const profile = profiles[0];
  const displayName = profile?.name || "Admin";
  const displayEmail = profile?.email || authEmail || "";

  return (
    <header className="flex h-16 items-center justify-between border-b border-[rgba(100,255,218,0.1)] bg-surface/50 px-6 backdrop-blur-sm">
      <div className="lg:hidden w-10" />
      <h1 className="text-lg font-semibold text-foreground">
        Tableau de bord
      </h1>
      <div className="flex items-center gap-4">
        <Badge variant="default">Admin</Badge>
        <div className="flex items-center gap-3 rounded-full border border-[rgba(100,255,218,0.1)] bg-background px-3 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">{displayName}</p>
            <p className="text-xs text-muted">{displayEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
