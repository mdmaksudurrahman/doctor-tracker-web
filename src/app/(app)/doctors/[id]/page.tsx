import { Suspense } from "react";
import type { Metadata } from "next";
import { DoctorDetail, DoctorDetailSkeleton } from "@/components/doctors/doctor-detail";

export const metadata: Metadata = { title: "Doctor details" };

export default async function DoctorDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // Suspense is required because the patients section reads the URL (useSearchParams)
    return (
        <Suspense fallback={<DoctorDetailSkeleton />}>
            <DoctorDetail id={id} />
        </Suspense>
    );
}