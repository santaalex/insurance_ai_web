import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, HeartPulse, Stethoscope, CarFront, Briefcase, FileText } from "lucide-react";
import { Policy } from "@/hooks/use-policies";

interface PolicyDrawerProps {
    policy: Policy | null;
    onClose: () => void;
}

const getPolicyIcon = (type: string) => {
    switch (type) {
        case '重疾': return <HeartPulse className="w-5 h-5 text-rose-500" />;
        case '医疗': return <Stethoscope className="w-5 h-5 text-emerald-500" />;
        case '意外': return <ShieldAlert className="w-5 h-5 text-amber-500" />;
        case '人寿': return <ShieldCheck className="w-5 h-5 text-indigo-500" />;
        case '财产': return <Briefcase className="w-5 h-5 text-slate-500" />;
        case '车险': return <CarFront className="w-5 h-5 text-blue-500" />;
        default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
};

export function PolicyDrawer({ policy, onClose }: PolicyDrawerProps) {
    if (!policy) return null;

    // Try to parse the rich JSON data (raw_json may contain Markdown + JSON mixed content)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let details: any = null;
    try {
        if (policy.raw_json) {
            details = JSON.parse(policy.raw_json);
        }
    } catch {
        // Fallback: extract JSON from the mixed Markdown+JSON extraction log
        try {
            if (policy.raw_json) {
                let targetJson: string | null = null;

                // Strategy 1: Find the JSON block after "REDUCE PHASE" marker (most complete data)
                const reduceIdx = policy.raw_json.indexOf("REDUCE PHASE");
                if (reduceIdx !== -1) {
                    const afterReduce = policy.raw_json.substring(reduceIdx);
                    const reduceMatch = afterReduce.match(/```json\s*([\s\S]*?)```/);
                    if (reduceMatch) {
                        targetJson = reduceMatch[1].trim();
                    }
                }

                // Strategy 2: Fall back to the largest json block (likely the most complete)
                if (!targetJson) {
                    const jsonBlocks = policy.raw_json.match(/```json\s*([\s\S]*?)```/g);
                    if (jsonBlocks && jsonBlocks.length > 0) {
                        let largest = '';
                        for (const block of jsonBlocks) {
                            const content = block.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
                            if (content.length > largest.length) largest = content;
                        }
                        targetJson = largest;
                    }
                }

                if (targetJson) {
                    const parsed = JSON.parse(targetJson);
                    // If it's an array (Reduce output [{ }]), take the first element
                    details = Array.isArray(parsed) ? parsed[0] : parsed;
                }
            }
        } catch (e2) {
            console.error("Failed to extract JSON from raw_json:", e2);
        }
    }

    // Format money safely
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatMoney = (amount: any) => {
        if (amount === undefined || amount === null || amount === "null" || amount === "") return "¥0";
        const num = String(amount).replace(/[^0-9.]/g, '');
        if (num) return `¥${parseInt(num).toLocaleString()}`;
        return String(amount);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const safeVal = (val: any, fallback = "-") => {
        if (val === undefined || val === null || val === "null" || val === "None" || val === "") return fallback;
        return val;
    };

    return (
        <Sheet open={!!policy} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-xl md:max-w-2xl bg-slate-50 p-0" aria-describedby="policy-details">
                {/* Header Hero Section */}
                <div className="bg-white border-b border-slate-200 px-6 py-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                    <SheetHeader className="relative z-10 text-left">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                {getPolicyIcon(policy.policy_type)}
                            </div>
                            <Badge variant="outline" className="bg-white text-slate-600 border-slate-200">
                                {safeVal(details?.policy_type, policy.policy_type)}
                            </Badge>
                            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700 border border-emerald-200">
                                生效中
                            </Badge>
                        </div>
                        <SheetTitle className="text-2xl font-bold text-slate-900 leading-tight">
                            {safeVal(details?.policy_name, policy.policy_name)}
                        </SheetTitle>
                        <SheetDescription className="text-slate-500 mt-1">
                            {safeVal(details?.insurance_company)} • 保单号: {safeVal(details?.policy_number, policy.id)}
                        </SheetDescription>
                    </SheetHeader>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-3 gap-4 mt-8 relative z-10 w-full max-w-lg">
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-1">主险保额</p>
                            <p className="text-lg font-bold text-slate-900">
                                {formatMoney(details?.coverage_amount || policy.coverage_amount)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-1">当期保费 ({safeVal(details?.payment_method, "合计")})</p>
                            <p className="text-lg font-bold text-slate-900">
                                {formatMoney(details?.annual_premium)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-1">生效日期</p>
                            <p className="text-lg font-bold text-slate-900">
                                {safeVal(details?.effective_date, policy.effective_date)}
                            </p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="h-[calc(100vh-240px)] w-full">
                    <div className="p-6 space-y-8">

                        {/* Parties Section */}
                        {details?.parties && (
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 uppercase tracking-wider">
                                    <span className="w-1.5 h-4 bg-indigo-500 rounded-full inline-block"></span>
                                    当事人信息
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Holder */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <p className="text-xs text-slate-500 font-medium mb-3 uppercase tracking-wider">投保人 / 申请人</p>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500">姓名</span>
                                                <span className="text-sm font-semibold text-slate-900">{safeVal(details.parties.policy_holder?.name)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500">身份证</span>
                                                <span className="text-sm font-medium text-slate-900">{safeVal(details.parties.policy_holder?.id_number)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500">出生日期</span>
                                                <span className="text-sm font-medium text-slate-900">{safeVal(details.parties.policy_holder?.date_of_birth)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Insured */}
                                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 shadow-sm">
                                        <p className="text-xs text-indigo-600/80 font-medium mb-3 uppercase tracking-wider">被保险人 / 受保障人</p>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500">姓名</span>
                                                <span className="text-sm font-bold text-indigo-900">{policy.insured_person || safeVal(details.parties.insured?.name)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500">关系</span>
                                                <span className="text-sm font-medium text-slate-900">{safeVal(details.parties.insured?.relationship_to_holder, "本人")}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500">出生日期</span>
                                                <span className="text-sm font-medium text-slate-900">{safeVal(details.parties.insured?.date_of_birth)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {details.parties.beneficiary && details.parties.beneficiary.name !== "null" && (
                                    <div className="mt-3 bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center px-4">
                                        <span className="text-sm font-medium text-slate-500">受益人 (Beneficiary)</span>
                                        <span className="text-sm font-bold text-slate-800">
                                            {details.parties.beneficiary.name}
                                            {details.parties.beneficiary.type && details.parties.beneficiary.type !== "null" && <span className="text-slate-400 font-normal ml-1">({details.parties.beneficiary.type})</span>}
                                        </span>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Coverages Section */}
                        {details?.coverages && details.coverages.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 uppercase tracking-wider">
                                    <span className="w-1.5 h-4 bg-emerald-500 rounded-full inline-block"></span>
                                    保障范围明细
                                </h3>
                                <div className="space-y-3">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {details.coverages.map((cov: any, idx: number) => (
                                        <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline" className={cov.type === "主险" ? "border-indigo-200 text-indigo-700 bg-indigo-50" : "border-slate-200 text-slate-600 bg-white"}>
                                                            {safeVal(cov.type, "附加险")}
                                                        </Badge>
                                                    </div>
                                                    <h4 className="font-semibold text-slate-800 text-sm leading-snug">{safeVal(cov.name)}</h4>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-xs text-slate-500 mb-0.5">保额</p>
                                                    <p className="font-bold text-emerald-600">{formatMoney(cov.sum_insured || cov.amount)}</p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white grid grid-cols-3 gap-2 px-4 divide-x divide-slate-100">
                                                <div className="text-center px-2">
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">保费</p>
                                                    <p className="text-xs font-medium text-slate-700">{formatMoney(cov.premium)}</p>
                                                </div>
                                                <div className="text-center px-2">
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">保障期</p>
                                                    <p className="text-xs font-medium text-slate-700">{safeVal(cov.period)}</p>
                                                </div>
                                                <div className="text-center px-2">
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">缴费期</p>
                                                    <p className="text-xs font-medium text-slate-700">{safeVal(cov.payment_period)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Support / Contact */}
                        {(details?.emergency_phone || details?.expiry_date) && (
                            <section className="pt-4 border-t border-slate-200/60 pb-8">
                                <div className="flex justify-between items-center p-4 bg-slate-100/50 rounded-xl border border-slate-200 shadow-sm">
                                    {details?.emergency_phone && details.emergency_phone !== "null" && (
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">客服/理赔报案</p>
                                            <p className="text-sm font-bold text-slate-800">{details.emergency_phone}</p>
                                        </div>
                                    )}
                                    {details?.expiry_date && details.expiry_date !== "null" && (
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">合同到期日</p>
                                            <p className="text-sm font-semibold text-slate-700">{details.expiry_date}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {!details && (
                            <div className="text-center py-20">
                                <p className="text-slate-500 text-sm">此保单尚无 AI 提取的详细数据副本。</p>
                            </div>
                        )}

                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet >
    );
}
