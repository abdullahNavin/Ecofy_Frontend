"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Category } from "@/types";
import { useCallback, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface IdeaFiltersProps {
  categories: Category[];
}

export function IdeaFilters({ categories }: IdeaFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for debounced inputs
  const [q, setQ] = useState(searchParams.get("q") || "");
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete("page"); // Reset page on new filter
      return params.toString();
    },
    [searchParams]
  );

  const updateFilter = (name: string, value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`);
  };

  const clearAll = () => {
    setQ("");
    router.push(pathname);
  };

  // Debounced search handling
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateFilter("q", q);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Search</Label>
        <div className="flex gap-2">
          <Input 
            placeholder="Keyword..." 
            value={q} 
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleSearch}
          />
          <Button variant="secondary" onClick={() => updateFilter("q", q)}>Go</Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select 
          value={searchParams.get("category") || "all"} 
          onValueChange={(val) => updateFilter("category", val === "all" ? "" : val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select 
          value={searchParams.get("sort") || "recent"} 
          onValueChange={(val) => updateFilter("sort", val)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="top_voted">Top Voted</SelectItem>
            <SelectItem value="most_commented">Most Commented</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <Select 
          value={searchParams.has("paid") ? searchParams.get("paid")! : "all"} 
          onValueChange={(val) => updateFilter("paid", val === "all" ? "" : val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="false">Free</SelectItem>
            <SelectItem value="true">Premium (Paid)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center">
          <Label>Min Upvotes</Label>
          <span className="text-sm text-muted-foreground">{searchParams.get("minVotes") || 0}</span>
        </div>
        <Slider 
          min={0} 
          max={100} 
          step={5} 
          value={[parseInt(searchParams.get("minVotes") || "0")]} 
          onValueChange={(vals) => updateFilter("minVotes", vals[0].toString())}
        />
      </div>

      <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground" onClick={clearAll}>
        Clear All Filters
      </Button>
    </div>
  );
}
