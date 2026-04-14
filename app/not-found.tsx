import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-4 text-center">
      <Leaf className="h-16 w-16 text-muted-foreground opacity-20 mb-6" />
      <h2 className="text-4xl font-bold tracking-tight mb-2">404 - Page Not Found</h2>
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild size="lg" className="px-8">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
