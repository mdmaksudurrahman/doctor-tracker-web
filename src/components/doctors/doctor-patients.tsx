"use client";

import { useCallback, useEffect, useState } from "react";
import { SearchX, Users } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { AddPatientDialog } from "@/components/patients/add-patient-dialog";
import { PatientsTable, PatientsTableSkeleton } from "@/components/patients/patients-table";
import { useDeleteDoctorPatient, useDoctorPatients } from "@/hooks/use-patients";
import { useUrlParams } from "@/hooks/use-url-params";
import { parsePage } from "@/lib/format";
import type { Doctor, Patient } from "@/types";

const PAGE_SIZE = 10;

export function DoctorPatients({ doctor }: { doctor: Doctor }) {
    const { searchParams, setParams } = useUrlParams();
    const [toDelete, setToDelete] = useState<Patient | null>(null);

    const q = searchParams.get("q") ?? "";
    const page = parsePage(searchParams.get("page"));

    const { data, isPending, isError, error, refetch, isPlaceholderData } = useDoctorPatients(
        doctor._id,
        { q: q || undefined, page, limit: PAGE_SIZE }
    );
    const deletePatient = useDeleteDoctorPatient(doctor._id);

    const handleSearch = useCallback((value: string) => setParams({ q: value }), [setParams]);

    // Deleting the last patient on the last page leaves an empty page: step back to the new last page
    useEffect(() => {
        if (data && data.items.length === 0 && data.meta.total > 0 && page > data.meta.totalPages) {
            setParams({ page: data.meta.totalPages });
        }
    }, [data, page, setParams]);

    const handleConfirmDelete = () => {
        if (!toDelete) return;
        deletePatient.mutate(toDelete._id, {
            onSuccess: () => {
                toast.success("Patient deleted");
                setToDelete(null);
            },
            onError: (err) => toast.error(err.message),
        });
    };

    const addButton = <AddPatientDialog doctorId={doctor._id} doctorName={doctor.name} />;

    return (
        <section className="mt-8 space-y-4" aria-labelledby="patients-heading">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 id="patients-heading" className="text-lg font-semibold">
                        Patients
                    </h2>
                    <p className="text-sm text-muted-foreground">Patients under {doctor.name}</p>
                </div>
                {addButton}
            </div>

            <div className="max-w-md">
                <SearchInput
                    initialValue={q}
                    onSearch={handleSearch}
                    placeholder="Search by patient name or condition"
                    label="Search patients"
                />
            </div>

            {isPending ? (
                <PatientsTableSkeleton />
            ) : isError ? (
                <ErrorState message={error.message} onRetry={() => refetch()} />
            ) : data.items.length === 0 ? (
                q ? (
                    <EmptyState
                        icon={SearchX}
                        title="No patients match your search"
                        description="Try a different name or condition."
                    />
                ) : (
                    <EmptyState
                        icon={Users}
                        title="No patients yet"
                        description={`Patients you add to ${doctor.name} will appear here.`}
                        action={addButton}
                    />
                )
            ) : (
                <>
                    <div className={isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"}>
                        <PatientsTable patients={data.items} onDelete={setToDelete} />
                    </div>
                    <Pagination meta={data.meta} onPageChange={(p) => setParams({ page: p })} />
                </>
            )}

            <ConfirmDialog
                open={toDelete !== null}
                onOpenChange={(open) => !open && setToDelete(null)}
                title="Delete patient?"
                description={
                    <>
                        This permanently removes <strong>{toDelete?.name}</strong> from {doctor.name}&apos;s patient
                        list. This can&apos;t be undone.
                    </>
                }
                pending={deletePatient.isPending}
                onConfirm={handleConfirmDelete}
            />
        </section>
    );
}