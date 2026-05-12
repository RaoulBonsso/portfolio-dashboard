"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatsCard } from "@/components/ui/StatsCard";
import { ChartLine } from "@/components/ui/ChartLine";
import { ChartBar } from "@/components/ui/ChartBar";
import { ChartPie } from "@/components/ui/ChartPie";
import { DataTable } from "@/components/ui/DataTable";
import { Eye, MousePointerClick, Clock, Globe } from "lucide-react";

const visitsData = [
  { name: "Lun", value: 320 },
  { name: "Mar", value: 450 },
  { name: "Mer", value: 380 },
  { name: "Jeu", value: 520 },
  { name: "Ven", value: 610 },
  { name: "Sam", value: 290 },
  { name: "Dim", value: 240 },
];

const monthlyVisits = [
  { name: "Jan", value: 2400 },
  { name: "Fév", value: 2100 },
  { name: "Mar", value: 3200 },
  { name: "Avr", value: 2800 },
  { name: "Mai", value: 3500 },
  { name: "Juin", value: 4100 },
];

const sourcesData = [
  { name: "Direct", value: 450 },
  { name: "Google", value: 320 },
  { name: "GitHub", value: 180 },
  { name: "LinkedIn", value: 120 },
  { name: "Twitter", value: 80 },
  { name: "Autres", value: 50 },
];

const pagesData = [
  { name: "/", views: 1240 },
  { name: "/projects", views: 850 },
  { name: "/about", views: 620 },
  { name: "/blog", views: 430 },
  { name: "/contact", views: 210 },
];

const clicksData = [
  { name: "GitHub", value: 340 },
  { name: "LinkedIn", value: 210 },
  { name: "Email", value: 150 },
  { name: "CV PDF", value: 120 },
  { name: "Demo", value: 95 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-muted">Statistiques détaillées de votre portfolio</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Visites ce mois"
          value="8,432"
          description="+15% vs mois dernier"
          icon={Eye}
          trend={{ value: 15, positive: true }}
        />
        <StatsCard
          title="Clics ce mois"
          value="1,156"
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
            <ChartLine data={visitsData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visites mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartBar data={monthlyVisits} color="#64ffda" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sources de trafic</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartPie data={sourcesData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clics par lien</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartBar data={clicksData} color="#3b82f6" />
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
            data={pagesData}
          />
        </CardContent>
      </Card>
    </div>
  );
}
