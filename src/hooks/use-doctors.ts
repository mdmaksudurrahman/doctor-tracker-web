"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Doctor, Paginated } from "@/types";

export const DOCTOR_SORTS = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "name", label: "Name (A–Z)" },
] as const;

export type DoctorSort = (typeof DOCTOR_SORTS)[number]["value"];

export type DoctorListParams = {
    q?: string;
    specialization?: string;
    hospital?: string;
    from?: string;
    to?: string;
    sort?: DoctorSort;
    page?: number;
    limit?: number;
};

export const doctorKeys = {
    all: ["doctors"] as const,
    list: (params: DoctorListParams) => ["doctors", "list", params] as const,
    filters: ["doctors", "filters"] as const,
};

export function useDoctors(params: DoctorListParams) {
    return useQuery({
        queryKey: doctorKeys.list(params),
        queryFn: () => api<Paginated<Doctor>>("/doctors", { params }),
        // Keep showing the previous page while the next one loads: no flash of skeletons
        placeholderData: keepPreviousData,
    });
}

export function useDoctorFilters() {
    return useQuery({
        queryKey: doctorKeys.filters,
        queryFn: () => api<{ specializations: string[]; hospitals: string[] }>("/doctors/filters"),
        staleTime: 5 * 60_000,
    });
}