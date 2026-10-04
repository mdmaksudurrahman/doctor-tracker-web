import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { PatientsTableSkeleton } from "@/components/patients/patients-table";
import { PatientsView } from "@/components/patients/patients-view";

export const metadata: Metadata = { title: "Patients" };

export default function PatientsPage() {
    // Suspense is required because the view reads the URL (useSearchParams)
    return (
        <Suspense
            fallback={
                <>
                    <PageHeader title="Patients" description="Search, filter and manage all patients" />
                    <PatientsTableSkeleton />
                </>
            }
        >
            <PatientsView />
        </Suspense>
    );
}