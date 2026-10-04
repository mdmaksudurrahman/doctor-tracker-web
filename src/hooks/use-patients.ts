"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { dashboardKeys, patientKeys } from "@/lib/query-keys";
import type { Gender, Paginated, Patient } from "@/types";

export const PATIENT_SORTS = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "name", label: "Name (A–Z)" },
] as const;

export type PatientSort = (typeof PATIENT_SORTS)[number]["value"];

export type PatientInput = {
    name: string;
    age: number;
    gender: Gender;
    condition: string;
    phone?: string;
};

// On edit, the doctor can be reassigned
export type PatientUpdate = Partial<PatientInput> & { doctor?: string };

export type DoctorPatientsParams = { q?: string; page?: number; limit?: number };

export type PatientListParams = {
    q?: string;
    condition?: string;
    gender?: Gender;
    doctor?: string;
    from?: string;
    to?: string;
    sort?: PatientSort;
    page?: number;
    limit?: number;
};

export function usePatients(params: PatientListParams) {
    return useQuery({
        queryKey: patientKeys.list(params),
        queryFn: () => api<Paginated<Patient>>("/patients", { params }),
        placeholderData: keepPreviousData,
    });
}

export function usePatientFilters() {
    return useQuery({
        queryKey: patientKeys.filters,
        queryFn: () => api<{ conditions: string[] }>("/patients/filters"),
        staleTime: 5 * 60_000,
    });
}

export function useDoctorPatients(doctorId: string, params: DoctorPatientsParams) {
    return useQuery({
        queryKey: patientKeys.byDoctor(doctorId, params),
        queryFn: () => api<Paginated<Patient>>(`/doctors/${doctorId}/patients`, { params }),
        placeholderData: keepPreviousData,
    });
}

export function useAddPatient(doctorId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (values: PatientInput) =>
            api<{ patient: { _id: string } }>(`/doctors/${doctorId}/patients`, {
                method: "POST",
                body: values,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: patientKeys.all });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    });
}

export function useUpdatePatient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: PatientUpdate }) =>
            api<{ patient: { _id: string } }>(`/patients/${id}`, { method: "PATCH", body: data }),
        onSuccess: () => {
            // Condition and doctor changes affect lists, dropdowns and dashboard counts
            queryClient.invalidateQueries({ queryKey: patientKeys.all });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    });
}

export function useDeletePatient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api(`/patients/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: patientKeys.all });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    });
}

export function useDeleteDoctorPatient(doctorId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (patientId: string) =>
            api(`/doctors/${doctorId}/patients/${patientId}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: patientKeys.all });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    });
}