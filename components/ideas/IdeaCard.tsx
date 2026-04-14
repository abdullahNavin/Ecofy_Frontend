import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Triangle } from "lucide-react";
import { PaidBadge } from "@/components/payment/PaidBadge";
import { formatDistanceToNow } from "date-fns";

export interface IdeaCardProps {
  id: string;
  title: string;
  category: { id: string; name: string };
  description: string;
  images?: string[];
  isPaid: boolean;
  price?: number;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  author: { id: string; name: string; avatarUrl?: string };
  createdAt: string;
}

export function IdeaCard({
  id,
  title,
  category,
  description,
  images,
  isPaid,
  price,
  upvoteCount,
  downvoteCount,
  commentCount,
  author,
  createdAt,
}: IdeaCardProps) {
  const netVotes = upvoteCount - downvoteCount;
  const imageUrl = images?.[0];

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md h-full group">
      {/* Image Header wrapper */}
      <div className="relative aspect-video w-full bg-muted overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-green-50">
            <span className="text-4xl">💡</span>
          </div>
        )}
        {isPaid && (
          <div className="absolute top-2 right-2">
            <PaidBadge price={price} />
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-5 space-y-4">
        {/* Category & Title */}
        <div className="space-y-2">
          <Badge variant="outline" className="border-primary text-primary bg-primary/5">
            {category.name}
          </Badge>
          <h3 className="font-semibold text-lg line-clamp-2 min-h-[56px] leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>

        {/* Description line clamp 3 */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>

        {/* Author info */}
        <div className="flex items-center gap-2 pt-2">
          <Avatar className="h-6 w-6 border">
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback className="text-[10px]">
              {author.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">
            {author.name} &middot; {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto flex-col gap-4 border-t border-border/50">
        <div className="flex items-center justify-between w-full pt-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-1.5" title={`${upvoteCount} up, ${downvoteCount} down`}>
              <Triangle className="h-4 w-4 text-primary fill-primary/20" />
              <span className={netVotes >= 0 ? "text-primary" : "text-destructive"}>
                {netVotes > 0 ? "+" : ""}{netVotes}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              <span>{commentCount}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors" asChild>
          <Link href={`/ideas/${id}`}>View Idea &rarr;</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
