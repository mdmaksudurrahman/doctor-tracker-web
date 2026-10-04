"use client";

import { useCallback, useState } from "react";
import { SearchX, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { DoctorFilters } from "@/components/doctors/doctor-filters";
import { DoctorsTable, DoctorsTableSkeleton } from "@/components/doctors/doctors-table";
import { DOCTOR_SORTS, useDoctors, type DoctorSort } from "@/hooks/use-doctors";
import { useUrlParams } from "@/hooks/use-url-params";
import { parsePage, toEndOfDay } from "@/lib/format";
import { AddDoctorDialog } from "@/components/doctors/add-doctor-dialog";

const PAGE_SIZE = 10;

const parseSort = (value: string | null): DoctorSort =>
    DOCTOR_SORTS.find((s) => s.value === value)?.value ?? "newest";

export function DoctorsView() {
    const { searchParams, setParams } = useUrlParams();
    const [searchKey, setSearchKey] = useState(0);

    const q = searchParams.get("q") ?? "";
    const specialization = searchParams.get("specialization") ?? undefined;
    const hospital = searchParams.get("hospital") ?? undefined;
    const from = searchParams.get("from") ?? undefined;
    const to = searchParams.get("to") ?? undefined;
    const sort = parseSort(searchParams.get("sort"));
    const page = parsePage(searchParams.get("page"));

    const { data, isPending, isError, error, refetch, isPlaceholderData } = useDoctors({
        q: q || undefined,
        specialization,
        hospital,
        from,
        to: toEndOfDay(to),
        sort,
        page,
        limit: PAGE_SIZE,
    });

    const handleSearch = useCallback((value: string) => setParams({ q: value }), [setParams]);

    const hasActive = Boolean(q || specialization || hospital || from || to || sort !== "newest");

    const handleClear = () => {
        setParams({
            q: undefined,
            specialization: undefined,
            hospital: undefined,
            from: undefined,
            to: undefined,
            sort: undefined,
        });
        setSearchKey((k) => k + 1);
    };

    return (
        <>
            <PageHeader
                title="Doctors"
                description="Search, filter and manage doctors"
                actions={<AddDoctorDialog />}
            />

            <div className="space-y-4">
                <DoctorFilters
                    searchKey={searchKey}
                    query={q}
                    onSearch={handleSearch}
                    specialization={specialization}
                    hospital={hospital}
                    from={from}
                    to={to}
                    sort={sort}
                    onChange={setParams}
                    onClear={handleClear}
                    hasActive={hasActive}
                />

                {isPending ? (
                    <DoctorsTableSkeleton />
                ) : isError ? (
                    <ErrorState message={error.message} onRetry={() => refetch()} />
                ) : data.items.length === 0 ? (
                    hasActive ? (
                        <EmptyState
                            icon={SearchX}
                            title="No doctors match your filters"
                            description="Try a different search term or remove some filters."
                            action={<Button variant="outline" onClick={handleClear}>Clear filters</Button>}
                        />
                    ) : data.meta.total > 0 ? (
                        <EmptyState
                            icon={SearchX}
                            title="This page doesn't exist"
                            description="There are no doctors on this page."
                            action={<Button variant="outline" onClick={() => setParams({ page: 1 })}>Go to first page</Button>}
                        />
                    ) : (
                        <EmptyState
                            icon={Stethoscope}
                            title="No doctors yet"
                            description="Doctors you add will appear here."
                        />
                    )
                ) : (
                    <>
                        {/* Dim the old rows while the next page loads instead of flashing skeletons */}
                        <div className={isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"}>
                            <DoctorsTable doctors={data.items} />
                        </div>
                        <Pagination meta={data.meta} onPageChange={(p) => setParams({ page: p })} />
                    </>
                )}
            </div>
        </>
    );
}