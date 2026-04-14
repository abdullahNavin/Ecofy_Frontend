import { useState } from "react";
import { VoteType } from "@/types";
import { api } from "@/lib/api/client";
import { toast } from "sonner";

interface InitialVoteState {
  upvoteCount: number;
  downvoteCount: number;
  userVote: VoteType | null;
}

export function useVote(ideaId: string, initial: InitialVoteState) {
  const [upvoteCount, setUp] = useState(initial.upvoteCount);
  const [downvoteCount, setDown] = useState(initial.downvoteCount);
  const [userVote, setUserVote] = useState<VoteType | null>(initial.userVote);
  const [pending, setPending] = useState(false);

  const cast = async (type: VoteType) => {
    if (pending) return;
    const removing = userVote === type;
    const snapshot = { upvoteCount, downvoteCount, userVote };

    // Optimistic update
    if (type === "UPVOTE") {
      setUp((c) => c + (removing ? -1 : userVote === "DOWNVOTE" ? 1 : 1));
      if (!removing && userVote === "DOWNVOTE") setDown((c) => c - 1);
    } else {
      setDown((c) => c + (removing ? -1 : userVote === "UPVOTE" ? 1 : 1));
      if (!removing && userVote === "UPVOTE") setUp((c) => c - 1);
    }
    
    setUserVote(removing ? null : type);
    setPending(true);

    try {
      if (removing) {
        await api.votes.remove(ideaId);
      } else {
        await api.votes.cast(ideaId, type);
      }
    } catch {
      // Revert optimistic update
      setUp(snapshot.upvoteCount);
      setDown(snapshot.downvoteCount);
      setUserVote(snapshot.userVote);
      toast.error("Failed to register vote. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return { upvoteCount, downvoteCount, userVote, pending, cast };
}
