"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { dashboardKeys, patientKeys } from "@/lib/query-keys";
import type { Gender, Paginated, Patient } from "@/types";

export type PatientInput = {
    name: string;
    age: number;
    gender: Gender;
    condition: string;
    phone?: string;
};

export type DoctorPatientsParams = { q?: string; page?: number; limit?: number };

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