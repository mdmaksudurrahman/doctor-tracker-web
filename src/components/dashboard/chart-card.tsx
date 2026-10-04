import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ChartCardProps = {
    title: string;
    description?: string;
    // Read aloud by screen readers, since the chart itself is a picture
    summary?: string;
    empty?: boolean;
    emptyMessage?: string;
    className?: string;
    children: React.ReactNode;
};

export function ChartCard({
    title,
    description,
    summary,
    empty = false,
    emptyMessage = "No data yet",
    className,
    children,
}: ChartCardProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                {summary && <p className="sr-only">{summary}</p>}
                {empty ? (
                    <div className="flex h-56 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                        {emptyMessage}
                    </div>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    );
}

export function ChartCardSkeleton({ className }: { className?: string }) {
    return (
        <Card className={className}>
            <CardHeader>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-2 h-4 w-56" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-64 w-full" />
            </CardContent>
        </Card>
    );
}