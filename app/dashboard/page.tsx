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
  Globe,
} from "lucide-react";
import { useAnalytics, useProjects, useSkills } from "@/hooks/useSupabase";

function calcTrend(current: number, previous: number) {
  if (previous === 0) return { value: current > 0 ? 100 : 0, positive: current >= 0 };
  const diff = ((current - previous) / previous) * 100;
  return { value: Math.abs(Math.round(diff * 10) / 10), positive: diff >= 0 };
}

export default function DashboardPage() {
  const now = new Date().toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

  const { data: eventsCurrent, loading: analyticsLoading, error: analyticsError } = useAnalytics(thirtyDaysAgo, now);
  const { data: eventsPrevious } = useAnalytics(sixtyDaysAgo, thirtyDaysAgo);
  const { data: projects, loading: projectsLoading } = useProjects();
  const { data: skills, loading: skillsLoading } = useSkills();

  const loading = analyticsLoading || projectsLoading || skillsLoading;

  const currentVisits = eventsCurrent.filter((e) => e.event_type === "page_view").length;
  const currentClicks = eventsCurrent.filter((e) => e.event_type === "click").length;
  const previousVisits = eventsPrevious.filter((e) => e.event_type === "page_view").length;
  const previousClicks = eventsPrevious.filter((e) => e.event_type === "click").length;

  const visitsTrend = calcTrend(currentVisits, previousVisits);
  const clicksTrend = calcTrend(currentClicks, previousClicks);

  // Conversion rate
  const conversionRate = currentVisits > 0 ? ((currentClicks / currentVisits) * 100).toFixed(1) : "0.0";
  const prevConversionRate = previousVisits > 0 ? ((previousClicks / previousVisits) * 100).toFixed(1) : "0.0";
  const conversionTrend = calcTrend(parseFloat(conversionRate), parseFloat(prevConversionRate));

  // Unique sessions
  const uniqueSessions = new Set(eventsCurrent.map((e) => e.session_id).filter(Boolean)).size;
  const prevUniqueSessions = new Set(eventsPrevious.map((e) => e.session_id).filter(Boolean)).size;
  const sessionsTrend = calcTrend(uniqueSessions, prevUniqueSessions);

  // Top referrer
  const topReferrer = useMemo(() => {
    const map = new Map<string, number>();
    eventsCurrent.forEach((e) => {
      const ref = e.referrer || "Direct";
      map.set(ref, (map.get(ref) || 0) + 1);
    });
    let max = 0;
    let name = "Direct";
    map.forEach((count, ref) => {
      if (count > max) { max = count; name = ref; }
    });
    return { name, count: max };
  }, [eventsCurrent]);

  const visitsData = useMemo(() => {
    const map = new Map<string, number>();
    eventsCurrent
      .filter((e) => e.event_type === "page_view")
      .forEach((e) => {
        const month = e.created_at.slice(0, 7);
        map.set(month, (map.get(month) || 0) + 1);
      });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [eventsCurrent]);

  const clicksData = useMemo(() => {
    const map = new Map<string, number>();
    eventsCurrent
      .filter((e) => e.event_type === "click")
      .forEach((e) => {
        map.set(e.page_path, (map.get(e.page_path) || 0) + 1);
      });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [eventsCurrent]);

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
          value={currentVisits.toLocaleString()}
          description="Visites sur votre portfolio"
          icon={Eye}
          trend={visitsTrend}
        />
        <StatsCard
          title="Clicks"
          value={currentClicks.toLocaleString()}
          description="Clics sur vos liens"
          icon={MousePointerClick}
          trend={clicksTrend}
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
            <div className="text-2xl font-bold text-foreground">{conversionRate}%</div>
            <p className="text-xs text-muted">
              {conversionTrend.positive ? "+" : "-"}{conversionTrend.value}% vs période précédente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sessions uniques</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{uniqueSessions.toLocaleString()}</div>
            <p className="text-xs text-muted">
              {sessionsTrend.positive ? "+" : "-"}{sessionsTrend.value}% vs période précédente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top source</CardTitle>
            <Globe className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground truncate">{topReferrer.name}</div>
            <p className="text-xs text-muted">{topReferrer.count} visites</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
