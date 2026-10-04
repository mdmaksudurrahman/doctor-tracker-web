"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogin, useMe } from "@/hooks/use-auth";

const schema = z.object({
    email: z.email("Enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type Values = z.infer<typeof schema>;

// Only allow redirects to paths inside this app
function safeDestination(from?: string) {
    return from && from.startsWith("/") && !from.startsWith("//") ? from : "/";
}

export function LoginForm({ from }: { from?: string }) {
    const router = useRouter();
    const destination = safeDestination(from);
    const login = useLogin();
    const { data: me } = useMe();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Values>({ resolver: zodResolver(schema) });

    // Already logged in? Skip the form.
    useEffect(() => {
        if (me) router.replace(destination);
    }, [me, destination, router]);

    const onSubmit = (values: Values) => {
        login.mutate(values, { onSuccess: () => router.replace(destination) });
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="space-y-3 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Stethoscope className="size-6" />
                </div>
                <div className="space-y-1">
                    <CardTitle className="text-2xl">Doctor Tracker</CardTitle>
                    <CardDescription>Sign in to manage doctors and patients</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="admin@example.com"
                            aria-invalid={!!errors.email}
                            {...register("email")}
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            aria-invalid={!!errors.password}
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    {login.isError && (
                        <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            {login.error.message}
                        </p>
                    )}

                    <Button type="submit" className="w-full" disabled={login.isPending}>
                        {login.isPending ? "Signing in..." : "Sign in"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}