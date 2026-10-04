"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PatientForm } from "@/components/patients/patient-form";
import { useAddPatient } from "@/hooks/use-patients";
import { toPatientPayload } from "@/lib/schemas";

type AddPatientDialogProps = { doctorId: string; doctorName: string };

export function AddPatientDialog({ doctorId, doctorName }: AddPatientDialogProps) {
    const [open, setOpen] = useState(false);
    const addPatient = useAddPatient(doctorId);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="size-4" /> Add patient
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add patient</DialogTitle>
                    <DialogDescription>New patient under {doctorName}.</DialogDescription>
                </DialogHeader>
                <PatientForm
                    submitLabel="Add patient"
                    onCancel={() => setOpen(false)}
                    onSubmit={async (values) => {
                        await addPatient.mutateAsync(toPatientPayload(values));
                        setOpen(false);
                        toast.success("Patient added");
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}