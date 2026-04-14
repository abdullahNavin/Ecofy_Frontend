import { Badge } from "@/components/ui/badge";
import { IdeaStatus } from "@/types";

const STATUS_CONFIG = {
  DRAFT:        { label: "Draft",        className: "bg-gray-100 text-gray-600 border-gray-300" },
  UNDER_REVIEW: { label: "Under Review", className: "bg-amber-100 text-amber-700 border-amber-200" },
  APPROVED:     { label: "Approved",     className: "bg-green-100 text-green-700 border-green-200" },
  REJECTED:     { label: "Rejected",     className: "bg-red-100 text-red-700 border-red-200" },
} as const;

export function IdeaStatusBadge({ status }: { status: IdeaStatus }) {
  const { label, className } = STATUS_CONFIG[status];
  return <Badge variant="outline" className={className}>{label}</Badge>;
}
