"use client";

import { useState } from "react";
import { Comment } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { CommentForm } from "./CommentForm";
import { useSession } from "@/lib/auth/betterAuthClient";

interface CommentItemProps {
  comment: Comment;
  onReply?: (parentId: string, content: string) => Promise<boolean>;
  onDelete?: (commentId: string) => Promise<void>;
  isReply?: boolean;
}

export function CommentItem({ comment, onReply, onDelete, isReply = false }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const { data: session } = useSession();

  const isOwner = session?.user?.id === comment.author.id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const canDelete = isOwner || isAdmin;

  const handleReplySubmit = async (content: string) => {
    if (!onReply) return false;
    return await onReply(comment.id, content);
  };

  return (
    <div className={`flex gap-4 ${isReply ? "mt-4" : "mt-6"}`}>
      <Avatar className="h-8 w-8 mt-1 border">
        {comment.isDeleted ? (
          <AvatarFallback className="bg-muted">?</AvatarFallback>
        ) : (
          <>
            <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
            <AvatarFallback>{comment.author.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </>
        )}
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
              {comment.isDeleted ? "[Deleted User]" : comment.author.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>

          {!comment.isDeleted && canDelete && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(comment.id)}
            >
              Delete
            </Button>
          )}
        </div>

        <div className="text-sm border border-border/50 bg-surface rounded-lg p-3">
          {comment.isDeleted ? (
            <p className="text-muted-foreground italic">This comment was deleted.</p>
          ) : (
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">{comment.content}</p>
          )}
        </div>

        {!comment.isDeleted && !isReply && onReply && session && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-8 px-2"
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </Button>
          </div>
        )}

        {isReplying && (
          <div className="mt-3 pl-4 border-l-2 border-primary/20">
            <CommentForm
              onSubmit={handleReplySubmit}
              onCancel={() => setIsReplying(false)}
              buttonText="Post Reply"
              placeholder={`Reply to ${comment.author.name}...`}
              autoFocus
            />
          </div>
        )}

        {/* Render nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="pl-4 sm:pl-6 border-l-2 border-border/50 space-y-4 pt-2">
            {comment.replies.map((reply) => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                isReply 
                onDelete={onDelete} 
                onReply={onReply} // Allow deep replies if backend supports it, else remove
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
