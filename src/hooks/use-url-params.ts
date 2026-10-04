"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Updates = Record<string, string | number | undefined>;

export function useUrlParams() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const setParams = useCallback(
        (updates: Updates) => {
            // Read the live URL, not a captured copy, so a delayed update
            // can never overwrite a change the user made in the meantime
            const current = new URLSearchParams(window.location.search);
            const next = new URLSearchParams(window.location.search);

            for (const [key, value] of Object.entries(updates)) {
                if (value === undefined || value === "") next.delete(key);
                else next.set(key, String(value));
            }
            // Any filter change goes back to page 1, unless the page itself is being set
            if (!("page" in updates)) next.delete("page");

            if (next.toString() === current.toString()) return;
            const query = next.toString();
            router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        },
        [router, pathname]
    );

    return { searchParams, setParams };
}