import RatingStars from "@/components/RatingStars";

interface Review {
  id: string;
  body: string;
  cleanliness: number;
  privacy: number;
  amenities: number;
  created_at: string;
  profile_names?: { display_name: string } | null;
}

export default function ReviewCard({ review }: { review: Review }) {
  const overall = Math.round((review.cleanliness + review.privacy + review.amenities) / 3);
  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {review.profile_names?.display_name ?? "Anonymous"}
        </span>
        <span className="text-xs text-muted-foreground">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>
      <div className="flex gap-6 text-xs text-muted-foreground">
        <div>
          <p className="mb-0.5">Cleanliness</p>
          <RatingStars value={review.cleanliness} readonly size="sm" />
        </div>
        <div>
          <p className="mb-0.5">Privacy</p>
          <RatingStars value={review.privacy} readonly size="sm" />
        </div>
        <div>
          <p className="mb-0.5">Amenities</p>
          <RatingStars value={review.amenities} readonly size="sm" />
        </div>
      </div>
      <p className="text-sm">{review.body}</p>
    </div>
  );
}
