import { LayoutDashboard, Stethoscope, Users, type LucideIcon } from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon };

export const navItems: NavItem[] = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Doctors", href: "/doctors", icon: Stethoscope },
    { label: "Patients", href: "/patients", icon: Users },
];