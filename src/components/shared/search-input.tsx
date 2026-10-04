"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

type SearchInputProps = {
    initialValue: string;
    // Must be a stable function (useCallback), or the effect below re-fires
    onSearch: (value: string) => void;
    placeholder?: string;
    label?: string;
};

export function SearchInput({
    initialValue,
    onSearch,
    placeholder = "Search...",
    label = "Search",
}: SearchInputProps) {
    const [text, setText] = useState(initialValue);
    const debounced = useDebounce(text.trim(), 400);

    // Fires once the user pauses typing. On first render it re-sends the value
    // already in the URL, which setParams ignores because nothing changed.
    useEffect(() => {
        onSearch(debounced);
    }, [debounced, onSearch]);

    return (
        <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="text"
                aria-label={label}
                value={text}
                maxLength={100}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder}
                className="pl-9 pr-9"
            />
            {text && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
                    aria-label="Clear search"
                    onClick={() => setText("")}
                >
                    <X className="size-4" />
                </Button>
            )}
        </div>
    );
}