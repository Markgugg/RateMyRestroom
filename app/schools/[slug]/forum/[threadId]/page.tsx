import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import ReplyForm from "@/components/ReplyForm";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ slug: string; threadId: string }>;
}) {
  const { slug, threadId } = await params;
  const supabase = await createClient();

  const { data: school } = await supabase
    .from("schools")
    .select("id,name")
    .eq("slug", slug)
    .single();

  if (!school) notFound();

  const { data: thread } = await supabase
    .from("forum_threads")
    .select("*")
    .eq("id", threadId)
    .eq("school_id", school.id)
    .single();

  if (!thread) notFound();

  const { data: replies } = await supabase
    .from("forum_replies")
    .select("id,body,created_at,user_id")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex gap-2 text-sm text-muted-foreground mb-6">
        <Link href={`/schools/${slug}`} className="hover:underline text-primary">{school.name}</Link>
        <span>/</span>
        <Link href={`/schools/${slug}/forum`} className="hover:underline text-primary">Forum</Link>
      </div>

      {/* Thread */}
      <h1 className="text-2xl font-bold mb-2">{thread.title}</h1>
      <p className="text-xs text-muted-foreground mb-4">
        {new Date(thread.created_at).toLocaleDateString()}
      </p>
      <div className="rounded-lg border bg-white p-5 mb-8">
        <p className="text-sm whitespace-pre-wrap">{thread.body}</p>
      </div>

      <Separator className="mb-8" />

      {/* Replies */}
      <h2 className="text-lg font-semibold mb-4">
        {replies?.length ?? 0} {(replies?.length ?? 0) === 1 ? "reply" : "replies"}
      </h2>
      <div className="space-y-4 mb-8">
        {replies?.map((r) => (
          <div key={r.id} className="rounded-lg border bg-white p-4">
            <p className="text-xs text-muted-foreground mb-2">
              {new Date(r.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm whitespace-pre-wrap">{r.body}</p>
          </div>
        ))}
      </div>

      {/* Reply form */}
      {user ? (
        <div>
          <h3 className="text-base font-semibold mb-3">Post a reply</h3>
          <ReplyForm threadId={threadId} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">Log in</Link> to reply.
        </p>
      )}
    </div>
  );
}
