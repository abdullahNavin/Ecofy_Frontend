"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth/betterAuthClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Ideas", href: "/ideas" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";
  const dashboardLink = isAdmin ? "/dashboard/admin" : "/dashboard/member";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary tracking-tight">Ecofy</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Section (Auth + Mobile Toggle) */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            {isPending ? (
              <Skeleton className="h-9 w-20" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name} />
                      <AvatarFallback>{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardLink}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/member/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </button>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    Ecofy
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-lg font-medium ${
                        pathname === link.href ? "text-primary" : "text-foreground"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="h-px bg-border my-2" />
                  {isPending ? (
                    <Skeleton className="h-10 w-full" />
                  ) : session ? (
                    <>
                      <Link
                        href={dashboardLink}
                        className="text-lg font-medium hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Button
                        variant="ghost"
                        className="justify-start px-0 text-lg hover:bg-transparent hover:text-primary focus:bg-transparent"
                        onClick={() => {
                          signOut();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Log out ({session.user.name})
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" asChild className="w-full justify-center">
                        <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                          Log In
                        </Link>
                      </Button>
                      <Button asChild className="w-full justify-center">
                        <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
