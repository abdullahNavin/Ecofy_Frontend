import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaidBadgeProps {
  price?: number;
  className?: string;
}

export function PaidBadge({ price, className }: PaidBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm gap-1 border-0", className)}
    >
      <Lock className="h-3 w-3" />
      {price !== undefined && price !== null ? `$${Number(price).toFixed(2)}` : "Paid"}
    </Badge>
  );
}
