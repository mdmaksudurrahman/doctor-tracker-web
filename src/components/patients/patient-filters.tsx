"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { useDoctorOptions } from "@/hooks/use-doctors";
import { PATIENT_SORTS, usePatientFilters, type PatientSort } from "@/hooks/use-patients";

const GENDER_OPTIONS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
];

type PatientFiltersProps = {
    searchKey: number;
    query: string;
    onSearch: (q: string) => void;
    condition?: string;
    gender?: string;
    doctor?: string;
    from?: string;
    to?: string;
    sort: PatientSort;
    onChange: (updates: Record<string, string | undefined>) => void;
    onClear: () => void;
    hasActive: boolean;
};

export function PatientFilters({
    searchKey,
    query,
    onSearch,
    condition,
    gender,
    doctor,
    from,
    to,
    sort,
    onChange,
    onClear,
    hasActive,
}: PatientFiltersProps) {
    const { data: conditions, isPending: conditionsPending } = usePatientFilters();
    const { data: doctors, isPending: doctorsPending } = useDoctorOptions();

    return (
        <div className="space-y-4 rounded-lg border bg-card p-4">
            {/* Changing the key remounts the input, which is how "Clear" empties it */}
            <SearchInput
                key={searchKey}
                initialValue={query}
                onSearch={onSearch}
                placeholder="Search by patient name or condition"
                label="Search patients"
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <FilterSelect
                    id="filter-condition"
                    label="Condition"
                    value={condition}
                    options={(conditions?.conditions ?? []).map((c) => ({ value: c, label: c }))}
                    placeholder="All"
                    allLabel="All conditions"
                    disabled={conditionsPending}
                    onChange={(v) => onChange({ condition: v })}
                />
                <FilterSelect
                    id="filter-gender"
                    label="Gender"
                    value={gender}
                    options={GENDER_OPTIONS}
                    placeholder="All"
                    allLabel="All genders"
                    onChange={(v) => onChange({ gender: v })}
                />
                <FilterSelect
                    id="filter-doctor"
                    label="Doctor"
                    value={doctor}
                    options={(doctors ?? []).map((d) => ({ value: d._id, label: d.name }))}
                    placeholder="All"
                    allLabel="All doctors"
                    disabled={doctorsPending}
                    onChange={(v) => onChange({ doctor: v })}
                />
                <div className="space-y-2">
                    <Label htmlFor="filter-from">Added from</Label>
                    <Input
                        id="filter-from"
                        type="date"
                        value={from ?? ""}
                        max={to}
                        onChange={(e) => onChange({ from: e.target.value || undefined })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="filter-to">Added to</Label>
                    <Input
                        id="filter-to"
                        type="date"
                        value={to ?? ""}
                        min={from}
                        onChange={(e) => onChange({ to: e.target.value || undefined })}
                    />
                </div>
                <FilterSelect
                    id="filter-sort"
                    label="Sort by"
                    value={sort}
                    options={[...PATIENT_SORTS]}
                    placeholder="Sort"
                    onChange={(v) => onChange({ sort: v === "newest" ? undefined : v })}
                />
            </div>

            {hasActive && (
                <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={onClear}>
                        <X className="size-4" /> Clear filters
                    </Button>
                </div>
            )}
        </div>
    );
}