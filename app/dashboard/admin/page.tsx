"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { StatCard } from "@/components/admin/StatCard";
import { Users, Lightbulb, Activity, CheckCircle } from "lucide-react";
import { Idea, User } from "@/types";

export default function AdminDashboardOverview() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.admin.ideas.list().catch(() => []),
      api.admin.users.list().catch(() => [])
    ]).then(([ideasData, usersData]) => {
      setIdeas(ideasData);
      setUsers(usersData);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const totalUsers = users.length;
  const pendingIdeas = ideas.filter(i => i.status === "UNDER_REVIEW").length;
  const approvedIdeas = ideas.filter(i => i.status === "APPROVED").length;
  const premiumIdeas = ideas.filter(i => i.isPaid).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Platform overview and core metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={isLoading ? "..." : totalUsers}
          description="Registered community members"
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
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
