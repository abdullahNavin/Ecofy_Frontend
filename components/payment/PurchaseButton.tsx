"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import { useSession } from "@/lib/auth/betterAuthClient";
import { useRouter } from "next/navigation";

export function PurchaseButton({ ideaId, price }: { ideaId: string; price: number | string }) {
  const [loading, setLoading] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const formattedPrice = Number(price).toFixed(2);

  const handlePurchase = async () => {
    if (!session) {
      router.push(`/auth/login?from=/ideas/${ideaId}`);
      return;
    }

    setLoading(true);
    try {
      const { checkoutUrl } = await api.payments.createCheckout(ideaId);
      window.location.href = checkoutUrl;
    } catch {
      toast.error("Could not initiate payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePurchase} 
      disabled={loading || isPending} 
      size="lg" 
      className="w-full gap-2 text-lg shadow-lg"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Lock className="h-5 w-5" />
      )}
      {session ? `Unlock Idea — $${formattedPrice}` : "Login to Unlock Idea"}
    </Button>
  );
}
