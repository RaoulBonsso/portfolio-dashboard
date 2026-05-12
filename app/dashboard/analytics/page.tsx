"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatsCard } from "@/components/ui/StatsCard";
import { ChartLine } from "@/components/ui/ChartLine";
import { ChartBar } from "@/components/ui/ChartBar";
import { ChartPie } from "@/components/ui/ChartPie";
import { DataTable } from "@/components/ui/DataTable";
import { Eye, MousePointerClick, Users, Globe } from "lucide-react";
import { useAnalytics } from "@/hooks/useSupabase";

function calcTrend(current: number, previous: number) {
  if (previous === 0) return { value: current > 0 ? 100 : 0, positive: current >= 0 };
  const diff = ((current - previous) / previous) * 100;
  return { value: Math.abs(Math.round(diff * 10) / 10), positive: diff >= 0 };
}

export default function AnalyticsPage() {
  const now = new Date().toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

  const { data: eventsCurrent, loading, error } = useAnalytics(thirtyDaysAgo, now);
  const { data: eventsPrevious } = useAnalytics(sixtyDaysAgo, thirtyDaysAgo);

  const currentVisits = eventsCurrent.filter((e) => e.event_type === "page_view").length;
  const currentClicks = eventsCurrent.filter((e) => e.event_type === "click").length;
  const previousVisits = eventsPrevious.filter((e) => e.event_type === "page_view").length;
  const previousClicks = eventsPrevious.filter((e) => e.event_type === "click").length;

  const visitsTrend = calcTrend(currentVisits, previousVisits);
  const clicksTrend = calcTrend(currentClicks, previousClicks);

  const uniqueSessions = new Set(eventsCurrent.map((e) => e.session_id).filter(Boolean)).size;
  const prevUniqueSessions = new Set(eventsPrevious.map((e) => e.session_id).filter(Boolean)).size;
  const sessionsTrend = calcTrend(uniqueSessions, prevUniqueSessions);

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

  const prevTopReferrer = useMemo(() => {
    const map = new Map<string, number>();
    eventsPrevious.forEach((e) => {
      const ref = e.referrer || "Direct";
      map.set(ref, (map.get(ref) || 0) + 1);
    });
    let max = 0;
    map.forEach((count) => {
      if (count > max) max = count;
    });
    return max;
  }, [eventsPrevious]);
  const referrerTrend = calcTrend(topReferrer.count, prevTopReferrer);

  const visitsData = useMemo(() => {
    const map = new Map<string, number>();
    eventsCurrent
      .filter((e) => e.event_type === "page_view")
      .forEach((e) => {
        const day = new Date(e.created_at).toLocaleDateString("fr-FR", { weekday: "short" });
        map.set(day, (map.get(day) || 0) + 1);
      });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [eventsCurrent]);

  const monthlyVisits = useMemo(() => {
    const map = new Map<string, number>();
    eventsCurrent
      .filter((e) => e.event_type === "page_view")
      .forEach((e) => {
        const month = e.created_at.slice(0, 7);
        const label = month.split("-")[1];
        const monthNames = ["", "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
        const name = monthNames[parseInt(label, 10)] || month;
        map.set(name, (map.get(name) || 0) + 1);
      });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [eventsCurrent]);

  const sourcesData = useMemo(() => {
    const map = new Map<string, number>();
    eventsCurrent.forEach((e) => {
      const source = e.referrer || "Direct";
      map.set(source, (map.get(source) || 0) + 1);
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

  const pagesData = useMemo(() => {
    const map = new Map<string, number>();
    eventsCurrent
      .filter((e) => e.event_type === "page_view")
      .forEach((e) => {
        map.set(e.page_path, (map.get(e.page_path) || 0) + 1);
      });
    return Array.from(map.entries()).map(([name, views]) => ({ name, views }));
  }, [eventsCurrent]);

  const fallback = [{ name: "-", value: 0 }];
  const fallbackPages = [{ name: "-", views: 0 }];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-muted">Statistiques détaillées de votre portfolio</p>
      </div>

      {loading && <div className="text-muted">Chargement...</div>}
      {error && <div className="text-red-400">Erreur : {error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Visites ce mois"
          value={currentVisits.toLocaleString()}
          description={`${visitsTrend.positive ? "+" : "-"}${visitsTrend.value}% vs période précédente`}
          icon={Eye}
          trend={visitsTrend}
        />
        <StatsCard
          title="Clics ce mois"
          value={currentClicks.toLocaleString()}
          description={`${clicksTrend.positive ? "+" : "-"}${clicksTrend.value}% vs période précédente`}
          icon={MousePointerClick}
          trend={clicksTrend}
        />
        <StatsCard
          title="Sessions uniques"
          value={uniqueSessions.toLocaleString()}
          description={`${sessionsTrend.positive ? "+" : "-"}${sessionsTrend.value}% vs période précédente`}
          icon={Users}
          trend={sessionsTrend}
        />
        <StatsCard
          title="Top source"
          value={topReferrer.name}
          description={`${referrerTrend.positive ? "+" : "-"}${referrerTrend.value}% vs période précédente`}
          icon={Globe}
          trend={referrerTrend}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visites par jour (cette semaine)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartLine data={visitsData.length > 0 ? visitsData : fallback} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visites mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartBar data={monthlyVisits.length > 0 ? monthlyVisits : fallback} color="#64ffda" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sources de trafic</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartPie data={sourcesData.length > 0 ? sourcesData : fallback} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clics par lien</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartBar data={clicksData.length > 0 ? clicksData : fallback} color="#3b82f6" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pages les plus visitées</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: "name", header: "Page" },
              { key: "views", header: "Vues" },
            ]}
            data={pagesData.length > 0 ? pagesData : fallbackPages}
          />
        </CardContent>
      </Card>
    </div>
  );
}
