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
import axios from "axios";
import { useAuthStore } from "@/store/auth";

interface ExtractionResult {
    doc_id?: string;
    message?: string;
    success?: boolean;
    status?: string;
    [key: string]: unknown;
}

export function PolicyUploaderModal() {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ExtractionResult | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

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
            setLogs([]); // Reset logs
            toast.info("正在将报告安全送往处理枢纽...", { description: "即将唤醒多模态流水线" });

            const formData = new FormData();
            formData.append("file", file); // FastAPI `UploadFile` expects "file"

            setIsUploading(false);
            setIsAnalyzing(true);
            setLogs(["📥 启动本地长图加密通道...", "🚀 连接至后方多模态网络中枢..."]);

            const token = useAuthStore.getState().token;

            // Use native fetch to consume the NDJSON streaming response chunk by chunk
            // The Next.js rewrite in next.config.ts will map /api to the backend
            const response = await fetch("/api/policy/extract_and_save", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (!response.body) throw new Error("服务器未响应数据流");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let finalResult = null;

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    try {
                        const data = JSON.parse(line);

                        if (data.message) {
                            setLogs(prev => [...prev, data.message]);
                        }

                        if (data.status === 'success') {
                            finalResult = data;
                        } else if (data.status === 'error') {
                            throw new Error(data.message);
                        }
                    } catch (e: unknown) {
                        // Ignore pure JSON parse fragments
                        if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
                            console.error("解析数据流异常", e, "Raw line:", line);
                        }
                    }
                }
            }

            if (finalResult && finalResult.success) {
                // Delay 1.5s to let the user bask in the "successful processing" log line
                setTimeout(() => {
                    setResult({ doc_id: finalResult.doc_id, message: finalResult.message });
                    toast.success(finalResult.message || "成功落地明道云", {
                        description: "保单已被大模型精准摘录、脱敏并归档",
                    });
                }, 1500);
            }

        } catch (error: unknown) {
            const err = error as Error;
            console.error(err);
            toast.error("大模型提取失败", {
                description: err.message || "心智推演超时或服务端异常",
            });
            setIsAnalyzing(false);
            setIsUploading(false);
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
                        {isAnalyzing ? (
                            <div className="bg-black rounded-xl p-4 font-mono text-sm text-green-400 h-64 overflow-y-auto text-left shadow-2xl relative border border-zinc-800 flex flex-col justify-end">
                                <div className="absolute top-3 right-3 flex gap-1.5 opacity-50 z-10">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                </div>
                                <div className="space-y-2 mt-4">
                                    {logs.map((log, i) => (
                                        <div key={i} className="animate-in fade-in slide-in-from-bottom-2 flex gap-2">
                                            <span className="text-zinc-600 select-none">❯</span>
                                            <span>{log}</span>
                                        </div>
                                    ))}
                                    <div className="flex gap-2 animate-pulse mt-2">
                                        <span className="text-zinc-600 select-none">❯</span>
                                        <span className="w-2 h-4 bg-green-400 inline-block align-middle my-auto"></span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
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
                                        accept="application/pdf,image/*"
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
                                                    点击或拖拽保单扫描件/源文件到此处
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    支持 PDF (自动逐页爆破切分为超清长图) 及 JPG/PNG
                                                </p>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                <Button
                                    className="w-full h-11 relative overflow-hidden"
                                    disabled={!file || isUploading}
                                    onClick={startExtraction}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            上云加密传输中...
                                        </>
                                    ) : (
                                        "激活硅基智能矩阵，开始提串"
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="py-6 space-y-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            {result.message?.includes('覆盖') ? '保单已自动去重合并！' : '解析投递圆满成功！'}
                        </h3>
                        <p className="text-sm text-zinc-500">
                            {result.message || "大模型已成功将长图中的非结构化数据提纯，并在明道云中创建了 1 条保单主记录记录。"}
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
