"use client";

import { useForm as useRHForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Category, CreateIdeaDto, IdeaAssistantSuggestion } from "@/types";
import { api } from "@/lib/api/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ideaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  problemStatement: z.string().min(20, "Problem statement must be at least 20 characters"),
  proposedSolution: z.string().min(20, "Solution must be at least 20 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  isPaid: z.boolean(),
  price: z.number().min(0).optional().nullable(),
  images: z.string().optional(), // We'll parse this to array
});

type IdeaFormValues = z.infer<typeof ideaSchema>;

interface IdeaFormProps {
  initialData?: Partial<CreateIdeaDto> & { id?: string; categoryId?: string; price?: number | string };
  isEdit?: boolean;
}

export function IdeaForm({ initialData, isEdit = false }: IdeaFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const [assistantResult, setAssistantResult] = useState<IdeaAssistantSuggestion | null>(null);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch, getValues } = useRHForm<IdeaFormValues>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      title: initialData?.title || "",
      categoryId: initialData?.categoryId || "",
      problemStatement: initialData?.problemStatement || "",
      proposedSolution: initialData?.proposedSolution || "",
      description: initialData?.description || "",
      isPaid: initialData?.isPaid || false,
      price: initialData?.price !== undefined && initialData?.price !== null ? Number(initialData.price) : undefined,
      images: initialData?.images?.join(", ") || "",
    }
  });

  const isPaid = watch("isPaid");
  const categoryId = watch("categoryId");

  useEffect(() => {
    api.categories.list().then(setCategories).catch(() => {});
  }, []);

  const applyAssistantSuggestion = (suggestion: IdeaAssistantSuggestion) => {
    setValue("title", suggestion.title, { shouldDirty: true, shouldValidate: true });
    setValue("categoryId", suggestion.categoryId, { shouldDirty: true, shouldValidate: true });
    setValue("problemStatement", suggestion.problemStatement, { shouldDirty: true, shouldValidate: true });
    setValue("proposedSolution", suggestion.proposedSolution, { shouldDirty: true, shouldValidate: true });
    setValue("description", suggestion.description, { shouldDirty: true, shouldValidate: true });
  };

  const runAssistant = async () => {
    const values = getValues();
    setIsAssistantLoading(true);
    try {
      const suggestion = await api.ai.ideaAssistant({
        ideaId: initialData?.id,
        title: values.title,
        categoryId: values.categoryId,
        problemStatement: values.problemStatement,
        proposedSolution: values.proposedSolution,
        description: values.description,
        isPaid: values.isPaid,
        price: values.price ?? undefined,
        images: values.images ? values.images.split(",").map((item) => item.trim()).filter(Boolean) : [],
        prompt: assistantPrompt || undefined,
      });
      setAssistantResult(suggestion);
      toast.success("AI suggestion is ready");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate AI suggestion");
    } finally {
      setIsAssistantLoading(false);
    }
  };

  const onSubmit = async (data: IdeaFormValues) => {
    setIsSubmitting(true);
    try {
      const dto: CreateIdeaDto = {
        title: data.title,
        categoryId: data.categoryId,
        problemStatement: data.problemStatement,
        proposedSolution: data.proposedSolution,
        description: data.description,
        isPaid: data.isPaid,
        price: data.isPaid ? (data.price ?? undefined) : undefined,
        images: data.images ? data.images.split(",").map(i => i.trim()).filter(Boolean) : [],
      };

      if (isEdit && initialData?.id) {
        await api.ideas.update(initialData.id, dto);
        toast.success("Idea updated successfully");
      } else {
        await api.ideas.create(dto);
        toast.success("Idea created successfully. It is now DRAFT.");
      }
      
      router.push("/dashboard/member/ideas");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save idea");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Idea Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assistantPrompt">What kind of help do you want?</Label>
            <Textarea
              id="assistantPrompt"
              value={assistantPrompt}
              onChange={(event) => setAssistantPrompt(event.target.value)}
              placeholder="Example: make this clearer for community voters, add practical implementation steps, and suggest a better title."
              className="min-h-24"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={runAssistant} disabled={isAssistantLoading}>
              {isAssistantLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Suggestion
            </Button>
            {assistantResult ? (
              <Button type="button" variant="outline" onClick={() => applyAssistantSuggestion(assistantResult)}>
                Apply All Suggestions
              </Button>
            ) : null}
          </div>

          {assistantResult ? (
            <div className="space-y-4 rounded-lg border bg-background p-4">
              <div>
                <p className="text-sm font-medium">Suggested title</p>
                <p className="text-sm text-muted-foreground">{assistantResult.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Suggested category</p>
                <p className="text-sm text-muted-foreground">{assistantResult.categoryName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Why these changes</p>
                <p className="text-sm text-muted-foreground">{assistantResult.rationale}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Improvement checklist</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {assistantResult.improvementChecklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" {...register("title")} placeholder="e.g., Community Composting Initiative" />
        {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Category *</Label>
        <Select 
          value={categoryId || undefined}
          onValueChange={(val) => setValue("categoryId", val ?? "")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register("categoryId")} />
        {errors.categoryId && <p className="text-destructive text-sm">{errors.categoryId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="problemStatement">Problem Statement *</Label>
        <Textarea 
          id="problemStatement" 
          {...register("problemStatement")} 
          placeholder="What specific problem are you trying to solve?" 
          className="h-24"
        />
        {errors.problemStatement && <p className="text-destructive text-sm">{errors.problemStatement.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="proposedSolution">Proposed Solution *</Label>
        <Textarea 
          id="proposedSolution" 
          {...register("proposedSolution")} 
          placeholder="How does your idea solve the problem?" 
          className="h-24"
        />
        {errors.proposedSolution && <p className="text-destructive text-sm">{errors.proposedSolution.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Full Description *</Label>
        <Textarea 
          id="description" 
          {...register("description")} 
          placeholder="Provide detailed information, plans, and implementation steps..." 
          className="h-48"
        />
        {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Images (Comma separated URLs)</Label>
        <Input id="images" {...register("images")} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
        <p className="text-xs text-muted-foreground">Optional: Provide direct links to images.</p>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg space-y-4 border border-border">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Make Idea Premium</Label>
            <p className="text-sm text-muted-foreground">Charge users to view the 'Proposed Solution' and 'Full Description'.</p>
          </div>
          <Switch 
            checked={isPaid}
            onCheckedChange={(val) => setValue("isPaid", val)}
          />
        </div>

        {isPaid && (
          <div className="space-y-2 pt-2 animate-in fade-in">
            <Label htmlFor="price">Price (USD) *</Label>
            <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} placeholder="19.99" />
            {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update Idea" : "Create Idea"}
        </Button>
      </div>
    </form>
  );
}
