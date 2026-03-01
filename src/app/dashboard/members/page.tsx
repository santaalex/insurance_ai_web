"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, HeartPulse, Stethoscope, Car, Loader2, UserX, UserMinus } from "lucide-react";
import { useFamily } from "@/hooks/use-family";
import { usePolicies } from "@/hooks/use-policies";
import { PolicyCard } from "@/components/policy-card";
import { Button } from "@/components/ui/button";
import { MergeIdentitiesModal } from "@/components/merge-identities-modal";

export default function MembersPage() {
    const { members, isLoading: familyLoading, mutate: mutateFamily } = useFamily();
    const { policies, isLoading: policiesLoading, mutate: mutatePolicies } = usePolicies();
    const [activeTab, setActiveTab] = useState<string>("");

    // Multi-select state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);

    // Auto-select first member when data loads
    useEffect(() => {
        if (members.length > 0 && !activeTab) {
            const timer = setTimeout(() => {
                setActiveTab(members[0].id);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [members, activeTab]);

    if (familyLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-slate-500 font-medium tracking-wide">编织家庭图谱中...</p>
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-dashed border-slate-300 rounded-3xl animate-in fade-in">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <UserX className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">尚未建立家庭图谱</h3>
                <p className="text-slate-500 mt-2 max-w-sm">
                    您还没有在中心配置家庭成员记录。<br />系统将在您第一次上传亲属保单时，依靠 AI 实体消歧自动为您创建家庭树。
                </p>
            </div>
        );
    }

    const activeMember = members.find(m => m.id === activeTab) || members[0];
    const memberPolicies = policies.filter(p =>
        p.insured_person && activeMember && p.insured_person.includes(activeMember.name)
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">家庭资产拓扑</h2>
                <p className="text-slate-500 font-medium tracking-wide mt-1">
                    在云端穿透查看每位家人的专属保障配置方案
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="bg-white/60 backdrop-blur-xl border border-slate-200/50 p-2.5 rounded-3xl flex flex-wrap gap-2 w-fit shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10 transition-all">
                    {members.map((member) => {
                        const isSelected = selectedIds.includes(member.id);
                        return (
                            <div key={member.id} className="relative group">
                                <TabsTrigger
                                    value={member.id}
                                    className={`px-5 py-3 rounded-2xl transition-all duration-300 ease-out border 
                                    ${isSelected
                                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400'
                                            : 'border-transparent data-[state=active]:bg-white data-[state=active]:border-slate-200 data-[state=active]:shadow-sm hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar className={`h-10 w-10 border-2 transition-colors duration-300 ${isSelected ? 'border-emerald-400' : 'border-slate-100 shadow-sm'}`}>
                                                <AvatarFallback className={`${isSelected ? 'bg-emerald-500 text-white' : 'bg-gradient-to-br from-emerald-100/50 to-teal-50/50 text-emerald-700'} font-bold text-sm`}>
                                                    {member.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>

                                            {/* Selection Indicator embedded in Avatar */}
                                            {isSelected && (
                                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white shadow-sm transform scale-100 animate-in zoom-in duration-200">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-left hidden sm:block">
                                            <div className={`font-semibold text-sm leading-tight transition-colors ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>{member.relation || "成员"}</div>
                                            <div className={`text-xs font-medium transition-colors ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`}>{member.name}</div>
                                        </div>
                                    </div>
                                </TabsTrigger>

                                {/* Glassmorphic overlay toggle button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (isSelected) {
                                            setSelectedIds(prev => prev.filter(id => id !== member.id));
                                        } else {
                                            setSelectedIds(prev => [...prev, member.id]);
                                        }
                                    }}
                                    className={`absolute -top-2 -right-2 z-20 p-1.5 rounded-full shadow-md backdrop-blur-md transition-all duration-300 transform outline-none focus:outline-none
                                    ${isSelected
                                            ? 'bg-emerald-500 text-white scale-100 opacity-100 hover:bg-emerald-600'
                                            : 'bg-white/95 border border-slate-200 text-slate-400 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 hover:text-emerald-500 hover:border-emerald-300'
                                        }`}
                                    title={isSelected ? "取消选择" : "选择此身份进行合并"}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </button>
                            </div>
                        )
                    })}
                </TabsList>

                {members.map(member => (
                    <TabsContent key={member.id} value={member.id} className="focus-visible:outline-none mt-0">
                        <div className="grid gap-6 md:grid-cols-3">
                            {/* Stats Card */}
                            <Card className="md:col-span-1 border-slate-200/60 shadow-sm rounded-2xl h-fit bg-white isolate relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -z-10" />
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">资产结构雷达</CardTitle>
                                    <CardDescription>该成员的保障险种分布归类</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100/50">
                                                <HeartPulse className="w-5 h-5 text-rose-500" />
                                            </div>
                                            <span className="font-semibold text-slate-700">重疾保障</span>
                                        </div>
                                        <span className="text-lg font-bold text-slate-900">
                                            {memberPolicies.filter(p => p.policy_type.includes("重疾") || p.policy_type.includes("重大疾病")).length} 份
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100/50">
                                                <Stethoscope className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <span className="font-semibold text-slate-700">医疗及津贴</span>
                                        </div>
                                        <span className="text-lg font-bold text-slate-900">
                                            {memberPolicies.filter(p => p.policy_type.includes("医疗") || p.policy_type.includes("健康")).length} 份
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100/50">
                                                <Car className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <span className="font-semibold text-slate-700">意外及财产</span>
                                        </div>
                                        <span className="text-lg font-bold text-slate-900">
                                            {memberPolicies.filter(p => (!p.policy_type.includes("重疾") && !p.policy_type.includes("医疗") && !p.policy_type.includes("健康") && !p.policy_type.includes("重大疾病"))).length} 份
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Policies List Card */}
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-lg font-bold tracking-tight text-slate-800 mb-2">名下生效保单精编</h3>
                                {policiesLoading ? (
                                    <div className="flex justify-center py-12 bg-white rounded-2xl border border-slate-200">
                                        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                                    </div>
                                ) : memberPolicies.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-dashed border-slate-300 rounded-2xl">
                                        <FileText className="w-8 h-8 text-slate-300 mb-3" />
                                        <h4 className="font-semibold text-slate-700 text-sm">该成员名下暂无保单纪录</h4>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {memberPolicies.map(policy => (
                                            <PolicyCard key={policy.id} policy={policy} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Floating Action Bar (Glassmorphic) */}
            {selectedIds.length > 1 && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center z-50 animate-in slide-in-from-bottom-12 fade-in duration-500">
                    <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 px-6 py-3.5 rounded-full shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500/20 p-2 rounded-full border border-emerald-500/20">
                                <UserMinus className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-100 tracking-wide">图谱归并模式</span>
                                <span className="text-xs text-slate-400 font-medium">已选中 {selectedIds.length} 个重叠身份</span>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => setSelectedIds([])}
                                variant="ghost"
                                className="rounded-full text-slate-300 hover:text-white hover:bg-white/10 h-10 px-5 transition-colors font-medium"
                            >
                                取消
                            </Button>
                            <Button
                                onClick={() => setIsMergeModalOpen(true)}
                                className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold h-10 px-6 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-105 border border-emerald-400/50"
                            >
                                执行融合
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <MergeIdentitiesModal
                isOpen={isMergeModalOpen}
                onClose={() => setIsMergeModalOpen(false)}
                selectedMembers={members.filter(m => selectedIds.includes(m.id))}
                onMergeComplete={() => {
                    setSelectedIds([]);
                    setIsMergeModalOpen(false);
                    mutateFamily();
                    mutatePolicies();
                }}
            />
        </div>
    );
}
