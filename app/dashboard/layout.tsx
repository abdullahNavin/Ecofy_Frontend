import { cookies } from "next/headers";
import Link from "next/link";
import { Leaf, Menu } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get("ecofy.role")?.value === "ADMIN" ? "ADMIN" : "MEMBER";

  return (
    <div className="min-h-screen flex w-full bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-surface shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">Ecofy</span>
          </Link>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <DashboardSidebar role={role} />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Navbar */}
        <header className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-border bg-surface shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Ecofy</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="h-16 flex items-start justify-center px-6 border-b border-border text-left">
                <SheetTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  Ecofy Dashboard
                </SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <DashboardSidebar role={role} />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
