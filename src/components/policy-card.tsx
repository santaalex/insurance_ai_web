import { FileText, ShieldCheck, MoreVertical, CreditCard } from "lucide-react";
import { Policy } from "@/hooks/use-policies";

export function PolicyCard({ policy, onClick }: { policy: Policy; onClick?: () => void }) {
    // Format currency (crude but effective for visualization)
    const formatMoney = (amount: string) => {
        // try to match numbers in the string
        const num = amount.replace(/[^0-9.]/g, '');
        if (num) {
            return `¥${parseInt(num).toLocaleString()}`;
        }
        return amount || "¥0";
    };

    return (
        <div
            onClick={onClick}
            role={onClick ? "button" : "region"}
            className="group relative bg-white border border-slate-200/60 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden isolate cursor-pointer"
        >
            {/* Background glowing circle for aesthetic depth */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10" />

            {/* Header section */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 text-blue-600 rounded-xl shadow-sm">
                        <FileText className="w-5 h-5 pointer-events-none" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 pointer-events-none line-clamp-1" title={policy.policy_name}>
                            {policy.policy_name}
                        </h3>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-full inline-block mt-1 border border-slate-200 pointer-events-none">
                            {policy.policy_type}
                        </span>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-slate-700 transition-colors p-1" aria-label="更多操作">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>

            {/* Primary Data Point: Coverage */}
            <div className="mt-6 mb-5">
                <p className="text-sm text-slate-500 font-medium mb-1 pointer-events-none">总保额 / Coverage</p>
                <div className="flex items-baseline gap-1 pointer-events-none">
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                        {formatMoney(policy.coverage_amount)}
                    </span>
                </div>
            </div>

            {/* Footer Info tags */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100/50 text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    保障生效中
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 border border-slate-200/60 text-xs font-medium px-2.5 py-1 rounded-full pointer-events-none">
                    被保人: <strong className="font-semibold text-slate-700">{policy.insured_person ? policy.insured_person.split(' (Sys_ID:')[0] : "未解析"}</strong>
                </div>
            </div>
        </div>
    );
}
