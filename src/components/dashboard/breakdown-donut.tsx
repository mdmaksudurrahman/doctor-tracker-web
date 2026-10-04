"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { OTHER_COLOR, PALETTE, tooltipStyles } from "@/components/dashboard/chart-theme";
import type { CountItem } from "@/types";

type BreakdownDonutProps = {
    items: CountItem[];
    // When the items are only part of a bigger total, the remainder becomes an "Other" slice
    total?: number;
    centerLabel: string;
};

export function BreakdownDonut({ items, total, centerLabel }: BreakdownDonutProps) {
    const slices = items.map((item, i) => ({ ...item, color: PALETTE[i % PALETTE.length] }));
    const shown = items.reduce((sum, item) => sum + item.count, 0);
    if (total !== undefined && total > shown) {
        slices.push({ name: "Other", count: total - shown, color: OTHER_COLOR });
    }
    const sum = slices.reduce((s, slice) => s + slice.count, 0);

    return (
        <div className="space-y-4">
            <div className="relative mx-auto h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={slices}
                            dataKey="count"
                            nameKey="name"
                            innerRadius={58}
                            outerRadius={86}
                            paddingAngle={slices.length > 1 ? 2 : 0}
                            stroke="var(--card)"
                            strokeWidth={2}
                        >
                            {slices.map((slice) => (
                                <Cell key={slice.name} fill={slice.color} />
                            ))}
                        </Pie>
                        <Tooltip {...tooltipStyles} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold tabular-nums">{sum}</span>
                    <span className="text-xs text-muted-foreground">{centerLabel}</span>
                </div>
            </div>

            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {slices.map((slice) => (
                    <li key={slice.name} className="flex items-center gap-2 text-sm">
                        <span
                            className="size-3 shrink-0 rounded-sm"
                            style={{ background: slice.color }}
                            aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1 truncate">{slice.name}</span>
                        <span className="tabular-nums text-muted-foreground">
                            {slice.count} · {Math.round((slice.count / sum) * 100)}%
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}