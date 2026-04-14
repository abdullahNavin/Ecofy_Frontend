"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { IdeaForm } from "@/components/ideas/IdeaForm";
import { api } from "@/lib/api/client";
import { useSession } from "@/lib/auth/betterAuthClient";
import type { Idea } from "@/types";

export default function EditIdeaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = useSession();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isSessionPending) return;

    if (!session) {
      router.replace(`/auth/login?from=/dashboard/member/ideas/${params.id}/edit`);
      return;
    }

    api.ideas
      .get(params.id)
      .then((data) => {
        if (data.author.id !== session.user.id) {
          toast.error("You can only edit your own ideas");
          router.replace("/dashboard/member/ideas");
          return;
        }

        if (data.status !== "DRAFT" && data.status !== "REJECTED") {
          toast.error("Only draft or rejected ideas can be edited");
          router.replace("/dashboard/member/ideas");
          return;
        }

        setIdea(data);
      })
      .catch(() => {
        toast.error("Failed to load idea");
        router.replace("/dashboard/member/ideas");
      })
      .finally(() => setIsLoading(false));
  }, [isSessionPending, params.id, router, session]);

  if (isSessionPending || isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!idea) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Idea</h1>
        <p className="text-muted-foreground mt-1">
          Update your rejected idea and submit a stronger revision.
        </p>
        {idea.rejectionFeedback ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span className="font-semibold">Admin feedback:</span> {idea.rejectionFeedback}
          </div>
        ) : null}
      </div>

      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
        <IdeaForm
          isEdit
          initialData={{
            id: idea.id,
            title: idea.title,
            categoryId: idea.category.id,
            problemStatement: idea.problemStatement,
            proposedSolution: idea.proposedSolution,
            description: idea.description,
            images: idea.images,
            isPaid: idea.isPaid,
            price: idea.price,
          }}
        />
      </div>
    </div>
  );
}
