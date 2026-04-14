import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-32 px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Blog & Resources</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-lg">
        We are currently brewing up some amazing content. Check back soon for the latest sustainability news and tips!
      </p>
      <Button asChild size="lg">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
