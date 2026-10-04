"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { useDoctorFilters } from "@/hooks/use-doctors";
import { ApiError } from "@/lib/api";
import { applyFieldErrors } from "@/lib/form-errors";
import { doctorFormSchema, type DoctorFormValues } from "@/lib/schemas";

type DoctorFormProps = {
    onSubmit: (values: DoctorFormValues) => Promise<unknown>;
    onCancel: () => void;
};

export function DoctorForm({ onSubmit, onCancel }: DoctorFormProps) {
    // Existing values become suggestions, which keeps spelling consistent
    const { data: options } = useDoctorFilters();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<DoctorFormValues>({
        resolver: zodResolver(doctorFormSchema),
        defaultValues: { name: "", specialization: "", hospital: "", phone: "", email: "" },
    });

    const submit = handleSubmit(async (values) => {
        try {
            await onSubmit(values);
        } catch (error) {
            if (error instanceof ApiError && error.status === 409) {
                setError("email", { type: "server", message: error.message });
                return;
            }
            if (!applyFieldErrors(error, setError)) {
                toast.error(error instanceof Error ? error.message : "Something went wrong");
            }
        }
    });

    return (
        <form onSubmit={submit} noValidate className="space-y-4">
            <FormField id="doctor-name" label="Full name" error={errors.name?.message}>
                <Input
                    id="doctor-name"
                    placeholder="Dr. Ayesha Rahman"
                    autoComplete="off"
                    aria-invalid={!!errors.name}
                    {...register("name")}
                />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="doctor-specialization" label="Specialization" error={errors.specialization?.message}>
                    <Input
                        id="doctor-specialization"
                        list="doctor-specializations"
                        placeholder="Cardiology"
                        autoComplete="off"
                        aria-invalid={!!errors.specialization}
                        {...register("specialization")}
                    />
                    <datalist id="doctor-specializations">
                        {options?.specializations.map((s) => <option key={s} value={s} />)}
                    </datalist>
                </FormField>

                <FormField id="doctor-hospital" label="Hospital" error={errors.hospital?.message}>
                    <Input
                        id="doctor-hospital"
                        list="doctor-hospitals"
                        placeholder="Square Hospital"
                        autoComplete="off"
                        aria-invalid={!!errors.hospital}
                        {...register("hospital")}
                    />
                    <datalist id="doctor-hospitals">
                        {options?.hospitals.map((h) => <option key={h} value={h} />)}
                    </datalist>
                </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="doctor-phone" label="Phone" error={errors.phone?.message}>
                    <Input
                        id="doctor-phone"
                        type="tel"
                        placeholder="01711000000"
                        autoComplete="off"
                        aria-invalid={!!errors.phone}
                        {...register("phone")}
                    />
                </FormField>

                <FormField id="doctor-email" label="Email" error={errors.email?.message}>
                    <Input
                        id="doctor-email"
                        type="email"
                        placeholder="doctor@example.com"
                        autoComplete="off"
                        aria-invalid={!!errors.email}
                        {...register("email")}
                    />
                </FormField>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Add doctor"}
                </Button>
            </div>
        </form>
    );
}