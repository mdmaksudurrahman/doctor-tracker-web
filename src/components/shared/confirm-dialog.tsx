"use client";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: React.ReactNode;
    confirmLabel?: string;
    pendingLabel?: string;
    pending?: boolean;
    onConfirm: () => void;
};

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Delete",
    pendingLabel = "Deleting...",
    pending = false,
    onConfirm,
}: ConfirmDialogProps) {
    return (
        // Can't be dismissed while the request is in flight
        <AlertDialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
                    {/* A plain Button, not AlertDialogAction, so the dialog stays open until the request finishes */}
                    <Button variant="destructive" onClick={onConfirm} disabled={pending}>
                        {pending ? pendingLabel : confirmLabel}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}