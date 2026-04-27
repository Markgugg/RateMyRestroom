"use client";

import { useRef } from "react";
import Link from "next/link";

const schoolColors: Record<string, string> = {
  mit: "from-[#A31F34] to-[#6b0f1e]",
  stanford: "from-[#8C1515] to-[#5a0d0d]",
  harvard: "from-[#A51C30] to-[#6b1020]",
  "uc-berkeley": "from-[#003262] to-[#003d7a]",
  umich: "from-[#00274C] to-[#003d78]",
  nyu: "from-[#57068C] to-[#3a0460]",
  "ut-austin": "from-[#BF5700] to-[#8c3f00]",
  uf: "from-[#0021A5] to-[#001570]",
  "penn-state": "from-[#1E407C] to-[#0d2449]",
  "ohio-state": "from-[#BB0000] to-[#7a0000]",
  uiuc: "from-[#13294B] to-[#0a1a30]",
  "uw-madison": "from-[#C5050C] to-[#8a0308]",
  ucla: "from-[#2774AE] to-[#1a4e7a]",
  uw: "from-[#4B2E83] to-[#2e1b52]",
  "georgia-tech": "from-[#003057] to-[#001a30]",
  cmu: "from-[#C41230] to-[#8a0c22]",
  cornell: "from-[#B31B1B] to-[#7a1212]",
  columbia: "from-[#003087] to-[#001d52]",
  uchicago: "from-[#800000] to-[#520000]",
  yale: "from-[#00356B] to-[#001e3d]",
  princeton: "from-[#E77500] to-[#a85400]",
  duke: "from-[#003087] to-[#00205a]",
  vanderbilt: "from-[#866D4B] to-[#5a4930]",
  bu: "from-[#CC0000] to-[#8a0000]",
  purdue: "from-[#8E6F3E] to-[#5a4526]",
};

const schoolInitials: Record<string, string> = {
  mit: "MIT", stanford: "Stanford", harvard: "Harvard", "uc-berkeley": "Cal",
  umich: "U-M", nyu: "NYU", "ut-austin": "UT", uf: "UF", "penn-state": "PSU",
  "ohio-state": "OSU", uiuc: "UIUC", "uw-madison": "UW", ucla: "UCLA",
  uw: "UW", "georgia-tech": "GT", cmu: "CMU", cornell: "Cornell",
  columbia: "CU", uchicago: "UChicago", yale: "Yale", princeton: "Princeton",
  duke: "Duke", vanderbilt: "Vandy", bu: "BU", purdue: "Purdue",
};

type School = { name: string; slug: string; city: string; state: string; logo_url?: string | null };

export default function PopularSchoolsRow({ schools }: { schools: School[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 312 : -312, behavior: "smooth" });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Popular Schools</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:shadow-md transition-shadow"
            aria-label="Scroll left"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:shadow-md transition-shadow"
            aria-label="Scroll right"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto -mx-6 px-6 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex gap-6 pb-4">
          {schools.map((s) => (
            <div key={s.slug} className="snap-start flex-shrink-0 w-72">
              <Link href={`/schools/${s.slug}`}>
                <div className="bg-white rounded-xl overflow-hidden cursor-pointer group border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                  {/* Image or gradient placeholder */}
                  <div className="relative h-64 overflow-hidden">
                    {s.logo_url ? (
                      <img
                        src={s.logo_url}
                        alt={s.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${schoolColors[s.slug] ?? "from-[#5CABDF] to-[#3a8ab8]"} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                      >
                        <span className="text-white text-4xl font-black tracking-tight drop-shadow-lg">
                          {schoolInitials[s.slug] ?? s.name.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 text-sm leading-tight">
                      {schoolInitials[s.slug] ?? s.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-0.5">{s.city}, {s.state}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
