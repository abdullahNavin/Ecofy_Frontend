import { IdeaGrid } from "@/components/ideas/IdeaGrid";
import { IdeaFilters } from "@/components/ideas/IdeaFilters";
import { IdeaQueryParams } from "@/types";
import { api } from "@/lib/api/client";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const unresolvedSearchParams = await searchParams;
  const pageParams = new URLSearchParams();
  
  const page = Number(unresolvedSearchParams.page) || 1;
  const limit = Number(unresolvedSearchParams.limit) || 10;
  
  const query: IdeaQueryParams = {
    page,
    limit,
    sort: (unresolvedSearchParams.sort as "recent" | "top_voted" | "most_commented") || "recent",
  };

  if (unresolvedSearchParams.category) query.category = String(unresolvedSearchParams.category);
  if (unresolvedSearchParams.q) query.q = String(unresolvedSearchParams.q);
  if (unresolvedSearchParams.minVotes) query.minVotes = Number(unresolvedSearchParams.minVotes);
  if (unresolvedSearchParams.paid !== undefined) query.paid = unresolvedSearchParams.paid === "true";

  Object.entries(unresolvedSearchParams).forEach(([key, value]) => {
    if (key === "page" || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((entry) => pageParams.append(key, entry));
      return;
    }
    pageParams.set(key, value);
  });

  const getPageHref = (nextPage: number) => {
    const params = new URLSearchParams(pageParams.toString());
    params.set("page", String(nextPage));
    return `?${params.toString()}`;
  };

  // Fetch data
  const [ideasData, categories] = await Promise.all([
    api.ideas.list(query).catch(() => ({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } })),
    api.categories.list().catch(() => []),
  ]);

  const ideas = Array.isArray(ideasData) ? ideasData : (ideasData?.data || []);
  const meta = ideasData && !Array.isArray(ideasData) ? ideasData.meta : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 w-full flex-1">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore Ideas</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Showing {Math.min(((meta?.page ?? 1) - 1) * (meta?.limit ?? 10) + 1, meta?.total || 0)}–{Math.min((meta?.page ?? 1) * (meta?.limit ?? 10), meta?.total || 0)} of {meta?.total || 0} results
          </p>
        </div>

        {/* Mobile Filters Trigger */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 text-xs gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="mb-6">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <IdeaFilters categories={categories} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Filters</h3>
            <IdeaFilters categories={categories} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <IdeaGrid ideas={ideas} emptyMessage="No ideas matched your criteria. Try loosening the filters." />
          
          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href={getPageHref(Math.max(1, page - 1))}
                      className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: meta.totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        href={getPageHref(i + 1)}
                        isActive={page === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      href={getPageHref(Math.min(meta.totalPages, page + 1))}
                      className={page >= meta.totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
