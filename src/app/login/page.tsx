import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ from?: string }>;
}) {
    const { from } = await searchParams;

    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <LoginForm from={from} />
        </main>
    );
}