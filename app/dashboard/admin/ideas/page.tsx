"use client";

import { useEffect, useState } from "react";
import { Idea } from "@/types";
import { api } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IdeaStatusBadge } from "@/components/ideas/IdeaStatusBadge";
import { Check, X, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function AdminIdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.ideas.list();
      setIdeas(data);
    } catch {
      toast.error("Failed to load ideas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.admin.ideas.approve(id);
      toast.success("Idea approved");
      setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, status: "APPROVED" } : i)));
    } catch {
      toast.error("Failed to approve idea");
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Reason for rejection:");
    if (reason === null) return;
    try {
      await api.admin.ideas.reject(id, reason);
      toast.success("Idea rejected");
      setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, status: "REJECTED" } : i)));
    } catch {
      toast.error("Failed to reject idea");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Idea Moderation</h1>
        <p className="text-muted-foreground mt-1">Review and manage community submissions.</p>
      </div>

      <div className="border rounded-xl bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : ideas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No ideas found.
                </TableCell>
              </TableRow>
            ) : (
              ideas.map((idea) => (
                <TableRow key={idea.id}>
                  <TableCell>
                    <div className="font-medium">{idea.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Submitted {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
                    </div>
                  </TableCell>
                  <TableCell>{idea.author.name}</TableCell>
                  <TableCell><IdeaStatusBadge status={idea.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button variant="ghost" size="icon" asChild title="View Idea">
                        <Link href={`/ideas/${idea.id}`}>
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </Link>
                      </Button>
                      
                      {idea.status === "UNDER_REVIEW" && (
                        <>
                          <Button variant="ghost" size="icon" title="Approve" onClick={() => handleApprove(idea.id)}>
                            <Check className="h-4 w-4 text-green-600 hover:text-green-700" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Reject" onClick={() => handleReject(idea.id)}>
                            <X className="h-4 w-4 text-destructive hover:text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
