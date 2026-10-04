"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import { PALETTE, axisTick, gridStroke, tooltipStyles } from "@/components/dashboard/chart-theme";

type Point = { date: string; count: number };

const GRADIENT_ID = "patients-over-time-fill";

export function PatientsOverTimeChart({ data }: { data: Point[] }) {
    return (
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={PALETTE[0]} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={PALETTE[0]} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke={gridStroke} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tick={axisTick}
                        tickLine={false}
                        axisLine={false}
                        // Dates are "YYYY-MM-DD" strings: parseISO reads them as local dates, so no timezone shift
                        tickFormatter={(d: string) => format(parseISO(d), "d MMM")}
                        interval="preserveStartEnd"
                        minTickGap={32}
                    />
                    <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} width={36} />
                    <Tooltip
                        {...tooltipStyles}
                        labelFormatter={(d) => format(parseISO(String(d)), "EEE, d MMM yyyy")}
                    />
                    <Area
                        type="monotone"
                        dataKey="count"
                        name="New patients"
                        stroke={PALETTE[0]}
                        strokeWidth={2}
                        fill={`url(#${GRADIENT_ID})`}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}