"use client";

import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api/client";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      await api.newsletter.subscribe(email);
      toast.success("Subscribed to newsletter!");
      setEmail("");
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="text-primary">🌿</span> Ecofy
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering communities to fund, build, and share sustainable ideas for a greener tomorrow.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h4 className="font-semibold tracking-tight">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/ideas" className="hover:text-primary transition-colors">Ideas</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold tracking-tight">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Use</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold tracking-tight">Newsletter</h4>
            <p className="text-sm text-muted-foreground">
              Get the latest sustainability ideas and news delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent"
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Ecofy. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
