"use client";

import { useForm } from "react-form"; // Wait, we should use 'react-hook-form' with 'zod' based on PRD.
// I'll rewrite this cleanly using basic react-hook-form
import { useForm as useRHForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Category, CreateIdeaDto } from "@/types";
import { api } from "@/lib/api/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const ideaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  problemStatement: z.string().min(20, "Problem statement must be at least 20 characters"),
  proposedSolution: z.string().min(20, "Solution must be at least 20 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  isPaid: z.boolean().default(false),
  price: z.number().min(0).optional().nullable(),
  images: z.string().optional(), // We'll parse this to array
});

type IdeaFormValues = z.infer<typeof ideaSchema>;

interface IdeaFormProps {
  initialData?: Partial<CreateIdeaDto> & { id?: string };
  isEdit?: boolean;
}

export function IdeaForm({ initialData, isEdit = false }: IdeaFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useRHForm<IdeaFormValues>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      title: initialData?.title || "",
      categoryId: initialData?.categoryId || "",
      problemStatement: initialData?.problemStatement || "",
      proposedSolution: initialData?.proposedSolution || "",
      description: initialData?.description || "",
      isPaid: initialData?.isPaid || false,
      price: initialData?.price || undefined,
      images: initialData?.images?.join(", ") || "",
    }
  });

  const isPaid = watch("isPaid");

  useEffect(() => {
    api.categories.list().then(setCategories).catch(() => {});
  }, []);

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
        price: data.isPaid ? (data.price || null) : null,
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
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" {...register("title")} placeholder="e.g., Community Composting Initiative" />
        {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Category *</Label>
        <Select 
          defaultValue={initialData?.categoryId} 
          onValueChange={(val) => setValue("categoryId", val)}
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
