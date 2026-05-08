"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { StatCard } from "@/components/admin/StatCard";
import { Users, Lightbulb, Activity, CheckCircle } from "lucide-react";
import { AdminOverview } from "@/types";

export default function AdminDashboardOverview() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    api.admin
      .overview()
      .then((data) => {
        setOverview(data);
        setLoadError("");
      })
      .catch(() => setLoadError("Unable to load admin metrics right now."))
      .finally(() => setIsLoading(false));
  }, []);

  const totalUsers = overview?.totalUsers ?? 0;
  const pendingIdeas = overview?.pendingIdeas ?? 0;
  const approvedIdeas = overview?.approvedIdeas ?? 0;
  const premiumIdeas = overview?.premiumIdeas ?? 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Platform overview and core metrics.
        </p>
        {loadError ? <p className="text-sm text-destructive mt-2">{loadError}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={isLoading ? "..." : totalUsers}
          description="Registered community members"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Ideas Under Review"
          value={isLoading ? "..." : pendingIdeas}
          description="Awaiting moderation"
          icon={<Activity className="h-4 w-4" />}
          className={pendingIdeas > 0 ? "border-amber-200 bg-amber-50" : ""}
        />
        <StatCard
          title="Approved Ideas"
          value={isLoading ? "..." : approvedIdeas}
          description="Live on platform"
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        />
        <StatCard
          title="Premium Ideas"
          value={isLoading ? "..." : premiumIdeas}
          description="Monetized projects"
          icon={<Lightbulb className="h-4 w-4 text-primary" />}
        />
      </div>
    </div>
  );
}
