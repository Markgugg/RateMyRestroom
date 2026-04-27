import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import SchoolSearch from "@/components/SchoolSearch";

export const metadata = { title: "Schools — RateMyRestroom" };

export default async function SchoolsPage() {
  const supabase = await createClient();
  const { data: schools } = await supabase
    .from("schools")
    .select("name,slug,city,state")
    .order("name");

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-2">Schools</h1>
      <p className="text-muted-foreground mb-8">Search for your school or browse the directory below.</p>
      <div className="max-w-lg mb-10">
        <SchoolSearch />
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {(schools ?? []).map((s) => (
          <Link key={s.slug} href={`/schools/${s.slug}`}>
            <Card className="hover:border-primary/60 hover:shadow-sm transition-all cursor-pointer h-full">
              <CardContent className="pt-5 pb-4">
                <p className="font-semibold text-sm leading-snug mb-1">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.city}, {s.state}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
