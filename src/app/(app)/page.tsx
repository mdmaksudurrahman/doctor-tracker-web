import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
    return (
        <>
            <PageHeader title="Dashboard" description="Overview of doctors and patients" />
            <p className="text-muted-foreground">Charts arrive in a later part.</p>
        </>
    );
}