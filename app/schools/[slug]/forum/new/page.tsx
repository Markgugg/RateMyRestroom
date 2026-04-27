"use client";

import { useState, use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { threadSchema, type ThreadInput } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewThreadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ThreadInput>({ resolver: zodResolver(threadSchema) });

  async function onSubmit(data: ThreadInput) {
    setServerError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setServerError("You must be logged in to post.");
      return;
    }

    const { data: school } = await supabase
      .from("schools")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!school) {
      setServerError("School not found.");
      return;
    }

    const { data: thread, error } = await supabase
      .from("forum_threads")
      .insert({ school_id: school.id, user_id: user.id, title: data.title, body: data.body })
      .select("id")
      .single();

    if (error) {
      setServerError(error.message);
    } else {
      router.push(`/schools/${slug}/forum/${thread.id}`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-4 text-sm text-muted-foreground">
        <Link href={`/schools/${slug}/forum`} className="hover:underline text-primary">← Forum</Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">New thread</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} placeholder="Thread title" />
              {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="body">Body</Label>
              <Textarea id="body" rows={6} {...register("body")} placeholder="What's on your mind?" />
              {errors.body && <p className="text-destructive text-xs">{errors.body.message}</p>}
            </div>
            {serverError && <p className="text-destructive text-sm">{serverError}</p>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting…" : "Post thread"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
