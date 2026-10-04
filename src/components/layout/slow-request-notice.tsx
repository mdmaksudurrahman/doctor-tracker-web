"use client";

import { useEffect, useState } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const SLOW_AFTER_MS = 5000;

function SlowNotice() {
    const [slow, setSlow] = useState(false);

    useEffect(() => {
        const id = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
        return () => clearTimeout(id);
    }, []);

    if (!slow) return null;

    return (
        <div
            role="status"
            className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-start gap-3 rounded-lg border bg-card p-4 text-sm shadow-lg"
        >
            <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin text-muted-foreground" />
            <p>
                <span className="font-medium">This is taking longer than usual.</span>{" "}
                <span className="text-muted-foreground">
                    The server runs on free hosting and may be waking up. It can take up to a minute.
                </span>
            </p>
        </div>
    );
}

export function SlowRequestNotice() {
    const fetching = useIsFetching() > 0;
    // The timer lives in a child that mounts only while something is loading,
    // so it restarts for every slow period and vanishes when loading ends
    return fetching ? <SlowNotice /> : null;
}