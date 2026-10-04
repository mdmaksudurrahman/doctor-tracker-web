"use client";

import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PatientForm } from "@/components/patients/patient-form";
import { useDoctorOptions } from "@/hooks/use-doctors";
import { useUpdatePatient } from "@/hooks/use-patients";
import { toPatientPayload } from "@/lib/schemas";
import type { Patient } from "@/types";

type EditPatientDialogProps = {
    patient: Patient | null;
    onClose: () => void;
};

export function EditPatientDialog({ patient, onClose }: EditPatientDialogProps) {
    const updatePatient = useUpdatePatient();
    const { data: doctors = [] } = useDoctorOptions();

    // Keep the current doctor selectable even before the list loads
    const options =
        patient && !doctors.some((d) => d._id === patient.doctor._id)
            ? [{ _id: patient.doctor._id, name: patient.doctor.name }, ...doctors]
            : doctors;

    return (
        <Dialog open={patient !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit patient</DialogTitle>
                    <DialogDescription>Update the details, or move the patient to another doctor.</DialogDescription>
                </DialogHeader>
                {/* The key resets the form when a different patient is opened */}
                {patient && (
                    <PatientForm
                        key={patient._id}
                        submitLabel="Save changes"
                        doctors={options}
                        defaultValues={{
                            name: patient.name,
                            age: String(patient.age),
                            gender: patient.gender,
                            condition: patient.condition,
                            phone: patient.phone ?? "",
                            doctor: patient.doctor._id,
                        }}
                        onCancel={onClose}
                        onSubmit={async (values) => {
                            await updatePatient.mutateAsync({ id: patient._id, data: toPatientPayload(values) });
                            toast.success("Patient updated");
                            onClose();
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}