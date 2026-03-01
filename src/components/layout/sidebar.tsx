"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Settings, LogOut, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const navItems = [
    { name: "保单总览", href: "/dashboard", icon: Home },
    { name: "家庭成员", href: "/dashboard/members", icon: Users },
    { name: "全险种图表", href: "/dashboard/charts", icon: FileText }, // Placeholder for future
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuthStore();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="p-6">
                <h2 className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">
                    家庭保单管家
                </h2>
                <p className="text-xs text-zinc-500 mt-1">Intelligent Hub</p>
            </div>

            <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-1 px-4">
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t">
                <button
                    onClick={() => {
                        logout();
                        window.location.href = "/";
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    安全退出
                </button>
            </div>
        </div>
    );
}
