import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StatCardProps = {
    label: string;
    value: React.ReactNode;
    hint?: React.ReactNode;
    icon: LucideIcon;
    // Smaller value text, for values that are names rather than numbers
    compact?: boolean;
};

export function StatCard({ label, value, hint, icon: Icon, compact = false }: StatCardProps) {
    return (
        <Card>
            <CardContent className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p
                        className={cn(
                            "truncate font-semibold tracking-tight tabular-nums",
                            compact ? "text-xl leading-9" : "text-3xl"
                        )}
                    >
                        {value}
                    </p>
                    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
                </div>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                </div>
            </CardContent>
        </Card>
    );
}

export function StatCardSkeleton() {
    return (
        <Card>
            <CardContent className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="size-10 rounded-lg" />
            </CardContent>
        </Card>
    );
}