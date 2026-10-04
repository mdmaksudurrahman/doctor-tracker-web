import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PageMeta } from "@/types";

type PaginationProps = {
    meta: PageMeta;
    onPageChange: (page: number) => void;
};

export function Pagination({ meta, onPageChange }: PaginationProps) {
    const { page, limit, total, totalPages } = meta;
    if (total === 0) return null;

    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <nav
            aria-label="Pagination"
            className="flex flex-col items-center justify-between gap-3 sm:flex-row"
        >
            <p className="text-sm text-muted-foreground" aria-live="polite">
                Showing <span className="font-medium text-foreground">{from}–{to}</span> of{" "}
                <span className="font-medium text-foreground">{total}</span>
            </p>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                >
                    <ChevronLeft className="size-4" /> Previous
                </Button>
                <span className="px-2 text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                >
                    Next <ChevronRight className="size-4" />
                </Button>
            </div>
        </nav>
    );
}