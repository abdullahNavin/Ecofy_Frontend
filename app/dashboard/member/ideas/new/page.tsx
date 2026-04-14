import { IdeaForm } from "@/components/ideas/IdeaForm";

export default function CreateIdeaPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create an Idea</h1>
        <p className="text-muted-foreground mt-1">
          Share your sustainability proposal with the community.
        </p>
      </div>
      
      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
        <IdeaForm />
      </div>
    </div>
  );
}
