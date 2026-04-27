import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${slug} — RateMyRestroom` };
}

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: school } = await supabase
    .from("schools")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!school) notFound();

  const { data: restrooms } = await supabase
    .from("restrooms")
    .select("id,building,floor,gender")
    .eq("school_id", school.id)
    .limit(6);

  const { data: recentReviews } = await supabase
    .from("reviews")
    .select("id,body,cleanliness,privacy,amenities,created_at,restrooms(building,floor)")
    .eq("restrooms.school_id", school.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentThreads } = await supabase
    .from("forum_threads")
    .select("id,title,created_at")
    .eq("school_id", school.id)
    .order("created_at", { ascending: false })
    .limit(4);

  const genderLabel: Record<string, string> = {
    men: "Men",
    women: "Women",
    "all-gender": "All-Gender",
    family: "Family",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* School header */}
      <div className="mb-8">
        <p className="text-sm text-muted-foreground mb-1">{school.city}, {school.state}</p>
        <h1 className="text-3xl font-bold text-primary">{school.name}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Restrooms */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Restrooms</h2>
            <Button variant="outline" size="sm" render={<Link href={`/schools/${slug}/restrooms`} />}>View all</Button>
          </div>
          <div className="space-y-3">
            {restrooms && restrooms.length > 0 ? (
              restrooms.map((r) => (
                <Link key={r.id} href={`/schools/${slug}/restrooms/${r.id}`}>
                  <Card className="hover:border-primary/60 transition-colors cursor-pointer mb-2">
                    <CardContent className="py-3 px-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{r.building}</p>
                        <p className="text-xs text-muted-foreground">{r.floor}</p>
                      </div>
                      <Badge variant="secondary">{genderLabel[r.gender] ?? r.gender}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No restrooms listed yet.</p>
            )}
          </div>
        </div>

        {/* Forum */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Forum</h2>
            <Button variant="outline" size="sm" render={<Link href={`/schools/${slug}/forum`} />}>View all</Button>
          </div>
          <div className="space-y-3">
            {recentThreads && recentThreads.length > 0 ? (
              recentThreads.map((t) => (
                <Link key={t.id} href={`/schools/${slug}/forum/${t.id}`}>
                  <Card className="hover:border-primary/60 transition-colors cursor-pointer mb-2">
                    <CardContent className="py-3 px-4">
                      <p className="text-sm font-medium line-clamp-2">{t.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(t.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No threads yet.</p>
            )}
          </div>
          <div className="mt-4">
            <Button size="sm" render={<Link href={`/schools/${slug}/forum/new`} />}>Start a thread</Button>
          </div>
        </div>
      </div>

      {/* Recent reviews */}
      {recentReviews && recentReviews.length > 0 && (
        <div className="mt-10">
          <Separator className="mb-6" />
          <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
          <div className="space-y-4">
            {recentReviews.map((rv) => (
              <Card key={rv.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">
                    {Array.isArray(rv.restrooms)
                      ? `${rv.restrooms[0]?.building} · ${rv.restrooms[0]?.floor}`
                      : rv.restrooms
                        ? `${(rv.restrooms as unknown as { building: string; floor: string }).building} · ${(rv.restrooms as unknown as { building: string; floor: string }).floor}`
                        : ""}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm mb-2 line-clamp-3">{rv.body}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Cleanliness: {rv.cleanliness}/5</span>
                    <span>Privacy: {rv.privacy}/5</span>
                    <span>Amenities: {rv.amenities}/5</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
