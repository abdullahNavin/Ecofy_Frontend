"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [ideaId, setIdeaId] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }
    
    api.payments.verify(sessionId)
      .then((purchase) => {
        setStatus("success");
        setIdeaId(purchase.ideaId);
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-card p-8 text-center border border-border shadow-lg rounded-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
        
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <h2 className="text-2xl font-bold tracking-tight">Verifying Payment</h2>
            <p className="text-muted-foreground">Please wait while we confirm your transaction...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 animate-in bounce-in duration-500" />
            <h2 className="text-2xl font-bold tracking-tight">Payment Successful!</h2>
            <p className="text-muted-foreground">You have successfully unlocked the premium idea.</p>
            <div className="pt-6 w-full flex flex-col gap-3">
              <Button asChild className="w-full h-11 text-base">
                <Link href={ideaId ? `/ideas/${ideaId}` : "/dashboard/member/purchases"}>
                  View Idea <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-11 text-base">
                <Link href="/dashboard/member">Return to Dashboard</Link>
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-16 w-16 text-destructive" />
            <h2 className="text-2xl font-bold tracking-tight">Verification Failed</h2>
            <p className="text-muted-foreground">We couldn't verify your payment. If you were charged, please contact support.</p>
            <div className="pt-6 w-full">
              <Button asChild className="w-full h-11 text-base">
                <Link href="/dashboard/member">Return to Dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
