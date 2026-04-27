import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SchoolSearch from "@/components/SchoolSearch";
import PopularSchoolsRow from "@/components/PopularSchoolsRow";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: popularSchools } = await supabase
    .from("schools")
    .select("name,slug,city,state,logo_url")
    .in("slug", [
      "mit", "stanford", "harvard", "nyu", "ucla", "uc-berkeley",
      "umich", "columbia", "yale", "princeton", "duke", "cmu",
    ])
    .order("name");

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 text-white font-bold text-2xl md:text-3xl"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(91,171,223,0.25), rgba(91,171,223,0.25))",
            "linear-gradient(rgba(0,0,0,0.30), rgba(0,0,0,0.30))",
            "url('/hero-campus.jpg')",
          ].join(", "),
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          minHeight: 540,
        }}
      >
        <h1 className="pb-4 flex flex-wrap items-baseline justify-center gap-2 text-center drop-shadow-lg">
          <span className="break-words">Real Campus Restroom Reviews from Verified Students</span>
          <span className="inline-flex items-center align-middle">
            {/* verified badge */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z"
                clipRule="evenodd"
                fill="#5BABDF"
              />
              <path
                d="M13.707 8.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                fill="white"
              />
            </svg>
          </span>
        </h1>

        <div className="w-11/12 md:w-full max-w-2xl md:max-w-3xl mx-auto">
          <div className="relative z-40 text-base text-black">
            <SchoolSearch heroStyle />
          </div>
        </div>
      </section>

      {/* ── Popular Schools ── */}
      <section className="w-full py-8 space-y-12">
        <div className="px-6">
          <PopularSchoolsRow schools={popularSchools ?? []} />
        </div>
      </section>

      {/* ── Feature: Find your school ── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find your school</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We&apos;ve collected restroom listings for 25+ colleges and universities across the US.
              Search for your school to browse buildings, floors, and all-gender options.
            </p>
            <div className="mt-6">
              <Button render={<Link href="/schools" />} className="px-8 py-2 text-base rounded-lg font-semibold">
                Browse schools
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-72 h-52">
              <div className="absolute inset-0 rounded-2xl bg-[#5CABDF]/10 border-2 border-[#5CABDF]/20" />
              <div className="absolute inset-4 rounded-xl bg-white shadow-lg flex flex-col items-center justify-center gap-3 p-5">
                <div className="text-5xl">🏫</div>
                <p className="text-sm font-semibold text-gray-700 text-center">25+ Schools &amp; Universities</p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {["MIT","Stanford","Harvard","NYU","UCLA"].map(s => (
                    <span key={s} className="text-xs bg-[#5CABDF]/10 text-[#3a8ab8] font-medium px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature: Anonymous ratings ── */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 flex justify-center">
            {/* Mock review card */}
            <div className="w-72 rounded-2xl border bg-white shadow-xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <div className="w-8 h-8 rounded-full bg-[#5CABDF]/20 flex items-center justify-center text-sm font-bold text-[#3a8ab8]">A</div>
                <span className="text-sm text-gray-500 font-medium">Anonymous student</span>
              </div>
              {[
                { label: "Cleanliness", val: 4 },
                { label: "Privacy", val: 5 },
                { label: "Amenities", val: 3 },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{r.label}</span>
                    <span className="text-yellow-400 font-bold text-base leading-none">{"★".repeat(r.val)}{"☆".repeat(5 - r.val)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-yellow-400" style={{ width: `${(r.val / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
              <div className="pt-1 flex gap-3">
                <button className="flex-1 rounded-lg border-2 border-green-500 text-green-600 font-semibold py-2 text-sm hover:bg-green-50 transition-colors">
                  👍 Helpful
                </button>
                <button className="flex-1 rounded-lg border-2 border-gray-200 text-gray-500 font-semibold py-2 text-sm hover:bg-gray-50 transition-colors">
                  👎 Not helpful
                </button>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Write an anonymous review</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Share your experience by rating cleanliness, privacy, and amenities. Mark reviews as helpful or not — no names required.
            </p>
            <div className="mt-6">
              <Button render={<Link href="/signup" />} className="px-8 py-2 text-base rounded-lg font-semibold">
                Write a Review
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature: Forum ── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join the conversation</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Each school has its own discussion forum — ask questions, share tips, and connect with students about the best spots on campus.
            </p>
            <div className="mt-6">
              <Button render={<Link href="/schools" />} className="px-8 py-2 text-base rounded-lg font-semibold">
                Find your school
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-72 h-52 rounded-2xl bg-white shadow-xl border flex flex-col gap-3 p-5 justify-center">
              {[
                { title: "Best restroom on north campus?", replies: 12 },
                { title: "Which building has the cleanest bathrooms?", replies: 7 },
                { title: "All-gender restrooms near the library?", replies: 4 },
              ].map((t) => (
                <div key={t.title} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="w-7 h-7 rounded-full bg-[#5CABDF]/15 flex items-center justify-center text-xs">💬</div>
                  <div>
                    <p className="text-xs font-medium text-gray-800 leading-snug line-clamp-1">{t.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.replies} replies</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
