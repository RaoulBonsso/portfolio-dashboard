"use client";

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

const visitsData = [
  { name: "Jan", value: 400 },
  { name: "Fév", value: 300 },
  { name: "Mar", value: 550 },
  { name: "Avr", value: 450 },
  { name: "Mai", value: 600 },
  { name: "Juin", value: 800 },
];

const clicksData = [
  { name: "GitHub", value: 120 },
  { name: "LinkedIn", value: 80 },
  { name: "Email", value: 45 },
  { name: "CV", value: 60 },
  { name: "Demo", value: 95 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Vue d&apos;ensemble</h2>
        <p className="text-muted">Bienvenue dans votre tableau de bord</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Visites totales"
          value="12,345"
          description="Visites sur votre portfolio"
          icon={Eye}
          trend={{ value: 12, positive: true }}
        />
        <StatsCard
          title="Clicks"
          value="1,234"
          description="Clics sur vos liens"
          icon={MousePointerClick}
          trend={{ value: 8, positive: true }}
        />
        <StatsCard
          title="Projets"
          value="24"
          description="Projets publiés"
          icon={FolderKanban}
        />
        <StatsCard
          title="Compétences"
          value="56"
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
            <ChartLine data={visitsData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clics par lien</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartBar data={clicksData} />
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
