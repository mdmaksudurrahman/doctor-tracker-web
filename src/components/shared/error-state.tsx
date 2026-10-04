import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
    message?: string;
    onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
        <div
            role="alert"
            className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-16 text-center"
        >
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                <TriangleAlert className="size-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">Something went wrong</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {message ?? "We couldn't load this data. Please try again."}
            </p>
            {onRetry && (
                <Button variant="outline" className="mt-6" onClick={onRetry}>
                    Try again
                </Button>
            )}
        </div>
    );
}