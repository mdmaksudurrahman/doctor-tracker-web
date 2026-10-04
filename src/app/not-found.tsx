import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <Compass className="size-7 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p className="max-w-sm text-sm text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Button asChild>
                <Link href="/">Back to dashboard</Link>
            </Button>
        </main>
    );
}