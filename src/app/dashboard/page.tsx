"use client";

import { useState } from "react";
import { usePolicies, type Policy } from "@/hooks/use-policies";
import { PolicyCard } from "@/components/policy-card";
import { PolicyDrawer } from "@/components/policy-drawer";
import { Shield, FileText, Loader2 } from "lucide-react";

export default function DashboardOverview() {
    const { policies, total, isLoading, isError } = usePolicies();
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">家庭保单金库</h2>
                <p className="text-slate-500 font-medium tracking-wide">
                    您已存托了 <span className="text-emerald-600 font-bold">{total}</span> 份家庭资产契约
                </p>
            </div>

            {/* Main Content Area */}
            {isLoading ? (
                // Loading Skeleton View
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-[220px] rounded-2xl bg-white border border-slate-100 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-slate-50/50 animate-pulse" />
                            <Loader2 className="w-8 h-8 text-emerald-200 animate-spin relative z-10" />
                        </div>
                    ))}
                </div>
            ) : isError ? (
                // Error State
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-red-100 rounded-3xl">
                    <Shield className="w-12 h-12 text-red-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800">读取保单档案馆失败</h3>
                    <p className="text-slate-500 mt-2 max-w-sm">无法从明道云中心拉取您的家庭数据，请检查网络或重新登录验证身份。</p>
                </div>
            ) : policies.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-dashed border-slate-300 rounded-3xl">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">尚未托管任何保单</h3>
                    <p className="text-slate-500 mt-1 max-w-sm">点击右下角悬浮按钮，让 Qwen2.5-VL 大模型为您一键切割提取庞大的 PDF。</p>
                </div>
            ) : (
                // Data Grid View
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {policies.map((policy) => (
                        <PolicyCard
                            key={policy.id}
                            policy={policy}
                            onClick={() => setSelectedPolicy(policy)}
                        />
                    ))}
                </div>
            )}

            <PolicyDrawer
                policy={selectedPolicy}
                onClose={() => setSelectedPolicy(null)}
            />
        </div>
    );
}
