"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Settings, LogOut, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const navItems = [
    { name: "保单金库", href: "/dashboard", icon: Home },
    { name: "家庭图谱", href: "/dashboard/members", icon: Users },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuthStore();

    return (
        <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
            <div className="p-6">
                <h2 className="text-xl font-bold tracking-tighter text-slate-800">
                    家庭保单管家
                </h2>
                <p className="text-xs text-slate-500 mt-1">Intelligent Hub</p>
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
                                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon className={cn("h-4 w-4", isActive ? "text-emerald-500" : "")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={() => {
                        logout();
                        window.location.href = "/";
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    安全退出
                </button>
            </div>
        </div>
    );
}
