"use client";

import { Activity, RefreshCw, Stethoscope, Trophy, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { BreakdownDonut } from "@/components/dashboard/breakdown-donut";
import { ChartCard, ChartCardSkeleton } from "@/components/dashboard/chart-card";
import { PatientsOverTimeChart } from "@/components/dashboard/patients-over-time-chart";
import { RankedBarChart } from "@/components/dashboard/ranked-bar-chart";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { DASHBOARD_RANGES, DEFAULT_RANGE, useDashboardStats } from "@/hooks/use-dashboard";
import { useUrlParams } from "@/hooks/use-url-params";

const DESCRIPTION = "Overview of doctors and patients";

// URL values are user-editable, so anything unexpected falls back to the default range
const parseDays = (value: string | null) =>
    DASHBOARD_RANGES.find((r) => String(r.days) === value)?.days ?? DEFAULT_RANGE;

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function DashboardSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading dashboard">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <ChartCardSkeleton className="lg:col-span-2" />
                <ChartCardSkeleton />
                <ChartCardSkeleton />
                <ChartCardSkeleton />
                <ChartCardSkeleton />
            </div>
        </div>
    );
}

export function DashboardView() {
    const { searchParams, setParams } = useUrlParams();
    const days = parseDays(searchParams.get("days"));

    const { data, isPending, isError, error, refetch, isFetching, isPlaceholderData } =
        useDashboardStats(days);

    const actions = (
        <>
            <div
                role="group"
                aria-label="Date range"
                className="inline-flex rounded-lg border bg-card p-1"
            >
                {DASHBOARD_RANGES.map((range) => (
                    <Button
                        key={range.days}
                        size="sm"
                        variant={range.days === days ? "default" : "ghost"}
                        aria-pressed={range.days === days}
                        onClick={() => setParams({ days: range.days === DEFAULT_RANGE ? undefined : range.days })}
                    >
                        {range.label}
                    </Button>
                ))}
            </div>
            <Button
                variant="outline"
                size="icon"
                aria-label="Refresh dashboard"
                onClick={() => refetch()}
                disabled={isFetching}
            >
                <RefreshCw className={isFetching ? "size-4 animate-spin" : "size-4"} />
            </Button>
        </>
    );

    if (isPending) {
        return (
            <>
                <PageHeader title="Dashboard" description={DESCRIPTION} actions={actions} />
                <DashboardSkeleton />
            </>
        );
    }

    if (isError) {
        return (
            <>
                <PageHeader title="Dashboard" description={DESCRIPTION} actions={actions} />
                <ErrorState message={error.message} onRetry={() => refetch()} />
            </>
        );
    }

    const { totals } = data;
    const busiest = data.patientsPerDoctor[0];
    const since = format(parseISO(data.patientsOverTime[0].date), "d MMM yyyy");

    return (
        <>
            <PageHeader
                title="Dashboard"
                description={`${DESCRIPTION} · trend and "new" figures cover the last ${days} days (since ${since})`}
                actions={actions}
            />

            {/* Dim the old numbers while a new range loads */}
            <div
                className={isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"}
                aria-busy={isPlaceholderData}
            >
                <section aria-label="Key figures" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Total doctors"
                        value={totals.doctors.toLocaleString()}
                        hint={`+${totals.newDoctors} in the last ${days} days`}
                        icon={Stethoscope}
                    />
                    <StatCard
                        label="Total patients"
                        value={totals.patients.toLocaleString()}
                        hint={`+${totals.newPatients} in the last ${days} days`}
                        icon={Users}
                    />
                    <StatCard
                        label="Avg. patients per doctor"
                        value={totals.avgPatientsPerDoctor}
                        hint={`across ${totals.doctors} doctors`}
                        icon={Activity}
                    />
                    <StatCard
                        label="Busiest doctor"
                        value={busiest ? busiest.name : "—"}
                        hint={busiest ? `${busiest.count} patients · ${busiest.specialization}` : "No patients yet"}
                        icon={Trophy}
                        compact
                    />
                </section>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <ChartCard
                        className="lg:col-span-2"
                        title="New patients over time"
                        description={`Patients added per day over the last ${days} days`}
                        summary={`${totals.newPatients} new patients in the last ${days} days.`}
                        empty={totals.newPatients === 0}
                        emptyMessage="No new patients in this period"
                    >
                        <PatientsOverTimeChart data={data.patientsOverTime} />
                    </ChartCard>

                    <ChartCard
                        title="Patients per doctor"
                        description="Top 10 doctors by number of patients (all time)"
                        summary={data.patientsPerDoctor.map((d) => `${d.name}: ${d.count}`).join(", ")}
                        empty={data.patientsPerDoctor.length === 0}
                    >
                        <RankedBarChart
                            seriesName="Patients"
                            rows={data.patientsPerDoctor.map((d) => ({
                                key: d.doctorId,
                                label: d.name,
                                detail: d.specialization,
                                count: d.count,
                            }))}
                        />
                    </ChartCard>

                    <ChartCard
                        title="Patients by condition"
                        description="Top 8 conditions, the rest grouped as Other (all time)"
                        summary={data.conditions.map((c) => `${c.name}: ${c.count}`).join(", ")}
                        empty={data.conditions.length === 0}
                    >
                        <BreakdownDonut items={data.conditions} total={totals.patients} centerLabel="patients" />
                    </ChartCard>

                    <ChartCard
                        title="Patients by gender"
                        description="Distribution across all patients"
                        summary={data.genders.map((g) => `${capitalize(g.name)}: ${g.count}`).join(", ")}
                        empty={data.genders.length === 0}
                    >
                        <BreakdownDonut
                            items={data.genders.map((g) => ({ ...g, name: capitalize(g.name) }))}
                            centerLabel="patients"
                        />
                    </ChartCard>

                    <ChartCard
                        title="Doctors by specialization"
                        description="How the doctor roster is distributed"
                        summary={data.specializations.map((s) => `${s.name}: ${s.count}`).join(", ")}
                        empty={data.specializations.length === 0}
                    >
                        <RankedBarChart
                            seriesName="Doctors"
                            color="oklch(0.65 0.16 160)"
                            rows={data.specializations.map((s) => ({ key: s.name, label: s.name, count: s.count }))}
                        />
                    </ChartCard>
                </div>
            </div>
        </>
    );
}