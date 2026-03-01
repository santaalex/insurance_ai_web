import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { PolicyUploaderModal } from "@/components/policy-uploader-modal";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 relative">
                    {children}
                    {/* Global Upload Trigger */}
                    <PolicyUploaderModal />
                </main>
            </div>
        </div>
    );
}
