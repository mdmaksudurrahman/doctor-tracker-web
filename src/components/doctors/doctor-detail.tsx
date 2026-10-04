"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Building2,
    CalendarDays,
    Mail,
    Phone,
    Trash2,
    UserX,
    type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { DoctorPatients } from "@/components/doctors/doctor-patients";
import { useDeleteDoctor, useDoctor } from "@/hooks/use-doctors";
import { ApiError } from "@/lib/api";
import { formatDate, getInitials } from "@/lib/format";

function BackLink() {
    return (
        <Link
            href="/doctors"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
            <ArrowLeft className="size-4" /> Back to doctors
        </Link>
    );
}

function InfoItem({
    icon: Icon,
    label,
    children,
}: {
    icon: LucideIcon;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="truncate text-sm font-medium">{children}</dd>
            </div>
        </div>
    );
}

export function DoctorDetailSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading doctor">
            <BackLink />
            <div className="space-y-6 rounded-lg border bg-card p-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="size-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }, (_, i) => (
                        <Skeleton key={i} className="h-10" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function DoctorDetail({ id }: { id: string }) {
    const router = useRouter();
    const { data: doctor, isPending, isError, error, refetch } = useDoctor(id);
    const deleteDoctor = useDeleteDoctor();
    const [confirmOpen, setConfirmOpen] = useState(false);

    if (isPending) return <DoctorDetailSkeleton />;

    if (isError) {
        // 400 means the id in the URL is malformed, 404 means no such doctor
        const notFound = error instanceof ApiError && (error.status === 404 || error.status === 400);
        return (
            <>
                <BackLink />
                {notFound ? (
                    <EmptyState
                        icon={UserX}
                        title="Doctor not found"
                        description="This doctor doesn't exist or has been deleted."
                        action={
                            <Button asChild variant="outline">
                                <Link href="/doctors">Back to doctors</Link>
                            </Button>
                        }
                    />
                ) : (
                    <ErrorState message={error.message} onRetry={() => refetch()} />
                )}
            </>
        );
    }

    const handleDelete = () => {
        deleteDoctor.mutate(id, {
            onSuccess: ({ patientsDeleted }) => {
                const extra =
                    patientsDeleted > 0
                        ? ` along with ${patientsDeleted} patient${patientsDeleted === 1 ? "" : "s"}`
                        : "";
                toast.success(`${doctor.name} deleted${extra}`);
                router.replace("/doctors");
            },
            onError: (err) => toast.error(err.message),
        });
    };

    return (
        <>
            <BackLink />

            <Card>
                <CardContent className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="size-16">
                                <AvatarFallback className="text-lg font-semibold">
                                    {getInitials(doctor.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">{doctor.name}</h1>
                                <Badge variant="secondary" className="mt-1">
                                    {doctor.specialization}
                                </Badge>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setConfirmOpen(true)}
                        >
                            <Trash2 className="size-4" /> Delete doctor
                        </Button>
                    </div>

                    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoItem icon={Building2} label="Hospital">
                            {doctor.hospital}
                        </InfoItem>
                        <InfoItem icon={Phone} label="Phone">
                            <a href={`tel:${doctor.phone}`} className="hover:underline">
                                {doctor.phone}
                            </a>
                        </InfoItem>
                        <InfoItem icon={Mail} label="Email">
                            <a href={`mailto:${doctor.email}`} className="hover:underline">
                                {doctor.email}
                            </a>
                        </InfoItem>
                        <InfoItem icon={CalendarDays} label="Joined">
                            {formatDate(doctor.createdAt)}
                        </InfoItem>
                    </dl>
                </CardContent>
            </Card>

            <DoctorPatients doctor={doctor} />

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Delete doctor?"
                description={
                    <>
                        This permanently deletes <strong>{doctor.name}</strong> and <strong>all of their patients</strong>.
                        This can&apos;t be undone.
                    </>
                }
                confirmLabel="Delete doctor"
                pending={deleteDoctor.isPending}
                onConfirm={handleDelete}
            />
        </>
    );
}