"use client";

import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-card p-8 text-center border border-border/50 shadow-sm rounded-2xl">
        <div className="flex flex-col items-center space-y-4">
          <XCircle className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold tracking-tight">Payment Cancelled</h2>
          <p className="text-muted-foreground">
            You've cancelled the checkout process. You haven't been charged.
          </p>
          <div className="pt-6 w-full flex flex-col gap-3">
            <Button onClick={() => router.back()} className="w-full h-11 text-base">
              Try Again
            </Button>
            <Button asChild variant="outline" className="w-full h-11 text-base">
              <Link href="/ideas">Explore Other Ideas</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
