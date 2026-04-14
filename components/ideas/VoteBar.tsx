"use client";

import { useVote } from "@/hooks/useVote";
import { VoteType } from "@/types";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/betterAuthClient";
import { Triangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function VoteBar({
  ideaId,
  initialUpvotes,
  initialDownvotes,
  initialUserVote,
}: {
  ideaId: string;
  initialUpvotes: number;
  initialDownvotes: number;
  initialUserVote: VoteType | null;
}) {
  const { data: session } = useSession();
  const { upvoteCount, downvoteCount, userVote, pending, cast } = useVote(ideaId, {
    upvoteCount: initialUpvotes,
    downvoteCount: initialDownvotes,
    userVote: initialUserVote,
  });

  const handleVote = (type: VoteType) => {
    if (!session) return;
    cast(type);
  };

  const buttons = (
    <div className="flex items-center gap-2">
      <Button
        variant={userVote === "UPVOTE" ? "default" : "outline"}
        size="sm"
        className={`gap-2 ${userVote === "UPVOTE" ? "bg-primary text-primary-foreground hover:bg-primary-dark" : "hover:text-primary hover:border-primary"}`}
        onClick={() => handleVote("UPVOTE")}
        disabled={pending}
      >
        <Triangle className="h-4 w-4" fill={userVote === "UPVOTE" ? "currentColor" : "none"} />
        Upvote ({upvoteCount})
      </Button>

      <Button
        variant={userVote === "DOWNVOTE" ? "destructive" : "outline"}
        size="sm"
        className={`gap-2 ${userVote === "DOWNVOTE" ? "" : "hover:text-destructive hover:border-destructive"}`}
        onClick={() => handleVote("DOWNVOTE")}
        disabled={pending}
      >
        <Triangle className="h-4 w-4 rotate-180" fill={userVote === "DOWNVOTE" ? "currentColor" : "none"} />
        Downvote ({downvoteCount})
      </Button>
    </div>
  );

  if (!session) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-block opacity-70 cursor-not-allowed">
              <div className="pointer-events-none">{buttons}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Log in to participate in voting</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttons;
}
