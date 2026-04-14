"use client";

import { useEffect, useState } from "react";
import { Idea } from "@/types";
import { api } from "@/lib/api/client";
import { useSession } from "@/lib/auth/betterAuthClient";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { IdeaStatusBadge } from "@/components/ideas/IdeaStatusBadge";
import { Eye, Edit, Trash, Send, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function MyIdeasPage() {
  const { data: session } = useSession();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("session", session)
    if (session?.user?.id) {
      api.ideas.list({ author: session.user.id, authorId: session.user.id, userId: session.user.id })
        .then(res => {
          const loaded = res?.data || (Array.isArray(res) ? res : []);
          setIdeas(loaded);
        })
        .catch(() => toast.error("Failed to load ideas"))
        .finally(() => setIsLoading(false));
    } else if (!session) {
      setIsLoading(false);
    }
  }, [session]);

  const handleSubmit = async (id: string) => {
    try {
      await api.ideas.submit(id);
      toast.success("Idea submitted for review!");
      setIdeas(ideas.map(i => i.id === id ? { ...i, status: "UNDER_REVIEW" } : i));
    } catch {
      toast.error("Failed to submit idea");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this idea?")) return;
    try {
      await api.ideas.delete(id);
      toast.success("Idea deleted");
      setIdeas(ideas.filter(i => i.id !== id));
    } catch {
      toast.error("Failed to delete idea");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Ideas</h1>
          <p className="text-muted-foreground mt-1">
            Manage your sustainability proposals.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/member/ideas/new">
            <Plus className="h-4 w-4" /> Create Idea
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : ideas.length === 0 ? (
        <div className="border border-dashed rounded-xl p-12 text-center bg-surface">
          <h3 className="font-semibold text-lg mb-2">No ideas yet</h3>
          <p className="text-muted-foreground mb-6">You haven't created any ideas. Share your first sustainability project today!</p>
          <Button asChild variant="outline">
            <Link href="/dashboard/member/ideas/new">Get Started</Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-xl bg-surface overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ideas.map((idea) => (
                <TableRow key={idea.id}>
                  <TableCell>
                    <div className="font-medium line-clamp-1 max-w-[200px]">{idea.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
                    </div>
                  </TableCell>
                  <TableCell>{idea.category.name}</TableCell>
                  <TableCell><IdeaStatusBadge status={idea.status} /></TableCell>
                  <TableCell>
                    <div className="text-xs space-y-1">
                      <div><span className="font-semibold">+{idea.upvoteCount - idea.downvoteCount}</span> votes</div>
                      <div>{idea.commentCount} <span className="text-muted-foreground">comments</span></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button variant="ghost" size="icon" title="View Public Page" asChild>
                        <Link href={`/ideas/${idea.id}`}>
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </Link>
                      </Button>

                      {idea.status === "DRAFT" && (
                        <>
                          <Button variant="ghost" size="icon" title="Edit" asChild>
                            <Link href={`/dashboard/member/ideas/${idea.id}/edit`}>
                              <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" title="Submit for Review" onClick={() => handleSubmit(idea.id)}>
                            <Send className="h-4 w-4 text-muted-foreground hover:text-green-600" />
                          </Button>
                        </>
                      )}

                      {(idea.status === "DRAFT" || idea.status === "REJECTED") && (
                        <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(idea.id)}>
                          <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
