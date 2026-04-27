"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function SiteHeader({ user }: { user: User | null }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-xl font-black tracking-tight">
            <span className="text-gray-900">RateMy</span>
            <span className="text-primary">Restroom</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/schools"
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-blue-50 transition-colors"
          >
            Schools
          </Link>
          {user ? (
            <button
              onClick={handleSignOut}
              className="ml-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-blue-50 transition-colors"
            >
              Sign out
            </button>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-blue-50 transition-colors"
              >
                Sign In
              </Link>
              <Button size="sm" render={<Link href="/signup" />} className="rounded-lg px-4 font-semibold">
                Write a Review
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
