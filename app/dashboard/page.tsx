"use client";

import { useMemo } from "react";
import { StatsCard } from "@/components/ui/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ChartLine } from "@/components/ui/ChartLine";
import { ChartBar } from "@/components/ui/ChartBar";
import {
  Eye,
  MousePointerClick,
  FolderKanban,
  Wrench,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAnalytics, useProjects, useSkills } from "@/hooks/useSupabase";

export default function DashboardPage() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  const { data: events, loading: analyticsLoading, error: analyticsError } = useAnalytics(thirtyDaysAgo, now);
  const { data: projects, loading: projectsLoading } = useProjects();
  const { data: skills, loading: skillsLoading } = useSkills();

  const loading = analyticsLoading || projectsLoading || skillsLoading;

  const totalVisits = events.filter((e) => e.event_type === "page_view").length;
  const totalClicks = events.filter((e) => e.event_type === "click").length;

  const visitsData = useMemo(() => {
    const map = new Map<string, number>();
    events
      .filter((e) => e.event_type === "page_view")
      .forEach((e) => {
        const month = e.created_at.slice(0, 7);
        map.set(month, (map.get(month) || 0) + 1);
      });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [events]);

  const clicksData = useMemo(() => {
    const map = new Map<string, number>();
    events
      .filter((e) => e.event_type === "click")
      .forEach((e) => {
        map.set(e.page_path, (map.get(e.page_path) || 0) + 1);
      });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [events]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Vue d&apos;ensemble</h2>
        <p className="text-muted">Bienvenue dans votre tableau de bord</p>
      </div>

      {loading && <div className="text-muted">Chargement...</div>}
      {analyticsError && <div className="text-red-400">Erreur : {analyticsError}</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Visites totales"
          value={totalVisits.toLocaleString()}
          description="Visites sur votre portfolio"
          icon={Eye}
          trend={{ value: 12, positive: true }}
        />
        <StatsCard
          title="Clicks"
          value={totalClicks.toLocaleString()}
          description="Clics sur vos liens"
          icon={MousePointerClick}
          trend={{ value: 8, positive: true }}
        />
        <StatsCard
          title="Projets"
          value={projects.length.toString()}
          description="Projets publiés"
          icon={FolderKanban}
        />
        <StatsCard
          title="Compétences"
          value={skills.length.toString()}
          description="Compétences listées"
          icon={Wrench}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visites mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartLine data={visitsData.length > 0 ? visitsData : [{ name: "-", value: 0 }]} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clics par lien</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartBar data={clicksData.length > 0 ? clicksData : [{ name: "-", value: 0 }]} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3.2%</div>
            <p className="text-xs text-muted">+0.5% vs mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux visiteurs</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2,847</div>
            <p className="text-xs text-muted">+12% vs mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Temps moyen</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4m 32s</div>
            <p className="text-xs text-muted">+18s vs mois dernier</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
