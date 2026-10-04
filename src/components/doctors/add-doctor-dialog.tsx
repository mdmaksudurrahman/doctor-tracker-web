"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { DoctorForm } from "@/components/doctors/doctor-form";
import { useCreateDoctor } from "@/hooks/use-doctors";

export function AddDoctorDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const createDoctor = useCreateDoctor();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="size-4" /> Add doctor
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add doctor</DialogTitle>
                    <DialogDescription>Enter the doctor&apos;s details. All fields are required.</DialogDescription>
                </DialogHeader>
                {/* The content unmounts when closed, so the form always opens empty */}
                <DoctorForm
                    onCancel={() => setOpen(false)}
                    onSubmit={async (values) => {
                        const { doctor } = await createDoctor.mutateAsync(values);
                        setOpen(false);
                        toast.success(`${doctor.name} added`, {
                            action: { label: "View", onClick: () => router.push(`/doctors/${doctor._id}`) },
                        });
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}