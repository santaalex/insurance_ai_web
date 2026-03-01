"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Activity, Shield, TrendingUp } from "lucide-react";

const mockPolicies = [
    { id: 1, name: "平安福大满贯(2021)重大疾病保险", insured: "赵丽颖", premium: "￥12,500/年", status: "保障中", date: "2026-02-28" },
    { id: 2, name: "尊享e生2024版医疗险", insured: "冯绍峰", premium: "￥1,200/年", status: "保障中", date: "2026-02-27" },
    { id: 3, name: "太平洋少儿超能宝", insured: "想想", premium: "￥3,600/年", status: "保障中", date: "2026-02-20" },
    { id: 4, name: "国寿福终身寿险", insured: "赵丽颖", premium: "￥8,900/年", status: "保障中", date: "2026-01-15" },
];

export default function DashboardOverview() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">资产总览</h2>
                <p className="text-muted-foreground mt-1">家庭全险种数据实时追踪看板</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">总保障额度</CardTitle>
                        <Shield className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">￥12,500,000</div>
                        <p className="text-xs text-zinc-500 mt-1">+2.4% 较上月增长</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">在保单总数</CardTitle>
                        <FileText className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">14 份</div>
                        <p className="text-xs text-zinc-500 mt-1">覆盖 4 名家庭成员</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">年度总保费</CardTitle>
                        <TrendingUp className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">￥68,430</div>
                        <p className="text-xs text-zinc-500 mt-1">下月需缴 ￥5,200</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI 风险评级</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">极佳 A+</div>
                        <p className="text-xs text-zinc-500 mt-1">医疗重疾覆盖率达 95%</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 max-h-[500px] flex flex-col">
                    <CardHeader>
                        <CardTitle>近期硅基解析流水</CardTitle>
                        <CardDescription>
                            由 Qwen2.5-VL 视觉大模型全自动提纯处理的保单文件记录
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                        <ScrollArea className="h-[350px] pr-4">
                            <div className="space-y-4">
                                {mockPolicies.map((policy) => (
                                    <div
                                        key={policy.id}
                                        className="flex items-center justify-between p-4 border rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-none">{policy.name}</p>
                                                <p className="text-sm text-zinc-500 mt-1">
                                                    被保人: {policy.insured} · 录入于 {policy.date}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{policy.premium}</p>
                                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">{policy.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>明道云管线状态</CardTitle>
                        <CardDescription>
                            Backend API & AI Engine Health Status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            <div className="flex items-center">
                                <span className="relative flex h-3 w-3 mr-3 mt-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Vercel Edge Network</p>
                                    <p className="text-sm text-muted-foreground">Frontend Hosted Successfully</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="relative flex h-3 w-3 mr-3 mt-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">FastAPI Core Gateway</p>
                                    <p className="text-sm text-muted-foreground">Connected to 127.0.0.1:8000</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="relative flex h-3 w-3 mr-3 mt-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                </span>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Qwen2.5-VL Vision Engine</p>
                                    <p className="text-sm text-muted-foreground">Awaiting Extract Triggers</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="relative flex h-3 w-3 mr-3 mt-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Mingdao Cloud HAP V3</p>
                                    <p className="text-sm text-muted-foreground">Database Sync Active</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
