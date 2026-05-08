"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { api } from "@/lib/api/client";
import type { NotificationItem } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function NotificationMenu() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const result = await api.notifications.list();
      setNotifications(result.data);
      setUnreadCount(result.meta.unreadCount);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAllRead = async () => {
    await api.notifications.markAllRead();
    setNotifications((items) => items.map((item) => ({ ...item, readAt: new Date().toISOString() })));
    setUnreadCount(0);
  };

  const markRead = async (id: string) => {
    await api.notifications.markRead(id);
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, readAt: new Date().toISOString() } : item))
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 ? (
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-[10px]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          ) : null}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-1.5 py-1">
          <span className="text-xs font-medium text-muted-foreground">Notifications</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2"
            onClick={markAllRead}
            disabled={!unreadCount}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Read all
          </Button>
        </div>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="flex h-24 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            No notifications yet.
          </div>
        ) : (
          notifications.slice(0, 8).map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              asChild={!!notification.href}
              className="items-start gap-3 whitespace-normal p-3"
              onClick={() => {
                if (!notification.readAt) {
                  markRead(notification.id);
                }
              }}
            >
              {notification.href ? (
                <Link href={notification.href}>
                  <NotificationContent notification={notification} />
                </Link>
              ) : (
                <div>
                  <NotificationContent notification={notification} />
                </div>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationContent({ notification }: { notification: NotificationItem }) {
  return (
    <div className="flex w-full gap-3">
      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.readAt ? "bg-muted" : "bg-primary"}`} />
      <span className="min-w-0">
        <span className="block text-sm font-medium leading-snug">{notification.title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{notification.body}</span>
      </span>
    </div>
  );
}
