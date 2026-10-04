"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

// Shared by the fixed desktop sidebar and the mobile drawer
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center gap-3 border-b px-6">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Stethoscope className="size-5" />
                </div>
                <span className="text-lg font-semibold tracking-tight">Doctor Tracker</span>
            </div>

            <nav aria-label="Main" className="flex-1 space-y-1 p-4">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onNavigate}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                active
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon className="size-5" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t p-4 text-xs text-muted-foreground">Admin portal</div>
        </div>
    );
}