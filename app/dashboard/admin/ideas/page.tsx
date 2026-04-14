"use client";

import { useEffect, useState } from "react";
import { Idea, IdeaStatus } from "@/types";
import { api } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IdeaStatusBadge } from "@/components/ideas/IdeaStatusBadge";
import { Eye, Loader2, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminIdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectIdeaId, setRejectIdeaId] = useState<string | null>(null);
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [pendingStatusIdeaId, setPendingStatusIdeaId] = useState<string | null>(null);
  const [deleteIdeaId, setDeleteIdeaId] = useState<string | null>(null);

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

  const updateIdeaRow = (updatedIdea: Idea) => {
    setIdeas((prev) => prev.map((idea) => (idea.id === updatedIdea.id ? { ...idea, ...updatedIdea } : idea)));
  };

  const handleApprove = async (id: string) => {
    try {
      const updated = await api.admin.ideas.setStatus(id, "APPROVED");
      toast.success("Idea approved");
      updateIdeaRow(updated);
    } catch {
      toast.error("Failed to approve idea");
    }
  };

  const handleDelete = async () => {
    if (!deleteIdeaId) return;
    try {
      await api.admin.ideas.delete(deleteIdeaId);
      toast.success("Idea deleted");
      setIdeas((prev) => prev.filter((idea) => idea.id !== deleteIdeaId));
      setDeleteIdeaId(null);
    } catch {
      toast.error("Failed to delete idea");
    }
  };

  const handleStatusChange = async (idea: Idea, status: IdeaStatus) => {
    if (status === idea.status) return;

    if (status === "REJECTED") {
      setRejectIdeaId(idea.id);
      setPendingStatusIdeaId(idea.id);
      setRejectFeedback("");
      setIsRejectDialogOpen(true);
      return;
    }

    try {
      const updated = await api.admin.ideas.setStatus(idea.id, status);

      toast.success(`Idea moved to ${status.replace("_", " ").toLowerCase()}`);
      updateIdeaRow(updated);
    } catch {
      toast.error("Failed to update idea status");
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectIdeaId) return;

    try {
      const updated = await api.admin.ideas.setStatus(rejectIdeaId, "REJECTED", rejectFeedback);
      toast.success("Idea rejected");
      updateIdeaRow(updated);
      setIsRejectDialogOpen(false);
      setRejectIdeaId(null);
      setPendingStatusIdeaId(null);
      setRejectFeedback("");
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
                  <TableCell>
                    <div className="space-y-2">
                      <IdeaStatusBadge status={idea.status} />
                      <Select
                        value={idea.status}
                        onValueChange={(value) => handleStatusChange(idea, value as IdeaStatus)}
                      >
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                          <SelectItem value="APPROVED">Approved</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button variant="ghost" size="icon" asChild title="View Idea">
                        <Link href={`/ideas/${idea.id}`}>
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </Link>
                      </Button>
                      {idea.status !== "APPROVED" && (
                        <Button variant="outline" size="sm" onClick={() => handleApprove(idea.id)}>
                          Approve
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete Idea"
                        onClick={() => setDeleteIdeaId(idea.id)}
                      >
                        <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Idea</DialogTitle>
            <DialogDescription>
              Add feedback so the author understands why this idea was rejected.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectFeedback}
            onChange={(e) => setRejectFeedback(e.target.value)}
            placeholder="Explain what needs to change before this idea can be approved."
            className="min-h-28"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!pendingStatusIdeaId || rejectFeedback.trim().length < 10}
              onClick={handleRejectConfirm}
            >
              Reject Idea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteIdeaId} onOpenChange={(open) => !open && setDeleteIdeaId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Idea</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the idea from the platform. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
