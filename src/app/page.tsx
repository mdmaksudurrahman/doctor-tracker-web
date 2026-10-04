"use client";

import { Button } from "@/components/ui/button";
import { useLogout, useMe } from "@/hooks/use-auth";

export default function Home() {
  const { data: user, isLoading } = useMe();
  const logout = useLogout();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">
        {isLoading ? "Loading..." : `Welcome, ${user?.name}`}
      </h1>
      <p className="text-muted-foreground">{user?.email}</p>
      <Button variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>
        Log out
      </Button>
    </main>
  );
}