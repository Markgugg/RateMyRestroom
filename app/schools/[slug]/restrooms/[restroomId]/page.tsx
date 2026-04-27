import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; restroomId: string }> }) {
  const { restroomId } = await params;
  return { title: `Restroom — RateMyRestroom` };
}

const genderLabel: Record<string, string> = {
  men: "Men",
  women: "Women",
  "all-gender": "All-Gender",
  family: "Family",
};

export default async function RestroomDetailPage({
  params,
}: {
  params: Promise<{ slug: string; restroomId: string }>;
}) {
  const { slug, restroomId } = await params;
  const supabase = await createClient();

  const { data: school } = await supabase
    .from("schools")
    .select("id,name")
    .eq("slug", slug)
    .single();

  if (!school) notFound();

  const { data: restroom } = await supabase
    .from("restrooms")
    .select("*")
    .eq("id", restroomId)
    .eq("school_id", school.id)
    .single();

  if (!restroom) notFound();

  const { data: ratings } = await supabase
    .from("restroom_ratings")
    .select("*")
    .eq("restroom_id", restroomId)
    .single();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id,body,cleanliness,privacy,amenities,created_at,user_id")
    .eq("restroom_id", restroomId)
    .order("created_at", { ascending: false });

  const { data: { user } } = await supabase.auth.getUser();

  const hasReviewed = user
    ? reviews?.some((r) => r.user_id === user.id)
    : false;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex gap-2 text-sm text-muted-foreground mb-6">
        <Link href={`/schools/${slug}`} className="hover:underline text-primary">{school.name}</Link>
        <span>/</span>
        <Link href={`/schools/${slug}/restrooms`} className="hover:underline text-primary">Restrooms</Link>
        <span>/</span>
        <span>{restroom.building}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold">{restroom.building}</h1>
          <p className="text-muted-foreground">{restroom.floor}</p>
        </div>
        <Badge variant="secondary">{genderLabel[restroom.gender] ?? restroom.gender}</Badge>
      </div>

      {restroom.description && (
        <p className="text-sm text-muted-foreground mb-6">{restroom.description}</p>
      )}

      {/* Aggregate ratings */}
      {ratings && Number(ratings.review_count) > 0 && (
        <div className="rounded-lg border bg-secondary/20 p-4 mb-8 grid grid-cols-4 gap-4 text-center text-sm">
          <div>
            <p className="text-2xl font-bold text-primary">{ratings.avg_overall}</p>
            <p className="text-muted-foreground text-xs">Overall</p>
          </div>
          <div>
            <p className="font-semibold">{ratings.avg_cleanliness}</p>
            <p className="text-muted-foreground text-xs">Cleanliness</p>
          </div>
          <div>
            <p className="font-semibold">{ratings.avg_privacy}</p>
            <p className="text-muted-foreground text-xs">Privacy</p>
          </div>
          <div>
            <p className="font-semibold">{ratings.avg_amenities}</p>
            <p className="text-muted-foreground text-xs">Amenities</p>
          </div>
        </div>
      )}

      <Separator className="mb-8" />

      {/* Review form */}
      {user ? (
        hasReviewed ? (
          <p className="text-sm text-muted-foreground mb-8">You&apos;ve already reviewed this restroom.</p>
        ) : (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4">Write a review</h2>
            <ReviewForm restroomId={restroomId} />
          </div>
        )
      ) : (
        <p className="text-sm text-muted-foreground mb-8">
          <Link href="/login" className="text-primary hover:underline">Log in</Link> with a .edu account to leave a review.
        </p>
      )}

      {/* Reviews list */}
      <h2 className="text-lg font-semibold mb-4">
        {reviews?.length ?? 0} {(reviews?.length ?? 0) === 1 ? "Review" : "Reviews"}
      </h2>
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
      )}
    </div>
  );
}
