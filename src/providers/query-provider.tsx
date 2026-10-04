"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiError } from "@/lib/api";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [client] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 30_000,
                        refetchOnWindowFocus: false,
                        // Retry network and server errors twice. Client errors (400, 401, 404...) never improve on retry.
                        retry: (failureCount, error) => {
                            const clientError = error instanceof ApiError && error.status >= 400 && error.status < 500;
                            return !clientError && failureCount < 2;
                        },
                    },
                },
            })
    );

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}