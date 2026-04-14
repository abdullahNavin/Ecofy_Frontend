import { Leaf, Users, CheckCircle, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero */}
      <section className="bg-primary/5 py-24 px-4 md:px-6 w-full border-b border-border text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
          We empower communities to bring sustainable ideas to life.
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
          Ecofy bridges the gap between individuals with brilliant green concepts and the communities ready to fund and build them.
        </p>
      </section>

      {/* Mission */}
      <section className="py-24 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-wider text-sm">
              <Leaf className="h-5 w-5" /> Our Mission
            </div>
            <h2 className="text-3xl font-bold">Accelerating global sustainability through local innovation.</h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe that the best solutions to climate change come from the people affected by it. By providing a platform for idea sharing, democratic voting, and direct funding, Ecofy removes the friction from environmental activism.
            </p>
          </div>
          <div className="aspect-square bg-muted rounded-2xl relative overflow-hidden bg-[url('/hero-pattern.svg')] border border-border/50 shadow-inner flex items-center justify-center">
            <Globe className="h-48 w-48 text-primary/10" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface py-24 px-4 md:px-6 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Core Values</h2>
          <div className="grid sm:grid-cols-3 gap-10">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-primary/10 mx-auto rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl">Community First</h3>
              <p className="text-muted-foreground">Real change happens when communities mobilize. We build tools that make collaboration easy and transparent.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-amber-500/10 mx-auto rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="font-bold text-xl">Quality Ideas</h3>
              <p className="text-muted-foreground">A strict moderation and voting system ensures that only the most viable, impactful projects rise to the top.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-blue-500/10 mx-auto rounded-full flex items-center justify-center">
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-xl">Global Impact</h3>
              <p className="text-muted-foreground">Every local project contributes to global goals. We track impact to show that every action counts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 md:px-6 text-center max-w-3xl mx-auto space-y-8">
        <h2 className="text-4xl font-bold">Ready to join the movement?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="px-8"><Link href="/auth/signup">Create an Account</Link></Button>
          <Button size="lg" variant="outline" asChild className="px-8"><Link href="/ideas">Explore Ideas</Link></Button>
        </div>
      </section>
    </div>
  );
}
