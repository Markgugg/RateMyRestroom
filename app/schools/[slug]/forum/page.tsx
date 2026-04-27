import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `Forum — ${slug} — RateMyRestroom` };
}

export default async function ForumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: school } = await supabase
    .from("schools")
    .select("id,name")
    .eq("slug", slug)
    .single();

  if (!school) notFound();

  const { data: threads } = await supabase
    .from("forum_threads")
    .select("id,title,body,created_at")
    .eq("school_id", school.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-2 text-sm text-muted-foreground">
        <Link href={`/schools/${slug}`} className="hover:underline text-primary">{school.name}</Link>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">Forum</h1>
        <Button render={<Link href={`/schools/${slug}/forum/new`} />}>New thread</Button>
      </div>

      {threads && threads.length > 0 ? (
        <div className="space-y-3">
          {threads.map((t) => (
            <Link key={t.id} href={`/schools/${slug}/forum/${t.id}`}>
              <Card className="hover:border-primary/60 hover:shadow-sm transition-all cursor-pointer mb-2">
                <CardContent className="py-4 px-5">
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{t.body}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(t.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="mb-4">No threads yet.</p>
          <Button variant="outline" render={<Link href={`/schools/${slug}/forum/new`} />}>Start the first discussion</Button>
        </div>
      )}
    </div>
  );
}
