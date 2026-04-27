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
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-primary tracking-tight">
          RateMyRestroom
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/schools" className="text-sm font-medium hover:text-primary transition-colors">
            Schools
          </Link>
          {user ? (
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" render={<Link href="/login" />}>Log in</Button>
              <Button size="sm" render={<Link href="/signup" />}>Sign up</Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
