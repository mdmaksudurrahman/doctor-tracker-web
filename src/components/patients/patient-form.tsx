"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/shared/form-field";
import { applyFieldErrors } from "@/lib/form-errors";
import { patientFormSchema, type PatientFormValues } from "@/lib/schemas";

type PatientFormProps = {
    defaultValues?: Partial<PatientFormValues>;
    submitLabel: string;
    onSubmit: (values: PatientFormValues) => Promise<unknown>;
    onCancel: () => void;
};

export function PatientForm({ defaultValues, submitLabel, onSubmit, onCancel }: PatientFormProps) {
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<PatientFormValues>({
        resolver: zodResolver(patientFormSchema),
        defaultValues: {
            name: "",
            age: "",
            gender: undefined,
            condition: "",
            phone: "",
            ...defaultValues,
        },
    });

    const submit = handleSubmit(async (values) => {
        try {
            await onSubmit(values);
        } catch (error) {
            if (!applyFieldErrors(error, setError)) {
                toast.error(error instanceof Error ? error.message : "Something went wrong");
            }
        }
    });

    return (
        <form onSubmit={submit} noValidate className="space-y-4">
            <FormField id="patient-name" label="Full name" error={errors.name?.message}>
                <Input
                    id="patient-name"
                    placeholder="Karim Uddin"
                    autoComplete="off"
                    aria-invalid={!!errors.name}
                    {...register("name")}
                />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="patient-age" label="Age" error={errors.age?.message}>
                    <Input
                        id="patient-age"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={130}
                        placeholder="45"
                        aria-invalid={!!errors.age}
                        {...register("age")}
                    />
                </FormField>

                <FormField id="patient-gender" label="Gender" error={errors.gender?.message}>
                    <Controller
                        control={control}
                        name="gender"
                        render={({ field }) => (
                            <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                <SelectTrigger id="patient-gender" className="w-full" aria-invalid={!!errors.gender}>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </FormField>
            </div>

            <FormField id="patient-condition" label="Condition" error={errors.condition?.message}>
                <Input
                    id="patient-condition"
                    placeholder="Hypertension"
                    autoComplete="off"
                    aria-invalid={!!errors.condition}
                    {...register("condition")}
                />
            </FormField>

            <FormField id="patient-phone" label="Phone (optional)" error={errors.phone?.message}>
                <Input
                    id="patient-phone"
                    type="tel"
                    placeholder="01811000000"
                    autoComplete="off"
                    aria-invalid={!!errors.phone}
                    {...register("phone")}
                />
            </FormField>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}