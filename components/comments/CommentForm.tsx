"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<boolean>;
  isSubmitting?: boolean;
  placeholder?: string;
  buttonText?: string;
  onCancel?: () => void;
  autoFocus?: boolean;
}

export function CommentForm({
  onSubmit,
  isSubmitting = false,
  placeholder = "Write a comment...",
  buttonText = "Post Comment",
  onCancel,
  autoFocus = false,
}: CommentFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    const success = await onSubmit(content.trim());
    if (success) {
      setContent("");
      if (onCancel) onCancel(); // Close if it was a reply form
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] resize-y"
        autoFocus={autoFocus}
      />
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!content.trim() || isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonText}
        </Button>
      </div>
    </form>
  );
}
