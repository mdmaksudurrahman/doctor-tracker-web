"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { User } from "@/types";

export const authKeys = { me: ["auth", "me"] as const };

export type LoginValues = { email: string; password: string };

export function useMe() {
    return useQuery({
        queryKey: authKeys.me,
        queryFn: async () => (await api<{ user: User }>("/auth/me")).user,
        retry: false,
    });
}

export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (values: LoginValues) =>
            api<{ user: User }>("/auth/login", { method: "POST", body: values }),
        onSuccess: ({ user }) => queryClient.setQueryData(authKeys.me, user),
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: () => api("/auth/logout", { method: "POST" }),
        onSuccess: () => {
            // Drop every cached query so the next user never sees old data
            queryClient.clear();
            router.replace("/login");
        },
    });
}