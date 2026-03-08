import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { request } from "@/lib/request";
import { FamilyMember } from "@/hooks/use-family";

interface MergeIdentitiesModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedMembers: FamilyMember[];
    onMergeComplete: () => void;
}

export function MergeIdentitiesModal({ isOpen, onClose, selectedMembers, onMergeComplete }: MergeIdentitiesModalProps) {
    const [masterId, setMasterId] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-select the first member whenever the modal opens or selections change
    useEffect(() => {
        if (isOpen && selectedMembers.length > 0) {
            // Check if current masterId is still valid, if not, pick the first
            if (!selectedMembers.find(m => m.id === masterId)) {
                setMasterId(selectedMembers[0].id);
            }
        }
    }, [isOpen, selectedMembers, masterId]);

    const handleMerge = async () => {
        if (!masterId) return;

        const subsidiaryIds = selectedMembers
            .map(m => m.id)
            .filter(id => id !== masterId);

        if (subsidiaryIds.length === 0) {
            toast.error("请至少选择两个需要合并的身份");
            return;
        }

        try {
            setIsSubmitting(true);
            toast.loading("正在执行图谱融合协议...", { id: "merge-toast" });

            const res = await request.post("/family/merge", {
                master_id: masterId,
                subsidiary_ids: subsidiaryIds
            });

            if (res.data?.success) {
                toast.success(`成功合并 ${res.data.merged_names.length} 个身份名下的 ${res.data.migrated_policies} 份保单`, { id: "merge-toast" });
                onMergeComplete();
            } else {
                throw new Error("API returned failure");
            }
        } catch (error) {
            console.error("Merge failed:", error);
            toast.error("实体融合失败，请稍后再试", { id: "merge-toast" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (selectedMembers.length < 2) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl">
                {/* Decorative header background */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute right-20 bottom-10 w-20 h-20 bg-emerald-300/20 rounded-full blur-xl"></div>

                    <DialogHeader className="relative z-10">
                        <DialogTitle className="text-2xl font-bold tracking-tight text-white mb-2">
                            数据归并向导
                        </DialogTitle>
                        <DialogDescription className="text-emerald-50 text-sm font-medium leading-relaxed">
                            您正准备将 <strong>{selectedMembers.length}</strong> 个冗余身份实体合并。<br />
                            请先在下方指定一个<strong className="text-white px-1">终极基准身份</strong>。其余被选中的实体将携名下所有资产划归并在系统中被永久清理。此操作不可逆，请谨慎判断。
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    <div className="space-y-3 max-h-[40vh] overflow-y-auto px-1 custom-scrollbar">
                        {selectedMembers.map((member) => {
                            const isMaster = masterId === member.id;
                            return (
                                <div
                                    key={member.id}
                                    onClick={() => !isSubmitting && setMasterId(member.id)}
                                    className={`flex justify-between items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 transform outline-none focus:outline-none ${isMaster
                                        ? "bg-emerald-50 border-[2px] border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)] scale-[1.02]"
                                        : "bg-slate-50 border-2 border-slate-200 border-dashed hover:border-emerald-300 hover:bg-emerald-50/30 opacity-70 hover:opacity-100"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar className={`h-11 w-11 border-2 transition-all ${isMaster ? "border-emerald-300 shadow-sm" : "border-slate-200"}`}>
                                            <AvatarFallback className={`font-bold text-sm ${isMaster
                                                ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white"
                                                : "bg-slate-200 text-slate-500"
                                                }`}>
                                                {member.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className={`font-bold tracking-wide transition-colors ${isMaster ? 'text-emerald-950 text-base' : 'text-slate-700'}`}>
                                                {member.name}
                                            </div>
                                            <div className={`text-xs font-medium transition-colors ${isMaster ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                图谱序列号: <span className="font-mono">{member.id.substring(0, 8)}...</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Indicator */}
                                    {isMaster ? (
                                        <div className="flex flex-col items-end gap-1 animate-in fade-in zoom-in duration-300">
                                            <div className="bg-emerald-500 text-white rounded-full p-1.5 shadow-sm">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-600 tracking-wider">基准真身</span>
                                        </div>
                                    ) : (
                                        <div className="text-[11px] font-bold text-slate-400 bg-slate-200/50 px-3 py-1.5 rounded-full tracking-wide">
                                            将被吸收合流
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">资产转移评估</span>
                        <span className="text-sm font-semibold text-slate-700">将有 <strong className="text-rose-500 mx-1">{selectedMembers.length - 1}</strong> 个身份的数据汇入主身</span>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="font-semibold text-slate-500 hover:text-slate-700 rounded-xl px-5 transition-colors"
                        >
                            取消中断
                        </Button>
                        <Button
                            onClick={handleMerge}
                            disabled={isSubmitting || !masterId}
                            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 font-bold rounded-xl px-6 transition-all duration-300 transform hover:scale-105 active:scale-95"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    引擎轰鸣中...
                                </>
                            ) : (
                                "确认执行融合"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
