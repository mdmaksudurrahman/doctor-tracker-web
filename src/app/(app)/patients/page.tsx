import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Patients" };

export default function PatientsPage() {
    return (
        <>
            <PageHeader title="Patients" description="All patients across every doctor" />
            <p className="text-muted-foreground">The patient list arrives soon.</p>
        </>
    );
}