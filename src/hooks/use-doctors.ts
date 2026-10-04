"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { dashboardKeys, doctorKeys, patientKeys } from "@/lib/query-keys";
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

export type DoctorInput = {
    name: string;
    specialization: string;
    hospital: string;
    phone: string;
    email: string;
};

export function useDoctors(params: DoctorListParams) {
    return useQuery({
        queryKey: doctorKeys.list(params),
        queryFn: () => api<Paginated<Doctor>>("/doctors", { params }),
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

export function useDoctor(id: string) {
    return useQuery({
        queryKey: doctorKeys.detail(id),
        queryFn: async () => (await api<{ doctor: Doctor }>(`/doctors/${id}`)).doctor,
    });
}

export function useCreateDoctor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (values: DoctorInput) =>
            api<{ doctor: Doctor }>("/doctors", { method: "POST", body: values }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: doctorKeys.lists });
            // A new doctor may bring a new specialization or hospital for the dropdowns
            queryClient.invalidateQueries({ queryKey: doctorKeys.filters });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    });
}

export function useDeleteDoctor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            api<{ message: string; patientsDeleted: number }>(`/doctors/${id}`, { method: "DELETE" }),
        onSuccess: (_data, id) => {
            queryClient.removeQueries({ queryKey: doctorKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: doctorKeys.lists });
            queryClient.invalidateQueries({ queryKey: doctorKeys.filters });
            // The API deleted this doctor's patients too
            queryClient.invalidateQueries({ queryKey: patientKeys.all });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    });
}