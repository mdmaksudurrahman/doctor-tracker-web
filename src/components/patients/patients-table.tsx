import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import type { Patient } from "@/types";

type PatientsTableProps = {
    patients: Patient[];
    showDoctor?: boolean;
    onEdit?: (patient: Patient) => void;
    onDelete: (patient: Patient) => void;
};

function RowActions({
    patient,
    onEdit,
    onDelete,
}: {
    patient: Patient;
    onEdit?: (patient: Patient) => void;
    onDelete: (patient: Patient) => void;
}) {
    return (
        <div className="flex justify-end gap-1">
            {onEdit && (
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${patient.name}`}
                    onClick={() => onEdit(patient)}
                >
                    <Pencil className="size-4" />
                </Button>
            )}
            <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${patient.name}`}
                onClick={() => onDelete(patient)}
            >
                <Trash2 className="size-4 text-destructive" />
            </Button>
        </div>
    );
}

export function PatientsTable({ patients, showDoctor = false, onEdit, onDelete }: PatientsTableProps) {
    return (
        <>
            {/* Desktop: table */}
            <div className="hidden rounded-lg border bg-card md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Age</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Condition</TableHead>
                            {showDoctor && <TableHead>Doctor</TableHead>}
                            <TableHead>Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {patients.map((patient) => (
                            <TableRow key={patient._id}>
                                <TableCell>
                                    <p className="font-medium">{patient.name}</p>
                                    {patient.phone && <p className="text-xs text-muted-foreground">{patient.phone}</p>}
                                </TableCell>
                                <TableCell>{patient.age}</TableCell>
                                <TableCell className="capitalize">{patient.gender}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{patient.condition}</Badge>
                                </TableCell>
                                {showDoctor && (
                                    <TableCell>
                                        <Link href={`/doctors/${patient.doctor._id}`} className="hover:underline">
                                            {patient.doctor.name}
                                        </Link>
                                    </TableCell>
                                )}
                                <TableCell className="text-muted-foreground">{formatDate(patient.createdAt)}</TableCell>
                                <TableCell>
                                    <RowActions patient={patient} onEdit={onEdit} onDelete={onDelete} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile: cards */}
            <ul className="space-y-3 md:hidden">
                {patients.map((patient) => (
                    <li key={patient._id} className="rounded-lg border bg-card p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="font-medium">{patient.name}</p>
                                {patient.phone && <p className="text-xs text-muted-foreground">{patient.phone}</p>}
                            </div>
                            <Badge variant="secondary">{patient.condition}</Badge>
                        </div>
                        <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                            <div>
                                <dt className="text-muted-foreground">Age</dt>
                                <dd className="font-medium">{patient.age}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Gender</dt>
                                <dd className="font-medium capitalize">{patient.gender}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Added</dt>
                                <dd className="font-medium">{formatDate(patient.createdAt)}</dd>
                            </div>
                        </dl>
                        {showDoctor && (
                            <p className="mt-3 text-xs text-muted-foreground">
                                Doctor:{" "}
                                <Link href={`/doctors/${patient.doctor._id}`} className="font-medium text-foreground hover:underline">
                                    {patient.doctor.name}
                                </Link>
                            </p>
                        )}
                        <div className="mt-2 border-t pt-2">
                            <RowActions patient={patient} onEdit={onEdit} onDelete={onDelete} />
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}

export function PatientsTableSkeleton({ rows = 6 }: { rows?: number }) {
    return (
        <div className="divide-y rounded-lg border bg-card" aria-busy="true" aria-label="Loading patients">
            {Array.from({ length: rows }, (_, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="hidden h-6 w-24 md:block" />
                </div>
            ))}
        </div>
    );
}