"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { BarChart2, CreditCard, Eye, MessageCircle, Triangle } from "lucide-react";
import { api } from "@/lib/api/client";
import type { CreatorAnalytics } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IdeaStatusBadge } from "@/components/ideas/IdeaStatusBadge";

export default function CreatorAnalyticsPage() {
  const [analytics, setAnalytics] = useState<CreatorAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    api.analytics
      .creator()
      .then((data) => {
        setAnalytics(data);
        setLoadError("");
      })
      .catch(() => setLoadError("Unable to load creator analytics."))
      .finally(() => setIsLoading(false));
  }, []);

  const stats = analytics?.stats;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Creator Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track views, engagement, purchases, and revenue across your ideas.
        </p>
        {loadError ? <p className="text-sm text-destructive mt-2">{loadError}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Ideas" value={isLoading ? "..." : stats?.totalIdeas ?? 0} icon={<BarChart2 className="h-4 w-4" />} />
        <MetricCard title="Views" value={isLoading ? "..." : stats?.totalViews ?? 0} icon={<Eye className="h-4 w-4" />} />
        <MetricCard title="Purchases" value={isLoading ? "..." : stats?.totalPurchases ?? 0} icon={<CreditCard className="h-4 w-4" />} />
        <MetricCard title="Revenue" value={isLoading ? "..." : `$${(stats?.totalRevenue ?? 0).toFixed(2)}`} icon={<Triangle className="h-4 w-4" />} />
      </div>

      <div className="border rounded-xl bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Idea</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Premium</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Loading analytics...
                </TableCell>
              </TableRow>
            ) : analytics?.ideas.length ? (
              analytics.ideas.map((idea) => (
                <TableRow key={idea.id}>
                  <TableCell>
                    <Link href={`/ideas/${idea.id}`} className="font-medium hover:text-primary">
                      {idea.title}
                    </Link>
                    <div className="text-xs text-muted-foreground">{idea.viewCount} views</div>
                  </TableCell>
                  <TableCell><IdeaStatusBadge status={idea.status} /></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="inline-flex items-center gap-1"><Triangle className="h-3 w-3" /> {idea.netVotes} net votes</span>
                      <span className="inline-flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {idea.commentCount} comments</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {idea.isPaid ? (
                      <div className="text-sm">
                        <div>{idea.purchaseCount} purchases</div>
                        <div className="text-xs text-muted-foreground">${idea.revenue.toFixed(2)} revenue</div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Free idea</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No idea analytics yet. Create and publish an idea to start collecting activity.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string | number; icon: ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
