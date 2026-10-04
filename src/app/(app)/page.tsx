import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardSkeleton, DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
    // Suspense is required because the view reads the URL (useSearchParams)
    return (
        <Suspense
            fallback={
                <>
                    <PageHeader title="Dashboard" description="Overview of doctors and patients" />
                    <DashboardSkeleton />
                </>
            }
        >
            <DashboardView />
        </Suspense>
    );
}