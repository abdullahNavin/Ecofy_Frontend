"use client";

import { useSession } from "@/lib/auth/betterAuthClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, MessageCircle, Triangle } from "lucide-react";

export default function MemberDashboardOverview() {
  const { data: session } = useSession();

  // In a real app, you'd fetch user specific stats like total ideas submitted, 
  // total votes received, total comments etc. from an API.
  // We'll mock the stats for the overview as the PRD focuses on the page structure 
  // and having the Idea List table in the `/ideas` nested route.

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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Upvotes Received</CardTitle>
            <Triangle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground mt-1">Across all your active ideas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comments on Ideas</CardTitle>
            <MessageCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground mt-1">You have 5 unread replies</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3 lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <p className="text-sm text-muted-foreground">
              Your activity feed will appear here showing when people vote or comment on your ideas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
