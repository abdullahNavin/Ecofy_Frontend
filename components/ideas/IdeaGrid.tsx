import { IdeaCard, IdeaCardProps } from "./IdeaCard";
import { IdeaCardSkeleton } from "./IdeaCardSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";

interface IdeaGridProps {
  ideas?: IdeaCardProps[];
  isLoading?: boolean;
  skeletonCount?: number;
  emptyMessage?: string;
}

export function IdeaGrid({
  ideas = [],
  isLoading = false,
  skeletonCount = 6,
  emptyMessage = "No ideas found. Try adjusting your filters.",
}: IdeaGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <IdeaCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!ideas || ideas.length === 0) {
    return (
      <Alert className="w-full border-dashed p-8 flex flex-col items-center justify-center text-center">
        <Lightbulb className="h-8 w-8 text-muted-foreground mb-4" />
        <AlertTitle className="text-xl">No Ideas Found</AlertTitle>
        <AlertDescription className="text-base text-muted-foreground mt-2">
          {emptyMessage}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {ideas.map((idea) => (
        <IdeaCard key={idea.id} {...idea} />
      ))}
    </div>
  );
}
