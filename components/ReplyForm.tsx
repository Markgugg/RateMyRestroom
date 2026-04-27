"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { replySchema, type ReplyInput } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ReplyForm({ threadId }: { threadId: string }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReplyInput>({ resolver: zodResolver(replySchema) });

  async function onSubmit(data: ReplyInput) {
    setServerError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setServerError("You must be logged in to reply.");
      return;
    }
    const { error } = await supabase.from("forum_replies").insert({
      thread_id: threadId,
      user_id: user.id,
      body: data.body,
    });
    if (error) {
      setServerError(error.message);
    } else {
      reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Textarea
        rows={3}
        placeholder="Write a reply…"
        {...register("body")}
      />
      {errors.body && <p className="text-destructive text-xs">{errors.body.message}</p>}
      {serverError && <p className="text-destructive text-sm">{serverError}</p>}
      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting ? "Posting…" : "Reply"}
      </Button>
    </form>
  );
}
