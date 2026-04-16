"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth/betterAuthClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session?.user as any)?.role === "ADMIN";
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
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-muted-foreground"
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
                      <AvatarImage src={session.user.avatarUrl || undefined} alt={session.user.name} />
                      <AvatarFallback>{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
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
              <SheetContent side="right" className="w-full max-w-[320px] px-0">
                <SheetHeader className="border-b border-border px-6 pb-5 pt-6">
                  <SheetTitle className="flex items-center gap-2 text-left">
                    <Leaf className="h-5 w-5 text-primary" />
                    Ecofy
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col px-4 pb-6 pt-5">
                  <div className="space-y-1">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors ${
                          pathname === link.href
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                  <div className="my-5 h-px bg-border" />
                  <div className="space-y-3">
                  {isPending ? (
                    <Skeleton className="h-11 w-full rounded-xl" />
                  ) : session ? (
                    <>
                      <Link
                        href={dashboardLink}
                        className="flex min-h-12 items-center rounded-xl bg-muted/60 px-4 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Button
                        variant="ghost"
                        className="h-12 justify-start rounded-xl px-4 text-base hover:bg-accent hover:text-primary focus:bg-accent"
                        onClick={() => {
                          signOut();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Log out ({session.user.name})
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Button variant="outline" asChild className="h-12 w-full justify-center rounded-xl">
                        <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                          Log In
                        </Link>
                      </Button>
                      <Button asChild className="h-12 w-full justify-center rounded-xl">
                        <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    </div>
                  )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
