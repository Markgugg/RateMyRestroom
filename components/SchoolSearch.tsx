"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";

type School = { name: string; slug: string; city: string; state: string };

export default function SchoolSearch() {
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
      <Input
        placeholder="Search your school…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full text-base h-12 border-primary/40 focus-visible:ring-primary"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
          {results.map((s) => (
            <li
              key={s.slug}
              className="px-4 py-3 hover:bg-secondary cursor-pointer text-sm"
              onMouseDown={() => pick(s)}
            >
              <span className="font-medium">{s.name}</span>
              <span className="text-muted-foreground ml-2">
                {s.city}, {s.state}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
