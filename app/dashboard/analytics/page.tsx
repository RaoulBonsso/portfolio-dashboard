"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatsCard } from "@/components/ui/StatsCard";
import { ChartLine } from "@/components/ui/ChartLine";
import { ChartBar } from "@/components/ui/ChartBar";
import { ChartPie } from "@/components/ui/ChartPie";
import { DataTable } from "@/components/ui/DataTable";
import { Eye, MousePointerClick, Clock, Globe } from "lucide-react";
import { useAnalytics } from "@/hooks/useSupabase";

export default function AnalyticsPage() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  const { data: events, loading, error } = useAnalytics(thirtyDaysAgo, now);

  const totalVisits = events.filter((e) => e.event_type === "page_view").length;
  const totalClicks = events.filter((e) => e.event_type === "click").length;

  const visitsData = useMemo(() => {
    const map = new Map<string, number>();
    events
      .filter((e) => e.event_type === "page_view")
      .forEach((e) => {
        const day = new Date(e.created_at).toLocaleDateString("fr-FR", { weekday: "short" });
        map.set(day, (map.get(day) || 0) + 1);
      });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [events]);

  const monthlyVisits = useMemo(() => {
    const map = new Map<string, number>();
    events
      .filter((e) => e.event_type === "page_view")
      .forEach((e) => {
        const month = e.created_at.slice(0, 7);
        const label = month.split("-")[1];
        const monthNames = ["", "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
        const name = monthNames[parseInt(label, 10)] || month;
        map.set(name, (map.get(name) || 0) + 1);
      });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [events]);

  const sourcesData = useMemo(() => {
    const map = new Map<string, number>();
    events.forEach((e) => {
      const source = e.referrer || "Direct";
      map.set(source, (map.get(source) || 0) + 1);
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

  const pagesData = useMemo(() => {
    const map = new Map<string, number>();
    events
      .filter((e) => e.event_type === "page_view")
      .forEach((e) => {
        map.set(e.page_path, (map.get(e.page_path) || 0) + 1);
      });
    return Array.from(map.entries()).map(([name, views]) => ({ name, views }));
  }, [events]);

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
          value={totalVisits.toLocaleString()}
          description="+15% vs mois dernier"
          icon={Eye}
          trend={{ value: 15, positive: true }}
        />
        <StatsCard
          title="Clics ce mois"
          value={totalClicks.toLocaleString()}
          description="+8% vs mois dernier"
          icon={MousePointerClick}
          trend={{ value: 8, positive: true }}
        />
        <StatsCard
          title="Temps moyen"
          value="4m 12s"
          description="+22s vs mois dernier"
          icon={Clock}
          trend={{ value: 5, positive: true }}
        />
        <StatsCard
          title="Taux de rebond"
          value="42.3%"
          description="-2.1% vs mois dernier"
          icon={Globe}
          trend={{ value: 2.1, positive: true }}
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
