"use client";

import { useAuthStore } from "@/store/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
    const { masterPhone } = useAuthStore();

    const formattedPhone = masterPhone
        ? masterPhone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
        : "访客";

    return (
        <header className="flex h-16 items-center justify-end border-b bg-white dark:bg-zinc-950 px-6">
            <div className="flex items-center gap-4">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    主理人：<span className="font-medium text-zinc-900 dark:text-zinc-100">{formattedPhone}</span>
                </div>
                <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
                        {masterPhone ? masterPhone.slice(-2) : "AI"}
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
