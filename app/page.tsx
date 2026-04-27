import Link from "next/link";
import { Button } from "@/components/ui/button";
import SchoolSearch from "@/components/SchoolSearch";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary to-white py-24 text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4">
          Rate Your Campus Restroom
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Find the cleanest, most private restrooms on campus. Read reviews from real students at your school.
        </p>
        <div className="max-w-lg mx-auto">
          <SchoolSearch />
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-xl border bg-secondary/30">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-semibold text-lg mb-1">Find your school</h3>
            <p className="text-sm text-muted-foreground">Search 25+ colleges and universities.</p>
          </div>
          <div className="p-6 rounded-xl border bg-secondary/30">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="font-semibold text-lg mb-1">Rate restrooms</h3>
            <p className="text-sm text-muted-foreground">Score cleanliness, privacy, and amenities.</p>
          </div>
          <div className="p-6 rounded-xl border bg-secondary/30">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-semibold text-lg mb-1">Join the forum</h3>
            <p className="text-sm text-muted-foreground">Talk campus life with fellow students.</p>
          </div>
        </div>
        <div className="mt-10 text-center">
          <Button size="lg" render={<Link href="/schools" />}>Browse schools</Button>
        </div>
      </section>
    </div>
  );
}
