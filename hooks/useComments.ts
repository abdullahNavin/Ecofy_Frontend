import { useState, useCallback } from "react";
import { Comment } from "@/types";
import { api } from "@/lib/api/client";
import { toast } from "sonner";

export function useComments(ideaId: string, initialComments: Comment[]) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await api.comments.list(ideaId);
      setComments(data);
    } catch {
      // Background refresh failed, ignore
    }
  }, [ideaId]);

  const postComment = async (content: string) => {
    setIsSubmitting(true);
    try {
      const newComment = await api.comments.post(ideaId, content);
      setComments((prev) => [newComment, ...prev]);
      toast.success("Comment posted successfully");
      return true;
    } catch {
      toast.error("Failed to post comment");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const replyComment = async (parentId: string, content: string) => {
    setIsSubmitting(true);
    try {
      const newReply = await api.comments.reply(ideaId, parentId, content);
      
      // Update local state by finding the parent and appending the reply
      setComments((prev) => 
        prev.map(c => {
          if (c.id === parentId) {
            return { ...c, replies: [...(c.replies || []), newReply] };
          }
          return c;
        })
      );
      
      toast.success("Reply posted successfully");
      return true;
    } catch {
      toast.error("Failed to post reply");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await api.comments.delete(ideaId, commentId);
      refresh(); // Refresh to get the [Deleted] state from server
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  return {
    comments,
    isSubmitting,
    postComment,
    replyComment,
    deleteComment,
    refresh
  };
}
