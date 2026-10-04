import { Topbar } from "@/components/layout/topbar";
import { SidebarContent } from "@/components/layout/sidebar";
import { SlowRequestNotice } from "@/components/layout/slow-request-notice";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
            >
                Skip to content
            </a>

            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card lg:block">
                <SidebarContent />
            </aside>

            <div className="lg:pl-64">
                <Topbar />
                <main id="main-content" className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            <SlowRequestNotice />
        </div>
    );
}