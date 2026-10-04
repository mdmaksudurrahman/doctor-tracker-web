import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Doctors" };

export default function DoctorsPage() {
    return (
        <>
            <PageHeader title="Doctors" description="Manage doctors and their patients" />
            <p className="text-muted-foreground">The doctor list arrives in the next part.</p>
        </>
    );
}