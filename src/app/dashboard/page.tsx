"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { masterPhone, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <header className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">概览工作台</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            欢迎回来，主理人手机号: {masterPhone ? masterPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : "未登录"}
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                        退出登录
                    </Button>
                </header>

                <div className="bg-white dark:bg-zinc-900 p-12 rounded-xl border border-zinc-100 dark:border-zinc-800 border-dashed flex flex-col items-center justify-center text-zinc-400">
                    <p>核心视图施工中（战役 3 敬请期待...）</p>
                </div>
            </div>
        </div>
    );
}
