import Link from "next/link";
import { api } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IdeaGrid } from "@/components/ideas/IdeaGrid";
import { Leaf, ChevronDown, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch Featured and Categories concurrently
  const [featuredData, categories] = await Promise.all([
    api.ideas.list({ sort: "top_voted", limit: 6 }).catch(() => ({ data: [], meta: null })),
    api.categories.list().catch(() => []),
  ]);

  const topIdeas = featuredData.data?.slice(0, 3) || [];

  return (
    <div className="flex flex-col flex-1 w-full relative">
      {/* ── 1. Hero Section ── */}
      <section className="relative w-full py-24 lg:py-32 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground max-w-4xl">
            Fund and build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">future of sustainability</span>.
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Ecofy is a community-driven platform to share, vote on, and fund green ideas that make a real difference in the world.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" className="w-full sm:w-auto gap-2" asChild>
              <Link href="/ideas">
                <Leaf className="h-5 w-5" />
                Explore Ideas
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-foreground/20" asChild>
              <Link href="/dashboard/member/ideas/new">Share Your Idea</Link>
            </Button>
          </div>
          <ChevronDown className="h-8 w-8 text-primary mt-16 animate-bounce opacity-50" />
        </div>
      </section>

      {/* ── 2. Inline Search Card ── */}
      <section className="relative z-10 -mt-10 px-4 md:px-6 max-w-4xl mx-auto w-full">
        <div className="bg-surface rounded-2xl shadow-xl p-4 md:p-6 border border-border/50">
          <form action="/ideas" className="flex flex-col sm:flex-row gap-4">
            <Input 
              name="q"
              placeholder="Search ideas by keyword..." 
              className="flex-1 h-12 text-base"
            />
            <Select name="category">
              <SelectTrigger className="w-full sm:w-[200px] h-12">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" size="lg" className="h-12 w-full sm:w-auto px-8">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* ── 3. Top 3 Spotlight ── */}
      {topIdeas.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Community Favorites</h2>
            <p className="text-muted-foreground mt-2">The most upvoted green initiatives right now.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {topIdeas.map((idea, index) => (
              <div key={idea.id} className={`transform transition-all ${index === 1 ? 'md:-translate-y-4 md:scale-105' : ''}`}>
                <div className="relative border-l-4 border-l-primary bg-card rounded-r-xl shadow-md p-6 group hover:shadow-lg transition-all h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xl group-hover:text-primary transition-colors line-clamp-2">{idea.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{idea.description}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <Triangle className="h-4 w-4" fill="currentColor" /> {idea.upvoteCount - idea.downvoteCount}
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/ideas/${idea.id}`}>Read more</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 4. Featured Ideas Grid ── */}
      <section className="bg-muted/30 w-full py-20 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Ideas</h2>
              <p className="text-muted-foreground mt-1">Discover projects making an impact.</p>
            </div>
            <Button variant="ghost" className="text-primary hover:text-primary-dark" asChild>
              <Link href="/ideas">See All &rarr;</Link>
            </Button>
          </div>
          <IdeaGrid ideas={featuredData.data || []} />
        </div>
      </section>

      {/* ── 5. How It Works ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-24 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            From an initial spark to a fully funded reality, Ecofy makes community collaboration seamless.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border -z-10" />
          
          {[
            {
              num: 1,
              title: "Share an Idea",
              desc: "Submit your sustainability proposal. Detail the problem, your solution, and attach visualizations."
            },
            {
              num: 2,
              title: "Community Votes",
              desc: "Engage with the community. Members upvote and comment to refine the most promising projects."
            },
            {
              num: 3,
              title: "Come to Life",
              desc: "Top ideas get curated. Premium ideas can be directly funded by supporters via secure payments."
            }
          ].map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center bg-card p-6 rounded-2xl shadow-sm border border-border/50">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-md ring-4 ring-primary-light">
                {step.num}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Newsletter CTA ── */}
      <section className="w-full bg-green-900 py-24 relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 top-0 opacity-10 pattern-dots" />
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center text-white space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to make an impact?</h2>
          <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto">
            Join thousands of changemakers inside the community. We send out the top 5 ideas once a week. Let’s build a sustainable future together.
          </p>
          <div className="flex justify-center mt-8">
            <Button size="lg" variant="secondary" className="mr-4 text-green-900 font-bold px-8" asChild>
              <Link href="/auth/signup">Join Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Inline Icon to keep it self contained without import errors
function Triangle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    </svg>
  );
}
