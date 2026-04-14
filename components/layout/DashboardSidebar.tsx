"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Lightbulb,
  Pencil,
  CreditCard,
  User,
  BarChart2,
  ClipboardList,
  Users,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: "MEMBER" | "ADMIN";
}

const MEMBER_LINKS = [
  { name: "Overview", href: "/dashboard/member", icon: Home },
  { name: "My Ideas", href: "/dashboard/member/ideas", icon: Lightbulb },
  { name: "Create Idea", href: "/dashboard/member/ideas/new", icon: Pencil },
  { name: "Purchases", href: "/dashboard/member/purchases", icon: CreditCard },
  { name: "Profile", href: "/dashboard/member/profile", icon: User },
];

const ADMIN_LINKS = [
  { name: "Overview", href: "/dashboard/admin", icon: BarChart2 },
  { name: "Moderation", href: "/dashboard/admin/ideas", icon: ClipboardList },
  { name: "Users", href: "/dashboard/admin/users", icon: Users },
  { name: "Categories", href: "/dashboard/admin/categories", icon: Tags },
];

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = role === "ADMIN" ? ADMIN_LINKS : MEMBER_LINKS;

  return (
    <nav className="flex flex-col gap-2 w-full">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
