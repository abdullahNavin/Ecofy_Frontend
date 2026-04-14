import { api } from "@/lib/api/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PaidBadge } from "@/components/payment/PaidBadge";
import { IdeaStatusBadge } from "@/components/ideas/IdeaStatusBadge";
import { VoteBar } from "@/components/ideas/VoteBar";
import { CommentThread } from "@/components/comments/CommentThread";
import { PurchaseButton } from "@/components/payment/PurchaseButton";
import { ChevronRight, Home, Eye, Lock, MessageCircle } from "lucide-react";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  // We fetch directly; if the user has a cookie, the server needs to pass it to the API 
  // via our api client which doesn't know about server component cookies natively unless patched.
  // BUT the exact instruction for next.js server fetch with cookies is to inject them.
  // For simplicity, we just use raw fetch for the server component here to forward cookies.
  
  const headers = new Headers();
  if (sessionToken) {
    headers.set("Cookie", `better-auth.session_token=${sessionToken}`);
  }

  let idea;
  let comments = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ideas/${id}`, { headers });
    if (!res.ok) {
      if (res.status === 404) notFound();
      throw new Error("Failed to fetch idea");
    }
    const data = await res.json();
    idea = data.data;

    // Fetch comments
    const commentsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ideas/${id}/comments`, { headers });
    if (commentsRes.ok) {
      const commentsData = await commentsRes.json();
      comments = commentsData.data;
    }
  } catch (error) {
    notFound();
  }

  const isLocked = idea.isPaid && !idea.isPurchased;
  const showAdminActions = false; // Admin check would go here based on role cookie "ecofy.role" === "ADMIN"

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 w-full relative">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <Home className="h-4 w-4" /> Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/ideas" className="hover:text-primary transition-colors">
          Ideas
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">
          {idea.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Main Column */}
        <div className="space-y-8 min-w-0">
          
          {/* Header Card */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <IdeaStatusBadge status={idea.status} />
              {idea.isPaid && <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200"><Lock className="h-3 w-3 mr-1" /> Premium</Badge>}
              <Badge variant="outline" className="border-primary text-primary bg-primary/5">{idea.category.name}</Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {idea.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={idea.author.avatarUrl} alt={idea.author.name} />
                  <AvatarFallback>{idea.author.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{idea.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground border-l pl-6">
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {idea.commentCount} Comments
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {Math.floor(Math.random() * 500) + 50} Views
                </div>
              </div>
            </div>
          </div>

          {/* Primary Image */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted border border-border/50">
            {idea.images && idea.images[0] ? (
              <Image src={idea.images[0]} alt="Idea cover" fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-green-50 shadow-inner">
                <span className="text-6xl opacity-50">💡</span>
              </div>
            )}
            {idea.isPaid && (
              <div className="absolute top-4 right-4 z-10">
                <PaidBadge price={idea.price} />
              </div>
            )}
          </div>

          {/* Content sections wrapper (blurred if locked) */}
          <div className={`space-y-8 relative ${isLocked ? "pointer-events-none" : ""}`}>
            {isLocked && (
              <div className="absolute inset-0 z-20 backdrop-blur-md bg-background/40 flex flex-col items-center justify-center rounded-xl p-6 pointer-events-auto border border-border/50 shadow-2xl">
                <Lock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-center">Premium Idea</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  This idea contains detailed implementation plans and exclusive content. Unlock it to see the full details.
                </p>
                <div className="w-full max-w-xs pointer-events-auto">
                  <PurchaseButton ideaId={idea.id} price={idea.price!} />
                </div>
              </div>
            )}

            <Card className={isLocked ? "blur-sm" : ""}>
              <CardContent className="p-6 md:p-8 space-y-8">
                <section>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                    Problem Statement
                  </h3>
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap pl-10">
                    {idea.problemStatement}
                  </p>
                </section>
                
                <Separator />
                
                <section>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                    Proposed Solution
                  </h3>
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap pl-10">
                    {idea.proposedSolution}
                  </p>
                </section>
                
                <Separator />
                
                <section>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                    Full Description
                  </h3>
                  <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap pl-10 prose prose-green max-w-none">
                    {idea.description}
                  </div>
                </section>
              </CardContent>
            </Card>

            {/* Voting Bar */}
            <div className={`flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border ${isLocked ? "blur-sm" : ""}`}>
              <VoteBar 
                ideaId={idea.id} 
                initialUpvotes={idea.upvoteCount} 
                initialDownvotes={idea.downvoteCount} 
                initialUserVote={idea.userVote || null} 
              />
            </div>

            {/* Comments Thread */}
            <div className={isLocked ? "blur-sm" : ""}>
              <CommentThread ideaId={idea.id} initialComments={comments} />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-lg mb-4">Idea Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Status</span>
                  <IdeaStatusBadge status={idea.status} />
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium text-right">{idea.category.name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Submitted</span>
                  <span className="font-medium text-right text-xs">
                    {new Date(idea.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Author</span>
                  <span className="font-medium text-right">{idea.author.name}</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-6" asChild>
                <Link href={`/users/${idea.author.id}`}>View Author Profile</Link>
              </Button>
            </CardContent>
          </Card>

          {isLocked && (
            <Card className="border-primary/50 shadow-md overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-green-400 to-primary" />
              <CardContent className="p-5 flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Premium Content</h4>
                  <p className="text-sm text-muted-foreground mt-1">Unlock this idea to view the full details and participate in the discussion.</p>
                </div>
                <PurchaseButton ideaId={idea.id} price={idea.price!} />
              </CardContent>
            </Card>
          )}

          {showAdminActions && (
             <Card className="border-destructive/30">
               <CardContent className="p-5 space-y-3">
                 <h4 className="font-bold text-destructive flex items-center gap-2"><Lock className="h-4 w-4"/> Admin Actions</h4>
                 <Button className="w-full bg-green-600 hover:bg-green-700">Approve</Button>
                 <Button variant="destructive" className="w-full">Reject</Button>
                 <Button variant="outline" className="w-full">Delete Idea</Button>
               </CardContent>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
}
