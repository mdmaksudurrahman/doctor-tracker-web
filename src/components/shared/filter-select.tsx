"use client";

import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

export function FilterSelect({
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