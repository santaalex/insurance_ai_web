"use client";

import { useState } from "react";
import { UploadCloud, Bot, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { request } from "@/lib/request";
import { toast } from "sonner";

export function PolicyUploaderModal() {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const startExtraction = async () => {
        if (!file) return;

        try {
            setIsUploading(true);
            // 1. Upload to Qiniu logic would normally go here (or backend handles it).
            // We'll send the file to the backend's extract_and_save endpoint directly
            // since FastAPI typically handles multi-part form data. 
            // For MVP, if Qiniu is required locally, we simulate the flow.
            // But based on `test_orchestrator_e2e.py`, it expects an image file 
            // or a URL. Let's send the File directly.

            const formData = new FormData();
            formData.append("file", file); // The backend needs to support this. If it only accepts JSON, we'd need to upload to Qiniu first here.

            toast.info("已推入 AI 运算队列...", { description: "正在唤醒 Qwen2.5-VL 视觉大模型" });
            setIsUploading(false);
            setIsAnalyzing(true);

            const response = await request.post("/policy/extract_and_save", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 120000, // 2 minutes timeout for the heavy LLM job
            });

            if (response.data && response.data.status === "success") {
                setResult(response.data.data.records); // HAP row IDs
                toast.success("成功落地明道云", {
                    description: `成功解析并落库 ${response.data.data.records.length} 份保单`,
                });
            }

        } catch (error: any) {
            console.error(error);
            toast.error("大模型提取失败", {
                description: error.response?.data?.detail || "心智推演超时或服务端异常",
            });
        } finally {
            setIsUploading(false);
            setIsAnalyzing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="absolute bottom-10 right-10">
                    <Button
                        size="lg"
                        className="h-14 rounded-full px-8 shadow-2xl bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all hover:scale-105 group"
                    >
                        <UploadCloud className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                        <span className="font-semibold text-base">提取新保单长图</span>
                    </Button>
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>智能录入保单视图</DialogTitle>
                    <DialogDescription>
                        支持将各种机构的“家庭保单年度资产配置表”长截图拖入此处，由硅基 Qwen2.5-VL 大模型全天候自动解析。
                    </DialogDescription>
                </DialogHeader>

                {!result ? (
                    <div className="space-y-4 py-4">
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file
                                    ? "border-green-500 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20"
                                    : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-700"
                                }`}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="fileUpload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <label htmlFor="fileUpload" className="cursor-pointer">
                                {file ? (
                                    <div className="space-y-2">
                                        <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
                                        <p className="font-medium text-sm text-green-700 dark:text-green-400">
                                            已就绪: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-4">
                                            <UploadCloud className="w-6 h-6 text-zinc-500" />
                                        </div>
                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            点击或拖拽长截图到此处
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            支持 JPG, PNG，最大不可超过 20MB
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>

                        <Button
                            className="w-full h-11 relative overflow-hidden"
                            disabled={!file || isUploading || isAnalyzing}
                            onClick={startExtraction}
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="absolute inset-0 bg-blue-500/10 animate-pulse pointer-events-none" />
                                    <Bot className="mr-2 h-4 w-4 animate-bounce text-blue-500" />
                                    模型深度推演中 (预计10-25秒)...
                                </>
                            ) : isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    上云传输中...
                                </>
                            ) : (
                                "激活硅基智能矩阵，开始提串"
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="py-6 space-y-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">解析投递圆满成功！</h3>
                        <p className="text-sm text-zinc-500">
                            大模型已成功将长图中的非结构化数据提纯，并在明道云中创建了 <span className="font-bold text-green-600 dark:text-green-400">{result.length}</span> 条保单主记录记录。
                        </p>
                        <div className="pt-4 flex justify-center gap-3">
                            <Button variant="outline" onClick={() => { setResult(null); setFile(null); setOpen(false); }}>
                                返回工作台
                            </Button>
                            <Button onClick={() => window.open('https://www.mingdao.com', '_blank')}>
                                前往 HAP 查看源码 <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
