"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/components/shared/search-input";
import { DOCTOR_SORTS, useDoctorFilters, type DoctorSort } from "@/hooks/use-doctors";

// Radix Select cannot use an empty string as a value, so "all" stands for "no filter"
const ALL = "all";

type FilterSelectProps = {
    id: string;
    label: string;
    value?: string;
    options: { value: string; label: string }[];
    placeholder: string;
    allLabel?: string;
    disabled?: boolean;
    onChange: (value: string | undefined) => void;
};

function FilterSelect({
    id,
    label,
    value,
    options,
    placeholder,
    allLabel,
    disabled,
    onChange,
}: FilterSelectProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Select
                value={value ?? (allLabel ? ALL : undefined)}
                onValueChange={(v) => onChange(v === ALL ? undefined : v)}
                disabled={disabled}
            >
                <SelectTrigger id={id} className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {allLabel && <SelectItem value={ALL}>{allLabel}</SelectItem>}
                    {options.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

type DoctorFiltersProps = {
    searchKey: number;
    query: string;
    onSearch: (q: string) => void;
    specialization?: string;
    hospital?: string;
    from?: string;
    to?: string;
    sort: DoctorSort;
    onChange: (updates: Record<string, string | undefined>) => void;
    onClear: () => void;
    hasActive: boolean;
};

export function DoctorFilters({
    searchKey,
    query,
    onSearch,
    specialization,
    hospital,
    from,
    to,
    sort,
    onChange,
    onClear,
    hasActive,
}: DoctorFiltersProps) {
    const { data: options, isPending } = useDoctorFilters();
    const toOptions = (list?: string[]) => (list ?? []).map((v) => ({ value: v, label: v }));

    return (
        <div className="space-y-4 rounded-lg border bg-card p-4">
            {/* Changing the key remounts the input, which is how "Clear" empties it */}
            <SearchInput
                key={searchKey}
                initialValue={query}
                onSearch={onSearch}
                placeholder="Search by name, specialization or hospital"
                label="Search doctors"
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <FilterSelect
                    id="filter-specialization"
                    label="Specialization"
                    value={specialization}
                    options={toOptions(options?.specializations)}
                    placeholder="All"
                    allLabel="All specializations"
                    disabled={isPending}
                    onChange={(v) => onChange({ specialization: v })}
                />
                <FilterSelect
                    id="filter-hospital"
                    label="Hospital"
                    value={hospital}
                    options={toOptions(options?.hospitals)}
                    placeholder="All"
                    allLabel="All hospitals"
                    disabled={isPending}
                    onChange={(v) => onChange({ hospital: v })}
                />
                <div className="space-y-2">
                    <Label htmlFor="filter-from">Joined from</Label>
                    <Input
                        id="filter-from"
                        type="date"
                        value={from ?? ""}
                        max={to}
                        onChange={(e) => onChange({ from: e.target.value || undefined })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="filter-to">Joined to</Label>
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
                    options={[...DOCTOR_SORTS]}
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