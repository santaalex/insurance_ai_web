"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, HeartPulse, Stethoscope, Car } from "lucide-react";

// Mock data based on Mingdao Cloud Family Member schema design
const familyMembers = [
    { id: "m1", role: "主理人/爸爸", name: "冯绍峰", age: 38, policies: 4, cover: "￥1200万" },
    { id: "m2", role: "妈妈", name: "赵丽颖", age: 36, policies: 7, cover: "￥2400万" },
    { id: "m3", role: "宝宝", name: "想想", age: 5, policies: 2, cover: "￥300万" },
    { id: "m4", role: "外婆", name: "李秀兰", age: 62, policies: 1, cover: "￥50万" },
];

export default function MembersPage() {
    const [activeTab, setActiveTab] = useState("m2");

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">家庭成员资产拓扑</h2>
                <p className="text-muted-foreground mt-1">
                    穿透查看每位家人的专属保障配置方案
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-zinc-100/50 dark:bg-zinc-900/50 p-1 rounded-xl h-auto">
                    {familyMembers.map((member) => (
                        <TabsTrigger
                            key={member.id}
                            value={member.id}
                            className="px-6 py-3 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                        {member.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-left hidden sm:block">
                                    <div className="font-semibold text-sm">{member.role}</div>
                                    <div className="text-xs text-zinc-500">{member.name}</div>
                                </div>
                            </div>
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value={activeTab} className="focus-visible:outline-none">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="md:col-span-1 h-fit">
                            <CardHeader>
                                <CardTitle>该成员资产雷达</CardTitle>
                                <CardDescription>
                                    保障覆盖面与产品统计
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                                            <HeartPulse className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                        </div>
                                        <span className="font-medium">重疾保障</span>
                                    </div>
                                    <span className="text-xl font-bold">2 份</span>
                                </div>
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="font-medium">医疗及津贴</span>
                                    </div>
                                    <span className="text-xl font-bold">3 份</span>
                                </div>
                                <div className="flex items-center justify-between pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                            <Car className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <span className="font-medium">意外及财产</span>
                                    </div>
                                    <span className="text-xl font-bold">2 份</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>名下生效保单明细</CardTitle>
                                <CardDescription>
                                    点击任意保单可查看大模型提取的原始结构化 JSON
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 uppercase">
                                            <tr>
                                                <th className="px-6 py-3 font-medium">保单名称 (产品)</th>
                                                <th className="px-6 py-3 font-medium">保单号</th>
                                                <th className="px-6 py-3 font-medium">状态</th>
                                                <th className="px-6 py-3 font-medium text-right">保费</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer">
                                                <td className="px-6 py-4 font-medium flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-zinc-400" />平安福大满贯(2021)
                                                </td>
                                                <td className="px-6 py-4 text-zinc-500">PA-8849201999</td>
                                                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">有效</span></td>
                                                <td className="px-6 py-4 text-right">￥12,500/年</td>
                                            </tr>
                                            <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer">
                                                <td className="px-6 py-4 font-medium flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-zinc-400" />尊享e生保障计划
                                                </td>
                                                <td className="px-6 py-4 text-zinc-500">ZA-2292018882</td>
                                                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">有效</span></td>
                                                <td className="px-6 py-4 text-right">￥1,200/年</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
