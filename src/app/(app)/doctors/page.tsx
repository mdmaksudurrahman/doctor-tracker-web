import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { DoctorsTableSkeleton } from "@/components/doctors/doctors-table";
import { DoctorsView } from "@/components/doctors/doctors-view";

export const metadata: Metadata = { title: "Doctors" };

export default function DoctorsPage() {
    return (
        <Suspense
            fallback={
                <>
                    <PageHeader title="Doctors" description="Search, filter and manage doctors" />
                    <DoctorsTableSkeleton />
                </>
            }
        >
            <DoctorsView />
        </Suspense>
    );
}