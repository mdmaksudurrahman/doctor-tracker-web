"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { SearchX, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { EditPatientDialog } from "@/components/patients/edit-patient-dialog";
import { PatientFilters } from "@/components/patients/patient-filters";
import { PatientsTable, PatientsTableSkeleton } from "@/components/patients/patients-table";
import { PATIENT_SORTS, useDeletePatient, usePatients, type PatientSort } from "@/hooks/use-patients";
import { useUrlParams } from "@/hooks/use-url-params";
import { parsePage, toEndOfDay } from "@/lib/format";
import type { Gender, Patient } from "@/types";

const PAGE_SIZE = 10;
const GENDERS: Gender[] = ["male", "female", "other"];
const OBJECT_ID = /^[a-f\d]{24}$/i;

// URL values are user-editable, so anything invalid is ignored
const parseSort = (value: string | null): PatientSort =>
    PATIENT_SORTS.find((s) => s.value === value)?.value ?? "newest";
const parseGender = (value: string | null) => GENDERS.find((g) => g === value);
const parseDoctor = (value: string | null) => (value && OBJECT_ID.test(value) ? value : undefined);

export function PatientsView() {
    const { searchParams, setParams } = useUrlParams();
    const [searchKey, setSearchKey] = useState(0);
    const [toEdit, setToEdit] = useState<Patient | null>(null);
    const [toDelete, setToDelete] = useState<Patient | null>(null);

    const q = searchParams.get("q") ?? "";
    const condition = searchParams.get("condition") ?? undefined;
    const gender = parseGender(searchParams.get("gender"));
    const doctor = parseDoctor(searchParams.get("doctor"));
    const from = searchParams.get("from") ?? undefined;
    const to = searchParams.get("to") ?? undefined;
    const sort = parseSort(searchParams.get("sort"));
    const page = parsePage(searchParams.get("page"));

    const { data, isPending, isError, error, refetch, isPlaceholderData } = usePatients({
        q: q || undefined,
        condition,
        gender,
        doctor,
        from,
        to: toEndOfDay(to),
        sort,
        page,
        limit: PAGE_SIZE,
    });
    const deletePatient = useDeletePatient();

    const handleSearch = useCallback((value: string) => setParams({ q: value }), [setParams]);

    const hasActive = Boolean(q || condition || gender || doctor || from || to || sort !== "newest");

    // A page past the end (typed into the URL, or left empty by a delete) steps back to the last real page
    const outOfRange =
        !!data && data.items.length === 0 && data.meta.total > 0 && page > data.meta.totalPages;

    useEffect(() => {
        if (outOfRange && data) setParams({ page: data.meta.totalPages });
    }, [outOfRange, data, setParams]);

    const handleClear = () => {
        setParams({
            q: undefined,
            condition: undefined,
            gender: undefined,
            doctor: undefined,
            from: undefined,
            to: undefined,
            sort: undefined,
        });
        setSearchKey((k) => k + 1);
    };

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

    return (
        <>
            <PageHeader title="Patients" description="Search, filter and manage all patients" />

            <div className="space-y-4">
                <PatientFilters
                    searchKey={searchKey}
                    query={q}
                    onSearch={handleSearch}
                    condition={condition}
                    gender={gender}
                    doctor={doctor}
                    from={from}
                    to={to}
                    sort={sort}
                    onChange={setParams}
                    onClear={handleClear}
                    hasActive={hasActive}
                />

                {isPending || outOfRange ? (
                    <PatientsTableSkeleton />
                ) : isError ? (
                    <ErrorState message={error.message} onRetry={() => refetch()} />
                ) : data.items.length === 0 ? (
                    hasActive ? (
                        <EmptyState
                            icon={SearchX}
                            title="No patients match your filters"
                            description="Try a different search term or remove some filters."
                            action={
                                <Button variant="outline" onClick={handleClear}>
                                    Clear filters
                                </Button>
                            }
                        />
                    ) : (
                        <EmptyState
                            icon={Users}
                            title="No patients yet"
                            description="Patients are added from a doctor's page."
                            action={
                                <Button asChild variant="outline">
                                    <Link href="/doctors">Go to doctors</Link>
                                </Button>
                            }
                        />
                    )
                ) : (
                    <>
                        {/* Dim the old rows while the next page loads instead of flashing skeletons */}
                        <div className={isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"}>
                            <PatientsTable
                                patients={data.items}
                                showDoctor
                                onEdit={setToEdit}
                                onDelete={setToDelete}
                            />
                        </div>
                        <Pagination meta={data.meta} onPageChange={(p) => setParams({ page: p })} />
                    </>
                )}
            </div>

            <EditPatientDialog patient={toEdit} onClose={() => setToEdit(null)} />

            <ConfirmDialog
                open={toDelete !== null}
                onOpenChange={(open) => !open && setToDelete(null)}
                title="Delete patient?"
                description={
                    <>
                        This permanently deletes <strong>{toDelete?.name}</strong>. This can&apos;t be undone.
                    </>
                }
                pending={deletePatient.isPending}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}