"use client";

import { useComments } from "@/hooks/useComments";
import { Comment } from "@/types";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { useSession } from "@/lib/auth/betterAuthClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function CommentThread({ ideaId, initialComments }: { ideaId: string, initialComments: Comment[] }) {
  const { comments, isSubmitting, postComment, replyComment, deleteComment } = useComments(ideaId, initialComments);
  const { data: session } = useSession();

  return (
    <div className="space-y-8 mt-8">
      <div>
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
          <MessageCircle className="h-6 w-6 text-primary" />
          Discussion ({comments.length})
        </h3>
        
        {session ? (
          <div className="bg-surface border border-border/50 rounded-xl p-4 shadow-sm mb-8">
            <CommentForm onSubmit={postComment} isSubmitting={isSubmitting} />
          </div>
        ) : (
          <div className="bg-muted/50 rounded-xl p-6 text-center mb-8 border border-border">
            <p className="text-muted-foreground mb-4">Log in to join the discussion.</p>
            <Button asChild>
              <Link href={`/auth/login?from=/ideas/${ideaId}`}>Log In</Link>
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 border border-dashed rounded-xl border-border">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                onReply={replyComment} 
                onDelete={deleteComment} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
