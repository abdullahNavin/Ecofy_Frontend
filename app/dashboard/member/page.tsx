"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, MessageCircle, Triangle } from "lucide-react";
import { useSession } from "@/lib/auth/betterAuthClient";
import { api } from "@/lib/api/client";
import type { DashboardSummary } from "@/types";

export default function MemberDashboardOverview() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isSessionPending) {
      setIsLoading(true);
      return;
    }

    if (!session) {
      setSummary(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    api.auth
      .dashboardSummary()
      .then((data) => setSummary(data))
      .finally(() => setIsLoading(false));
  }, [session, isSessionPending]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {session?.user?.name || "Member"}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Ideas</CardTitle>
            <Lightbulb className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : summary?.stats.myIdeas ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Ideas you have created so far</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Upvotes Received</CardTitle>
            <Triangle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : summary?.stats.totalUpvotesReceived ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all of your submitted ideas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comments on Ideas</CardTitle>
            <MessageCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : summary?.stats.commentsOnIdeas ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total discussion activity on your ideas</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3 lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading activity...</p>
            ) : summary?.recentActivity.length ? (
              summary.recentActivity.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.actorName}</span>{" "}
                      {activity.type === "vote"
                        ? `added a ${activity.meta === "UPVOTE" ? "vote" : "downvote"} on`
                        : "commented on"}{" "}
                      <Link href={`/ideas/${activity.ideaId}`} className="font-medium text-primary hover:underline">
                        {activity.ideaTitle}
                      </Link>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent activity yet. Votes and comments on your ideas will appear here.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
