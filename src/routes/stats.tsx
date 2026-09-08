import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { usePortfolio } from "@/lib/portfolio-store";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Statistiques — Virgile Martinez" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StatsPage,
});

type DailyCount = { day: string; count: number };

function dayKey(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

function aggregateByDay(timestamps: string[]): DailyCount[] {
  const counts = new Map<string, number>();
  for (const ts of timestamps) counts.set(dayKey(ts), (counts.get(dayKey(ts)) ?? 0) + 1);
  return [...counts.entries()].map(([day, count]) => ({ day, count }));
}

const chartConfig: ChartConfig = { count: { label: "Visites", color: "var(--brand)" } };

function StatsPage() {
  const { isAdmin } = usePortfolio();
  const [total, setTotal] = useState<number | null>(null);
  const [daily, setDaily] = useState<DailyCount[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    void Promise.all([
      supabase.from("site_visits").select("*", { count: "exact", head: true }),
      supabase
        .from("site_visits")
        .select("visited_at")
        .gte("visited_at", thirtyDaysAgo)
        .order("visited_at", { ascending: true }),
      supabase.from("site_visits").select("visited_at").order("visited_at", { ascending: false }).limit(50),
    ]).then(([totalRes, dailyRes, recentRes]) => {
      setTotal(totalRes.count ?? 0);
      setDaily(aggregateByDay((dailyRes.data ?? []).map((r) => r.visited_at)));
      setRecent((recentRes.data ?? []).map((r) => r.visited_at));
    });
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-sm text-center">
          <p className="text-sm text-muted-foreground">Accès réservé au propriétaire du site.</p>
          <Link to="/auth" className="link-underline mt-3 inline-block text-sm text-brand">
            Se connecter
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link to="/" className="link-underline text-xs text-muted-foreground">
        ← Retour au portfolio
      </Link>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Visites du site</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Suivi 100% anonyme : aucune donnée personnelle n'est conservée, uniquement l'heure de chaque visite.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <p className="eyebrow">Total, depuis le début</p>
        <p className="mt-2 text-4xl font-semibold tracking-tight">{total ?? "…"}</p>
      </div>

      <div className="mt-8">
        <p className="eyebrow mb-3">Visites par jour (30 derniers jours)</p>
        {daily.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune visite sur cette période.</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
            <BarChart data={daily}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </div>

      <div className="mt-8">
        <p className="eyebrow mb-3">Dernières visites</p>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune visite pour le moment.</p>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {recent.map((ts) => (
              <li key={ts} className="px-4 py-2 text-sm text-muted-foreground">
                {new Date(ts).toLocaleString("fr-FR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
