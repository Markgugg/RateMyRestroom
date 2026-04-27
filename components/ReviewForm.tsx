"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { reviewSchema, type ReviewInput } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/client";
import RatingStars from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ReviewForm({ restroomId }: { restroomId: string }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { cleanliness: 0, privacy: 0, amenities: 0, body: "" },
  });

  async function onSubmit(data: ReviewInput) {
    setServerError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setServerError("You must be logged in to post a review.");
      return;
    }
    const { error } = await supabase.from("reviews").insert({
      restroom_id: restroomId,
      user_id: user.id,
      cleanliness: data.cleanliness,
      privacy: data.privacy,
      amenities: data.amenities,
      body: data.body,
    });
    if (error) {
      setServerError(error.message);
    } else {
      setSuccess(true);
      router.refresh();
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border bg-secondary/30 p-4 text-sm text-center text-muted-foreground">
        Review submitted! Thanks for your feedback.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {(["cleanliness", "privacy", "amenities"] as const).map((field) => (
        <div key={field}>
          <Label className="capitalize mb-2 block">{field}</Label>
          <Controller
            control={control}
            name={field}
            render={({ field: f }) => (
              <RatingStars value={f.value} onChange={f.onChange} />
            )}
          />
          {errors[field] && (
            <p className="text-destructive text-xs mt-1">{errors[field]?.message}</p>
          )}
        </div>
      ))}
      <div>
        <Label htmlFor="body" className="mb-2 block">Your review</Label>
        <Textarea
          id="body"
          rows={4}
          placeholder="Tell other students about this restroom…"
          {...register("body")}
        />
        {errors.body && <p className="text-destructive text-xs mt-1">{errors.body.message}</p>}
      </div>
      {serverError && <p className="text-destructive text-sm">{serverError}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}
