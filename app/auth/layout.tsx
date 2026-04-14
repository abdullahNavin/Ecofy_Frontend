import { Leaf } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex w-full">
      {/* Left branding panel */}
      <div className="hidden lg:flex w-1/2 bg-green-950 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-20 mix-blend-overlay" />
        
        <Link href="/" className="flex items-center gap-2 z-10 hover:opacity-90 transition-opacity">
          <Leaf className="h-8 w-8 text-primary-light" />
          <span className="font-bold text-2xl tracking-tight">Ecofy</span>
        </Link>
        
        <div className="z-10 bg-green-900/40 p-8 rounded-2xl backdrop-blur-sm border border-green-800/50 relative">
          <div className="absolute -top-4 -left-2 text-6xl text-green-500/20 font-serif">"</div>
          <blockquote className="text-2xl font-medium leading-relaxed relative z-10">
            We are the first generation to feel the effect of climate change and the last generation who can do something about it.
          </blockquote>
          <p className="mt-4 text-green-200 font-medium">— Barack Obama</p>
        </div>
      </div>
      
      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative bg-surface">
        <Link href="/" className="lg:hidden absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-primary tracking-tight">Ecofy</span>
        </Link>
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
