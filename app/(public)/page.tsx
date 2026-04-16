import Link from "next/link";
import { api } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IdeaGrid } from "@/components/ideas/IdeaGrid";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Leaf,
  MessageCircle,
  Search,
  Sparkles,
  Triangle as TriangleIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch Featured and Categories concurrently
  const [featuredData, categories] = await Promise.all([
    api.ideas.list({ sort: "top_voted", limit: 6 }).catch(() => ({ data: [], meta: null })),
    api.categories.list().catch(() => []),
  ]);

  const featuredIdeas = Array.isArray(featuredData) ? featuredData : featuredData?.data || [];
  const topIdeas = featuredIdeas.slice(0, 3);

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
      <section className="relative z-10 -mt-10 mx-auto w-full max-w-5xl px-4 md:px-6">
        <div className="rounded-[28px] border border-border/60 bg-background/95 p-5 shadow-2xl backdrop-blur md:p-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Quick Discovery
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Search for ideas worth backing</h2>
                <p className="text-sm text-muted-foreground">
                  Jump straight into the topics, categories, and sustainability concepts that match your goals.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border bg-background px-3 py-1">Top voted</span>
                <span className="rounded-full border border-border bg-background px-3 py-1">Newest ideas</span>
                <span className="rounded-full border border-border bg-background px-3 py-1">Premium concepts</span>
              </div>
            </div>

            <form action="/ideas" className="grid gap-3 md:grid-cols-[1.5fr_0.9fr_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  placeholder="Search by keyword, topic, or sustainability challenge"
                  className="h-14 rounded-2xl border-border/70 bg-background pl-11 text-base"
                />
              </div>

              <div className="relative">
                <select
                  name="category"
                  defaultValue=""
                  className="h-14 w-full appearance-none rounded-2xl border border-input bg-background px-4 pr-10 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>

              <Button type="submit" size="lg" className="h-14 rounded-2xl px-8">
                Search Ideas
              </Button>
            </form>

            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                href="/ideas?sort=top_voted"
                className="rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="font-semibold">Browse what the community loves</div>
                <div className="mt-1 text-muted-foreground">Start with the highest-voted ideas.</div>
              </Link>
              <Link
                href="/ideas?paid=true"
                className="rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="font-semibold">Explore premium concepts</div>
                <div className="mt-1 text-muted-foreground">Find detailed, monetized project plans.</div>
              </Link>
              <Link
                href="/ideas?sort=most_commented"
                className="rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="font-semibold">See active discussions</div>
                <div className="mt-1 text-muted-foreground">Follow ideas with the most community feedback.</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Top 3 Spotlight ── */}
      {topIdeas.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 w-full">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-800">
                <Sparkles className="h-3.5 w-3.5" />
                Community Favorites
              </div>
              <h2 className="text-3xl font-bold tracking-tight">The ideas people are rallying behind</h2>
              <p className="text-muted-foreground mt-2">
                A sharper look at the most supported sustainability concepts on Ecofy right now.
              </p>
            </div>
            <Button variant="outline" className="w-full md:w-auto" asChild>
              <Link href="/ideas?sort=top_voted">
                View Full Ranking
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.9fr_0.9fr]">
            {topIdeas.map((idea, index) => (
              <article
                key={idea.id}
                className={`group relative overflow-hidden rounded-[28px] border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${
                  index === 0 ? "xl:min-h-[360px] xl:p-8" : ""
                }`}
              >
                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  #{index + 1}
                </div>
                <div className="flex h-full flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        {idea.category.name}
                      </span>
                      {idea.isPaid ? (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                          Premium
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                          Free Access
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className={`font-bold leading-tight transition-colors group-hover:text-primary ${index === 0 ? "text-2xl md:text-3xl" : "text-xl"}`}>
                        {idea.title}
                      </h3>
                      <p className={`mt-3 text-muted-foreground ${index === 0 ? "line-clamp-4 text-base" : "line-clamp-3 text-sm"}`}>
                        {idea.description || "Premium details stay protected until a supporter unlocks this idea."}
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground">
                        By <span className="font-medium text-foreground">{idea.author.name}</span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 rounded-2xl bg-muted/50 p-4 text-sm">
                      <div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <TriangleIcon className="h-4 w-4 text-primary" />
                          Votes
                        </div>
                        <div className="mt-1 text-lg font-bold text-foreground">
                          {idea.upvoteCount - idea.downvoteCount > 0 ? "+" : ""}
                          {idea.upvoteCount - idea.downvoteCount}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MessageCircle className="h-4 w-4 text-sky-600" />
                          Comments
                        </div>
                        <div className="mt-1 text-lg font-bold text-foreground">{idea.commentCount}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Status
                        </div>
                        <div className="mt-1 text-sm font-semibold text-foreground">Community Pick</div>
                      </div>
                    </div>
                    <Button variant={index === 0 ? "default" : "outline"} className="w-full" asChild>
                      <Link href={`/ideas/${idea.id}`}>
                        Explore Idea
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
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
          <IdeaGrid ideas={featuredIdeas} />
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
            <Button size="lg" variant="secondary" className="mr-4 px-8 font-bold text-green-900" asChild>
              <Link href="/auth/signup">Join Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
