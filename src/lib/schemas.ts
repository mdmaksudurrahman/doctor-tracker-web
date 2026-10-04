import { z } from "zod";

export const doctorFormSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
    specialization: z.string().trim().min(2, "Specialization is required").max(100, "Too long"),
    hospital: z.string().trim().min(2, "Hospital is required").max(150, "Too long"),
    phone: z
        .string()
        .trim()
        .min(7, "Phone must be at least 7 characters")
        .max(20, "Phone must be at most 20 characters"),
    email: z.string().trim().pipe(z.email("Enter a valid email address")),
});

export type DoctorFormValues = z.infer<typeof doctorFormSchema>;

// Age stays a string inside the form (that is what an <input> holds)
// and is converted to a number by toPatientPayload before it is sent.
export const patientFormSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
    age: z
        .string()
        .trim()
        .min(1, "Age is required")
        .refine((v) => {
            const n = Number(v);
            return Number.isInteger(n) && n >= 0 && n <= 130;
        }, "Enter a whole number between 0 and 130"),
    gender: z.enum(["male", "female", "other"], { error: "Select a gender" }),
    condition: z.string().trim().min(2, "Condition is required").max(150, "Too long"),
    phone: z
        .string()
        .trim()
        .refine((v) => v === "" || (v.length >= 7 && v.length <= 20), "Phone must be 7–20 characters"),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;

export const toPatientPayload = (values: PatientFormValues) => ({
    name: values.name,
    age: Number(values.age),
    gender: values.gender,
    condition: values.condition,
    // The API treats phone as optional, so don't send an empty string
    ...(values.phone ? { phone: values.phone } : {}),
});