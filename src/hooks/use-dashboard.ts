"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { dashboardKeys } from "@/lib/query-keys";
import type { DashboardStats } from "@/types";

// The API accepts 7 to 365 days
export const DASHBOARD_RANGES = [
    { days: 7, label: "7 days" },
    { days: 30, label: "30 days" },
    { days: 90, label: "90 days" },
    { days: 365, label: "1 year" },
] as const;

export const DEFAULT_RANGE = 30;

export function useDashboardStats(days: number) {
    return useQuery({
        queryKey: dashboardKeys.stats(days),
        queryFn: () => api<DashboardStats>("/dashboard/stats", { params: { days } }),
        // Changing the range keeps the old numbers on screen until the new ones arrive
        placeholderData: keepPreviousData,
    });
}