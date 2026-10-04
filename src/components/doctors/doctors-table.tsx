import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableCaption, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, getInitials } from "@/lib/format";
import type { Doctor } from "@/types";

export function DoctorsTable({ doctors }: { doctors: Doctor[] }) {
    return (
        <>
            {/* Desktop: table */}
            <div className="hidden rounded-lg border bg-card md:block">
                <Table>
                    <TableCaption className="sr-only">Doctors</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Specialization</TableHead>
                            <TableHead>Hospital</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {doctors.map((doctor) => (
                            <TableRow key={doctor._id}>
                                <TableCell>
                                    <Link href={`/doctors/${doctor._id}`} className="group flex items-center gap-3">
                                        <Avatar className="size-9">
                                            <AvatarFallback className="text-xs font-semibold">
                                                {getInitials(doctor.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="font-medium group-hover:underline">{doctor.name}</p>
                                            <p className="truncate text-xs text-muted-foreground">{doctor.email}</p>
                                        </div>
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{doctor.specialization}</Badge>
                                </TableCell>
                                <TableCell>{doctor.hospital}</TableCell>
                                <TableCell className="text-muted-foreground">{doctor.phone}</TableCell>
                                <TableCell className="text-muted-foreground">{formatDate(doctor.createdAt)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile: cards */}
            <ul className="space-y-3 md:hidden">
                {doctors.map((doctor) => (
                    <li key={doctor._id}>
                        <Link
                            href={`/doctors/${doctor._id}`}
                            className="block rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
                        >
                            <div className="flex items-start gap-3">
                                <Avatar className="size-10">
                                    <AvatarFallback className="text-xs font-semibold">
                                        {getInitials(doctor.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium">{doctor.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">{doctor.email}</p>
                                </div>
                                <Badge variant="secondary">{doctor.specialization}</Badge>
                            </div>
                            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <dt className="text-muted-foreground">Hospital</dt>
                                    <dd className="font-medium">{doctor.hospital}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Joined</dt>
                                    <dd className="font-medium">{formatDate(doctor.createdAt)}</dd>
                                </div>
                            </dl>
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}

export function DoctorsTableSkeleton({ rows = 8 }: { rows?: number }) {
    return (
        <div className="divide-y rounded-lg border bg-card" aria-busy="true" aria-label="Loading doctors">
            {Array.from({ length: rows }, (_, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                    <Skeleton className="size-9 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="hidden h-6 w-24 md:block" />
                </div>
            ))}
        </div>
    );
}