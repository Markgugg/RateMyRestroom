"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type School = { name: string; slug: string; city: string; state: string };

export default function SchoolSearch({ heroStyle = false }: { heroStyle?: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<School[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const supabase = createClient();
    let cancelled = false;
    supabase
      .from("schools")
      .select("name,slug,city,state")
      .or(`name.ilike.%${query}%,city.ilike.%${query}%`)
      .limit(8)
      .then(({ data }) => {
        if (!cancelled) {
          setResults(data ?? []);
          setOpen(true);
        }
      });
    return () => { cancelled = true; };
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function pick(school: School) {
    setOpen(false);
    setQuery("");
    router.push(`/schools/${school.slug}`);
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        placeholder="Search for your school"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="School search"
        className={
          heroStyle
            ? "mt-2 shadow-md focus:outline-none border-2 border-[#5CABDF] bg-white rounded-2xl py-3 px-6 block w-full text-base text-black placeholder-gray-400"
            : "w-full text-base h-11 rounded-lg border border-gray-300 px-4 focus:outline-none focus:border-[#5CABDF] focus:ring-2 focus:ring-[#5CABDF]/30 bg-white placeholder-gray-400"
        }
      />
      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow-xl overflow-hidden">
          {results.map((s) => (
            <li
              key={s.slug}
              className="px-5 py-3 hover:bg-[#5CABDF]/10 cursor-pointer text-sm border-b last:border-0"
              onMouseDown={() => pick(s)}
            >
              <span className="font-semibold text-gray-900">{s.name}</span>
              <span className="text-gray-400 ml-2">{s.city}, {s.state}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
