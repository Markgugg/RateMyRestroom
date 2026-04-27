import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `Restrooms — ${slug} — RateMyRestroom` };
}

const genderLabel: Record<string, string> = {
  men: "Men",
  women: "Women",
  "all-gender": "All-Gender",
  family: "Family",
};

export default async function RestroomsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: school } = await supabase
    .from("schools")
    .select("id,name")
    .eq("slug", slug)
    .single();

  if (!school) notFound();

  const { data: restrooms } = await supabase
    .from("restrooms")
    .select("id,building,floor,gender,description")
    .eq("school_id", school.id)
    .order("building");

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-2 text-sm text-muted-foreground">
        <Link href={`/schools/${slug}`} className="hover:underline text-primary">{school.name}</Link>
      </div>
      <h1 className="text-3xl font-bold text-primary mb-8">Restrooms</h1>
      {restrooms && restrooms.length > 0 ? (
        <div className="space-y-4">
          {restrooms.map((r) => (
            <Link key={r.id} href={`/schools/${slug}/restrooms/${r.id}`}>
              <Card className="hover:border-primary/60 hover:shadow-sm transition-all cursor-pointer mb-2">
                <CardContent className="py-4 px-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{r.building}</p>
                    <p className="text-sm text-muted-foreground">{r.floor}</p>
                    {r.description && (
                      <p className="text-sm mt-1 text-foreground/70 line-clamp-2">{r.description}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {genderLabel[r.gender] ?? r.gender}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No restrooms listed for this school yet.</p>
      )}
    </div>
  );
}
