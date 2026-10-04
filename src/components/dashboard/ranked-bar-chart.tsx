"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PALETTE, axisTick, gridStroke, tooltipStyles } from "@/components/dashboard/chart-theme";

export type RankedRow = {
    key: string; // must be unique, it is what the chart groups by
    label: string;
    count: number;
    detail?: string;
};

const truncate = (text: string, max: number) =>
    text.length > max ? `${text.slice(0, max - 1)}…` : text;

type RankedBarChartProps = {
    rows: RankedRow[];
    seriesName: string;
    color?: string;
};

export function RankedBarChart({ rows, seriesName, color = PALETTE[0] }: RankedBarChartProps) {
    const byKey = new Map(rows.map((row) => [row.key, row]));
    const height = Math.max(240, rows.length * 36 + 24);

    return (
        <div className="w-full" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid horizontal={false} stroke={gridStroke} strokeDasharray="3 3" />
                    <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} />
                    <YAxis
                        type="category"
                        dataKey="key"
                        width={130}
                        tick={axisTick}
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        tickFormatter={(key: string) => truncate(byKey.get(key)?.label ?? key, 20)}
                    />
                    <Tooltip
                        {...tooltipStyles}
                        cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                        labelFormatter={(key) => {
                            const row = byKey.get(String(key));
                            if (!row) return String(key);
                            return row.detail ? `${row.label} · ${row.detail}` : row.label;
                        }}
                    />
                    <Bar dataKey="count" name={seriesName} fill={color} radius={[0, 4, 4, 0]} maxBarSize={22} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}